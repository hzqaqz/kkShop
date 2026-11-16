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

- GMC → 设置 → **配送与退货**：按目标国填运费和时效
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
