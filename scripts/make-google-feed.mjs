/**
 * 生成 Google Merchant Center 的商品 feed（RSS 2.0 + g: 命名空间）。
 *
 *   npm run feed:google                       # 默认 US / USD
 *   npm run feed:google -- --country AU --currency AUD
 *
 * 输出到 `public/feeds/google-<country>.xml`，构建时被 copydist 到
 * `https://meowerair.com/feeds/google-<country>.xml`，GMC 按这个 URL 定时抓取。
 *
 * 几条刻意的规则（都和 GMC 的校验有关，改动前先读）：
 *
 * 1. **每个商品只出一条 item，用「第一个有货变体」**。站点商品页默认选中的
 *    就是第一个有货变体（ProductBuyBar），所以 feed 里的价格和 Googlebot 抓
 *    到的页面价格天然一致。代价是多规格只覆盖了一个规格；要全覆盖得先让
 *    商品页支持 `?variant=` 深链，那是下一步的事。
 * 2. **链接只指向 Vue 站的商品页**（`/products/<id>`）。Shopify 不在线商店
 *    渠道没有这些商品，指过去就是 404，GMC 会判「页面不可用」。
 * 3. **只收有货商品**。缺货商品在 Free Listings 里没有价值，还会拉低账户质量。
 * 4. **价格币种必须等于目标国本地币种**（GMC 硬校验）。如果店铺市场还没配
 *    本地货币，脚本会照实输出真实币种并大声警告 —— 这时候别拿去提交，
 *    先去 Shopify Markets 把该市场货币配好。
 * 5. 没有 GTIN，所以 `identifier_exists=false`，靠 brand + mpn 识别。
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_VERSION = '2026-10';

// --- 参数 -------------------------------------------------------------------

function parseArgs(argv) {
  const args = { optional: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--optional') {
      args.optional = true;
    } else if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${token} 需要一个值`);
      }
      args[key] = value;
      i += 1;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const COUNTRY = (args.country || 'US').toUpperCase();
const CURRENCY = (args.currency || 'USD').toUpperCase();
const SITE = (args.site || 'https://meowerair.com').replace(/\/$/, '');
const OUT = path.resolve(ROOT, args.out || `public/feeds/google-${COUNTRY.toLowerCase()}.xml`);

/**
 * 构建时（Cloudflare）环境变量由平台注入；本地 `npm run build` 没有
 * `--env-file`，所以这里补一次 `.env` 读取。已有的环境变量优先。
 */
