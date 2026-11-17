import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const read = file => readFile(resolve(root, "dist", file), "utf8");
const pages = [
  ["index.html", "/", "zh-CN", "好想法"],
  ["docs.html", "/docs", "zh-CN", "使用"],
  ["download.html", "/download", "zh-CN", "下载"],
  ["en/index.html", "/en/", "en", "Keep the thought"],
  ["en/docs/index.html", "/en/docs/", "en", "guide"],
  ["en/download/index.html", "/en/download/", "en", "Download"],
];
for (const [file, path, lang, text] of pages) {
  const html = await read(file);
  assert(html.includes(`<html lang="${lang}"`), `${file}: html language`);
  assert(html.includes(`rel="canonical" href="https://cliperx.com${path}"`), `${file}: canonical`);
  assert(html.toLowerCase().includes(text.toLowerCase()), `${file}: rendered content`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one H1`);
  assert(!html.includes('content="noindex'), `${file}: indexable`);
  for (const language of ["zh-CN", "en", "x-default"]) assert.equal((html.match(new RegExp(`hreflang="${language}"`, "g")) || []).length, 1);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.url, `https://cliperx.com${path}`);
  assert.equal(schema.downloadUrl, "https://cliperx.com/download/latest");
  assert.equal(schema.offers.price, "0");
  for (const asset of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) await access(resolve(root, "dist", asset[1].slice(1)));
  console.log(`PASS rendered SEO: ${path}`);
}
const missing = await read("404.html");
assert(missing.includes('content="noindex, follow"'));
assert(!missing.includes('hreflang='));
const robots = await read("robots.txt");
assert(!robots.includes('Disallow: /assets/'));
assert(robots.includes('Disallow: /api/'));
const sitemap = await read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, new Set(urls).size);
assert.equal(urls.length, 12);
for (const url of urls) {
  const path = new URL(url).pathname;
  const file = path === "/" ? "index.html" : path.endsWith("/") ? path.slice(1) + "index.html" : path.endsWith(".html") ? path.slice(1) : path.slice(1) + ".html";
  const html = await read(file);
  assert(html.includes(`href="${url}"`), `${url}: sitemap matches canonical`);
  assert(!/¥18|&yen;18/.test(html), `${url}: no old CliperX price`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
}
assert((await read("blog/how-to-view-clipboard-history-mac.html")).includes("macOS Tahoe 26"));
console.log("PASS 404, robots, 12 sitemap URLs, prices, JSON-LD and resource references");
for (const file of ['compare/paste.html', 'blog/clipboard-manager-one-time-purchase.html']) {
  const html = await read(file);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one H1`);
  assert(!/¥299|&yen;299|无 AI 功能|1-2 GB|综合性价比最高/.test(html), `${file}: no stale unsupported comparison`);
  assert(html.includes('https://pasteapp.io/pricing'), `${file}: primary pricing source`);
  assert(html.includes('href="/docs"') && html.includes('href="/download"'), `${file}: actionable internal links`);
}
for (const file of ['docs.html', 'en/docs/index.html']) {
  const html = await read(file);
  assert(html.includes('id="quick-check"'));
  assert(html.includes('id="more-guides"'));
  assert(html.includes('/blog/how-to-view-clipboard-history-mac.html'));
}
console.log('PASS source-backed comparison pages and discoverable documentation resources');
for (const file of ['index.html', 'en/index.html']) {
  assert((await read(file)).includes('poster="/videos/hero-poster.webp"'), `${file}: optimized poster rendered without JS`);
}
await access(resolve(root, 'dist/videos/hero-poster.webp'));
console.log('PASS optimized poster in both server-rendered languages');
