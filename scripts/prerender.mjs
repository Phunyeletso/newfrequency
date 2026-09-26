import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderRoute } from "../.prerender/prerender.js";
import { SEO_BY_ROUTE, SITE_ORIGIN, SOCIAL_IMAGE } from "../src/lib/seo.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(projectRoot, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function replaceMeta(html, matcher, attributes) {
  const tag = `<meta ${attributes}>`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `  ${tag}\n  </head>`);
}

async function writeRoute(route, page, output) {
  const title = `${page.title} · newFrequency`;
  const description = page.description;
  const canonical = `${SITE_ORIGIN}${route === "/" ? "/" : route}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, /<meta name="description"[^>]*>/, `name="description" content="${escapeHtml(description)}"`);
  html = replaceMeta(html, /<meta property="og:url"[^>]*>/, `property="og:url" content="${canonical}"`);
  html = replaceMeta(html, /<meta property="og:title"[^>]*>/, `property="og:title" content="${escapeHtml(title)}"`);
  html = replaceMeta(html, /<meta property="og:description"[^>]*>/, `property="og:description" content="${escapeHtml(description)}"`);
  html = replaceMeta(html, /<meta property="og:image"[^>]*>/, `property="og:image" content="${SOCIAL_IMAGE}"`);
  html = replaceMeta(html, /<meta name="twitter:title"[^>]*>/, `name="twitter:title" content="${escapeHtml(title)}"`);
  html = replaceMeta(html, /<meta name="twitter:description"[^>]*>/, `name="twitter:description" content="${escapeHtml(description)}"`);
  html = replaceMeta(html, /<meta name="twitter:image"[^>]*>/, `name="twitter:image" content="${SOCIAL_IMAGE}"`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
  if (page.noindex) html = replaceMeta(html, /<meta name="robots"[^>]*>/, 'name="robots" content="noindex,follow"');
  html = html.replace('<div id="root"></div>', `<div id="root">${await renderRoute(route)}</div>`);

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html, "utf8");
}

for (const [route, page] of Object.entries(SEO_BY_ROUTE)) {
  const output = route === "/" ? path.join(dist, "index.html") : path.join(dist, `${route.slice(1)}.html`);
  await writeRoute(route, page, output);
}

await writeRoute("/__not_found__", {
  title: "Page not found",
  description: "This newFrequency page could not be found.",
  noindex: true,
}, path.join(dist, "404.html"));

console.log(`Pre-rendered ${Object.keys(SEO_BY_ROUTE).length} routes and a custom 404 page.`);
