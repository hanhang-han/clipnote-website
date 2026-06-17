import { chromium } from 'playwright';
import { createServer } from 'http';
import pkg from 'serve-handler';
const handler = pkg.default || pkg;
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const DIST = resolve(import.meta.dirname, '../dist');
const PORT = 9876;

async function prerender() {
  // 1. Start static server from dist/
  const server = createServer((req, res) =>
    handler(req, res, { public: DIST, cleanUrls: true })
  );

  await new Promise(r => server.listen(PORT, r));
  console.log(`[prerender] Serving ${DIST} on http://localhost:${PORT}`);

  // 2. Launch headless browser
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const routes = ['/', '/docs', '/download'];
  const templatePath = resolve(DIST, 'index.html');
  const template = readFileSync(templatePath, 'utf-8');

  for (const route of routes) {
    console.log(`[prerender] Rendering ${route} ...`);
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const renderedHtml = await page.content();
    const bodyMatch = renderedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const renderedBody = bodyMatch ? bodyMatch[1] : '';

    const final = template.replace(
      /(<div\s+id="root"[^>]*>)([\s\S]*?)(<\/div>)/i,
      `$1${renderedBody.replace(/<div\s+id="root"[^>]*>[\s\S]*?<\/div>/, '')}$3`
    );

    if (route === '/') {
      writeFileSync(templatePath, final, 'utf-8');
      console.log(`[prerender] Saved prerendered index.html`);
    } else {
      const outPath = resolve(DIST, `${route.slice(1)}.html`);
      writeFileSync(outPath, final, 'utf-8');
      console.log(`[prerender] Saved prerendered ${route}.html`);
    }
  }

  await browser.close();
  server.close();
  console.log('[prerender] Done');
}

prerender().catch(err => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
