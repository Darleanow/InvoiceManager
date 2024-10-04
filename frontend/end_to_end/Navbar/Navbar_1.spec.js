const { test, expect } = require('@playwright/test');

test.describe('Navbar Component', () => {
  test('should set "Billing" as the default active item', async ({ page }) => {
    await page.goto("http://localhost:3000");

    const billingButton = page.locator('[data-testid="billing_button"]');

    const isActive = await billingButton.getAttribute("test-data-active");
    expect(isActive).toBe("true");
  });

  test('should set "Clients" as active when clicked', async ({ page }) => {
    await page.goto("http://localhost:3000");

    const clientsButton = page.locator('[data-testid="clients_button"]');
    const billingButton = page.locator('[data-testid="billing_button"]');
    const reportingButton = page.locator('[data-testid="reporting_button"]');

    await clientsButton.click();

    const isClientsActive = await clientsButton.getAttribute(
      "test-data-active"
    );
    expect(isClientsActive).toBe("true");

    const isBillingActive = await billingButton.getAttribute(
      "test-data-active"
    );
    const isReportingActive = await reportingButton.getAttribute(
      "test-data-active"
    );

    expect(isBillingActive).toBe("false");
    expect(isReportingActive).toBe("false");
  });

  test('should set "Reporting" as active when clicked', async ({ page }) => {
    await page.goto("http://localhost:3000");

    const reportingButton = page.locator('[data-testid="reporting_button"]');
    const billingButton = page.locator('[data-testid="billing_button"]');
    const clientsButton = page.locator('[data-testid="clients_button"]');

    await reportingButton.click();

    const isReportingActive = await reportingButton.getAttribute(
      "test-data-active"
    );
    expect(isReportingActive).toBe("true");

    const isBillingActive = await billingButton.getAttribute(
      "test-data-active"
    );
    const isClientsActive = await clientsButton.getAttribute(
      "test-data-active"
    );

    expect(isBillingActive).toBe("false");
    expect(isClientsActive).toBe("false");
  });

  test("should not change active state when clicking the active button", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    const billingButton = page.locator('[data-testid="billing_button"]');

    await billingButton.click();
    const isActiveAfterFirstClick = await billingButton.getAttribute(
      "test-data-active"
    );
    expect(isActiveAfterFirstClick).toBe("true");

    await billingButton.click();
    const isActiveAfterSecondClick = await billingButton.getAttribute(
      "test-data-active"
    );
    expect(isActiveAfterSecondClick).toBe("true");
  });

  test("should have correct text labels on buttons", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const billingButtonText = await page
      .locator('[data-testid="billing_text"]')
      .textContent();
    expect(billingButtonText.trim()).toBe("Billing");

    const clientsButtonText = await page
      .locator('[data-testid="clients_text"]')
      .textContent();
    expect(clientsButtonText.trim()).toBe("Clients");

    const reportingButtonText = await page
      .locator('[data-testid="reporting_text"]')
      .textContent();
    expect(reportingButtonText.trim()).toBe("Reporting");
  });  

  test("should render icons correctly", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const billingIcon = page.locator('[data-testid="billing_icon"]');
    expect(await billingIcon.count()).toBe(1);

    const clientsIcon = page.locator('[data-testid="clients_icon"]');
    expect(await clientsIcon.count()).toBe(1);

    const reportingIcon = page.locator('[data-testid="reporting_icon"]');
    expect(await reportingIcon.count()).toBe(1);
  });
});
