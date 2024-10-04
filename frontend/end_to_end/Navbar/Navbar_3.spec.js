const { test, expect } = require('@playwright/test');

test.describe('Navbar Component', () => {
  
  test("should only have one active button at a time", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const billingButton = page.locator('[data-testid="billing_button"]');
    const clientsButton = page.locator('[data-testid="clients_button"]');
    const reportingButton = page.locator('[data-testid="reporting_button"]');

    await clientsButton.click();
    let activeButtons = await page.locator('[test-data-active="true"]');
    expect(await activeButtons.count()).toBe(1);

    await reportingButton.click();
    activeButtons = await page.locator('[test-data-active="true"]');
    expect(await activeButtons.count()).toBe(1);

    await billingButton.click();
    activeButtons = await page.locator('[test-data-active="true"]');
    expect(await activeButtons.count()).toBe(1);
  });

  test('should apply hover styles on buttons when hovered', async ({ page }) => {
    await page.goto("http://localhost:3000");
  
    const billingButton = page.locator('[data-testid="billing_button"]');
    await billingButton.hover();
  
    const isHovered = await billingButton.evaluate((button) => {
      return window.getComputedStyle(button).backgroundColor === 'rgb(41, 41, 41)';
    });
  
    expect(isHovered).toBe(true);
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
