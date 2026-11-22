# Google 免费购物列表（Free Listings）接入指南

面向本仓库的无头店铺：**Vue 前台 + Shopify 只在幕后管交易**。
目标：让商品免费出现在 Google 购物标签页，不依赖 Shopify 的 Google & YouTube 应用。

## 为什么不用官方的 Google & YouTube 渠道

那个渠道生成的 feed，`link` 字段指向 **Shopify 主题页**（`meowerair.com/products/xxx`）。
本店商品只发布在 **Headless 渠道**，Online Store 主题页是 404，所以它的 feed 提交上去
会被判「页面不可用」。它要你把域名指向 Shopify，本质就是要求「用主题当店面」。

我们的做法：**GMC 用 DNS TXT 验证域名所有权（与域名指向谁无关）+ 自建 feed**。
Free Listings 的门槛只有四条：验证过的域名、合格的 feed、清晰公示的退货/配送政策、
可用的结账。这四条现在的站点都满足或即将满足，不需要 Shopify 应用参与。

## 一、生成 feed

```bash
npm run feed:google                     # 默认 US / USD
npm run feed:google -- --country AU --currency AUD
```

脚本：`scripts/make-google-feed.mjs`，输出 `public/feeds/google-<country>.xml`。

**这份 XML 要提交进仓库**（`.gitignore` 里特意没有忽略它）。原因：构建时那一步是
`--optional` 的 —— CI 里如果拿不到 Shopify 变量就会跳过，此时线上用的就是仓库里
这份；不提交就会变成 GMC 抓取 404。

`npm run build` 也会重新生成一次，所以**改了价格、补了库存、上了新品之后**，
要么让构建时的生成生效，要么手动跑一遍再提交：

```bash
npm run feed:google && git add public/feeds && git commit -m "update google feed" && git push
```

生成后的线上地址：

```
https://meowerair.com/feeds/google-us.xml
```

几条刻意的规则（都跟 GMC 校验有关，改脚本前先读文件头的注释）：

1. **每个商品一条 item，用「第一个有货变体」** —— 商品页默认选中的也是它
   （`ProductBuyBar`），所以 feed 价格和 Googlebot 抓到的页面价格一致。
   多规格全覆盖需要商品页支持 `?variant=` 深链，是后续工作。
2. **链接只指向 Vue 商品页** —— 指到 Shopify 主题页会 404。
3. **只收有货商品**，缺货商品跳过并在终端列出。
4. **价格币种必须等于目标国本地币种**。脚本会照实输出真实币种，不匹配时大声警告。

## 二、在 GMC 里操作

### 1. 建号与商家信息

- GMC → 设置 → 商家信息：填法定名称、地址、联系方式
- 完成 **商家身份验证**（跨国卖家常被要求营业执照/地址证明）

### 2. 验证网站所有权

- GMC → 设置 → 商家信息 → 网站 → 添加 `https://meowerair.com`
- 选 **DNS 记录** 方式，把 Google 给的 TXT 加进 Cloudflare DNS
- Cloudflare 里已有一条 `google-site-verification=...` 的 TXT（此前给 Search Console 用的），
  同一 Google 账号通常可以直接认领
- **不需要**把 A 记录指向 Shopify

### 3. 添加商品 feed

- 产品 → 数据源 → 添加数据源 → **定时抓取**（Scheduled fetch）
- URL：`https://meowerair.com/feeds/google-us.xml`
- 目标国家 `美国`，语言 `en`，货币 `USD`
- 抓取频率：每日

> 只有 US 能这样提交：店铺目前是单一 USD。等国别市场配好本地货币后，
> 每国单独生成一份 feed（`--country` / `--currency`），GMC 里按国家建数据源。

### 4. 运费与退货（Free Listings 的硬门槛）

