import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('js/marketing-loader.js', root), 'utf8');
function run({ consent, gpc = false, dnt = false, hostname = 'clickcoach.io', failure = false } = {}) {
  const scripts = [], events = {}, storage = new Map([['clickcoach-marketing-consent-v1', consent]]);
  const window = { addEventListener(name, fn) { events[name] = fn; } };
  vm.runInNewContext(source, { window, location: { hostname }, navigator: { globalPrivacyControl: gpc, doNotTrack: dnt ? '1' : '0' },
    localStorage: { getItem(key) { if (failure) throw Error('Unavailable'); return storage.get(key); } },
    document: { currentScript: { dataset: { rybbit: 'true' } }, createElement() { return { setAttribute() {} }; }, head: { appendChild(s) { scripts.push(s.src); } } }
  });
  return { scripts, events, storage };
}
for (const options of [{}, {consent:'declined'}, {consent:'accepted',gpc:true}, {consent:'accepted',dnt:true}, {consent:'accepted',failure:true}, {consent:'accepted',hostname:'new.clickcoach.io'}, {consent:'accepted',hostname:'localhost'}]) {
  assert.equal(run(options).scripts.length, 0, JSON.stringify(options));
}
const accepted = run({consent:'accepted'});
assert.equal(accepted.scripts.length, 3);
accepted.events['clickcoach:consent']();
assert.equal(accepted.scripts.length, 3);
const fresh = run();
fresh.storage.set('clickcoach-marketing-consent-v1', 'accepted');
fresh.events['clickcoach:consent']();
assert.equal(fresh.scripts.length, 3);
async function check(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await check(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file,'utf8');
      assert.doesNotMatch(html, /facebook\.com\/tr|fbevents\.js/, file.pathname);
      if (html.includes('/js/google-analytics.js')) assert.match(html, /google-analytics\.js\?v=consent-20261007/, file.pathname);
      if (html.includes('</footer>')) assert.match(html, /data-privacy-links/, file.pathname);
    }
  }
}
await check(root);
const config = JSON.parse(await readFile(new URL('vercel.json', root),'utf8'));
const headers = Object.fromEntries(config.headers[0].headers.map(h => [h.key,h.value]));
assert.match(headers['Content-Security-Policy'], /object-src 'none'/);
assert.ok(headers['Content-Security-Policy-Report-Only']);
assert.equal(headers['Cross-Origin-Opener-Policy'], 'same-origin-allow-popups');
console.log('Marketing consent, GPC/DNT, isolation, deduplication, static entry points, and headers passed.');
