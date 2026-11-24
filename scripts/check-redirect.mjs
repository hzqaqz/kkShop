#!/usr/bin/env node
/**
 * 线上跳转自检：Shopify 域名是否还在把「主题页」送回 meowerair.com。
 *
 * 背景：headless 模式下 `meowerair.myshopify.com` 上还留着一套在线商店主题。
 * 付款完成页（`/…/thank_you`）的 Logo、`Continue shopping`、邮件里的店铺链接，
 * 都指向店铺主域名的根路径 —— 只有 Shopify 域名那边有跳转，这些流量才会回到主站。
 * 这套跳转曾经在换/更新主题时被静默覆盖过一次（2026-11-14 配好，2026-11-25 发现没了），
 * 而且没有任何监控会报错，所以每次动主题后跑一次：
 *
 *     npm run check:redirect
 *
 * 检查四件事：
 *   1. 根路径不再 302 到 /password（密码保护必须关，否则跳转代码不执行）
 *   2. 根路径的 HTML 里带着跳转主题，且 storefront_hostname = meowerair.com
 *   3. 每个有 Shopify handle 的商品，handle → 主站 slug 的映射都在（否则跳过去 404），
 *      且主站那个 slug 真的是 200
 *   4. `/checkouts/…` 不受跳转主题影响（结账不能被拦走）
 *
 * 和 check:checkout 一样用 curl 而不是 fetch：Shopify 前台在 Cloudflare 后面，
 * 会按 TLS 指纹拦截 undici/fetch（403 Request Forbidden）。
 *
 * 退出码：0 = 全部通过；1 = 有检查项不通过；2 = 网络不通（不是配置问题）。
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SHOP_HOST = process.env.SHOP_HOST || 'meowerair.myshopify.com';
const SITE = process.env.SITE_URL || 'https://meowerair.com';
const EXPECTED_HOSTNAME = process.env.STOREFRONT_HOSTNAME || 'meowerair.com';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const bad = (msg) => console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
const skip = (msg) => console.log(`  \x1b[33m–\x1b[0m ${msg}`);
const info = (msg) => console.log(`    ${msg}`);

let failures = 0;
const fail = (msg) => {
  failures += 1;
  bad(msg);
};

const MARK = '@@CURL_STATUS@@';

/** GET 一个 URL（不跟随跳转）。失败返回 { error }，不抛异常。 */
function get(url, timeout = 45) {
  let raw;
  try {
    raw = execFileSync(
      'curl',
      [
        '-sS',
        '--compressed',
        '--max-time',
        String(timeout),
        '-A',
        UA,
        // curl 的 %{redirect_url} 要原样交给 curl，不能被模板字符串吃掉。
        '-w',
        '\n' + MARK + '%{http_code} %{redirect_url}',
        url,
      ],
      { encoding: 'utf8', maxBuffer: 30e6, stdio: ['ignore', 'pipe', 'pipe'] },
    );
  } catch (err) {
    return { error: String(err.stderr || err.message).trim().split('\n')[0], url };
  }
  const cut = raw.lastIndexOf(MARK);
  const [status = '', redirect = ''] = raw
    .slice(cut + MARK.length)
    .trim()
    .split(/\s+/, 2);
  return { body: raw.slice(0, Math.max(cut, 0)), status, redirect, url };
}

/** 主站偶尔抖（实测详情页 1s～20s），失败重试一次再判死。 */
function getRetry(url, timeout = 45, attempts = 2) {
  let res;
  for (let i = 0; i < attempts; i += 1) {
    res = get(url, timeout);
    if (!res.error) return res;
  }
  return res;
}

/** 从 products.js 里读出 `{ id, shopifyHandle }`，不用真的 import 那份模块。 */
function readProducts() {
  const src = readFileSync(new URL('../src/data/products.js', import.meta.url), 'utf8');
  const products = [];
  const re = /\{\s*id:\s*'([^']+)'/g;
  let match;
  while ((match = re.exec(src))) {
    const start = match.index;
    // 从「这条 id 值之后」开始找下一个商品，否则会切在它自己的 id 上。
    const next = src.indexOf("id: '", match.index + match[0].length);
    const block = src.slice(start, next === -1 ? src.length : next);
    const handle = block.match(/shopifyHandle:\s*\n?\s*'([^']*)'/);
    products.push({ id: match[1], handle: handle ? handle[1] : null });
  }
  return products;
}

console.log(`\n跳转自检  ${SHOP_HOST} → ${EXPECTED_HOSTNAME}\n`);

