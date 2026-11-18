#!/usr/bin/env node
/**
 * 图片压缩：把 public/images 下的位图统一成「宽度 ≤ MAX_WIDTH 的 WebP」。
 *
 * 为什么要有这个脚本：
 * 上线首日 Cloudflare 的数据显示 355 次浏览里 90% 是桌面端，但真实买家
 * （尤其是美国手机用户）会先被首屏图片卡住 —— 站上原先有单张 2 MB 的
 * PNG、以及 1600×1200 的 JPEG 各 400 KB，移动端 4G 下 LCP 必然爆表。
 *
 * 约定（和 make-icons.mjs / make-og-image.mjs 一致）：
 * sharp 只在本地装，不进 package.json，构建流程不会调用这个脚本。
 *     npm i --no-save sharp
 *     node scripts/optimize-images.mjs
 * 输出（.webp）和尺寸清单（.image-manifest.json）都是产物，需要提交。
 *
 * 不处理的文件：
 *   - og-image.jpg / og-card.jpg：社交平台对 WebP 支持不一致，保持 JPEG
 *   - icon-* / apple-touch-* / favicon：站点图标，尺寸由 <link> 决定
 *   - svg：矢量图，本来就不是瓶颈
 */
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = 'public/images';
/** 1600 宽足够覆盖 2× DPR 的 800px 展示区，再宽只是浪费流量。 */
const MAX_WIDTH = 1600;
/** q78 是照片类内容的甜点：再高体积暴涨，再低出现可见色带。 */
const QUALITY = 78;

const RASTER = new Set(['.webp', '.jpg', '.jpeg', '.png']);
const KEEP_RASTER = [/og-image\.jpe?g$/i, /og-card\.jpe?g$/i, /\/icon-\d+\.png$/i, /apple-touch-icon\.png$/i];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (RASTER.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const files = walk(ROOT).filter((file) => !KEEP_RASTER.some((re) => re.test(file)));
const manifest = {};
const report = [];

for (const file of files) {
  const before = statSync(file).size;
  const meta = await sharp(file).metadata();

  // jpg/png 统一转成同名 .webp；已经是 .webp 的原位覆盖（不改变引用路径）。
  const target = file.replace(/\.(jpe?g|png)$/i, '.webp');

  const buf = await sharp(file)
    .rotate() // 尊重 EXIF 方向，否则手机拍的图会歪
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toBuffer({ resolveWithObject: true });

  const after = buf.data.length;
  const gain = before - after;

  // 只有真的变小才覆盖：已经是优化过的 WebP 不要越转越大。
  if (gain > 1024 || target !== file) {
    writeFileSync(target, buf.data);
    report.push({ file: target.replace('public', ''), before, after, w: buf.info.width, h: buf.info.height });
  } else {
    report.push({ file: target.replace('public', ''), before, after: before, w: meta.width, h: meta.height });
  }

  // 清单键用站内绝对路径，供 inject-image-dimensions 精确匹配 <img src>。
  manifest[target.replace(/^public/, '')] = { width: buf.info.width, height: buf.info.height };
}

writeFileSync('.image-manifest.json', JSON.stringify(manifest, null, 2) + '\n');

const sumBefore = report.reduce((a, r) => a + r.before, 0);
const sumAfter = report.reduce((a, r) => a + r.after, 0);
const saved = report.filter((r) => r.before > r.after).sort((a, b) => b.before - b.after);

console.log(`\n处理 ${report.length} 张，${(sumBefore / 1048576).toFixed(1)} MB → ${(sumAfter / 1048576).toFixed(1)} MB\n`);
console.log('节省最多的 12 张：');
for (const r of saved.slice(0, 12)) {
  console.log(`  ${((r.before - r.after) / 1024).toFixed(0).padStart(5)} KB 省  ${String(r.w).padStart(4)}x${String(r.h).padEnd(4)}  ${r.file}`);
}
console.log('\n已写入 .image-manifest.json');
