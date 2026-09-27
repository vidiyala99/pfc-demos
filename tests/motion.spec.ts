import { expect, test } from "@playwright/test";

test.describe("motion on", () => {
  test.use({ reducedMotion: "no-preference" });

  test("scroll motion runs and every list ends fully printed", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/pfc-motion/);
    // Scroll-driven animations are attached to the season rows.
    const anim = await page.locator(".season .entry").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("print");
    // Scroll to the bottom and back through every section: rows end unclipped and in place.
    for (const sel of [".season", ".record", ".offer", ".footer"]) {
      await page.locator(sel).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
    }
    await page.locator(".record").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -200));
    await page.waitForTimeout(200);
    const verified = await page.locator(".figure__n:not(.figure__n--ghost)").evaluate((el) => getComputedStyle(el).translate);
    expect(["none", "0px", "0px 0px"]).toContain(verified);
    // The filter still dims rows (the print animation never touches opacity).
    await page.locator(".season").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Health" }).click();
    const dimmed = page.locator(".entry[data-dim]").first();
    await expect.poll(() => dimmed.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.5);
  });

  test("the Donate ticket tilts toward the pointer and settles when it leaves", async ({ page }) => {
    await page.goto("/");
    const ticket = page.getByRole("link", { name: "Donate to this project" });
    await ticket.scrollIntoViewIfNeeded();
    const box = (await ticket.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2);
    await expect(ticket).toHaveAttribute("data-tilt", "");
    const ry = await ticket.evaluate((el) => el.style.getPropertyValue("--ry"));
    expect(parseFloat(ry)).toBeGreaterThan(0);
    await page.mouse.move(5, box.y + box.height + 300);
    await expect(ticket).not.toHaveAttribute("data-tilt", "");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing moves and nothing is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/pfc-motion/);
    const names = await page.evaluate(() =>
      [...document.querySelectorAll(".feature__still img, .row, .entry, .figure__n, .offer li, .section__head > div")]
        .map((el) => getComputedStyle(el).animationName)
        .filter((n) => n !== "none"),
    );
    expect(names).toEqual([]);
  });
});
