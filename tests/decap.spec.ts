import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("Decap demo editor: seeded projects, and changing the featured project updates the preview", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByRole("button", { name: /login/i }).click();
  await page.getByText("Projects", { exact: true }).first().click();
  await expect(page.getByText("Himalayan Kids (Education, Active)")).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('a[href*="/collections/projects/entries/"]')).toHaveCount(8);
  await page.screenshot({ path: "tests/shots/decap-list.png" });

  await page.getByText("Homepage", { exact: true }).first().click();
  await page.getByText("Homepage settings").click();
  const preview = page.frameLocator("iframe").first();
  await expect(preview.locator("h1.feature__title")).toHaveText("Himalayan Kids", { timeout: 30_000 });

  await page.locator("#featured-field-2, [id^='featured-field']").first().click({ force: true }).catch(() => {});
  await page.keyboard.type("Great Green");
  await page.getByText("Great Green Wall", { exact: true }).last().click();
  await expect(preview.locator("h1.feature__title")).toHaveText("Great Green Wall", { timeout: 15_000 });
  await page.screenshot({ path: "tests/shots/decap-home-edit.png" });
});
