import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../js/google-analytics.js', import.meta.url), 'utf8');
function run({ consent = null, hostname = 'clickcoach.io', blocked = false } = {}) {
  const scripts = [], elements = [], storage = new Map();
  if (consent) storage.set('clickcoach-analytics-consent-v1', consent);
  function element(tag) {
    const el = { tag, listeners: {}, setAttribute() {}, addEventListener(k, fn) { this.listeners[k] = fn; }, show() { this.open = true; }, close() { this.open = false; } };
    el.buttons = [{ ...el, listeners: {} }, { ...el, listeners: {} }];
    el.querySelectorAll = () => el.buttons;
    el.querySelector = () => (el.paragraph ||= {});
    elements.push(el);
    return el;
  }
  const window = {};
  const context = vm.createContext({ window, URL, Date, navigator: { globalPrivacyControl: blocked },
    location: { hostname, origin: 'https://' + hostname, pathname: '/pricing/', reload() {} },
    localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) },
    document: { cookie: '', referrer: 'https://example.com/private?email=secret', createElement: element, querySelector: () => null,
      head: { appendChild(el) { if (el.tag === 'script') scripts.push(el); } }, body: { appendChild() {} } }
  });
  vm.runInContext(source, context);
  return { scripts, window, context, dialog: elements.find(e => e.tag === 'dialog') };
}
for (const consent of [null, 'declined']) assert.equal(run({consent}).scripts.length, 0);
for (const hostname of ['localhost', 'preview.vercel.app', 'new.clickcoach.io']) assert.equal(run({consent:'accepted',hostname}).scripts.length, 0);
assert.equal(run({consent:'accepted', blocked:true}).scripts.length, 0);
const accepted = run({consent:'accepted'});
assert.equal(accepted.scripts.length, 1);
assert.match(accepted.scripts[0].src, /G-Z5M6NT3QFL$/);
const config = accepted.window.dataLayer.find(a => a[0] === 'config')[2];
assert.equal(config.page_location, 'https://clickcoach.io/pricing/');
assert.equal(config.page_referrer, 'https://example.com');
assert.equal(config.allow_google_signals, false);
vm.runInContext(source, accepted.context);
assert.equal(accepted.scripts.length, 1);
const firstVisit = run();
assert.equal(firstVisit.dialog.open, true);
firstVisit.dialog.buttons[1].listeners.click();
assert.equal(firstVisit.scripts.length, 1);
assert.equal(firstVisit.dialog.open, false);
firstVisit.dialog.buttons[0].listeners.click();
assert.equal(firstVisit.window['ga-disable-G-Z5M6NT3QFL'], true);
console.log('Analytics consent, host isolation, URL sanitization, deduplication, and opt-out tests passed.');
