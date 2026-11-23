#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const RESOURCE_ROOT = path.join(ROOT, "resources");
const SITE_URL = "https://clickcoach.io";
const MAX_ITEMS = 25;

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function parseSchema(html, filePath) {
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const schema = JSON.parse(match[1]);
      const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
      const article = graph.find((item) => item?.["@type"] === "Article");
      if (article) return article;
    } catch (error) {
      throw new Error(`Invalid JSON-LD in ${filePath}: ${error.message}`);
    }
  }
  return null;
}

async function main() {
  const articles = [];
  for (const entry of await readdir(RESOURCE_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(RESOURCE_ROOT, entry.name, "index.html");
    let html;
    try {
      html = await readFile(filePath, "utf8");
    } catch {
      continue;
    }

    const article = parseSchema(html, filePath);
    if (!article?.headline || !article?.datePublished) continue;
    const url = `${SITE_URL}/resources/${entry.name}/`;
    articles.push({
      title: article.headline,
      description: article.description || "",
      date: article.datePublished,
      author: article.author?.name || "Mitch Russo",
      url,
    });
  }

  articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const items = articles.slice(0, MAX_ITEMS);
  if (!items.length) throw new Error("No resource articles with publish dates were found.");

  const newestDate = new Date(`${items[0].date}T12:00:00Z`).toUTCString();
  const itemXml = items.map((article) => {
    const published = new Date(`${article.date}T12:00:00Z`).toUTCString();
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.url)}</link>
      <guid isPermaLink="true">${escapeXml(article.url)}</guid>
      <description>${escapeXml(article.description)}</description>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <pubDate>${published}</pubDate>
    </item>`;
  }).join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>ClickCoach Coaching Resources</title>
    <link>${SITE_URL}/resources/</link>
    <description>Practical guides for professional coaches on client progress, accountability, practice management, and coaching software.</description>
    <language>en-us</language>
    <lastBuildDate>${newestDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>
`;

  await writeFile(path.join(ROOT, "feed.xml"), feed);
  console.log(`Generated feed.xml with ${items.length} recent resource articles.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
