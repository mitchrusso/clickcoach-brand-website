#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyImageDimensions, saveImageDimensionCache } from "./image-dimensions.mjs";

const ROOT = process.cwd();
const RESOURCE_ROOT = path.join(ROOT, "resources");
const SITE_URL = "https://clickcoach.io";

function stripTags(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFaqs(html = "") {
  const heading = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].find((match) =>
    /\bfaq(?:s)?\b|frequently asked questions/i.test(stripTags(match[1]))
  );
  if (!heading) return [];
  const remainder = html.slice(heading.index + heading[0].length);
  const nextH2 = remainder.search(/<h2\b/i);
  const section = nextH2 >= 0 ? remainder.slice(0, nextH2) : remainder;
  const faqs = [];
  const pair = /<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pair.exec(section)) && faqs.length < 8) {
    const question = stripTags(match[1]);
    const answer = stripTags(match[2]);
    if (question && answer) {
      faqs.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      });
    }
  }
  return faqs;
}

function formatSeoTitle(title) {
  const branded = `${title} | ClickCoach`;
  return branded.length <= 60 ? branded : title;
}

function normalizeArticleBody(body, heroImageUrl) {
  let content = body.replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  );
  content = content.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, "");
  content = content.replace(/(<img\b[^>]*?)\s+\/\s+(?=width=)/gi, "$1 ");
  if (heroImageUrl) {
    const hero = escapeRegExp(heroImageUrl);
    content = content.replace(
      new RegExp(`<p[^>]*>\\s*<img\\s+[^>]*src=["']${hero}["'][^>]*>\\s*<\\/p>\\s*`, "i"),
      ""
    );
  }
  content = content.replace(/<img\b([^>]*)>/gi, (_match, attributes) => {
    const cleaned = attributes
      .replace(/\s+loading=["'][^"']*["']/gi, "")
      .replace(/\s+decoding=["'][^"']*["']/gi, "")
      .replace(/\s+fetchpriority=["'][^"']*["']/gi, "");
    return `<img loading="lazy" decoding="async" fetchpriority="low"${cleaned}>`;
  });
  return content.trim();
}

async function main() {
  const entries = await readdir(RESOURCE_ROOT, { withFileTypes: true });
  const localHeroFiles = new Map(
    (await readdir(path.join(ROOT, "images", "resources")))
      .filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name))
      .map((name) => [name.replace(/\.(?:jpe?g|png|webp)$/i, ""), name])
  );
  let repaired = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(RESOURCE_ROOT, entry.name, "index.html");
    let html;
    try {
      html = await readFile(filePath, "utf8");
    } catch {
      continue;
    }
    if (!html.includes("babylovegrowth:article-id=")) continue;

    const title = stripTags(html.match(/<section class="resource-article-hero">[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    if (!title) throw new Error(`Missing generated article title in ${filePath}`);
    const seoTitle = formatSeoTitle(title);
    const articleMatch = html.match(/(<article class="resource-article">)([\s\S]*?)(<\/article>)/i);
    if (!articleMatch) throw new Error(`Missing article body in ${filePath}`);
    const heroImageUrl = articleMatch[2].match(/<figure class="resource-article-media">[\s\S]*?<img[^>]+src=["']([^"']+)/i)?.[1] || "";
    const articleBody = await applyImageDimensions(
      normalizeArticleBody(articleMatch[2], heroImageUrl)
    );
    let optimizedArticleBody = articleBody.replace(
      /(<figure class="resource-article-media">[\s\S]*?<img\b)([^>]*)(>)/i,
      (_match, opening, attributes, closing) => {
        const cleaned = attributes
          .replace(/\s+loading=["'][^"']*["']/gi, "")
          .replace(/\s+decoding=["'][^"']*["']/gi, "")
          .replace(/\s+fetchpriority=["'][^"']*["']/gi, "");
        return `${opening} loading="eager" decoding="async" fetchpriority="high"${cleaned}${closing}`;
      }
    );
    const localHeroFile = localHeroFiles.get(entry.name);
    const localHeroPath = localHeroFile ? `/images/resources/${localHeroFile}` : "";
    const localHeroUrl = localHeroPath ? `${SITE_URL}${localHeroPath}` : "";
    if (heroImageUrl && localHeroPath) {
      optimizedArticleBody = optimizedArticleBody.replace(heroImageUrl, localHeroPath);
    }
    let next = html.replace(articleMatch[0], `${articleMatch[1]}\n${optimizedArticleBody}\n    ${articleMatch[3]}`);

    next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seoTitle}</title>`);
    next = next.replace(/(<meta property="og:title" content=")[^"]*(" \/>)/i, `$1${seoTitle}$2`);
    next = next.replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/i, `$1${seoTitle}$2`);
    if (!/<meta property="og:image:alt"/i.test(next)) {
      next = next.replace(/(<meta property="og:image"[^>]*>)/i, `$1\n<meta property="og:image:alt" content="${title}" />`);
    }
    if (!/<meta name="twitter:image:alt"/i.test(next)) {
      next = next.replace(/(<meta name="twitter:image"[^>]*>)/i, `$1\n<meta name="twitter:image:alt" content="${title}" />`);
    }
    if (localHeroUrl) {
      next = next.replace(/(<meta property="og:image" content=")[^"]*(" \/>)/i, `$1${localHeroUrl}$2`);
      next = next.replace(/(<meta name="twitter:image" content=")[^"]*(" \/>)/i, `$1${localHeroUrl}$2`);
    }

    const schemaMatch = next.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i);
    if (!schemaMatch) throw new Error(`Missing primary JSON-LD in ${filePath}`);
    const schema = JSON.parse(schemaMatch[1]);
    const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
    const filtered = graph.filter((item) => item?.["@type"] !== "FAQPage");
    const article = filtered.find((item) => item?.["@type"] === "Article");
    if (article) {
      article.author = { "@id": `${SITE_URL}/about/#mitch-russo` };
      if (localHeroUrl) article.image = localHeroUrl;
    }
    const faqs = extractFaqs(optimizedArticleBody);
    if (faqs.length) {
      const breadcrumbIndex = filtered.findIndex((item) => item?.["@type"] === "BreadcrumbList");
      const faq = { "@type": "FAQPage", "@id": `${SITE_URL}/resources/${entry.name}/#faq`, mainEntity: faqs };
      filtered.splice(breadcrumbIndex >= 0 ? breadcrumbIndex : filtered.length, 0, faq);
    }
    schema["@graph"] = filtered;
    next = next.replace(schemaMatch[0], `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`);

    if (next !== html) {
      await writeFile(filePath, next);
      repaired += 1;
    }
  }

  await saveImageDimensionCache();

  console.log(`Repaired ${repaired} generated resource page(s).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
