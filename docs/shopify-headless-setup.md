# Shopify 无头接入指南（独立站当前台）

本指南说明如何让这个 Vue 3 + Vite SSG 独立站直接接入 Shopify：**前台保持你现在这套设计，
Shopify 只在幕后管交易**（购物车 / 结账 / 订单 / 库存）。不需要使用 Shopify 的主题模板。

## 架构

```
你的 Vue 独立站（前台，设计 / SEO 不变）
        │  浏览器直连，无需后端
        ▼
Shopify Storefront API（GraphQL，公开 token）
        ├── MW200：价格 / 库存（实时）
        ├── 购物车 Cart API
        └── 结账 → Shopify 托管 Checkout（信用卡 / Apple Pay / Shop Pay）
```

## 商品分工

| 商品 | 前端表现 | 说明 |
|---|---|---|
| MW200 | **Add to cart**（走 Shopify 结账） | 唯一可在线下单的商品，`handle = mw200` |
| MD001 / MD002 / 商用 / 吊顶 | **Request a quote**（发邮件询价） | 不建在 Shopify，只展示 + 询价 |
| MW100 | 隐藏 | 代码里 `hidden: true`，数据保留可随时恢复 |

## 一、拿 Storefront access token（公共访问令牌）

1. 在线商店 → **Headless 渠道**（未安装先去 App Store 装）
2. 创建店面 → 进入 **Storefront API** → **凭据**
3. 复制 **公共访问令牌（Public access token）**

> ⚠️ 用**公共**令牌：它是给客户端（浏览器）用的。
> 不要用「私有访问令牌（`shpat_…`）」，那是服务器端专用、切勿放前端。

## 二、建 MW200 商品

1. **Products → Add product**：
   - Title：`MW200 Air Purifier with H13 HEPA`
   - **Handle：`mw200`**（必须精确，前端按它查找）
   - Price 填实际售价；可选 Compare-at price 做促销
   - **Track quantity** 打开并填库存；Weight 填上
   - Status = **Active**，发布到 **Headless 渠道**（这样 Storefront API 才能读到）
2. 上传商品图。

> 只建 MW200 一个商品即可；其余产品不建在 Shopify。

## 三、本地配置

```bash
cp .env.example .env
# 编辑 .env，填入域名和 token
npm run dev
```

`.env`：

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> `VITE_*` 变量在**构建时**写入产物，改完 token 要重新 `npm run build`。`.env` 已加入
> `.gitignore`，不会提交。

配好后先跑一条命令自检连接是否可用：

```bash
node --env-file=.env scripts/test-shopify.mjs
```

看到 `✅ Storefront 连接成功` 并打印出 MW200 的价格即表示已接通。

## 四、部署

在 Cloudflare Pages（或任意静态托管）设置两个构建环境变量：

- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`

构建命令保持 `npm run build`。

## 五、询价邮箱

2B 产品的「Request a quote」按钮是 `mailto:` 链接，邮箱在
地址统一在 `src/data/siteInfo.js` 的 `QUOTE_EMAIL`（目前指向 `info@meowerair.com`，
因为还没有 sales 邮箱）。建好 sales 邮箱后只改这一行即可。

## 代码结构

| 文件 | 作用 |
|---|---|
| `src/composables/useShopify.js` | Storefront GraphQL 客户端 + 商品查询 + Cart 操作 + 货币格式化 |
| `src/composables/useCart.js` | 响应式购物车 + localStorage 持久化 |
| `src/components/CartDrawer.vue` | 购物车抽屉（改数量/删除/小计/结账） |
| `src/components/ProductBuyBar.vue` | 可下单商品的底部加购栏（价格/变体/数量） |
| `src/components/InquiryBar.vue` | 询价商品的底部「Request a quote」栏 |
| `src/views/ProductDetailPage.vue` | 按 `purchasable` 决定显示加购栏还是询价栏 |
| `src/data/products.js` | MW200 标记 `purchasable + shopifyHandle`；MW100 标记 `hidden` |

未配置 `.env` 时，购物相关 UI 自动隐藏，站点表现与纯展示一致。
