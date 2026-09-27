import { expect, test } from "@playwright/test";

// Smoke checks against the deployed demos. Run with: LIVE=1 npx playwright test tests/live.spec.ts
const LIVE = "https://vidiyala99.github.io/pfc-demos/";
test.skip(!process.env.LIVE, "set LIVE=1 to check the deployed site");
test.setTimeout(240_000);

test("live comparison page and Next.js demo", async ({ page }) => {
  await page.goto(LIVE);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("two ways to run it");
  await page.goto(LIVE + "next/");
  await expect(page.locator("h1.feature__title")).toHaveText("Himalayan Kids");
  await expect(page.locator(".showing .placeholder").first()).toContainText("from PFC needed");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto(LIVE + "next/work/himalayan-kids/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("live Decap editor opens with the seeded projects", async ({ page }) => {
  await page.goto(LIVE + "next/admin/");
  await page.getByRole("button", { name: /login/i }).click();
  await page.getByText("Projects", { exact: true }).first().click();
  await expect(page.locator('a[href*="/collections/projects/entries/"]')).toHaveCount(8, { timeout: 30_000 });
});

test("live WordPress Playground link boots our theme and content", async ({ page }) => {
  await page.goto(LIVE);
  const href = await page.getByRole("link", { name: "Try the WordPress editor" }).getAttribute("href");
  await page.goto(href + "&url=/");
  const site = page.frameLocator("#playground-viewport, iframe").first().frameLocator("iframe").first();
  await expect(site.locator("h1.feature__title")).toHaveText("Himalayan Kids", { timeout: 200_000 });
  await expect(site.locator(".season .entry")).toHaveCount(8);
  await page.screenshot({ path: "tests/shots/live-playground.png" });
});

test("live WordPress link lands in the Site Editor on the homepage template", async ({ page }) => {
  await page.goto(LIVE);
  const href = await page.getByRole("link", { name: "Try the WordPress editor" }).getAttribute("href");
  await page.goto(href!);
  const wp = page.frameLocator("#playground-viewport, iframe").first().frameLocator("iframe").first();
  await expect(wp.getByText("You attempted to edit an item that doesn't exist")).toHaveCount(0);
  const canvas = wp.frameLocator('iframe[name="editor-canvas"]');
  await expect(canvas.getByRole("document", { name: "Block: Featured project" })).toBeAttached({ timeout: 200_000 });
  await page.screenshot({ path: "tests/shots/live-site-editor.png" });
});
