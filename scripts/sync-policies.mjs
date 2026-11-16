/**
 * 把 Shopify 后台 Settings → Policies 里的法律条款同步到本仓库。
 *
 * 后台改完政策后运行：
 *   npm run sync:policies
 *
 * 它会通过 Storefront API 读取店铺的四类政策，写入
 * `src/data/policies.generated.json`，构建时由 `LegalPage.vue` 直接渲染。
 * 生成的文件要一起提交；这样 Cloudflare 构建不需要 token，产物也是确定的。
 *
 * 为什么是构建时同步而不是运行时拉取：本站是 SSG，正文必须出现在预渲染的
 * HTML 里（SEO + 首屏不闪），所以只在本地/CI 拉一次，写成静态数据。
 *
 * 注意：这个脚本只覆盖 Storefront API 暴露的四类政策。后台的「Contact
 * information」等其它字段不在适用范围，仍由 `src/data/legalContent.js` 维护。
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const API_VERSION = '2026-10';
const OUTPUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'data',
  'policies.generated.json',
);

/** Shopify `Shop` 字段 → 本站路由 slug。顺序即后台 Policies 页面的顺序。 */
const POLICY_MAP = [
  { field: 'refundPolicy', slug: 'refunds', label: 'Refund policy' },
  { field: 'privacyPolicy', slug: 'privacy', label: 'Privacy policy' },
  { field: 'termsOfService', slug: 'terms', label: 'Terms of service' },
  { field: 'shippingPolicy', slug: 'shipping', label: 'Shipping policy' },
];

const STORE_DOMAIN = (process.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim();
const TOKEN = (process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();

if (!STORE_DOMAIN || !TOKEN) {
  console.error(
    '❌ 缺少环境变量。请确认 .env 里有 VITE_SHOPIFY_STORE_DOMAIN 与 VITE_SHOPIFY_STOREFRONT_TOKEN，然后用 `npm run sync:policies` 运行。',
  );
  process.exit(1);
}

const domain = STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');

const QUERY = `
  query ShopPolicies {
    shop {
      name
      primaryDomain { url }
      refundPolicy { title url body }
      privacyPolicy { title url body }
      termsOfService { title url body }
      shippingPolicy { title url body }
    }
  }
`;

/**
 * Shopify 的正文是后台编辑器里的 HTML，直接进 `v-html`。只做两件事：
 * 去掉可能被粘贴进来的 `script`/`style`，并把正文自己写的
 * “Last updated: …” 抠出来交给页头的 `lastUpdated`，避免同一句话出现两次。
 */
function normalizePolicy(raw) {
  let body = (raw.body || '').trim();

  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const updatedMatch = body.match(/<p[^>]*>\s*Last updated:\s*([^<]+)<\/p>/i);
  let lastUpdated = '';
  if (updatedMatch) {
    lastUpdated = formatDate(updatedMatch[1].trim());
    body = body.replace(updatedMatch[0], '').trim();
  }

  return {
    title: raw.title || '',
    lastUpdated,
    sourceUrl: raw.url || '',
    bodyHtml: body,
  };
}

/** `November 16, 2026` → `16 November 2026`（站点其它地方的写法）。 */
function formatDate(text) {
  const match = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!match) {
    return text;
  }
  const [, month, day, year] = match;
  return `${Number(day)} ${month} ${year}`;
}

const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;

let response;
try {
  response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: QUERY }),
  });
} catch (err) {
  console.error(`❌ 无法连接 ${domain}：${err.message}`);
  process.exit(1);
}

if (!response.ok) {
  console.error(`❌ Storefront API 返回 ${response.status} ${response.statusText}`);
  process.exit(1);
}

const json = await response.json();

if (json.errors?.length) {
  console.error('❌ GraphQL 报错：');
  for (const err of json.errors) {
    console.error(`   ${err.message}`);
  }
  console.error('\n   多半是 token 对应的渠道没有读政策的权限，换 Storefront API 的公共访问令牌再试。');
  process.exit(1);
}

const shop = json.data?.shop;
if (!shop) {
  console.error('❌ 返回里没有 shop 字段，检查 token 与 API 版本。');
  process.exit(1);
}

const policies = {};
const empty = [];

for (const { field, slug, label } of POLICY_MAP) {
  const raw = shop[field];
  if (!raw || !(raw.body || '').trim()) {
    empty.push(label);
    continue;
  }
  policies[slug] = normalizePolicy(raw);
}

const payload = {
  generatedAt: new Date().toISOString(),
  shop: shop.name || '',
  shopDomain: shop.primaryDomain?.url || '',
  policies,
};

await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`✅ 已写入 ${path.relative(process.cwd(), OUTPUT)}`);
console.log(`   店铺：${payload.shop} (${payload.shopDomain || domain})`);
for (const { slug, label } of POLICY_MAP) {
  const policy = policies[slug];
  if (!policy) {
    continue;
  }
  const size = `${policy.bodyHtml.length} 字符`;
  console.log(`   /${slug}  ${label} — ${size}${policy.lastUpdated ? `，更新于 ${policy.lastUpdated}` : ''}`);
}

if (empty.length) {
  console.warn(`\n⚠️  后台还没填：${empty.join('、')}。对应页面会退回 src/data/legalContent.js 的手写版本。`);
}
