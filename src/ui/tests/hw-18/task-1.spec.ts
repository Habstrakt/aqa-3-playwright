import { test, expect } from '@playwright/test';

test.describe("[UI] [Smoke] Форма регистрации", () => {
  const validCredential = {
    userName: "User",
    password: "NewPassword"
  }

  const unvalidCredential = {
    userName: "qw",
    password: "321"
  }

  const messages = {
    userNameRequired: "Username is required",
    passwordRequired: "Password is required",
    userNameMinReq: "Username should contain at least 3 characters",
    successRegister: "Successfully registered! Please, click Back to return on login page"
  }

  const nameMaxLenghts = "40characters#Rw9pTxV!eLjM2$CgQnaZxu@Fb1WhEtKX";

  test.beforeEach(async({page}) => {
    await page.goto("https://anatoly-karpovich.github.io/demo-login-form/");
    await page.locator("#registerOnLogin").click();
  });

  test("Проверить, что форма регистрации доступна и отображается корректно.", async({page}) => {
    await expect(page.locator(".registerForm")).toBeVisible();
  });

  test("Проверить поля формы (Username, Password) имеют соответствующие подписи.", async({page}) => {
    await expect(page.locator("#userNameOnRegister")).toBeVisible();
    await expect(page.locator("#passwordOnRegister")).toBeVisible();
  });

  test("Проверить, что кнопка 'Register' присутствует", async({page}) => {
    await expect(page.locator("#register")).toBeVisible();
  });

  test("Проверить, что поле Username обязательно для заполнения (отображается ошибка при попытке отправить пустое значение)", async({page}) => {
    await page.locator("#passwordOnRegister").fill(validCredential.password);
    await page.locator("#register").click()
    await expect(page.locator("#errorMessageOnRegister")).toHaveText(messages.userNameRequired);
  });

  test("Проверить, что минимальная длина имени пользователя — 3 символа (отображается ошибка при вводе менее 3 символов)", async({page}) => {
    await page.locator("#userNameOnRegister").fill(unvalidCredential.userName);
    await page.locator("#passwordOnRegister").fill(validCredential.password);
    await page.locator("#register").click();
    await expect(page.locator("#errorMessageOnRegister")).toHaveText(messages.userNameMinReq);
  });

  test("Проверить, что максимальная длина имени пользователя — 40 символов", async({page}) => {
    await page.locator("#userNameOnRegister").fill(nameMaxLenghts);
    await page.locator("#passwordOnRegister").fill(validCredential.password);
    await page.locator("#register").click();
    await expect(page.locator("#errorMessageOnRegister")).toHaveText(messages.successRegister);
  });

  test("Проверить, что поле Password обязательно для заполнения (отображается ошибка при попытке отправить пустое значение)", async({page}) => {
    await page.locator("#userNameOnRegister").fill(validCredential.userName);

    await page.locator("#register").click();
    await expect(page.locator("#errorMessageOnRegister")).toHaveText(messages.passwordRequired);
  });

  test("Проверка успешной регистрации", async({page}) => {
    await page.locator("#userNameOnRegister").fill(validCredential.userName);
    await page.locator("#passwordOnRegister").fill(validCredential.password);
    await page.locator("#register").click();

    await expect(page.locator("#errorMessageOnRegister")).toHaveText(messages.successRegister)
  })
});