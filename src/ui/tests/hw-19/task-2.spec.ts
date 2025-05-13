// Разработать тест со следующими шагами:
//  - Открыть url https://anatoly-karpovich.github.io/aqa-course-project/#
//  - Войти в приложения используя учетные данные test@gmail.com / 12345678 при этом:
//  - дождаться исчезновения спиннеров
//  - проверить действительно ли пользователь с логином Anatoly вошел в систему
//  - Проверить скриншотом боковое навигационное меню с выбранной страницей Home




import { test, expect } from '@playwright/test';

test.describe("[UI] Страница 'Login'", () => {
  test.only("Проверить страницу авторизации", async({page}) => {
    await page.goto("https://anatoly-karpovich.github.io/aqa-course-project/#");
    await page.locator("#emailinput").fill("test@gmail.com");
    await page.locator("#passwordinput").fill("12345678");
    await page.getByRole("button", {name: "Login"}).click();
    await expect(page.locator(".spinner-border")).toHaveCount(0);
    await expect(page.getByRole('heading', { name: "Welcome to Sales Management Portal" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Anatoly" })).toBeVisible();
    await expect(page.locator("#sidebar")).toHaveScreenshot();
  });
});