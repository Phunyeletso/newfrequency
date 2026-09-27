import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeo, SITE_ORIGIN, SOCIAL_IMAGE } from "./seo";

function upsertMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/** Sets the page title and syncs the meta description for each route. */
export default function useDocumentTitle(title, description) {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = getSeo(pathname);
    const pageTitle = title ? `${title} · newFrequency` : `${page.title} · newFrequency`;
    const pageDescription = description || page.description;
    const canonical = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', { name: "description" }, pageDescription);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, "website");
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, "newFrequency");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, pageDescription);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonical);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, SOCIAL_IMAGE);
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, "newFrequency — Social media that pays attention.");
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, pageDescription);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, SOCIAL_IMAGE);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement("link"); canonicalLink.rel = "canonical"; document.head.appendChild(canonicalLink); }
    canonicalLink.href = canonical;
    let robots = document.head.querySelector('meta[name="robots"]');
    if (page.noindex) upsertMeta('meta[name="robots"]', { name: "robots" }, "noindex,follow");
    else if (robots) robots.remove();
  }, [title, description, pathname]);
}
