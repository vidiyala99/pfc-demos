import { expect, test } from "@playwright/test";

test("homepage shows the featured project and its gold ticket", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1.feature__title")).toHaveText("Himalayan Kids");
  await expect(page.getByRole("link", { name: "Donate to this project" })).toBeVisible();
  await expect(page.locator(".showing .row")).toHaveCount(4);
  await expect(page.locator(".season .entry")).toHaveCount(8);
  await page.screenshot({ path: "tests/shots/next-home.png" });
});

test("strand filter dims non-matching entries without moving the layout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Health" }).click();
  await expect(page.locator(".entry[data-dim]")).toHaveCount(7);
  await expect(page.getByRole("button", { name: "Health" })).toHaveAttribute("aria-pressed", "true");
});

test("program page renders with body, facts and placeholder rules", async ({ page }) => {
  await page.goto("/work/himalayan-kids/");
  await expect(page.locator("h1")).toHaveText("Himalayan Kids");
  await expect(page.locator(".prose h2").first()).toHaveText("The need");
  await expect(page.locator(".band--lg")).toHaveText("Active, since 2001");
  await page.screenshot({ path: "tests/shots/next-program.png", fullPage: true });
  await page.goto("/work/women-are-sacred/");
  await expect(page.locator(".screening__still .placeholder")).toHaveText("Poster from PFC needed");
  await expect(page.locator(".band--pending").first()).toHaveText("Status to confirm");
});
