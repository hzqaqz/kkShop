#!/usr/bin/env node
/**
 * Turn a product photo shot on a plain white background into the transparent
 * card cut-out the site uses (`card-cutout.webp`, `navImage`, …).
 *
 * This is a MANUAL, one-off tool. Nothing in `npm run build` depends on it, and
 * its dependency (sharp) is intentionally NOT in package.json:
 *
 *   npm i --no-save sharp
 *   node scripts/make-product-cutout.mjs <input.jpg> <output.webp>
 *
 * How it works — a plain "delete every white pixel" pass would punch holes in
 * a product that has white highlights inside it, so the background is found by
 * flood-filling inwards from the four borders instead. Only white that is
 * connected to the edge of the frame is treated as background. The alpha
 * channel is blurred by ~1px afterwards so the cut edge does not read as a
 * hard jaggies line, and the result is padded (never resampled) onto a square
 * transparent canvas so it sits at the same weight as the other cut-outs.
 *
 * Use a threshold well below 255: JPEG noise around the product edge keeps the
 * corner pixels at exactly 255,255,255 while the last few millimetres of halo
 * land nearer 245–250. The script prints the numbers so the choice can be
 * checked against the actual file.
 */
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const DEFAULTS = {
  threshold: 240, // r,g,b all >= this and edge-connected => background
  size: 900, // square canvas side, in px
  quality: 88, // webp quality
  feather: 1, // px of alpha blur
  defringe: 236, // drop the blended 1px ring at the silhouette; 0 disables
};

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value ?? true;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [input, output] = positional;

if (!input || !output) {
  console.error('Usage: node scripts/make-product-cutout.mjs <input image> <output .webp> [--threshold=240] [--size=900] [--quality=88]');
  process.exit(1);
}

const threshold = Number(flags.threshold ?? DEFAULTS.threshold);
const size = Number(flags.size ?? DEFAULTS.size);
const quality = Number(flags.quality ?? DEFAULTS.quality);
const feather = Number(flags.feather ?? DEFAULTS.feather);

/** Alpha mask: 255 = keep, 0 = background reachable from the frame edge. */
function backgroundMask(data, width, height, channels, limit) {
  const mask = new Uint8Array(width * height).fill(255);
  const isWhite = (x, y) => {
    const i = (y * width + x) * channels;
    return data[i] >= limit && data[i + 1] >= limit && data[i + 2] >= limit;
  };

  const queue = [];
  const visit = (x, y) => {
    const key = y * width + x;
    if (mask[key] === 255 && isWhite(x, y)) {
      mask[key] = 0;
      queue.push(key);
    }
  };

  for (let x = 0; x < width; x += 1) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (queue.length) {
    const key = queue.pop();
    const x = key % width;
    const y = (key - x) / width;
    if (x > 0) visit(x - 1, y);
    if (x < width - 1) visit(x + 1, y);
    if (y > 0) visit(x, y - 1);
    if (y < height - 1) visit(x, y + 1);
  }

  return mask;
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const mask = backgroundMask(data, width, height, channels, threshold);

// The pixels right at the silhouette are a blend of product and white backdrop,
// so they land just under the threshold and survive as a light 1px fringe. Drop
// that ring before feathering: only pixels that are still very light AND touch
// the background are removed, which cannot reach a white detail inside the
// product.
const defringe = Number(flags.defringe ?? DEFAULTS.defringe);
if (defringe > 0) {
  const before = Uint8Array.from(mask);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = y * width + x;
      if (before[key] === 0) {
        continue;
      }
      const i = key * channels;
      if (data[i] < defringe || data[i + 1] < defringe || data[i + 2] < defringe) {
        continue;
      }
      const neighbours = [
        x > 0 ? before[key - 1] : 0,
        x < width - 1 ? before[key + 1] : 0,
        y > 0 ? before[key - width] : 0,
        y < height - 1 ? before[key + width] : 0,
      ];
      if (neighbours.includes(0)) {
        mask[key] = 0;
      }
    }
  }
}

let transparent = 0;
let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const key = y * width + x;
    if (mask[key] === 0) {
      transparent += 1;
      continue;
    }
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

if (maxX < 0) {
  console.error('Every pixel was treated as background — lower --threshold.');
  process.exit(1);
}

const contentWidth = maxX - minX + 1;
const contentHeight = maxY - minY + 1;

// Feather the mask before it becomes alpha, so the cut edge is not a hard line.
// `toColourspace('b-w')` matters: a 1-channel raw input is otherwise expanded
// to 3 channels on the way out, which silently shifts every alpha value.
const { data: feathered } = await sharp(Buffer.from(mask), {
  raw: { width, height, channels: 1 },
})
  .blur(feather)
  .toColourspace('b-w')
  .raw()
  .toBuffer({ resolveWithObject: true });

const rgba = Buffer.alloc(contentWidth * contentHeight * 4);
for (let y = 0; y < contentHeight; y += 1) {
  for (let x = 0; x < contentWidth; x += 1) {
    const src = ((y + minY) * width + (x + minX)) * channels;
    const dst = (y * contentWidth + x) * 4;
    rgba[dst] = data[src];
    rgba[dst + 1] = data[src + 1];
    rgba[dst + 2] = data[src + 2];
    rgba[dst + 3] = feathered[(y + minY) * width + (x + minX)];
  }
}

// Pad onto a square transparent canvas. Purely additive: if the content is
// already wider than `size`, the canvas grows instead of downscaling the photo.
const canvas = Math.max(size, contentWidth, contentHeight);
const padX = Math.round((canvas - contentWidth) / 2);
const padY = Math.round((canvas - contentHeight) / 2);

await sharp(rgba, { raw: { width: contentWidth, height: contentHeight, channels: 4 } })
  .extend({
    top: padY,
    bottom: canvas - contentHeight - padY,
    left: padX,
    right: canvas - contentWidth - padX,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ quality, effort: 4 })
  .toFile(output);

const saved = await sharp(output).metadata();
console.log(
  [
    `${path.basename(input)} → ${output}`,
    `  source ${width}x${height} · threshold ${threshold}`,
    `  content ${contentWidth}x${contentHeight} at (${minX},${minY})`,
    `  background ${((transparent / (width * height)) * 100).toFixed(1)}%`,
    `  output ${saved.width}x${saved.height} alpha=${Boolean(saved.hasAlpha)}`,
  ].join('\n'),
);