// ── 1) 根路径不该被密码保护挡住 ──────────────────────────────
const root = get(`https://${SHOP_HOST}/`);
if (root.error) {
  console.error(`\x1b[31m连不上 ${SHOP_HOST}\x1b[0m：${root.error}`);
  console.error('这是网络问题，不是配置问题；换个网络重跑一次。\n');
  process.exit(2);
}

if (root.status === '302' && root.redirect.includes('/password')) {
  fail(`根路径 302 → ${root.redirect}：密码保护还开着，跳转代码不会执行`);
  info('后台 → 在线商店 → 偏好设置 → 取消「密码保护」');
} else if (root.status !== '200') {
  fail(`根路径返回 ${root.status}（期望 200）`);
} else {
  ok('根路径 200，未被密码保护挡住');
}

// ── 2) 跳转主题在不在、hostname 对不对 ──────────────────────
const hasThemeScript = (root.body || '').includes('storefrontHostname');
const hostnameOk = (root.body || '').includes(`storefrontHostname = "${EXPECTED_HOSTNAME}"`);

if (!hasThemeScript) {
  fail('根路径没有跳转主题的代码 —— 现在渲染的是一套正常商店主题');
  if ((root.body || '').includes('"schema_name":"Dwell"')) {
    info('看到 Dwell 主题。后台 → 在线商店 → 模板 → 上传跳转主题后「发布」');
    info('上传包：parked/shopify-headless-theme-meowerair.zip');
  }
  info('主题没装好之前，「映射」一节无法检查（设置只存在于主题渲染结果里）');
} else if (!hostnameOk) {
  fail(`跳转主题在，但 storefront_hostname 不是 "${EXPECTED_HOSTNAME}"`);
  info('主题编辑器 → 主题设置 → Storefront → Hostname');
} else {
  ok(`跳转主题在线，storefront_hostname = ${EXPECTED_HOSTNAME}`);
}

// ── 3) handle → 主站 slug 的映射 ────────────────────────────
const products = readProducts().filter((p) => p.handle);
const needMapping = products.filter((p) => p.handle !== p.id);

console.log(`\n  商品（${products.length} 个有 Shopify handle，其中 ${needMapping.length} 个 slug 与 handle 不同）`);

if (!hasThemeScript) {
  skip('跳过映射检查（主题未上线）');
} else {
  // 主题渲染时把空格全删了，所以匹配连写形式：/products/<handle>>/products/<slug>
  const rendered = root.body.replace(/\s+/g, '');
  let missing = 0;
  for (const p of needMapping) {
    if (!rendered.includes(`/products/${p.handle}>/products/${p.id}`)) {
      missing += 1;
      fail(`${p.handle} 缺映射 → 跳到主站会 404`);
      info(`custom_redirects 加一行：/products/${p.handle} > /products/${p.id}`);
    }
  }
  if (!missing) ok(`${needMapping.length} 条自定义映射都在`);
}

// ── 4) 主站落地页真的是 200 吗 ─────────────────────────────
let siteBroken = 0;
for (const p of products) {
  const res = getRetry(`${SITE}/products/${p.id}`, 45, 2);
  if (res.error) {
    siteBroken += 1;
    fail(`主站 /products/${p.id} 请求失败：${res.error}`);
  } else if (res.status !== '200') {
    siteBroken += 1;
    fail(`主站 /products/${p.id} 返回 ${res.status}（Shopify handle: ${p.handle}）`);
  }
}
if (!siteBroken) ok(`${products.length} 个商品的主站落地页都是 200`);

// ── 5) 结账路径不能被跳转主题拦走 ───────────────────────────
const probe = get(`https://${SHOP_HOST}/checkouts/cn/00000000000000000000000000000000/thank_you`);
if (probe.error) {
  skip(`结账路径探测失败（${probe.error}），跳过`);
} else if ((probe.body || '').includes('storefrontHostname')) {
  fail('结账/感谢页被注入了跳转主题代码 —— 结账会被拦回主站');
} else {
  ok(`结账路径没被跳转主题接管（探测返回 ${probe.status}，属正常）`);
}

console.log('');
if (failures) {
  console.error(`\x1b[31m${failures} 项不通过\x1b[0m —— 见 docs/shopify-checkout-logo-redirect.md 的「零」节\n`);
  process.exit(1);
}
console.log(`\x1b[32m全部通过\x1b[0m —— 付款完成后页面上的链接会回到 ${EXPECTED_HOSTNAME}\n`);
