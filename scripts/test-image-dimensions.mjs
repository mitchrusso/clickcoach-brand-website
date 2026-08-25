#!/usr/bin/env node

import assert from "node:assert/strict";
import { readImageSize } from "./image-dimensions.mjs";

const png = Buffer.alloc(24);
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
png.writeUInt32BE(1200, 16);
png.writeUInt32BE(675, 20);
assert.deepEqual(readImageSize(png), { width: 1200, height: 675 });

const gif = Buffer.alloc(10);
gif.write("GIF89a", 0, "ascii");
gif.writeUInt16LE(640, 6);
gif.writeUInt16LE(360, 8);
assert.deepEqual(readImageSize(gif), { width: 640, height: 360 });

const webp = Buffer.alloc(30);
webp.write("RIFF", 0, "ascii");
webp.write("WEBP", 8, "ascii");
webp.write("VP8X", 12, "ascii");
webp.writeUIntLE(1079, 24, 3);
webp.writeUIntLE(719, 27, 3);
assert.deepEqual(readImageSize(webp), { width: 1080, height: 720 });

const jpeg = Buffer.from([
  0xff, 0xd8,
  0xff, 0xc0, 0x00, 0x11, 0x08,
  0x02, 0xd0,
  0x04, 0x38,
  0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
]);
assert.deepEqual(readImageSize(jpeg), { width: 1080, height: 720 });

console.log("Image dimension parser checks passed.");