async function loadDotEnv() {
  if (process.env.VITE_SHOPIFY_STORE_DOMAIN && process.env.VITE_SHOPIFY_STOREFRONT_TOKEN) {
    return;
  }
  try {
    const text = await readFile(path.join(ROOT, '.env'), 'utf8');
    for (const line of text.split('\n')) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
      if (!match) {
        continue;
      }
      const [, key, raw] = match;
      if (!process.env[key]) {
        process.env[key] = raw.trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch {
    // 没有 .env 就走下面的缺变量报错路径。
  }
}

await loadDotEnv();

const STORE_DOMAIN = (process.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
const TOKEN = (process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();

// --- GMC 分类映射 -----------------------------------------------------------

/** Vue 站商品分类 → Google product taxonomy（猜得太细反而容易被判分类错误）。 */
const CATEGORY_MAP = {
  'Air Purifier': 'Home & Garden > Household Appliances > Climate Control Appliances > Air Purifiers',
  Dehumidifier: 'Home & Garden > Household Appliances > Climate Control Appliances > Dehumidifiers',
};

const PET_CATEGORY = 'Animals & Pet Supplies > Pet Supplies';

function googleCategory(vueProduct) {
  return CATEGORY_MAP[vueProduct.category] || PET_CATEGORY;
}

// --- 标题改写 ---------------------------------------------------------------

/**
 * Shopping 广告没有关键词出价，能不能被搜到几乎全靠 title 的前 3-5 个词。
 * Shopify 里的标题以品牌开头（「Meower Christmas Plaid …」），前两个词就把
 * 位置浪费在没人搜的品牌名上 —— 新店尤其吃亏，因为还没人搜 Meower。
 *
 * 通用规则：去掉开头的品牌名（品牌已在 g:brand 里给了，GMC 不缺这个信息）。
 * 个别商品再按真实搜索词重写，把品类词顶到最前面。
 *
 * 约束：GMC 限 150 字符；不要写促销语（「Sale」「Free shipping」会被拒）；
 * 变体后缀（尺寸/颜色）由 translateVariant 追加，这里只写公共部分。
 */
const TITLE_LEAD = {
  'christmas-pet-bed': 'Christmas Plaid Cat Bed & Dog Bed, Bolster Cushion, Washable',
  'pom-pom-cat-toy': 'Interactive Cat Toy with Bell, Retractable Pom-Pom Wand, Cat Teaser',
  'car-pet-seat': 'Dog Car Seat & Pet Booster Carrier, Waterproof 2-in-1, Travel',
  'woven-sisal-cat-scratcher':
    'Wall Mounted Cat Scratcher, Sisal Scratching Board, Furniture Protector',
  'triangle-cat-bed': 'Cat Cave Bed, 3-in-1 Triangle Cat Bed & Foldable Indoor Cat Tent',
};

const GMC_TITLE_MAX = 150;

function feedTitle(shopifyTitle, siteProductId, suffix) {
  const lead = TITLE_LEAD[siteProductId];
  const base = lead || String(shopifyTitle).replace(/^meower\s+/i, '');
  const full = suffix ? `${base} — ${suffix}` : base;
  return full.length > GMC_TITLE_MAX ? `${full.slice(0, GMC_TITLE_MAX - 1).trimEnd()}…` : full;
}

// --- GraphQL ----------------------------------------------------------------

const QUERY = `
  query Feed($cursor: String, $country: CountryCode!) @inContext(country: $country) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        title
        handle
        description
        vendor
        productType
        featuredImage { url width height }
        images(first: 5) { nodes { url width height } }
        variants(first: 100) {
          nodes {
            id
            title
            sku
            availableForSale
            price { amount currencyCode }
            image { url width height }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

async function fetchPage(cursor) {
  const response = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: QUERY, variables: { cursor, country: COUNTRY } }),
  });

  if (!response.ok) {
    throw new Error(`Storefront API 返回 ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((err) => err.message).join('; '));
  }
  return json.data.products;
}

// --- 工具 -------------------------------------------------------------------

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** GMC 对 description 的上限是 5000 字符，留 100 字符余量给截断后的省略。 */
function tidyDescription(text) {
  const plain = String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 4900 ? `${plain.slice(0, 4890).trimEnd()}…` : plain;
}

function money(amount) {
  return Number(amount).toFixed(2);
}

function variantLabel(variant) {
  return variant.title && variant.title !== 'Default Title' ? variant.title : '';
}

/**
 * Shopify 后台不少变体值是中文（「卡其色」「森林」），前台靠 products.js 的
 * `variantLabels` 映射成英文。feed 面向英文市场，必须走同一套映射，否则
 * 商品标题里会混进中文，和落地页也对不上。
 */
function translateVariant(siteProduct, value) {
  if (!value) {
    return '';
  }
  return siteProduct.variantLabels?.[value] || value;
}

function optionValue(variant, pattern, siteProduct) {
  const option = variant.selectedOptions?.find((entry) => pattern.test(entry.name));
  return translateVariant(siteProduct, option?.value || '');
}// --- 主流程 -----------------------------------------------------------------

async function buildFeed() {
  if (!STORE_DOMAIN || !TOKEN) {
    throw new Error(
      '缺少 VITE_SHOPIFY_STORE_DOMAIN / VITE_SHOPIFY_STOREFRONT_TOKEN。本地用 `npm run feed:google`（会读 .env），CI 里检查环境变量。',
    );
  }

  // 只有「Vue 站可下单」的商品才进 feed：其余商品在站上没有可购买的落地页。
  const siteByHandle = new Map();
  for (const product of Object.values(products)) {
    if (product.purchasable && product.shopifyHandle) {
      siteByHandle.set(product.shopifyHandle, product);
    }
  }

  const items = [];
  const skipped = { outOfStock: [], notOnSite: [], badImage: [] };
  const currencies = new Set();

  let cursor = null;
  let hasNext = true;
  while (hasNext) {
    const page = await fetchPage(cursor);
    for (const product of page.nodes) {
      const siteProduct = siteByHandle.get(product.handle);
      if (!siteProduct) {
        skipped.notOnSite.push(product.handle);
        continue;
      }

      // 与商品页保持一致：用第一个有货变体。
      const variant = product.variants.nodes.find((entry) => entry.availableForSale);
      if (!variant) {
        skipped.outOfStock.push(`${product.handle}(${siteProduct.label})`);
        continue;
      }

      currencies.add(variant.price.currencyCode);

      const image = variant.image?.url ? variant.image : product.featuredImage || product.images.nodes[0];
      if (!image?.url) {
        skipped.badImage.push(product.handle);
        continue;
      }
      if (image.width && image.width < 500) {
        skipped.badImage.push(`${product.handle}(图片宽 ${image.width}px)`);
      }

      const suffix = translateVariant(siteProduct, variantLabel(variant));
      // 标题决定 Shopping 的曝光，见文件上方 TITLE_LEAD 的说明。
      const title = feedTitle(product.title, siteProduct.id, suffix);
      const link = `${SITE}/products/${siteProduct.id}`;

      items.push({
        id: variant.id.split('/').pop(),
        title,
        description: tidyDescription(product.description),
        link,
        imageLink: image.url,
        price: `${money(variant.price.amount)} ${variant.price.currencyCode}`,
        availability: 'in stock',
        brand: product.vendor || 'Meower',
        mpn: variant.sku || product.handle,
        condition: 'new',
        googleCategory: googleCategory(siteProduct),
        productType: siteProduct.category || product.productType || '',
        size: optionValue(variant, /size|尺寸|大小/i, siteProduct),
        color: optionValue(variant, /colou?r|颜色|色彩/i, siteProduct),
      });
    }

    hasNext = page.pageInfo.hasNextPage;
    cursor = page.pageInfo.endCursor;
  }

  if (!items.length) {
    throw new Error('没有任何可提交的商品：检查商品是否发布到 Headless 渠道、是否有库存。');
  }

  const itemXml = items
    .map(
      (item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:price>${escapeXml(item.price)}</g:price>
      <g:availability>${item.availability}</g:availability>
      <g:condition>${item.condition}</g:condition>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>${
        item.googleCategory ? `\n      <g:google_product_category>${escapeXml(item.googleCategory)}</g:google_product_category>` : ''
      }${item.productType ? `\n      <g:product_type>${escapeXml(item.productType)}</g:product_type>` : ''}${
        item.size ? `\n      <g:size>${escapeXml(item.size)}</g:size>` : ''
      }${item.color ? `\n      <g:color>${escapeXml(item.color)}</g:color>` : ''}
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Meower — Google Merchant feed (${COUNTRY})</title>
    <link>${escapeXml(SITE)}</link>
    <description>Generated by scripts/make-google-feed.mjs — do not edit by hand.</description>
${itemXml}
  </channel>
</rss>
`;

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, xml, 'utf8');

  const actualCurrency = [...currencies].join('/');
  console.log(`✅ 已写入 ${path.relative(ROOT, OUT)}`);
  console.log(`   目标国 ${COUNTRY} · 币种 ${actualCurrency} · ${items.length} 个商品`);
  for (const item of items) {
    console.log(`   ${item.mpn.padEnd(28)} ${item.price.padStart(12)}  ${item.link.replace(SITE, '')}`);
  }
  if (skipped.outOfStock.length) {
    console.warn(`\n   缺货跳过：${skipped.outOfStock.join('、')}`);
  }
  if (skipped.notOnSite.length) {
    console.warn(`   未在 Vue 站上架跳过：${skipped.notOnSite.join('、')}`);
  }
  if (skipped.badImage.length) {
    console.warn(`   图片不合格：${skipped.badImage.join('、')}`);
  }

  if (actualCurrency !== CURRENCY) {
    console.warn(
      `\n⚠️  feed 里是 ${actualCurrency}，但你要求 ${CURRENCY}（目标国 ${COUNTRY} 的本地币种）。\n` +
        '    GMC 会按本地币种校验价格，直接提交会被判币种不匹配。\n' +
        `    先去 Shopify → 设置 → 市场，把 ${COUNTRY} 的展示货币设为 ${CURRENCY}，再重新生成本文件。`,
    );
  }
}

try {
  await buildFeed();
} catch (error) {
  if (args.optional) {
    console.warn(`[feed] ⚠️  跳过 Google feed 生成：${error.message}`);
    console.warn('[feed]    站点构建继续，但本次产物里不会更新 feeds/google-*.xml。');
    process.exit(0);
  }
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
