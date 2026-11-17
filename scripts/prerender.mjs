// Deterministic HTML in both languages; URL, content and metadata agree without JS.
import { build } from "esbuild";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(import.meta.dirname, "..");
const entry = resolve(root, ".prerender/entry.mjs");
const dist = resolve(root, "dist");
const workshopPages = ["/workshop", "/workshop/develop", "/workshop/submit", "/workshop/mine", "/workshop/review", "/workshop/authorize"];
const routes = ["/", "/docs", "/download", "/en/", "/en/docs/", "/en/download/", ...workshopPages, ...workshopPages.map(route => `/en${route}/`), "/account", "/checkout", "/admin", "/en/account/", "/404"];
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
try {
  await build({ entryPoints: [resolve(root, "src/entry-server.tsx")], outfile: entry, bundle: true, platform: "node", format: "esm", packages: "external", jsx: "automatic", logLevel: "warning" });
  const { render, seoFor } = await import(pathToFileURL(entry).href);
  const template = await readFile(resolve(dist, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>')) throw new Error("Missing empty root in Vite output");
  for (const route of routes) {
    const seo = seoFor(route);
    let html = template.replace('<div id="root"></div>', () => `<div id="root">${render(route)}</div>`)
      .replace(/<html lang="[^"]+"/, `<html lang="${seo.lang === "zh" ? "zh-CN" : "en"}"`)
      .replace(/<title>.*?<\/title>/s, `<title>${escape(seo.title)}</title>`)
      .replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${seo.canonical}" />`);
    for (const [attr, key, value] of [
      ["name", "description", seo.description], ["name", "robots", seo.indexable ? "index, follow, max-image-preview:large" : "noindex, follow"],
      ["property", "og:title", seo.title], ["property", "og:description", seo.description], ["property", "og:url", seo.canonical],
      ["property", "og:locale", seo.lang === "zh" ? "zh_CN" : "en_US"], ["name", "twitter:title", seo.title], ["name", "twitter:description", seo.description],
    ]) html = html.replace(new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`), `<meta ${attr}="${key}" content="${escape(value)}" />`);
    for (const [lang, href] of Object.entries(seo.alternates)) {
      html = html.replace(new RegExp(`<link\\s+rel="alternate"\\s+hreflang="${lang}"[^>]*>`), seo.known ? `<link rel="alternate" hreflang="${lang}" href="${href}" />` : "");
    }
    const schema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "CliperX", applicationCategory: "UtilitiesApplication", operatingSystem: "macOS 14.0 or later", url: seo.canonical, downloadUrl: "https://cliperx.com/download/latest", inLanguage: seo.lang === "zh" ? "zh-CN" : "en", description: seo.description, offers: { "@type": "Offer", price: "0", priceCurrency: "CNY", name: seo.lang === "zh" ? "免费版" : "Free" } };
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, seo.known ? `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>` : "");
    const files = route === "/" ? ["index.html"] : route === "/404" ? ["404.html"] : route.startsWith("/en") ? [`${route.slice(1)}index.html`] : [`${route.slice(1)}.html`, `${route.slice(1)}/index.html`];
    for (const file of files) { await mkdir(dirname(resolve(dist, file)), { recursive: true }); await writeFile(resolve(dist, file), html); }
    console.log(`[prerender] ${route} (${seo.lang})`);
  }
} finally { await rm(resolve(root, ".prerender"), { recursive: true, force: true }); }
