// Builds wordpress/pfc-content.xml (WXR) from content/, so the WordPress demo imports the same projects as the Next.js demo.
import fs from "node:fs";
import path from "node:path";
import { loadSite, type Project } from "../lib/content";

const out = path.resolve(import.meta.dirname, "../wordpress/pfc-content.xml");
const cdata = (s: string) => `<![CDATA[${s.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Markdown renders to <h2> and <p> only; map each to its native block so editors get Heading and Paragraph blocks.
export function toBlocks(html: string): string {
  return (html.match(/<(h2|p)>[\s\S]*?<\/\1>/g) ?? [])
    .map((el) =>
      el.startsWith("<h2")
        ? `<!-- wp:heading -->\n${el.replace("<h2>", '<h2 class="wp-block-heading">')}\n<!-- /wp:heading -->`
        : `<!-- wp:paragraph -->\n${el}\n<!-- /wp:paragraph -->`,
    )
    .join("\n\n");
}

function meta(key: string, value: string | number | undefined) {
  if (value === undefined || value === "") return "";
  return `<wp:postmeta><wp:meta_key>${key}</wp:meta_key><wp:meta_value>${cdata(String(value))}</wp:meta_value></wp:postmeta>`;
}

function item(p: Project, id: number) {
  const terms = [
    ["pfc_strand", p.strand],
    ["pfc_kind", p.kind],
    ["pfc_status", p.status],
  ]
    .map(([tax, name]) => `<category domain="${tax}" nicename="${slug(name)}">${cdata(name)}</category>`)
    .join("");
  return `<item>
<title>${cdata(p.title)}</title>
<dc:creator>${cdata("admin")}</dc:creator>
<content:encoded>${cdata(toBlocks(p.html))}</content:encoded>
<excerpt:encoded>${cdata(p.lede)}</excerpt:encoded>
<wp:post_id>${id}</wp:post_id>
<wp:post_date>${cdata(`${p.lastReviewed} 09:00:00`)}</wp:post_date>
<wp:post_name>${cdata(p.slug)}</wp:post_name>
<wp:status>${cdata("publish")}</wp:status>
<wp:post_type>${cdata("pfc_project")}</wp:post_type>
${terms}
${meta("pfc_place", p.place)}${meta("pfc_since", p.since)}${meta("pfc_image", p.image)}${meta("pfc_image_alt", p.imageAlt)}${meta("pfc_show_in_also_showing", p.showInAlsoShowing ? "1" : "")}${meta("pfc_last_reviewed", p.lastReviewed)}
</item>`;
}

const site = loadSite();
const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
<title>Partnerships For Change</title>
<wp:wxr_version>1.2</wp:wxr_version>
<wp:author><wp:author_id>1</wp:author_id><wp:author_login>${cdata("admin")}</wp:author_login></wp:author>
${site.projects.map((p, i) => item(p, 100 + i)).join("\n")}
</channel>
</rss>
`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, xml);
console.log(`WXR: ${site.projects.length} projects -> ${path.relative(process.cwd(), out)}`);
