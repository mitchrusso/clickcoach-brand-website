import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CACHE_PATH = path.join(process.cwd(), "data", "remote-image-dimensions.json");
const dimensions = new Map();
let loaded = false;
let changed = false;

async function loadCache() {
  if (loaded) return;
  loaded = true;
  try {
    const cache = JSON.parse(await readFile(CACHE_PATH, "utf8"));
    for (const [url, value] of Object.entries(cache)) {
      if (value?.width > 0 && value?.height > 0) dimensions.set(url, value);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function readJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (sofMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) break;
    offset += segmentLength + 2;
  }
  return null;
}

export function readImageSize(buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 10 && ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))) {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8L" && buffer[20] === 0x2f) {
      return {
        width: 1 + buffer[21] + ((buffer[22] & 0x3f) << 8),
        height: 1 + ((buffer[22] & 0xc0) >> 6) + (buffer[23] << 2) + ((buffer[24] & 0x0f) << 10),
      };
    }
    if (chunk === "VP8 ") {
      for (let offset = 20; offset + 6 < buffer.length; offset += 1) {
        if (buffer[offset] === 0x9d && buffer[offset + 1] === 0x01 && buffer[offset + 2] === 0x2a) {
          return {
            width: buffer.readUInt16LE(offset + 3) & 0x3fff,
            height: buffer.readUInt16LE(offset + 5) & 0x3fff,
          };
        }
      }
    }
  }
  return readJpegSize(buffer);
}

async function fetchImageSize(url) {
  const response = await fetch(url, { headers: { Range: "bytes=0-131071" } });
  if (!response.ok && response.status !== 206) {
    throw new Error(`Image request failed with ${response.status}`);
  }
  const size = readImageSize(Buffer.from(await response.arrayBuffer()));
  if (!size?.width || !size?.height) throw new Error("Unsupported or unreadable image format");
  return size;
}

async function resolveImageSize(url) {
  await loadCache();
  if (dimensions.has(url)) return dimensions.get(url);
  const size = await fetchImageSize(url);
  dimensions.set(url, size);
  changed = true;
  return size;
}

export async function applyImageDimensions(html = "") {
  await loadCache();
  const tags = [...String(html).matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const candidates = tags.filter((tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)/i)?.[1];
    const missingDimensions = !/\bwidth=["']/i.test(tag) || !/\bheight=["']/i.test(tag);
    return src && /^https?:\/\//i.test(src) && (missingDimensions || dimensions.has(src));
  });
  const uniqueUrls = [...new Set(candidates.map((tag) => tag.match(/\bsrc=["']([^"']+)/i)[1]))];
  const resolved = new Map();

  await Promise.all(
    uniqueUrls.map(async (url) => {
      try {
        resolved.set(url, await resolveImageSize(url));
      } catch (error) {
        console.warn(`Could not determine image dimensions for ${url}: ${error.message}`);
      }
    })
  );

  let output = String(html);
  for (const tag of candidates) {
    const url = tag.match(/\bsrc=["']([^"']+)/i)[1];
    const size = resolved.get(url);
    if (!size) continue;
    const selfClosing = /\s*\/>$/.test(tag);
    const next = tag
      .replace(/\s+width=["']?\d+["']?/i, "")
      .replace(/\s+height=["']?\d+["']?/i, "")
      .replace(/\s*\/\s*(?=>)/, "")
      .replace(/\s*\/?>$/, ` width="${size.width}" height="${size.height}"${selfClosing ? " />" : ">"}`);
    output = output.replace(tag, next);
  }
  return output;
}

export const addMissingImageDimensions = applyImageDimensions;

export async function saveImageDimensionCache() {
  await loadCache();
  if (!changed) return;
  const cache = Object.fromEntries([...dimensions.entries()].sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
  changed = false;
}
