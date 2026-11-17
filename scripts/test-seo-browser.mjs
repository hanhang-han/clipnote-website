import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";
const dist = resolve(import.meta.dirname, "../dist");
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const files = path === "/" ? ["index.html"] : path.endsWith("/") ? [path.slice(1) + "index.html"] : [path.slice(1), path.slice(1) + ".html", path.slice(1) + "/index.html"];
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".svg": "image/svg+xml" };
  for (const file of files) {
    if (file.includes("..")) continue;
    try { const bytes = await readFile(resolve(dist, file)); res.writeHead(200, { "Content-Type": types[extname(file)] || "text/plain" }); res.end(bytes); return; } catch {}
  }
  res.writeHead(404); res.end(await readFile(resolve(dist, "404.html")));
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = process.env.SEO_BASE_URL || `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.waitForURL(base + "/en/");
  await page.waitForFunction(() => document.title === "CliperX — AI Clipboard Manager for Mac");
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://cliperx.com/en/");
  assert((await page.locator("h1").innerText()).includes("Keep the thought"));
  await page.locator("footer").getByRole("link", { name: "Guide", exact: true }).click();
  await page.waitForURL(base + "/en/docs/");
  await page.waitForFunction(() => document.querySelector('link[hreflang="zh-CN"]')?.getAttribute("href") === "https://cliperx.com/docs");
  await page.getByRole("button", { name: "切换中文" }).click();
  await page.waitForURL(base + "/docs");
  await page.goBack();
  await page.waitForURL(base + "/en/docs/");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page.goto(base + "/download?lang=en");
  await page.waitForURL(base + "/en/download/");
  assert((await page.title()).includes("Download"));
  await page.goto(base + "/?lang=zh#memories");
  await page.waitForURL(base + "/#memories");
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
  await page.getByRole("textbox").fill("设计");
  assert((await page.locator("body").innerText()).includes("设计"));
  await page.getByRole("textbox").fill("");
  for (const path of ["/", "/en/", "/en/docs/", "/en/download/"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + path);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${path}: no horizontal overflow`);
  }
  await page.goto(base + "/en/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Guide", exact: true }).click();
  await page.waitForURL(base + "/en/docs/");
  await page.locator("#mobile-nav").waitFor({ state: "hidden" });
  await page.goto(base + "/not-a-real-page");
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, follow");
  assert.deepEqual(errors, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/en/");
  await page.screenshot({ path: "/tmp/cliperx-seo-en.png", fullPage: false });
  console.log("PASS browser: language toggle, metadata, localized links, Back/reload, legacy query, search, mobile navigation/overflow, 404; zero page errors");
} finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
