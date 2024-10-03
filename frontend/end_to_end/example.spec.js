import { test, expect } from "@playwright/test";

test(
  "homepage has title and links to other page",
  async ({ page }) => {
    await page.goto("https://google.com");

    await expect(page).toHaveTitle(/Google/);
  },
  { timeout: 10000 }
);
