import {test, expect, Locator, Page} from "@playwright/test";

const products = ["Product 2", "Product 4", "Product 6", "Product 8", "Product 10"];
const promocodes = ["HelloThere", "15-PERCENT-FOR-CSS", "HOT-COURSE", "10-PERCENT-FOR-REDEEM", "NO-PYTHON", "JAVA-FOR-BOOMERS", "5-PERCENT-FOR-UTILS"];

test.only("Успешное оформление заказа с 5 товарами и всеми действующими промокодами", async({page}) => {
  await page.goto("https://anatoly-karpovich.github.io/demo-shopping-cart/");

  for (const product of products) {
    await addToCart(product, page).click();
  }

  const prices = await Promise.all(
    products.map((p) => getProductPrice(page, p))
  );
  const total = prices.reduce((sum, price) => sum + price, 0);

  await expect(page.locator("#badge-number")).toHaveText(
    products.length.toString()
  );
  await page.getByRole("button", { name: "Shopping Cart" }).click();
  await expect(page.locator("#total-price")).toHaveText(`$${total}.00`);

  await expect(page.locator("h5")).toHaveText(products);

  const amounts = page.locator('[data-id="product-amount-in-shopping-cart"]');
  await expect.soft(amounts).toHaveCount(products.length);
  for (let i = 0; i < products.length; i++) {
    await expect(amounts.nth(i)).toHaveText("1");
  }

  for (const promo of promocodes) {
    await applyPromoCode(promo, page);
  }

  const totalDiscountPercent = await calculateTotalDiscount(page);
  const finalPriceAfterDiscount = total * (1 - totalDiscountPercent / 100);
  const discountAmount = total - finalPriceAfterDiscount;
  await expect(page.locator("#total-price")).toHaveText(
    `$${finalPriceAfterDiscount.toFixed(2)} (-$${discountAmount})`
  );

  await page.locator("#continue-to-checkout-button").click();
  await expect(page.locator("span.text-muted")).toHaveText(
    `$${finalPriceAfterDiscount.toFixed(2)}`
  );
});


function addToCart(productName: string, page: Page): Locator {
  return page.locator("div.card-body").filter({hasText: productName}).getByRole("button", {name: "Add to card"});
};

async function getProductPrice(
  page: Page,
  productName: string
): Promise<number> {
  const priceText = await page
    .locator("div.card-body")
    .filter({ hasText: productName })
    .locator("span")
    .innerText();
  return Number(priceText.replace("$", ""));
}

async function applyPromoCode(code: string, page: Page) {
  await page.fill("#rebate-input", code);
  await page.getByRole("button", { name: "Redeem" }).click();
  const spinner = page.locator(".spinner-border");
  await expect(spinner).toBeVisible();
  await expect(spinner).toBeHidden();
}

async function calculateTotalDiscount(page: Page): Promise<number> {
  const rebateItemsLocator = page.locator("#rebates-list small");
  const rebateTextContents = await rebateItemsLocator.allTextContents();

  const totalDiscount = rebateTextContents.reduce((sum, text) => {
    const discountTextWithoutSymbols = text.replace(/[-%]/g, "");
    const discountPercentage = parseFloat(discountTextWithoutSymbols) || 0;
    return sum + discountPercentage;
  }, 0);

  return totalDiscount;
}