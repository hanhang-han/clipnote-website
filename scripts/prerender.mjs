// Deterministic static rendering: no browser, network, analytics, or video requests.
import { build } from "esbuild";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(import.meta.dirname, "..");
const entry = resolve(root, ".prerender/entry.mjs");
const dist = resolve(root, "dist");
const routes = [
  ["/", "灵剪 CliperX — 你的个人 AI 记忆空间"],
  ["/docs", "使用指南 — 灵剪 CliperX"],
  ["/download", "下载灵剪 — CliperX for Mac"],
  ["/404", "页面未找到 — 灵剪 CliperX"],
];
try {
  await build({
    entryPoints: [resolve(root, "src/entry-server.tsx")],
    outfile: entry,
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    jsx: "automatic",
    logLevel: "warning",
  });
  const { render } = await import(pathToFileURL(entry).href);
  const template = await readFile(resolve(dist, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>'))
    throw new Error("Missing empty root in Vite output");
  for (const [route, title] of routes) {
    const html = template
      .replace(
        '<div id="root"></div>',
        () => `<div id="root">${render(route)}</div>`,
      )
      .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
      .replace(
        'href="https://cliperx.com/"',
        `href="https://cliperx.com${route === "/404" ? "/" : route}"`,
      );
    if (route === "/") await writeFile(resolve(dist, "index.html"), html);
    else {
      await writeFile(resolve(dist, `${route.slice(1)}.html`), html);
      if (route !== "/404") {
        const dir = resolve(dist, route.slice(1));
        await mkdir(dir, { recursive: true });
        await writeFile(resolve(dir, "index.html"), html);
      }
    }
    console.log(`[prerender] ${route}`);
  }
} finally {
  await rm(resolve(root, ".prerender"), { recursive: true, force: true });
}
