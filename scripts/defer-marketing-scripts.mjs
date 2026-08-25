#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(filePath)));
    else if (entry.name.endsWith(".html")) files.push(filePath);
  }
  return files;
}

const convertBoxPattern = /<script\b[^>]*>[^<]*cdn\.convertbox\.com\/convertbox\/js\/embed\.js[^<]*<\/script>\s*/i;
const rybbitPattern = /<script\s+src=["']https:\/\/app\.rybbit\.io\/api\/script\.js["'][^>]*><\/script>\s*/i;
const metaPattern = /<!-- Meta Pixel Code -->\s*<script>[\s\S]*?fbq\(['"]track['"],\s*['"]PageView['"]\);\s*<\/script>\s*<!-- End Meta Pixel Code -->\s*/i;
let changed = 0;

for (const filePath of await htmlFiles(ROOT)) {
  let html = await readFile(filePath, "utf8");
  if (html.includes("setTimeout(loadMarketingScripts, 12000)")) continue;
  if (!convertBoxPattern.test(html)) continue;

  const includeRybbit = rybbitPattern.test(html);
  const loader = `<script src="/js/marketing-loader.js" defer${includeRybbit ? ' data-rybbit="true"' : ""}></script>\n`;
  const next = html
    .replace(convertBoxPattern, loader)
    .replace(rybbitPattern, "")
    .replace(metaPattern, "");

  if (next !== html) {
    await writeFile(filePath, next);
    changed += 1;
  }
}

console.log(`Deferred marketing scripts on ${changed} page(s).`);
