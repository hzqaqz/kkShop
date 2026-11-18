#!/usr/bin/env node
/**
 * 线上结账链自检。
 *
 * 背景：Google Merchant Center 的结账 URL 是一个模板 `https://meowerair.com/cart/{id}:1`，
 * `{id}` 会被替换成 feed 里的 Shopify variant id。这条路径不是静态文件，
 * 靠 public/_redirects 里的 302 转到 Shopify。一旦这条规则丢了、写错了，
 * 或者被别的规则挡住，GMC 不会马上告诉你 —— 它会把商品默默标成
 * 「结账页无法访问」，等你发现时已经丢掉一周的曝光。
 *
 * 所以每次发版跑一次：
 *     npm run check:checkout
 *
 * 检查三件事：
 *   1. /cart 仍然是 200（静态页没被 /cart/* 通配规则吃掉）
 *   2. /cart/{真实 variant id}:1 返回 302，且指向 myshopify 的购物车直链
 *   3. 跟完整条重定向链，落地页是 200 且确实是 Shopify 的结账页
 *
 * 为什么用 curl 而不是 Node 的 fetch：
 * Shopify 的结账页在 Cloudflare 后面，会按 TLS 指纹拦截 undici/fetch
 * （返回 403 Request Forbidden），curl 的指纹能过。验证脚本要复现的正是
 * 「浏览器能不能走到结账页」，所以宁可调 curl。
 *
 * 退出码非 0 表示线上是坏的。
 */

import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BASE = process.env.CHECKOUT_BASE_URL || 'https://meowerair.com';
const FEED = process.env.FEED_PATH || 'dist/feeds/google-us.xml';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const bad = (msg) => console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
const info = (msg) => console.log(`    ${msg}`);

let failures = 0;
const fail = (msg) => {
  failures += 1;
  bad(msg);
};

/** 从 feed 里取第一个 g:id —— 这就是 GMC 会替换进 {id} 的真实值。 */
function readVariantId() {
  if (!existsSync(FEED)) {
    console.error(`找不到 feed：${FEED}（先跑 npm run build 或 npm run feed:google）`);
    process.exit(2);
  }
  const match = readFileSync(FEED, 'utf8').match(/<g:id>\s*([^<\s]+)\s*<\/g:id>/);
  if (!match) {
    console.error(`feed 里没有 <g:id>：${FEED}`);
    process.exit(2);
  }
  return match[1];
}

const tmp = mkdtempSync(join(tmpdir(), 'meower-checkout-'));
const jarFile = join(tmp, 'cookies.txt');
const bodyFile = join(tmp, 'body.html');

/** 跑一次 curl，返回 {status, url, location}。 */
function curl(url, { follow = false, saveBody = false } = {}) {
  const args = [
    '-s',
    '-A',
    UA,
    '-c',
    jarFile,
    '-b',
    jarFile,
    '-w',
    '%{http_code}\t%{redirect_url}\t%{url_effective}',
    '-o',
    saveBody ? bodyFile : '/dev/null',
    url,
  ];
  if (follow) args.unshift('-L', '--max-redirs', '6');
  const out = execFileSync('curl', args, { encoding: 'utf8', timeout: 60000 });
  const [status, redirectUrl, effectiveUrl] = out.split('\t');
  return { status: Number(status), redirectUrl, effectiveUrl };
}

const variantId = readVariantId();
const templatePath = `/cart/${variantId}:1`;

console.log(`\n检查 ${BASE}  （用 feed 里的 variant id ${variantId}）\n`);

try {
  // ① 静态购物车页必须还是 200，不能被 /cart/* 的通配规则一起吃掉。
  try {
    const res = curl(`${BASE}/cart`);
    if (res.status === 200) ok('/cart → 200（静态购物车页正常）');
    else fail(`/cart → ${res.status}，期望 200。看 _redirects 的 /cart/* 规则是否误伤了精确路径`);
  } catch (err) {
    fail(`/cart 请求失败：${err.message}`);
  }

  // ② 带 {id} 的模板路径必须 302 到 Shopify，而不是 404。
  let redirected = false;
  try {
    const res = curl(`${BASE}${templatePath}`);
    if (res.status === 404) {
      fail(
        `${templatePath} → 404。GMC 的 checkout URL 模板就是这条路径，404 会让商品被拒。\n` +
          '      检查 public/_redirects：/cart/* https://<store>.myshopify.com/cart/:splat 302',
      );
    } else if (res.status >= 300 && res.status < 400) {
      ok(`${templatePath} → ${res.status}`);
      info(`Location: ${res.redirectUrl}`);
      if (/myshopify\.com\/cart\//i.test(res.redirectUrl)) {
        ok('重定向目标是 Shopify 购物车直链');
        redirected = true;
      } else {
        fail('重定向目标不是 Shopify 购物车直链，GMC 会判为无效结账页');
      }
    } else {
      fail(`${templatePath} → ${res.status}，期望 302`);
    }
  } catch (err) {
    fail(`${templatePath} 请求失败：${err.message}`);
  }

  // ③ 跟完整条链，落地必须是 Shopify 的结账页。
  if (redirected) {
    try {
      const res = curl(`${BASE}${templatePath}`, { follow: true, saveBody: true });
      const finalUrl = res.effectiveUrl || '';
      if (res.status !== 200) {
        fail(`落地页返回 ${res.status}，期望 200`);
      } else if (!/checkouts\//i.test(finalUrl)) {
        fail(`落地页 200 但没停在结账页，通常是被弹回首页：${finalUrl.split('?')[0]}`);
      } else {
        const title =
          readFileSync(bodyFile, 'utf8').match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || '(无标题)';
        ok(`落地页 200：${title}`);
        info(`最终地址：${finalUrl.split('?')[0]}`);
      }
    } catch (err) {
      fail(`跟随重定向时失败：${err.message}`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures > 0) {
  console.log(`\n\x1b[31m${failures} 项不通过 —— 线上结账链是坏的，先别投广告。\x1b[0m\n`);
  process.exit(1);
}
console.log('\n\x1b[32m全部通过：GMC 的 checkout 模板可以正常走到 Shopify 结账页。\x1b[0m\n');
