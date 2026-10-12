#!/usr/bin/env node
/**
 * Regenerate public/images/og-image.jpg — the 1200x630 link-preview card.
 *
 * This is a MANUAL, one-off tool. Nothing in `npm run build` depends on it, and
 * its dependencies (sharp, fonttools) are intentionally NOT in package.json.
 *
 * Usage:
 *   npm i --no-save sharp
 *   python3 -m pip install --target /tmp/pylibs fonttools
 *   PYTHONPATH=/tmp/pylibs node scripts/make-og-image.mjs
 *
 * The original variable font is no longer in the repo (it was replaced by a
 * 106 KB Latin subset). The script recovers it from git history automatically.
 *
 * Layout knobs are the constants below; keep PANEL wide enough for the longest
 * headline line plus 2x PAD (the script prints measured widths).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolveSourceFont } from './lib/font-source.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(import.meta.dirname, '..');
const IMAGES = path.join(ROOT, 'public/images');
const OUT = path.join(IMAGES, 'og-image.jpg');

const W = 1200;
const H = 630;
const PANEL = 430; // brand panel width; headline must fit PANEL - 2*PAD
const PAD = 60;
const HEAD_SIZE = 38;
const LOGO_TOP = 130;
const LOGO_WIDTH = 250;
const PHOTO_LEFT = 200; // crop window offset; max shows the dog fully
const INK = '#334c51'; // site --ink
const CREAM = '#fef5ed'; // site --cream
const MUTED = '#c8d6d3';

const HEADLINE = ['Pet-Friendly Air', 'Purifiers &', 'Dehumidifiers'];

const sourceFont = resolveSourceFont(ROOT);

const textSpec = [
  ...HEADLINE.map((text, i) => ({
    text, size: HEAD_SIZE, weight: 800, fill: CREAM, x: PAD, baseline: 322 + i * 52,
  })),
  { text: 'Homes · Businesses · OEM/ODM', size: 17, weight: 500, fill: MUTED, x: PAD, baseline: 486 },
];

const { svg, measured } = JSON.parse(
  execFileSync('python3', [path.join(ROOT, 'scripts/glyph-text.py')], {
    input: JSON.stringify(textSpec),
    env: { ...process.env, FONT_TTF: sourceFont },
    maxBuffer: 32 * 1024 * 1024,
  }).toString(),
);

for (const m of measured) {
  console.log(`  ${String(m.size).padStart(2)}px w${m.weight}  ${m.widthPx.toFixed(0).padStart(4)}px  ${m.text}`);
}
if (measured.some((m) => m.widthPx > PANEL - 2 * PAD)) {
  throw new Error(`文字超出面板宽度 ${PANEL - 2 * PAD}px，请调小 HEAD_SIZE 或加宽 PANEL`);
}

// Photo: cover the right side, but with an exact crop window — a centred crop
// slices the schnauzer's rear off, because it sits at the far right of the source.
const scaled = await sharp(path.join(IMAGES, 'carousel/hero-air-purifier-pets.webp'))
  .resize({ height: H })
  .png()
  .toBuffer();
const scaledMeta = await sharp(scaled).metadata();
const maxLeft = scaledMeta.width - (W - PANEL);
const left = Math.max(0, Math.min(maxLeft, Number(process.env.PHOTO_LEFT ?? PHOTO_LEFT)));
const photo = await sharp(scaled)
  .extract({ left, top: 0, width: W - PANEL, height: H })
  .png()
  .toBuffer();

// Logo: keep the alpha, repaint the wordmark cream so it reads on the dark panel.
const logoRaw = await sharp(path.join(IMAGES, 'logo-meower.webp'))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 0; i < logoRaw.data.length; i += 4) {
  logoRaw.data[i] = 254;
  logoRaw.data[i + 1] = 245;
  logoRaw.data[i + 2] = 237;
}
const logo = await sharp(logoRaw.data, {
  raw: { width: logoRaw.info.width, height: logoRaw.info.height, channels: 4 },
})
  .resize({ width: LOGO_WIDTH })
  .png()
  .toBuffer();

const info = await sharp({ create: { width: W, height: H, channels: 4, background: INK } })
  .composite([
    { input: photo, left: PANEL, top: 0 },
    { input: logo, left: PAD, top: LOGO_TOP },
    { input: Buffer.from(svg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT);

console.log(`\n写出 ${path.relative(ROOT, OUT)}  ${info.width}x${info.height}  ` +
  `${(fs.statSync(OUT).size / 1024).toFixed(0)} KB（照片取景窗 left=${left}/${maxLeft}）`);
