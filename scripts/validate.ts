import { loadSite } from "../lib/content";
const site = loadSite();
console.log(`OK: ${site.projects.length} projects, featured "${site.featured.title}", ${site.alsoShowing.length} in Also showing`);
