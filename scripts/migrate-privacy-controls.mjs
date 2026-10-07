import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Remove legacy tracker entry points and invalidate the old immutable script URLs.
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!file.endsWith('.html')) continue;
    const original = await readFile(file, 'utf8');
    let html = original.replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*fbevents\.js(?:(?!<\/script>)[\s\S])*<\/script>/gi,
      '<script src="/js/marketing-loader.js?v=consent-20261007" defer data-rybbit="true"></script>');
    html = html.replace(/<noscript>\s*<img\b[^>]*facebook\.com\/tr[^>]*>\s*<\/noscript>/gi, '');
    html = html.replace(/\/js\/(google-analytics|marketing-loader)\.js(?:\?[^"']*)?/g, '/js/$1.js?v=consent-20261007');
    if (html.includes('</footer>') && !html.includes('data-privacy-links')) {
      html = html.replace('</footer>', '<nav data-privacy-links aria-label="Privacy and accessibility" style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;background:#fff;color:#182338"><a style="color:#182338" href="/privacy/#privacy-choices">Your Privacy Choices / Do Not Sell or Share</a><a style="color:#182338" href="/privacy/#your-rights">Request or delete my data</a><a style="color:#182338" href="/privacy/#accessibility">Accessibility</a></nav>\n</footer>');
    }
    if (html !== original) await writeFile(file, html);
  }
}
await visit(new URL('..', import.meta.url).pathname);
