const { test, expect } = require('@playwright/test');

test.describe('Navbar Component', () => {

  test('should allow navigation and activation via keyboard', async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.focus('body');
    const billingButton = page.locator('[data-testid="billing_button"]');
    await billingButton.focus();
    expect(await billingButton.evaluate((el) => el === document.activeElement)).toBe(true);
    await page.keyboard.press('ArrowRight');
    const clientsButton = page.locator('[data-testid="clients_button"]');
    expect(await clientsButton.evaluate((el) => el === document.activeElement)).toBe(true);
    await page.keyboard.press('Enter');
    const isClientsActive = await clientsButton.getAttribute('test-data-active');
    expect(isClientsActive).toBe('true');
  });

  test('should have appropriate ARIA attributes for accessibility', async ({ page }) => {
    await page.goto("http://localhost:3000");
    const billingButton = page.locator('[data-testid="billing_button"]');
    expect(await billingButton.getAttribute('role')).toBe('tab');
    const clientsButton = page.locator('[data-testid="clients_button"]');
    expect(await clientsButton.getAttribute('role')).toBe('tab');
    const reportingButton = page.locator('[data-testid="reporting_button"]');
    expect(await reportingButton.getAttribute('role')).toBe('tab');
  });

  test('should apply active class styles to the active button', async ({ page }) => {
    await page.goto("http://localhost:3000");
    const billingButton = page.locator('[data-testid="billing_button"]');
    const activeClass = await billingButton.getAttribute('class');
    expect(activeClass).toContain('active');
  });

  test("should render Navbar component without crashing", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const navbar = page.locator('[data-testid="navbar"]');
    expect(await navbar.count()).toBe(1);
  });

  test('should not allow clicking disabled buttons', async ({ page }) => {
    await page.goto("http://localhost:3000");
    const reportingButton = page.locator('[data-testid="reporting_button"]');
    await reportingButton.evaluate((button) => button.setAttribute('disabled', 'disabled'));
    const isDisabled = await reportingButton.isDisabled();
    expect(isDisabled).toBe(true);
    const isReportingActive = await reportingButton.getAttribute('test-data-active');
    expect(isReportingActive).toBe('false');
  });
});
