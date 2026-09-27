import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

export const STRANDS = ["Education", "Health", "Climate", "Media"] as const;
export const KINDS = ["Project", "Documentary", "Book", "Campaign"] as const;
export const STATUSES = ["Active", "Completed", "Paused", "To confirm"] as const;

export type Strand = (typeof STRANDS)[number];
export type Kind = (typeof KINDS)[number];
export type Status = (typeof STATUSES)[number];
export type Band = { style: "solid" | "archive" | "pending"; text: string };

export type Project = {
  slug: string;
  title: string;
  strand: Strand;
  kind: Kind;
  place: string;
  status: Status;
  since?: number;
  image?: string;
  imageAlt?: string;
  showInAlsoShowing: boolean;
  lastReviewed: string;
  band: Band;
  placeholder: string;
  lede: string;
  html: string;
};

export type Home = { headline: string; featured: string };

export type Site = {
  home: Home;
  projects: Project[];
  featured: Project;
  alsoShowing: Project[];
};

const CONTENT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content");

export function band(status: Status, since?: number): Band {
  switch (status) {
    case "Active":
      return { style: "solid", text: since ? `Active, since ${since}` : "Active" };
    case "Completed":
      return { style: "archive", text: "Completed" };
    case "Paused":
      return { style: "pending", text: "Paused" };
    case "To confirm":
      return { style: "pending", text: "Status to confirm" };
  }
}

export function placeholderLabel(kind: Kind): string {
  if (kind === "Documentary") return "Poster from PFC needed";
  if (kind === "Book") return "Cover from PFC needed";
  return "Image from PFC needed";
}

function oneOf<T extends readonly string[]>(slug: string, field: string, value: unknown, allowed: T): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new Error(`${slug}: ${field} must be one of ${allowed.join(", ")} (got ${JSON.stringify(value)})`);
  }
  return value as T[number];
}

function text(slug: string, field: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${slug}: ${field} is required`);
  }
  return value;
}

export function parseProject(slug: string, data: Record<string, unknown>, body: string): Project {
  const title = text(slug, "title", data.title);
  const strand = oneOf(slug, "strand", data.strand, STRANDS);
  const kind = oneOf(slug, "kind", data.kind, KINDS);
  const place = text(slug, "place", data.place);
  const status = oneOf(slug, "status", data.status, STATUSES);
  const lastReviewed = text(slug, "last_reviewed", data.last_reviewed);
  const since = typeof data.since === "number" ? data.since : undefined;
  const image = typeof data.image === "string" && data.image ? data.image : undefined;
  const imageAlt = typeof data.image_alt === "string" && data.image_alt ? data.image_alt : undefined;
  if (image && !imageAlt) throw new Error(`${slug}: image_alt is required when an image is set`);

  return {
    slug,
    title,
    strand,
    kind,
    place,
    status,
    since,
    image,
    imageAlt,
    showInAlsoShowing: data.show_in_also_showing === true,
    lastReviewed,
    band: band(status, since),
    placeholder: placeholderLabel(kind),
    lede: body.trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "",
    html: marked.parse(body, { async: false }) as string,
  };
}

export function resolveFeatured(ref: string, projects: Project[]): Project {
  const found = projects.find((p) => p.slug === ref);
  if (!found) throw new Error(`home: featured points to "${ref}", which is not a project`);
  return found;
}

export function loadSite(dir: string = CONTENT_DIR): Site {
  const projectDir = path.join(dir, "projects");
  const projects = fs
    .readdirSync(projectDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(projectDir, f), "utf8"));
      return parseProject(f.replace(/\.md$/, ""), data, content);
    });

  const { data } = matter(fs.readFileSync(path.join(dir, "home.md"), "utf8"));
  const home: Home = { headline: text("home", "headline", data.headline), featured: text("home", "featured", data.featured) };
  const featured = resolveFeatured(home.featured, projects);
  const alsoShowing = projects.filter((p) => p.showInAlsoShowing && p.slug !== featured.slug);

  return { home, projects, featured, alsoShowing };
}
