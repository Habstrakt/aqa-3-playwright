import { test, expect } from '@playwright/test';

test.describe("[UI] Страница 'Dynamic Controls'", () => {
  test("Проверить страницу 'Dynamic Controls'", async({page}) => {
    const removeBtn = page.getByRole("button", {name: "Remove"});
    const checkBox = page.locator("[label='blah']");
    const titleText = page.getByRole("heading", {name: "Dynamic Controls"});
    const addBtn = page.getByRole("button", {name: "Add"});

    await page.goto("https://the-internet.herokuapp.com/");
    await page.getByRole("link", {name: "Dynamic Controls"}).click();
    await expect(removeBtn).toBeVisible({timeout: 5000});
    await expect(titleText).toHaveText("Dynamic Controls");
    await checkBox.check();
    await removeBtn.click();
    await expect(checkBox).toBeHidden({timeout: 5000});
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await expect(page.locator("#checkbox")).toBeVisible();
    await expect(page.locator("#message")).toHaveText("It's back!")
  });
});