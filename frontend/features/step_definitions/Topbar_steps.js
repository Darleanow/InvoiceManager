const { Given, Then, Before, After } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { chromium } = require("playwright");

let browser;
let page;

Before(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

After(async () => {
  await browser.close();
});

Given("I am on the homepage", async () => {
  await page.goto("http://localhost:3000");
});

Then("I should see {string} in the topbar", async (text) => {
  const topbarText = await page.locator('[data-testid="logo_text"]');
  await expect(topbarText).toBeVisible();
  const actualText = await topbarText.textContent();
  expect(actualText).toBe(text);
});

Then('I should see the "Username" displayed in the topbar', async () => {
  const userText = await page
    .locator('[data-testid="username_text"]')
    .textContent();
  expect(userText).toBe("Username");
});

Then('I should see a search input with the placeholder "Search"', async () => {
  const placeholder = await page
    .locator('[data-testid="search_input"]')
    .getAttribute("placeholder");
  expect(placeholder).toBe("Search");
});

Then("I should see a notification icon in the topbar", async () => {
  const notificationIcon = await page.locator(
    '[data-testid="notifications_icon"]'
  );
  await expect(notificationIcon).toBeVisible();
});

Then("I should see a settings icon in the topbar", async () => {
  const settingsIcon = await page.locator('[data-testid="settings_icon"]');
  await expect(settingsIcon).toBeVisible();
});

Then('I should see a button labeled "Create Invoice"', async () => {
  const buttonText = await page
    .locator('[data-testid="create_invoice_button"]')
    .textContent();
  expect(buttonText).toBe("Create Invoice");
});
