import { test, expect } from "@playwright/test";

const negativeRegistrationData = [
  {
    username: '',
    password: 'ValidPass123',
    errorDescription: 'Username is required',
  },
  {
    username: 'ab',
    password: 'ValidPass123',
    errorDescription: 'Username should contain at least 3 characters',
  },
  {
    username: '   ',
    password: 'ValidPass123',
    errorDescription: 'Prefix and postfix spaces are not allowed is username',
  },
  {
    username: 'validUsername',
    password: '',
    errorDescription: 'Password is required',
  },
  {
    username: 'validUsername',
    password: 'short',
    errorDescription: 'Password should contain at least 8 characters',
  },
  {
    username: 'validUsername',
    password: '        ',
    errorDescription: 'Password is required',
  },
  {
    username: 'validUsername',
    password: 'onlylowercase',
    errorDescription: 'Password must contain at least one uppercase letter',
  },
  {
    username: 'validUsername',
    password: 'ONLYUPPERCASE',
    errorDescription: 'Password should contain at least one character in lower case',
  },
];

test.describe("[UI] Отрицательная регистрация", () => {
  for(const data of negativeRegistrationData ) {
    test(`должно отображаться сообщение об ошибке, если имя пользователя="${data.username}" и пароль="${data.password}"`, async({page}) => {

        await page.goto("https://anatoly-karpovich.github.io/demo-login-form/")

        await page.locator("#registerOnLogin").click();

        await page.locator("#userNameOnRegister").fill(data.username);

        await page.locator("#passwordOnRegister").fill(data.password);

        await page.getByRole('button', { name: 'register' }).click();

        const errorLocator = page.locator('#errorMessageOnRegister');
        await expect(errorLocator).toHaveText(data.errorDescription);
    });
  };
});