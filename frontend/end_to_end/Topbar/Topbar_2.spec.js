const { test, expect } = require("@playwright/test");

test.describe("Topbar Component", () => {
  test('should display logo text "InMa"', async ({ page }) => {
    await page.goto("http://localhost:3000");

    const logoText = await page.locator('[data-testid="logo_text"]');
    await expect(logoText).toHaveText("InMa");
  });

  test("should display the username", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const usernameText = await page.locator('[data-testid="username_text"]');
    await expect(usernameText).toBeVisible();
  });

  test("should allow input in the search bar", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const searchInput = await page.locator('[data-testid="search_input"]');
    await searchInput.fill("invoice search");
    await expect(searchInput).toHaveValue("invoice search");
  });

  test("should display notifications icon", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const notificationIcon = await page.locator(
      '[data-testid="notifications_icon"]'
    );
    await expect(notificationIcon).toBeVisible();
  });


});
