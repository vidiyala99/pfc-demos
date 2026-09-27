// Assembles _site/ exactly as GitHub Pages serves it: chooser at the root, the Next.js demo under /next,
// the shared design, images, the WordPress import file, and a blueprint pointing at this repo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "_site");
const repo = process.env.REPO_URL ?? "https://github.com/OWNER/pfc-demos";
const pages = process.env.PAGES_URL ?? "http://127.0.0.1:4320/";

fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });
fs.cpSync(path.join(root, "chooser"), site, { recursive: true });
fs.cpSync(path.join(root, "design"), path.join(site, "design"), { recursive: true });
fs.cpSync(path.join(root, "content/images"), path.join(site, "images"), { recursive: true });
fs.cpSync(path.join(root, "next-demo/out"), path.join(site, "next"), { recursive: true });
fs.mkdirSync(path.join(site, "wordpress"), { recursive: true });
fs.copyFileSync(path.join(root, "wordpress/pfc-content.xml"), path.join(site, "wordpress/pfc-content.xml"));
const bp = fs.readFileSync(path.join(root, "wordpress/blueprint.template.json"), "utf8").replaceAll("__REPO_URL__", repo).replaceAll("__PAGES_URL__", pages);
fs.writeFileSync(path.join(site, "blueprint.json"), bp);
fs.writeFileSync(path.join(site, ".nojekyll"), "");
console.log(`assembled _site/ (repo ${repo}, pages ${pages})`);
