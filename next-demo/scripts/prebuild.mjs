// Copies the shared design layer and content images into public/ (pfc.css ships unchanged),
// and builds the Decap demo editor in public/admin/, seeded from content/ via window.repoFiles.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const pub = path.resolve(here, "../public");
const base = process.env.BASE_PATH ?? "";
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

copyDir(path.join(root, "design"), path.join(pub, "design"));
copyDir(path.join(root, "content/images"), path.join(pub, "images"));

// Decap test-repo backend reads a file tree from window.repoFiles. Folder collections are looked up
// by their whole folder path as one key (tree["content/projects"]), while single files are resolved
// by splitting their path on "/" (tree.content["home.md"]), so the seed carries both shapes.
const projects = {};
for (const f of fs.readdirSync(path.join(root, "content/projects")).filter((x) => x.endsWith(".md")).sort()) {
  projects[f] = { content: fs.readFileSync(path.join(root, "content/projects", f), "utf8") };
}
const tree = {
  "content/projects": projects,
  content: { "home.md": { content: fs.readFileSync(path.join(root, "content/home.md"), "utf8") } },
};

const admin = path.join(pub, "admin");
copyDir(path.join(here, "../admin-src"), admin);
fs.writeFileSync(path.join(admin, "repo-files.js"), `window.repoFiles = ${JSON.stringify(tree, null, 2)};\n`);
fs.writeFileSync(path.join(admin, "base.js"), `window.PFC_BASE = ${JSON.stringify(base)};\n`);
const cfg = path.join(admin, "config.yml");
fs.writeFileSync(cfg, fs.readFileSync(cfg, "utf8").replaceAll("__SITE_URL__", siteUrl + base + "/"));

console.log(`prebuild: design, images, and Decap admin seeded with ${Object.keys(projects).length} projects`);
