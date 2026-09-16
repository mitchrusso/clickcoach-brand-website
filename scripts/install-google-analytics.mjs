import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const include = '<script src="/js/google-analytics.js?v=2" defer></script>';
let count = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'recipe', 'partials', 'admin', 'resources-drafts', 'word-drafts', 'ContextDocs'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (!html.includes('rel="canonical" href="https://clickcoach.io/') || html.includes('/js/google-analytics.js')) continue;
      const marker = html.includes('</head>') ? '</head>' : '<body';
      if (!html.includes(marker)) throw new Error('Missing document structure: ' + file);
      await writeFile(file, html.replace(marker, include + '\n' + marker));
      count++;
    }
  }
}
await visit(root);
console.log(`Added consent-gated analytics to ${count} public pages.`);
