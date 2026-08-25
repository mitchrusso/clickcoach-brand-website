#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://clickcoach.io";
const EXCLUDED_DIRS = new Set([".git", "node_modules", "resources-drafts", "word-drafts"]);
const errors = [];

function decodeHtml(value = "") {
  return String(value)
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–")
    .replaceAll("&middot;", "·")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));
}

function metaContent(html, key, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (!new RegExp(`\\b${key}=["']${escaped}["']`, "i").test(match[0])) continue;
    return decodeHtml(match[0].match(/\bcontent=["']([^"']*)["']/i)?.[1] || "");
  }
  return "";
}

function tagContent(html, tag) {
  return decodeHtml(html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function routeFor(file) {
  const relative = path.relative(ROOT, file).replaceAll(path.sep, "/");
  return relative === "index.html" ? "/" : `/${relative.replace(/\/index\.html$/, "/")}`;
}

function isRedirectStub(route, redirectMap) {
  for (const candidate of [route, route.replace(/\/$/, "")]) {
    const destination = redirectMap.get(candidate);
    if (!destination) continue;
    const resolved = new URL(destination, SITE_URL);
    if (resolved.origin !== SITE_URL || resolved.pathname !== route) return true;
  }
  return false;
}

function routeRole(route, html, redirectMap) {
  if (isRedirectStub(route, redirectMap)) return "Redirect stub";
  if (/noindex/i.test(metaContent(html, "name", "robots"))) return "Noindex utility";
  if (route === "/") return "Homepage / primary product entity";
  if (["/features/", "/pricing/", "/for-coaches/", "/testimonials/", "/about/", "/contact/", "/jv/", "/slipmeter/"].includes(route)) return "Core commercial / trust page";
  if (["/privacy/", "/terms/"].includes(route)) return "Legal page";
  if (route === "/resources/") return "Resource collection hub";
  if (route === "/resources/faqs/" || route === "/resources/coaching-software-answers/") return "Answer / FAQ hub";
  if (route.startsWith("/resources/")) return "Resource article";
  return "High-intent solution page";
}

function addError(route, message) {
  errors.push(`${route}: ${message}`);
}

function localAssetPath(url) {
  if (!url) return "";
  const parsed = new URL(url, SITE_URL);
  if (parsed.origin !== SITE_URL) return "";
  const pathname = parsed.pathname;
  if (!pathname.startsWith("/")) return "";
  return path.join(ROOT, decodeURIComponent(pathname.replace(/^\//, "")));
}

async function main() {
  const files = (await walk(ROOT)).filter((file) => file.endsWith("index.html"));
  const pages = new Map();
  for (const file of files) pages.set(routeFor(file), { file, html: await readFile(file, "utf8") });

  const vercel = JSON.parse(await readFile(path.join(ROOT, "vercel.json"), "utf8"));
  const redirectMap = new Map((vercel.redirects || []).filter((item) => !item.source.includes(":")) .map((item) => [item.source, item.destination]));
  const redirectSources = new Set(redirectMap.keys());
  const sitemapXml = await readFile(path.join(ROOT, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const sitemapRoutes = new Set(sitemapUrls.map((url) => new URL(url).pathname));
  const remoteImageDimensions = JSON.parse(
    await readFile(path.join(ROOT, "data", "remote-image-dimensions.json"), "utf8")
  );
  const titleOwners = new Map();
  const descriptionOwners = new Map();
  const matrix = [];

  if (sitemapRoutes.size !== sitemapUrls.length) addError("sitemap.xml", "contains duplicate URLs");

  for (const [route, page] of pages) {
    const { html } = page;
    const role = routeRole(route, html, redirectMap);
    const redirected = role === "Redirect stub";
    const noindex = /noindex/i.test(metaContent(html, "name", "robots"));
    const indexable = !redirected && !noindex;
    const title = tagContent(html, "title");
    const description = metaContent(html, "name", "description");
    const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] || html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1] || "";
    const expectedCanonical = `${SITE_URL}${route}`;
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

    matrix.push({ route, role, indexable, sitemap: sitemapRoutes.has(route), canonical: canonical || "—" });
    if (redirected) continue;

    if (!title) addError(route, "missing title");
    else if (title.length < 25 || title.length > 65) addError(route, `title length is ${title.length} characters`);
    if (!description) addError(route, "missing meta description");
    else if (indexable && (description.length < 100 || description.length > 170)) addError(route, `description length is ${description.length} characters`);
    if (!canonical) addError(route, "missing canonical");
    else if (indexable && canonical !== expectedCanonical) addError(route, `canonical is ${canonical}, expected ${expectedCanonical}`);
    if (h1Count !== 1) addError(route, `contains ${h1Count} H1 elements`);

    for (const required of [
      ["property", "og:title", "og:title"],
      ["property", "og:description", "og:description"],
      ["property", "og:image", "og:image"],
      ["property", "og:image:alt", "og:image:alt"],
      ["name", "twitter:card", "twitter:card"],
      ["name", "twitter:title", "twitter:title"],
      ["name", "twitter:description", "twitter:description"],
      ["name", "twitter:image", "twitter:image"],
      ["name", "twitter:image:alt", "twitter:image:alt"],
    ]) {
      if (!metaContent(html, required[0], required[1])) addError(route, `missing ${required[2]}`);
    }
    const socialImage = metaContent(html, "property", "og:image");
    const socialImagePath = localAssetPath(socialImage);
    if (socialImagePath && !existsSync(socialImagePath)) addError(route, `local social image is missing: ${socialImage}`);

    if (!jsonLd.length) addError(route, "missing JSON-LD");
    for (const block of jsonLd) {
      try {
        const schema = JSON.parse(block[1]);
        const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
        const visibleText = decodeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
        for (const faq of graph.filter((item) => item?.["@type"] === "FAQPage")) {
          for (const question of faq.mainEntity || []) {
            if (question.name && !visibleText.includes(decodeHtml(question.name))) addError(route, `FAQ schema question is not visible: ${question.name}`);
          }
        }
      } catch (error) {
        addError(route, `invalid JSON-LD: ${error.message}`);
      }
    }
    const articleBody = html.match(/<article class="resource-article">([\s\S]*?)<\/article>/i)?.[1] || "";
    if (/application\/ld\+json/i.test(articleBody)) addError(route, "contains JSON-LD inside article content");
    if (html.includes("babylovegrowth:article-id=")) {
      const schema = JSON.parse(jsonLd[0][1]);
      const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
      const article = graph.find((item) => item?.["@type"] === "Article");
      if (article?.author?.["@id"] !== `${SITE_URL}/about/#mitch-russo`) addError(route, "generated Article author is not the Mitch Russo entity");
      const heroSource = articleBody.match(/<figure class="resource-article-media">[\s\S]*?<img[^>]+src=["']([^"']+)/i)?.[1];
      if (heroSource) {
        const appearances = articleBody.split(heroSource).length - 1;
        if (appearances > 1) addError(route, "repeats the generated hero image inside article content");
      }
    }

    for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
      if (!/\balt=["'][^"']*["']/i.test(image[1])) addError(route, "contains an image without alt text");
      const source = image[1].match(/\bsrc=["']([^"']+)/i)?.[1] || "";
      const sourcePath = localAssetPath(source);
      if (sourcePath && !existsSync(sourcePath)) addError(route, `local image is missing: ${source}`);
      const hasDimensions = /\bwidth=["']?\d+/i.test(image[1]) && /\bheight=["']?\d+/i.test(image[1]);
      if (!hasDimensions && !/^https?:\/\//i.test(source)) addError(route, `local image lacks width and height: ${source || "unknown source"}`);
      if (!hasDimensions && /^https?:\/\//i.test(source)) addError(route, `remote image lacks width and height: ${source}`);
      const expectedSize = remoteImageDimensions[source];
      if (expectedSize && hasDimensions) {
        const width = Number(image[1].match(/\bwidth=["']?(\d+)/i)?.[1]);
        const height = Number(image[1].match(/\bheight=["']?(\d+)/i)?.[1]);
        if (width !== expectedSize.width || height !== expectedSize.height) {
          addError(route, `remote image dimensions are ${width}x${height}, expected ${expectedSize.width}x${expectedSize.height}: ${source}`);
        }
      }
    }
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html)) addError(route, "loads remote Google Fonts instead of self-hosted fonts");
    if (/<script\b[^>]*src=["']https:\/\/(?:cdn\.convertbox\.com|app\.rybbit\.io|connect\.facebook\.net)/i.test(html)) {
      addError(route, "loads a marketing script directly instead of through the deferred loader");
    }
    if (/Mindful Guidance, LLC/.test(html)) addError(route, "uses the outdated legal entity name");
    if (route.startsWith("/resources/")) {
      if (!/href=["']\/styles-resources\.min\.css\?v=resource-perf-1["']/i.test(html)) {
        addError(route, "does not use the resource-only stylesheet");
      }
      if (/href=["']\/styles\.css(?:\?|["'])/i.test(html)) addError(route, "loads the full shared stylesheet");
      for (const image of articleBody.matchAll(/<img\b([^>]*)>/gi)) {
        const source = image[1].match(/\bsrc=["']([^"']+)/i)?.[1] || "";
        if (/^https?:\/\//i.test(source) && !/\bloading=["']lazy["']/i.test(image[1])) {
          addError(route, `remote article image is not lazy-loaded: ${source}`);
        }
      }
    }

    if (indexable && !sitemapRoutes.has(route)) addError(route, "indexable route is missing from sitemap");
    if (!indexable && sitemapRoutes.has(route)) addError(route, "non-indexable route is present in sitemap");
    if (indexable) {
      (titleOwners.get(title) || titleOwners.set(title, []).get(title)).push(route);
      (descriptionOwners.get(description) || descriptionOwners.set(description, []).get(description)).push(route);
    }
  }

  for (const route of sitemapRoutes) {
    if (!pages.has(route)) addError("sitemap.xml", `URL has no local page: ${route}`);
  }
  for (const [title, owners] of titleOwners) if (owners.length > 1) addError("titles", `duplicate "${title}" on ${owners.join(", ")}`);
  for (const [description, owners] of descriptionOwners) if (owners.length > 1) addError("descriptions", `duplicate "${description}" on ${owners.join(", ")}`);

  const knownRoutes = new Set(pages.keys());
  for (const [sourceRoute, page] of pages) {
    for (const match of page.html.matchAll(/href=["']([^"'#?]+)[^"']*["']/gi)) {
      let target = match[1];
      if (/^(mailto:|tel:|javascript:|https?:\/\/)/i.test(target)) continue;
      if (!target.startsWith("/")) continue;
      if (/\.[a-z0-9]{2,5}$/i.test(target) || target.startsWith("/downloads/")) continue;
      if (!target.endsWith("/")) target += "/";
      if (!knownRoutes.has(target) && !redirectSources.has(target) && !redirectSources.has(target.replace(/\/$/, ""))) addError(sourceRoute, `broken internal link to ${target}`);
    }
  }

  const llms = await readFile(path.join(ROOT, "llms.txt"), "utf8");
  for (const match of llms.matchAll(/https:\/\/clickcoach\.io([^\s)]+)/g)) {
    const route = new URL(`${SITE_URL}${match[1]}`).pathname;
    if (!knownRoutes.has(route)) addError("llms.txt", `references missing route ${route}`);
  }

  if (process.argv.includes("--write-matrix")) {
    matrix.sort((a, b) => a.route.localeCompare(b.route));
    const rows = matrix.map((item) => `| \`${item.route}\` | ${item.role} | ${item.indexable ? "Index" : "Exclude"} | ${item.sitemap ? "Yes" : "No"} | ${item.canonical} |`).join("\n");
    const output = `# ClickCoach SEO Route Matrix\n\nGenerated by \`npm run seo:matrix\`. This ledger records the intended search role of every local HTML route.\n\n| Route | Role | Indexation | Sitemap | Canonical |\n| --- | --- | --- | --- | --- |\n${rows}\n`;
    await mkdir(path.join(ROOT, "docs"), { recursive: true });
    await writeFile(path.join(ROOT, "docs", "seo-route-matrix.md"), output);
  }

  if (errors.length) {
    console.error(`SEO checks failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`SEO checks passed for ${pages.size} routes and ${sitemapRoutes.size} sitemap URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
