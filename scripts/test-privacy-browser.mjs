import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const config = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const headers = Object.fromEntries(config.headers[0].headers.map(h => [h.key, h.value]));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const optional = /googletagmanager|google-analytics|facebook|rybbit|convertbox/;
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: {width, height:900} });
    const external = [];
    // Serve local files under the production hostname without sending visitor data.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'clickcoach.io') { external.push(url.href); await route.abort(); return; }
      const file = path.join(root, decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
      if (!file.startsWith(root + '/')) return route.abort();
      try {
        const body = await readFile(file);
        const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'}[path.extname(file)] || 'application/octet-stream';
        await route.fulfill({body, contentType:mime, headers});
      } catch { await route.fulfill({status:404,body:''}); }
    });
    const page = await context.newPage();
    await page.goto('https://clickcoach.io/');
    await page.getByRole('button',{name:'Decline all',exact:true}).waitFor();
    await page.waitForTimeout(13000);
    assert.equal(external.filter(url => optional.test(url)).length,0);
    const dialog = page.locator('.cc-analytics-dialog');
    const bounds = await dialog.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
    assert.equal(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth),true);
    await page.screenshot({path:`/tmp/clickcoach-privacy-${width}.png`});
    await page.getByRole('button',{name:'Analytics only',exact:true}).click();
    await page.waitForTimeout(100);
    assert.equal(external.filter(url => /googletagmanager/.test(url)).length,1);
    assert.equal(external.filter(url => /facebook|rybbit|convertbox/.test(url)).length,0);
    await page.getByRole('button',{name:'Your Privacy Choices',exact:true}).click();
    await page.getByRole('button',{name:'Accept analytics and marketing',exact:true}).click();
    await page.waitForTimeout(100);
    assert.equal(external.filter(url => /facebook|rybbit|convertbox/.test(url)).length,3);
    await page.getByRole('button',{name:'Your Privacy Choices',exact:true}).click();
    await page.getByRole('button',{name:'Decline all',exact:true}).click();
    await page.waitForLoadState('load');
    external.length = 0;
    await page.reload();
    await page.waitForTimeout(200);
    assert.equal(external.filter(url => optional.test(url)).length,0);
    await page.goto('https://clickcoach.io/privacy/#privacy-choices');
    await page.getByRole('button',{name:'Decline all',exact:true}).waitFor();
    await context.close();
  }
  console.log('Desktop/mobile: no pre-consent tracking, analytics-only, marketing opt-in, revocation, privacy link, and dialog bounds passed. External requests were intercepted, not sent.');
} finally { await browser.close(); }
