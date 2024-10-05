const { test, expect } = require("@playwright/test");

test.describe("Topbar Component", () => {
  test("should display settings icon", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const settingsIcon = await page.locator('[data-testid="settings_icon"]');
    await expect(settingsIcon).toBeVisible();
  });

  test("should change search bar border color on hover", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const searchContainer = await page.locator('[data-testid="search_input"]');

    const initialBorderColor = await searchContainer.evaluate((el) => {
      return window
        .getComputedStyle(el.parentElement)
        .getPropertyValue("border-color");
    });
    console.log("Border color before hover:", initialBorderColor);

    await searchContainer.hover();

    const hoveredBorderColor = await searchContainer.evaluate((el) => {
      return window
        .getComputedStyle(el.parentElement)
        .getPropertyValue("border-color");
    });
    console.log("Border color after hover:", hoveredBorderColor);

    expect(initialBorderColor).toBe("rgb(130, 130, 130)");
    expect(hoveredBorderColor).toBe("rgb(226, 156, 35)");
  });

});
