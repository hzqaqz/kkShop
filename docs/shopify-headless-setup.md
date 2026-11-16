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

## 六、法律条款（Policies）同步

**Shopify 后台改政策不会自动出现在这个站点上。** 后台的 Policies 只在两个地方生效：
Shopify 托管的结账页（`checkout.shopify.com/<店铺ID>/policies/...`）和后台的
「政策」页面。本站是无头前端，条款必须由自己渲染。

本站的处理方式：**以 Shopify 后台为唯一权威来源，构建前同步一次**。

```bash
# 1) 在 Shopify 后台 Settings → Policies 改好条款
# 2) 拉下来，生成静态数据
npm run sync:policies
# 3) 提交生成的文件并部署
git add src/data/policies.generated.json && git commit -m "sync policies"
```

脚本走 Storefront API 的 `shop { refundPolicy privacyPolicy termsOfService shippingPolicy }`，
把正文 HTML 和「Last updated」写进 `src/data/policies.generated.json`（要提交进仓库，
这样 Cloudflare 构建不需要 token，产物也确定）。`LegalPage.vue` 优先渲染这份正文，
后台某项为空时退回 `src/data/legalContent.js` 的手写版本。

对应的四个页面与路由：

| 后台字段 | 页面 |
|---|---|
| Refund policy | `/refunds` |
| Privacy policy | `/privacy` |
| Terms of service | `/terms` |
| Shipping policy | `/shipping` |

注意事项：

- 结账页页脚链接的是 Shopify 自己那份政策。如果后台和本站显示不同内容，同一个买家
  会在两个页面看到两套条款 —— 所以**别在 `legalContent.js` 里单独改条款正文**，
  改后台再同步。
- 后台模板是通用英语（面向美国市场）。面向 NZ 的政策必须保留 Consumer Guarantees
  Act 1993 下的权利，不能写「no refunds」或把退货窗口写成对法定权利的排除。
  模板正文建议人工过一遍再上线。
- 后台没填的政策不会出现在生成的 JSON 里，页面会用兜底文案；脚本运行时会打印警告。

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
| `scripts/sync-policies.mjs` | 从 Shopify 后台拉四类政策 → `src/data/policies.generated.json` |
| `src/views/LegalPage.vue` | 渲染政策页：优先 Shopify 正文，退回手写摘要 |

未配置 `.env` 时，购物相关 UI 自动隐藏，站点表现与纯展示一致。
