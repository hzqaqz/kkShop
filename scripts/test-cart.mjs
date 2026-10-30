/**
 * Shopify 购物车全链路自检：取商品 → 创建购物车 → 生成结账链接。
 *
 * 用法：
 *   node --env-file=.env scripts/test-cart.mjs
 * 或指定 handle：
 *   node --env-file=.env scripts/test-cart.mjs mw200
 */
const STORE_DOMAIN = (process.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim();
const TOKEN = (process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();
const HANDLE = process.argv[2] || 'mw200';
const API_VERSION = '2026-10';

if (!STORE_DOMAIN || !TOKEN) {
  console.error('❌ 缺少环境变量。请先配置 .env 后再运行：node --env-file=.env scripts/test-cart.mjs');
  process.exit(1);
}

const endpoint = `https://${STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/${API_VERSION}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

// 1) 取商品与变体
const productData = await gql(
  `query ($handle: String!) {
    product(handle: $handle) {
      title
      variants(first: 1) {
        nodes { id title availableForSale price { amount currencyCode } }
      }
    }
  }`,
  { handle: HANDLE },
);

const product = productData.product;
if (!product) {
  console.error(`❌ 找不到 handle 为 "${HANDLE}" 的商品。`);
  process.exit(1);
}

const variant = product.variants?.nodes?.[0];
if (!variant) {
  console.error('❌ 该商品没有变体。');
  process.exit(1);
}
if (!variant.availableForSale) {
  console.error('❌ 该商品售罄（availableForSale=false），加购会被拦。请先在 Shopify 里把库存调大。');
  process.exit(1);
}

// 2) 创建购物车
const cartData = await gql(
  `mutation ($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost { subtotalAmount { amount currencyCode } }
      }
    }
  }`,
  { lines: [{ merchandiseId: variant.id, quantity: 1 }] },
);

const cart = cartData.cartCreate.cart;

console.log('✅ 加购 + 结账链接 生成成功！');
console.log(`   商品：${product.title}  (${variant.title})`);
console.log(`   单价：${variant.price.amount} ${variant.price.currencyCode}`);
console.log(`   购物车数量：${cart.totalQuantity}`);
console.log(`   小计：${cart.cost.subtotalAmount.amount} ${cart.cost.subtotalAmount.currencyCode}`);
console.log('   结账链接：');
console.log(`   ${cart.checkoutUrl}`);
