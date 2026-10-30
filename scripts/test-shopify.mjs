/**
 * Shopify Storefront 连接自检：验证域名 + token 是否可用，并打印 MW200 的价格/库存。
 *
 * 用法：
 *   node --env-file=.env scripts/test-shopify.mjs
 * 或指定其它商品 handle：
 *   node --env-file=.env scripts/test-shopify.mjs mw200
 * 或直接传环境变量：
 *   VITE_SHOPIFY_STORE_DOMAIN=xxx.myshopify.com \
 *   VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx \
 *   node scripts/test-shopify.mjs
 */

const STORE_DOMAIN = (process.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim();
const TOKEN = (process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();
const HANDLE = process.argv[2] || 'mw200';

if (!STORE_DOMAIN || !TOKEN) {
  console.error(
    '❌ 缺少环境变量。请先 `cp .env.example .env` 并填入 VITE_SHOPIFY_STORE_DOMAIN 与 VITE_SHOPIFY_STOREFRONT_TOKEN，然后用 `node --env-file=.env scripts/test-shopify.mjs` 运行。',
  );
  process.exit(1);
}

const endpoint = `https://${STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/2026-10/graphql.json`;

const query = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
        }
      }
    }
  }
`;

let response;
try {
  response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables: { handle: HANDLE } }),
  });
} catch (err) {
  console.error('❌ 无法连接 Shopify，请检查域名是否正确：', err.message);
  process.exit(1);
}

if (!response.ok) {
  console.error(`❌ HTTP ${response.status} ${response.statusText}`);
  process.exit(1);
}

const json = await response.json();

if (json.errors?.length) {
  console.error('❌ GraphQL 错误：', json.errors.map((e) => e.message).join('; '));
  process.exit(1);
}

const product = json.data?.product;
if (!product) {
  console.error(
    `❌ 找不到 handle 为 "${HANDLE}" 的商品（连接是通的、token 有效）。\n   下面列出商店里当前能读到的商品，方便你核对：`,
  );
  const listQuery = `
    query Products { products(first: 20) { nodes { title handle } } }
  `;
  try {
    const listRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query: listQuery }),
    });
    const listJson = await listRes.json();
    const nodes = listJson.data?.products?.nodes ?? [];
    if (!nodes.length) {
      console.error('   （商店里没有任何可读商品 —— 请先创建 MW200，并发布到 Headless / Online Store 渠道）');
    } else {
      for (const p of nodes) console.error(`   - ${p.title}  →  handle: ${p.handle}`);
    }
  } catch {
    console.error('   （无法列出商品）');
  }
  process.exit(1);
}

console.log('✅ Storefront 连接成功！');
console.log(`   商品：${product.title}  (handle: ${product.handle})`);
for (const variant of product.variants.nodes) {
  const state = variant.availableForSale ? '✅ 有货' : '⛔ 售罄';
  console.log(`   - ${variant.title || 'Default'}: ${variant.price.amount} ${variant.price.currencyCode}  ${state}`);
}