- GMC → 设置 → **配送与退货**：按目标国填运费和时效，必须和站上一致：

  | 目的地 | 时效（自发货起算） |
  |---|---|
  | 美国 United States | 9–16 天 |
  | 欧洲 Europe | 11–20 天 |
  | 加拿大 Canada | 11–20 天 |
  | 亚洲 Asia | 10–15 天 |
  | 新西兰 New Zealand | 11–15 天 |
  | 澳大利亚 Australia | 11–15 天 |

  代码里的唯一来源是 `src/data/siteInfo.js` 的 `deliveryZones`。
- 退货政策 URL：`https://meowerair.com/refunds`
- 配送政策页：`https://meowerair.com/shipping`

### 5. 开启 Free Listings

- GMC → 增长 → **免费购物列表** → 选目标地区 → 开启

## 三、提交后的自查清单

| 检查 | 怎么看 |
|---|---|
| feed 能被抓取 | GMC → 产品 → 数据源，看「上次抓取时间/状态」 |
| 商品被识别 | 产品 → 全部产品，看「已批准 / 需处理」数量 |
| 价格一致 | 抽查一条商品：feed 里的价格、货币 vs 页面显示 |
| 链接可用 | 点 feed 里的 `link`，应为 200 且是 Vue 商品页 |
| 政策可达 | `/refunds`、`/shipping`、`/privacy` 均 200 |
| 结账可用 | 加购 → 跳 `meowerair.myshopify.com/cart/...` 正常 |

常见不通过原因：

- **币种不匹配**：feed 是 USD，但目标国不是美国 → 先配市场货币
- **价格不匹配**：页面默认变体价格与 feed 不同 → 检查商品页默认变体
- **缺少商品标识符**：无 GTIN 时必须有 `brand` + `mpn`（本 feed 已填，并声明 `identifier_exists=false`）
- **图片不合格**：需 ≥ 500×500，脚本会在终端提示宽度不足的图片

## 四、多国扩展（等本地货币配好后）

```bash
npm run feed:google -- --country NZ --currency NZD
npm run feed:google -- --country AU --currency AUD
npm run feed:google -- --country GB --currency GBP
```

前提是 **Shopify → 设置 → 市场** 已经把对应国家的展示货币设成当地币种。
没配之前生成出来的仍是 USD，脚本会警告，不要提交。

另外，多国落地页需要按 URL 区分市场（例如 `/nz/products/mw200`），否则 Googlebot
从美国 IP 抓取时看到的价格与 feed 不符。当前站点在构建时写死
`VITE_SHOPIFY_COUNTRY=NZ`，多市场改造时一并处理。

## 五、站内信任信息（Misrepresentation 申诉的准备工作）

2026-11-23 收到过一次 **Misrepresentation**（误导性陈述）警告，影响范围是
「United States 全部商品下架」。这类判定是机器审核的账户级问题，改 feed 没用 ——
要准备的是**站点上的证据**：让人一眼能看出这是一家可核实、可追责的公司。

所有事实只有一个来源：**`src/data/siteInfo.js`**。改那里，下面五处同时更新：

| 展示位置 | 组件 / 文件 | 内容 |
|---|---|---|
| 页脚（全站每页） | `components/SiteFooter.vue` | 法人名、完整地址、发货地、美国时效、退货窗口、支付方式 |
| Business 页 `#about` | `views/BusinessPage.vue` | 公司介绍 + `CompanyDetails` 完整卡片（含信用代码、邮箱/电话/WhatsApp） |
| Support 页 `#contact` | `views/SupportPage.vue` | 联系方式 + `CompanyDetails` 紧凑版 |
| `/shipping`、`/refunds` | `views/LegalPage.vue` | 顶部「Fulfilment at a glance」卡片 |
| 每个商品页 | `views/ProductDetailPage.vue` | 面包屑下方一行：发货地 · 美国 9–16 天 · 30 天退货 |

2026-11-23 客户确认过的登记信息：

