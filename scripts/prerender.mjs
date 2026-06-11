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

  // 3. Render the page
  console.log('[prerender] Rendering / ...');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for animations & dynamic content
  await page.waitForTimeout(2000);

  const renderedHtml = await page.content();

  // 4. Read original index.html (has meta tags, JSON-LD, etc.)
  const originalPath = resolve(DIST, 'index.html');
  const original = readFileSync(originalPath, 'utf-8');

  // 5. Extract rendered body content
  const bodyMatch = renderedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const renderedBody = bodyMatch ? bodyMatch[1] : '';

  // 6. Inject rendered content into original HTML
  // Replace the root div's content with prerendered HTML
  const final = original.replace(
    /(<div\s+id="root"[^>]*>)([\s\S]*?)(<\/div>)/i,
    `$1${renderedBody.replace(/<div\s+id="root"[^>]*>[\s\S]*?<\/div>/, '')}$3`
  );

  writeFileSync(originalPath, final, 'utf-8');
  console.log('[prerender] Saved prerendered index.html');

  // 7. Cleanup
  await browser.close();
  server.close();
  console.log('[prerender] Done');
}

prerender().catch(err => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
