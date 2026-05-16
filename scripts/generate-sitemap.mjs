import fs from "fs";
import path from "path";

const SITE_URL = "https://noiceresume.pages.dev";

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/resume-builder", priority: "0.9", changefreq: "monthly" },
  { loc: "/resume-import", priority: "0.8", changefreq: "monthly" },
  { loc: "/resources", priority: "0.8", changefreq: "weekly" },
];

const TEMPLATE_SLUGS = [
  "ats-friendly",
  "internship",
  "tech",
  "college",
  "modern",
  "software-engineer",
  "product-manager",
  "data-scientist",
  "marketing",
  "ux-designer",
  "business-analyst",
  "project-manager",
  "graphic-designer",
];

const RESOURCE_SLUGS = ["how-to-write-resume"];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const route of STATIC_ROUTES) {
  xml += `  <url>\n    <loc>${SITE_URL}${route.loc}</loc>\n    <priority>${route.priority}</priority>\n    <changefreq>${route.changefreq}</changefreq>\n  </url>\n`;
}

for (const slug of TEMPLATE_SLUGS) {
  xml += `  <url>\n    <loc>${SITE_URL}/templates/${slug}</loc>\n    <priority>0.7</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
}

for (const slug of RESOURCE_SLUGS) {
  xml += `  <url>\n    <loc>${SITE_URL}/resources/${slug}</loc>\n    <priority>0.9</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
}

xml += "</urlset>\n";

const outPath = path.join(process.cwd(), "public", "sitemap.xml");
fs.writeFileSync(outPath, xml, "utf-8");
console.log(`Generated sitemap.xml with ${STATIC_ROUTES.length + TEMPLATE_SLUGS.length + RESOURCE_SLUGS.length} URLs → ${outPath}`);
