import { expect, test, type Page } from "@playwright/test";

// Runs against the local Playground server (scripts/wp-serve.sh); skipped when it is not running.
const WP = "http://127.0.0.1:9400";
const FRONT_PAGE = "/wp-admin/site-editor.php?p=%2Fwp_template%2Fpfc-programme%2F%2Ffront-page&canvas=edit";
test.use({ baseURL: WP, viewport: { width: 1600, height: 1000 } });
test.setTimeout(180_000);

test.beforeAll(async ({ request }) => {
  const up = await request.get(WP + "/wp-login.php", { maxRedirects: 0 }).catch(() => null);
  test.skip(!up, "WordPress Playground server is not running on :9400");
});

async function openFrontPageEditor(page: Page) {
  await page.goto(FRONT_PAGE);
  const canvas = page.frameLocator('iframe[name="editor-canvas"]');
  await expect(canvas.getByRole("document", { name: "Block: Featured project" })).toBeAttached({ timeout: 60_000 });
  // The first-visit welcome guide opens a moment after the canvas; close it when it appears.
  await page.locator(".edit-site-welcome-guide, .components-guide").first()
    .waitFor({ state: "visible", timeout: 10_000 }).then(() => page.keyboard.press("Escape")).catch(() => {});
}

// Sets the featured project and saves through WordPress's own save action (what the Save button calls).
async function saveFeatured(page: Page, slug?: string) {
  await page.evaluate(async (s) => {
    const wp = (window as any).wp;
    const [id] = wp.data.select("core/block-editor").getBlocksByName("pfc/featured");
    if (s) wp.data.dispatch("core/block-editor").updateBlockAttributes(id, { slug: s });
    await wp.data.dispatch("core").saveEditedEntityRecord("postType", "wp_template", "pfc-programme//front-page");
  }, slug);
}

test("WordPress homepage matches the Next.js demo's content and rules", async ({ page }) => {
  await openFrontPageEditor(page);
  await saveFeatured(page, "himalayan-kids");
  await page.goto("/");
  await expect(page.locator("h1.feature__title")).toHaveText("Himalayan Kids");
  await expect(page.locator(".season .entry")).toHaveCount(8);
  await expect(page.locator(".season .band--pending")).toHaveCount(7);
  await expect(page.locator(".showing .row")).toHaveCount(4);
  await page.screenshot({ path: "tests/shots/wp-home.png" });
});

test("WordPress program page renders the screening block", async ({ page }) => {
  await page.goto("/work/women-are-sacred/");
  await expect(page.locator("h1.screening__title")).toHaveText("Women Are Sacred");
  await expect(page.locator(".screening__still .placeholder")).toHaveText("Poster from PFC needed");
});

test("Task 1 in the Site Editor: the Featured block's dropdown changes the homepage", async ({ page }) => {
  await openFrontPageEditor(page);
  await saveFeatured(page, "himalayan-kids"); // known starting point, whatever ran before

  // The editor UI: select the block, open its settings, pick a project in the dropdown.
  await page.evaluate(() => {
    const wp = (window as any).wp;
    const [id] = wp.data.select("core/block-editor").getBlocksByName("pfc/featured");
    wp.data.dispatch("core/block-editor").selectBlock(id);
  });
  const settings = page.getByRole("button", { name: "Settings", exact: true });
  if ((await settings.getAttribute("aria-pressed").catch(() => "true")) === "false") await settings.click();
  const select = page.locator(".block-editor-block-inspector select.components-select-control__input");
  await expect(select.locator('option[value="great-green-wall"]')).toBeAttached({ timeout: 30_000 });
  await select.selectOption("great-green-wall");
  await page.screenshot({ path: "tests/shots/wp-site-editor.png" });

  await saveFeatured(page);
  await page.goto("/");
  await expect(page.locator("h1.feature__title")).toHaveText("Great Green Wall");

  // Leave the demo as we found it.
  await openFrontPageEditor(page);
  await saveFeatured(page, "himalayan-kids");
});
