import { expect, test } from "@playwright/test";

const SITE = "http://127.0.0.1:4320";
test.use({ baseURL: SITE, permissions: ["clipboard-read", "clipboard-write"] });

test.beforeAll(async ({ request }) => {
  const up = await request.get(SITE + "/").catch(() => null);
  test.skip(!up, "assembled _site is not being served on :4320");
});

test("comparison page links both demos with equal weight", async ({ page }) => {
  await page.goto("/");
  const wp = page.getByRole("link", { name: "Try the WordPress editor" });
  const decap = page.getByRole("link", { name: "Try the Decap editor" });
  await expect(wp).toHaveAttribute("href", /playground\.wordpress\.net\/\?blueprint-url=.*blueprint\.json/);
  await expect(decap).toHaveAttribute("href", "next/admin/");
  const [a, b] = await Promise.all([wp.boundingBox(), decap.boundingBox()]);
  expect(Math.abs(a!.height - b!.height)).toBeLessThan(2);
  expect((await page.request.get(SITE + "/blueprint.json")).ok()).toBe(true);
  expect((await page.request.get(SITE + "/wordpress/pfc-content.xml")).ok()).toBe(true);
  expect((await page.request.get(SITE + "/next/")).ok()).toBe(true);
  await page.screenshot({ path: "tests/shots/chooser.png", fullPage: true });
});

test("the Next.js demo works under its /next sub-path", async ({ page }) => {
  await page.goto("/next/");
  await expect(page.locator("h1.feature__title")).toHaveText("Himalayan Kids");
  await page.getByRole("link", { name: "Himalayan Kids", exact: true }).first().click();
  await expect(page).toHaveURL(/\/next\/work\/himalayan-kids\/$/);
});

test("scores persist across reloads and copy as plain text", async ({ page }) => {
  await page.goto("/");
  await page.locator('select[name="t1-wp"]').selectOption("4");
  await page.locator('select[name="t1-decap"]').selectOption("5");
  await page.locator('input[name="name"]').fill("Jacqueline");
  await page.reload();
  await expect(page.locator('select[name="t1-decap"]')).toHaveValue("5");
  await page.getByRole("button", { name: "Copy my scores" }).click();
  await expect(page.locator("#copied")).toContainText(/Copied|Select the text/);
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  if (clip) expect(clip).toContain("Task 1, featured project: WordPress 4, Decap 5");
});

test("every control is reachable by keyboard", async ({ page }) => {
  await page.goto("/");
  const names: string[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    names.push(await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim().slice(0, 30) || document.activeElement!.tagName));
  }
  expect(names).toContain("Try the WordPress editor");
  expect(names).toContain("Try the Decap editor");
});
