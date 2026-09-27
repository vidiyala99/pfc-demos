import { describe, expect, it } from "vitest";
import fixtures from "../fixtures/honesty.json";
import { band, loadSite, parseProject, placeholderLabel, resolveFeatured } from "./content";

describe("status band (shared fixtures)", () => {
  for (const f of fixtures.band) {
    it(f.name, () => {
      expect(band(f.status as never, f.since)).toEqual(f.expect);
    });
  }
});

describe("missing-image placeholder (shared fixtures)", () => {
  for (const f of fixtures.placeholder) {
    it(f.name, () => {
      expect(placeholderLabel(f.kind as never)).toBe(f.expect);
    });
  }
});

describe("validation (shared fixtures)", () => {
  for (const f of fixtures.invalid) {
    it(f.name, () => {
      expect(() => parseProject("x", f.project as Record<string, unknown>, "")).toThrow(f.error);
    });
  }
});

describe("featured reference", () => {
  it("resolves to the referenced project", () => {
    const site = loadSite();
    expect(resolveFeatured(site.home.featured, site.projects).slug).toBe("himalayan-kids");
  });
  it("a broken reference fails loudly", () => {
    const site = loadSite();
    expect(() => resolveFeatured(fixtures.featured.broken_reference, site.projects)).toThrow(fixtures.featured.error);
  });
});

describe("the real content", () => {
  const site = loadSite();
  it("loads all eight projects", () => {
    expect(site.projects).toHaveLength(8);
  });
  it("only confirmed work shows a solid band", () => {
    const solid = site.projects.filter((p) => p.band.style === "solid").map((p) => p.slug);
    expect(solid).toEqual(["himalayan-kids"]);
  });
  it("every project without an image gets a labelled placeholder", () => {
    for (const p of site.projects.filter((x) => !x.image)) {
      expect(p.placeholder).toMatch(/from PFC needed$/);
    }
  });
  it("Also showing lists the flagged projects, never the featured one", () => {
    expect(site.alsoShowing.map((p) => p.slug)).not.toContain(site.featured.slug);
    expect(site.alsoShowing.length).toBeGreaterThan(0);
  });
  it("lede is the first paragraph as plain text", () => {
    expect(site.featured.lede).toBe("With Lama Tenzin Choegyal and the C.E.D. Institute.");
    expect(site.projects.find((p) => p.slug === "laudate-deum")!.lede).toContain("Laudato Si'");
  });
  it("renders the body to HTML", () => {
    expect(site.featured.html).toContain("<h2");
  });
});
