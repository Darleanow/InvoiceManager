const { test, expect } = require("@playwright/test");

test.describe("Topbar Component", () => {

  test("should display the create invoice button", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const createInvoiceButton = await page.locator(
      '[data-testid="create_invoice_button"]'
    );
    await expect(createInvoiceButton).toBeVisible();
  });

  test("should allow clicking the create invoice button", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const createInvoiceButton = await page.locator(
      '[data-testid="create_invoice_button"]'
    );
    await createInvoiceButton.click();
  });
});
