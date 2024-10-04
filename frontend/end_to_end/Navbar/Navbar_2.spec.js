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

  test('should not have console errors during rendering and interaction', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err));
    await page.goto("http://localhost:3000");
    const clientsButton = page.locator('[data-testid="clients_button"]');
    await clientsButton.click();
    const reportingButton = page.locator('[data-testid="reporting_button"]');
    await reportingButton.click();
    expect(errors.length).toBe(0);
  });

  test('should have correct ARIA roles and labels', async ({ page }) => {
    await page.goto("http://localhost:3000");
    const billingButton = page.locator('[data-testid="billing_button"]');
    expect(await billingButton.getAttribute('role')).toBe('tab');
    expect(await billingButton.getAttribute('aria-selected')).toBe('true');
    const clientsButton = page.locator('[data-testid="clients_button"]');
    expect(await clientsButton.getAttribute('role')).toBe('tab');
    expect(await clientsButton.getAttribute('aria-selected')).toBe('false');
  });

  test('should render navigation items in correct order', async ({ page }) => {
    await page.goto("http://localhost:3000");
    const navItems = page.locator('[role="tablist"] > li');
    const firstItemText = await navItems.nth(0).locator('span').textContent();
    expect(firstItemText.trim()).toBe('Billing');
    const secondItemText = await navItems.nth(1).locator('span').textContent();
    expect(secondItemText.trim()).toBe('Clients');
    const thirdItemText = await navItems.nth(2).locator('span').textContent();
    expect(thirdItemText.trim()).toBe('Reporting');
  });
});
