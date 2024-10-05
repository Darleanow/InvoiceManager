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
});
