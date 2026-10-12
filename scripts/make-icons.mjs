#!/usr/bin/env node
/**
 * Regenerate the square favicon set from the brand mark artwork.
 *
 *   favicon.ico          16 / 32 / 48 px (PNG-compressed ICO container)
 *   apple-touch-icon.png 180 px, opaque white (iOS composites transparency badly)
 *
 * Source of truth: scripts/assets/icon-mark.png — the "M + cat tail" mark on a
 * flat white background. The white is turned into a real alpha channel by
 * inverting luminance, so the ink keeps its antialiasing and can be repainted
 * to the exact brand colour.
 *
 * A wide wordmark must never be used as a favicon: browsers force the tab icon
 * into a square, which stretches a 3.3:1 logo into a squashed mess.
 *
 * Manual, one-off tool — nothing in `npm run build` depends on it.
 *   npm i --no-save sharp
 *   node scripts/make-icons.mjs                         # solid white background
 *   BACKGROUND=transparent node scripts/make-icons.mjs   # keep transparency
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ART = path.join(ROOT, 'scripts/assets/icon-mark.png');

// Brand tokens from src/styles.css
const INK = { r: 0x33, g: 0x4c, b: 0x51 };

// Mark width as a fraction of the square. The artwork stacks the "M" above the
// tail, so the mark's bounding box is landscape; 0.88 keeps it as large as
// possible without touching the edges at 16 px.
const MARK_WIDTH_RATIO = 0.88;

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;

/**
 * Flat background colour, or null to keep transparency.
 * White is the default: the artwork ships on white, and a transparent dark mark
 * all but disappears in a dark browser tab strip (verified against #202124).
 */
const BACKGROUND = process.env.BACKGROUND === 'transparent' ? null : { r: 255, g: 255, b: 255 };

/** White background -> alpha, then repaint the ink in the exact brand colour. */
async function extractMark() {
  const { data, info } = await sharp(ART).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Luminance of the pure ink in the source, used as the alpha denominator.
  const inkLuma = 0.299 * INK.r + 0.587 * INK.g + 0.114 * INK.b;
  const span = 255 - inkLuma;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const alpha = Math.max(0, Math.min(255, Math.round(((255 - luma) / span) * 255)));

      data[i] = INK.r;
      data[i + 1] = INK.g;
      data[i + 2] = INK.b;
      data[i + 3] = alpha;

      if (alpha > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const mark = await sharp(data, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer({ resolveWithObject: true });

  return { mark: mark.data, width: mark.info.width, height: mark.info.height, source: info };
}

/** Centre the trimmed mark on a square canvas at a fixed width ratio. */
async function squareCanvas({ mark, width, height }) {
  const side = Math.round(width / MARK_WIDTH_RATIO);
  const background = BACKGROUND
    ? { ...BACKGROUND, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 0 };
  const out = await sharp({ create: { width: side, height: side, channels: 4, background } })
    .composite([{ input: mark, left: Math.round((side - width) / 2), top: Math.round((side - height) / 2) }])
    .png()
    .toBuffer();
  return { square: out, side };
}

/** Minimal ICO writer; modern browsers accept PNG payloads inside the container. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach((entry, i) => {
    const at = i * 16;
    // 0 means 256 in the ICO format.
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at);
    dir.writeUInt8(entry.size >= 256 ? 0 : entry.size, at + 1);
    dir.writeUInt8(0, at + 2); // palette size
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(entry.png.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += entry.png.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

const extracted = await extractMark();
console.log(
  `源标记 ${extracted.source.width}x${extracted.source.height} -> 去白底后 ${extracted.width}x${extracted.height}`,
);

const { square, side } = await squareCanvas(extracted);
console.log(
  `正方形画布 ${side}x${side}，标记占宽 ${(MARK_WIDTH_RATIO * 100).toFixed(0)}%，` +
    `背景=${BACKGROUND ? '不透明白色' : '透明'}`,
);

const render = (size) => sharp(square).resize(size, size).png().toBuffer();

const icoEntries = [];
for (const size of ICO_SIZES) {
  icoEntries.push({ size, png: await render(size) });
}
const icoPath = path.join(PUBLIC, 'favicon.ico');
fs.writeFileSync(icoPath, buildIco(icoEntries));
console.log(`favicon.ico          ${ICO_SIZES.join(' / ')}px  ${fs.statSync(icoPath).size} bytes`);

// apple-touch-icon is always opaque: iOS does not composite transparency well.
const applePath = path.join(PUBLIC, 'apple-touch-icon.png');
fs.writeFileSync(
  applePath,
  await sharp(square)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(APPLE_SIZE, APPLE_SIZE)
    .png()
    .toBuffer(),
);
console.log(`apple-touch-icon.png ${APPLE_SIZE}x${APPLE_SIZE}  ${fs.statSync(applePath).size} bytes`);