- 法人：Beijing Zhuoyue Youshi Technology Co., Ltd.（北京卓越优识科技有限公司）
- 统一社会信用代码：`91110119MAKB3X4U0M`（`company.registrationNumber`，同时写进 `Organization` 的 `taxID`）
- 注册地址 = 仓库 = 发货地：北京市延庆区中关村延庆园风谷四路8号院3号楼D座1369室
- 电话 `+86 1337 049 7731` 实际可接听（GMC 可能电话核验，别改成虚拟号）
- 支付：**只有 PayPal**，不要挂其它卡组织图标
- 时效：按目的地分档，见第二节那张表（代码里 `deliveryZones`）
- **备货 / 处理时间：所有 C 端产品 1 个工作日**（`fulfilment.dispatchWindow`）

### 与 Shopify 政策的口径对齐（2026-11-23）

原则：**以 Shopify 后台政策为准，站上不写比它更宽的话。** 因此：

| 项目 | 之前站上 | 现在 |
|---|---|---|
| 配送范围 | 「we ship worldwide」 | 不写 worldwide；改成「约 50 个目的地，清单见 Shipping Policy」。Shopify 明确不发日本、韩国、印度、墨西哥、巴西、越南、瑞士、挪威 |
| 区域时效 | Europe / Asia 分区无限制 | 加一句「区域时效仅适用于政策清单内的国家」 |
| 30 天退货 | 对所有目的地 | 加「清单内国家」限定（Shopify 清单外只写 contact us） |
| 追踪 | 「Parcels are tracked」 | 「where the carrier provides one」——对齐 Shopify 的例外措辞 |
| 丢件 / 损坏 | 「我们负责到送达，补发或退款」 | **客户 2026-11-23 决定反过来改 Shopify**，两边统一成更强的版本，见下 |
| 备货时间 | 无 | 站上写明 1 个工作日 |

最后一条需要留意：Shopify 那句是「Except as otherwise stated on our website, orders
will be processed as soon as possible」，等于**允许站上另行声明处理时长**，所以备货
时间写在站上就生效，不需要改后台。

**丢件责任那一句，我们原来的写法（负责到送达、补发或退款）比 Shopify 强，
对 GMC 与消费者都更有利，所以直接改 Shopify，而不是把站上降级。** 统一后的句子：

> If your order is lost, damaged or delayed, contact us. We are responsible for the
> order until it is delivered and will arrange a replacement or refund.

改法（Shopify 后台只有一个地方，政策是店铺级的，不分市场）：

1. 后台左下角 **Settings**（设置）→ **Policies**（政策）
   直达：`https://admin.shopify.com/store/meowerair/settings/legal`
2. 选 **Shipping policy**
3. 找到 **Lost, damaged, or delayed packages** 这一段（倒数第三段）
4. 把原来那句 `If your order is lost, damaged, or delayed, contact us and we will
   help you work with the carrier.` 整段替换成上面两句话 → **Save**
5. 回到本仓库跑 `npm run sync:policies`（会更新 `policies.generated.json`），
   再 `npm run build`。后台改完但没跑同步的话，站上 `/shipping` 正文不会变。

`legalContent.js` 里的兜底文本已经先改成同一句，两边现在就差后台这一步。

Shopify 侧另外**还有一处**建议确认（未改）：

- `Free standard shipping may be available on selected orders` —— 如果结账页
  其实没有免运费，这句属于虚假承诺，应删。

另外 `index.html` 的 `Organization` 结构化数据里也有同一份法人名和地址，
**改 `siteInfo.js` 时别忘了一起改**（Google 会拿它和 GMC 后台比对的）。

需要核对一致的三方：

1. `src/data/siteInfo.js`（站上写的）
2. GMC → 设置 → 商家信息（账户里填的）
3. 营业执照（英文名、注册地址）

三者不一致比「信息缺失」更容易被判 Misrepresentation —— 特别是公司英文名和
注册地址，别为了好看而意译。统一社会信用代码现在是有值的；要改就必须和执照一致。

补充说明：`/shipping` 与 `/refunds` 的正文优先渲染 Shopify 后台政策
（`npm run sync:policies`），后台模板里没有「9–16 天」「发货地」这两项，
所以 `LegalPage.vue` 的卡片是**独立于正文**渲染的 —— 别把它删掉，否则换一次
政策同步，时效信息就又丢了。
