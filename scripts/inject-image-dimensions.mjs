#!/usr/bin/env node
/**
 * 给静态 <img src="/images/..."> 补上 width / height 属性。
 *
 * 为什么：没有固有尺寸的图片在加载完成前不占位，图片一到就把下面的内容
 * 顶下去 —— 这就是 CLS。Cloudflare 的数据看不出 CLS，但移动端 4G 下
 * 每张图延迟 1-2 秒，累积位移会直接把 Google Ads 的落地页体验分打穿。
 *
 * 只处理「写死路径」的 <img>。用 :src 绑定的图（数据驱动的画廊、
 * 轮播）尺寸来自数据文件，需要按数据补，不在这里硬编码。
 *
 * 依赖 optimize-images.mjs 产出的 .image-manifest.json（内含真实宽高）。
 *     node scripts/optimize-images.mjs   # 先跑这个
 *     node scripts/inject-image-dimensions.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST = '.image-manifest.json';
if (!existsSync(MANIFEST)) {
  console.error(`缺少 ${MANIFEST}：先跑 node scripts/optimize-images.mjs`);
  process.exit(1);
}
const dimensions = JSON.parse(readFileSync(MANIFEST, 'utf8'));

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.vue')) files.push(full);
  }
})('src');

/** 单行写成 <img ... src="..." ... /> 的情况。 */
const INLINE = /<img\b[^>]*?\ssrc="(\/images\/[^"]+)"[^>]*?\/?>/;
/** 多行写法：src="..." 独立成行。 */
const SRC_LINE = /^(\s*)src="(\/images\/[^"]+)"\s*$/;

let touched = 0;
let skippedDynamic = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  const out = [];
  let changed = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // 单行 img
    const inline = line.match(INLINE);
    if (inline && !/\swidth=/.test(line)) {
      const dims = dimensions[inline[1]];
      if (dims) {
        out.push(line.replace(inline[1] + '"', `${inline[1]}" width="${dims.width}" height="${dims.height}"`));
        changed = true;
        touched += 1;
        continue;
      }
    }

    // 多行 img：src 独占一行
    const m = line.match(SRC_LINE);
    if (m) {
      const [, indent, src] = m;
      const dims = dimensions[src];
      // 往后找到标签结束，确认这个标签还没有 width
      let end = i;
      while (end < lines.length && !lines[end].includes('/>') && !lines[end].includes('>')) end += 1;
      const block = lines.slice(i, end + 1).join('\n');
      if (dims && !/\swidth=/.test(block)) {
        out.push(line, `${indent}width="${dims.width}"`, `${indent}height="${dims.height}"`);
        changed = true;
        touched += 1;
        continue;
      }
      if (!dims) skippedDynamic += 1;
    }

    out.push(line);
  }

  if (changed) {
    writeFileSync(file, out.join('\n'));
    console.log('补尺寸：', file);
  }
}

console.log(`\n补齐 ${touched} 个 <img>；${skippedDynamic} 个静态引用没在清单里（跳过）`);
