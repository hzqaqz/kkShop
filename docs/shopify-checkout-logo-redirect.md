# 结账页点 Logo 返回 meowerair.com（而不是 Shopify 页面）

## 一、为什么现在会跳去 Shopify

Shopify 结账页（`meowerair.myshopify.com/checkouts/...`）顶部的 Logo 是一个**写死的链接**，
指向 **`shop.url` = 店铺主域名的根路径 `/`**。后台没有任何开关可以改这个地址：

- `在线商店 → 偏好设置` 里只有 Logo 图片、没有链接；
- `设置 → 结账 → 自定义 → 品牌` 只能换 Logo 图 / 字号 / 对齐；
- Checkout Branding 的 API（`CheckoutBrandingHeader`）字段只有
  `alignment / banner / cartLink / colorScheme / divided / logo / padding / position`
  ——**没有 URL 字段**（而且品牌 API 本身就要 Plus / 开发店）；
- 老的自定义入口 `checkout.liquid` 已于 2025 年 8 月彻底停用。

所以"改 Logo 链接"这条路不存在，**正确做法是让 Shopify 的根路径自己跳回 meowerair.com**。

当前实测（2026-11-06）：

| 请求 | 结果 |
|---|---|
| Storefront API 建购物车 → `checkoutUrl` | `https://meowerair.myshopify.com/cart/c/...` |
| `https://meowerair.myshopify.com/` | `302 → /password`（在线商店还开着密码保护） |

也就是说：客户在结账页点左上角 Meower，会落到 Shopify 的密码页 / 主题首页，
而不是 meowerair.com。

## 二、方案 A：主题首页跳转（推荐，10 分钟，不需要 Plus）

### 1. 关掉在线商店的密码保护

`Shopify 后台 → 在线商店 → 偏好设置 → 密码保护` 取消勾选、保存。

> 开着密码保护时，根路径根本不渲染主题，只会显示 password 页，跳转代码不会执行。
> 如果一定要保留密码保护，就改走第 4 步的备选。

### 2. 在主题里加跳转

`在线商店 → 模板 → 当前模板 → ⋯ → 编辑代码 → layout/theme.liquid`，
把下面这段放进 `<head>` 里的最前面（`{{ content_for_header }}` 之前）：

```liquid
{%- if template.name == 'index' -%}
  {%- comment -%}
    结账页顶部 Logo、结账完成后的 “Continue shopping”、邮件里的店铺链接，
    都会落到 Shopify 店铺根路径。这里把首页送回 Meower 主站。
    只拦首页模板，/checkouts、/orders、/account 保持正常。
  {%- endcomment -%}
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=https://meowerair.com/">
  <script>location.replace('https://meowerair.com/');</script>
{%- endif -%}
```

- 想落到别的页面（比如 `/products`），把两处 `https://meowerair.com/` 换掉即可。
- `template.name == 'index'` 比 `request.path == '/'` 稳：以后加多语言（`/en-nz`）也不会漏。
- `noindex` 是为了避免 `meowerair.myshopify.com` 被抓进搜索结果、和主站重复内容。

#### 界面里到底在哪点（含英文后台对照）

1. 用**电脑浏览器**打开后台：<https://admin.shopify.com/store/meowerair>
   （手机 App 里没有代码编辑器。）
2. 左侧边栏「**在线商店** / Online Store」→ 顶部标签「**模板** / Themes」。
   找不到就在地址栏直接开：<https://admin.shopify.com/store/meowerair/themes>
3. 「**当前模板 / Current theme**」那张卡片，右上角有「**⋯**」→ 菜单里选「**编辑代码 / Edit code**」。
4. 代码编辑器左边是文件树：展开「**Layout**」文件夹 → 点 **`theme.liquid`**。
5. 右边代码区最上面长这样，光标放到 `<head>` 的**下一行**：

   ```liquid
   <!doctype html>
   <html class="no-js" lang="{{ request.locale.iso_code }}">
     <head>
       <meta charset="utf-8">      ← 光标放这行的上面（即 <head> 后新起一行）
   ```

   粘贴上面那段 `{%- if template.name == 'index' -%}` 代码，结果应类似：

   ```liquid
     <head>
       {%- if template.name == 'index' -%}
         <meta name="robots" content="noindex">
         <meta http-equiv="refresh" content="0; url=https://meowerair.com/">
         <script>location.replace('https://meowerair.com/');</script>
       {%- endif -%}
       <meta charset="utf-8">
   ```

   ⚠️ 别粘到 `{% style %}`、`{% schema %}` 里，也别覆盖原来的 `<meta charset>` 等标签。
6. 右上角「**保存 / Save**」（显示 Saved 即生效，线上主题即时生效）。
7. 开**无痕窗口**验证（普通窗口有缓存，容易误判）。

### 3. 验证

1. 无痕窗口打开 `https://meowerair.myshopify.com/` → 应立刻跳到 `https://meowerair.com/`；
2. 主站加购 → 结账 → 点左上角 Logo → 应回到 `meowerair.com`；
3. 下单走完整流程，确认 thank-you 页的「Continue shopping」也回到主站；
4. `https://meowerair.myshopify.com/orders/<token>` 这类订单状态页**不受影响**（没被拦）。

### 4. 备选：必须保留密码保护

把同一段（去掉 `template.name` 判断）加到 `layout/password.liquid` 的 `<head>` 里：

```liquid
<script>location.replace('https://meowerair.com/');</script>
```

这样即使客户先被 302 到 `/password`，也会立刻被送回主站。

## 三、方案 B：直接用现成的 headless 跳转主题（更彻底，完全不用写代码）

如果希望**所有**主题页面（首页、商品页、集合页、`/account`）都回主站，只留
`/checkouts`、`/orders` 在 Shopify 上：

1. 拿到主题 zip：已经下载好放在仓库里 —— `parked/shopify-headless-theme.zip`
   （来源 <https://github.com/instantcommerce/shopify-headless-theme>，`master` 分支）；
2. `在线商店 → 模板` → 页面右上「**添加模板 / Add theme**」→「**上传 zip 文件 / Upload zip file**」→ 选这个 zip；
3. 上传完成后，在新主题卡片上点「**自定义 / Customize**」→ 左侧「**主题设置 / Theme settings**」→
   「**Storefront**」→ `storefront_hostname` 填 `meowerair.com` → 保存；
4. 回到模板页，这张卡片「**⋯**」→「**发布 / Publish**」。

它做的正是：把 `meowerair.myshopify.com/<路径>` 换成 `meowerair.com/<路径>`，
`/checkouts`、`/orders`、`/account/login` 保持不跳（登录页会变成一个"回主站"的提示页）。

代价：默认主题被这个"只负责跳转"的主题替换掉（原主题还在库里，随时能换回）；
同样需要先关掉密码保护，否则根路径只会显示 password 页。

## 四、不要走的弯路

| 想法 | 为什么不行 |
|---|---|
| 把 `meowerair.com` 设成 Shopify 主域名 | 不行，`meowerair.com` 的 DNS 在 Cloudflare Pages（主站），Shopify 要求域名解析到 Shopify |
| 装个 App 改结账页 Logo 链接 | 不行，结账页是沙盒，非 Plus 不能注入脚本；Plus 也没有"改 Logo 链接"的扩展点 |
| 在品牌设置里把 Logo 去掉 | 只能换图/调大小，去不掉链接；客户仍会点走 |
| 用 `URL Redirects` 重定向 `/` | Shopify 的 URL 重定向不允许重定向根路径 `/` |

## 五、以后可选的进阶（让 checkout 也挂在自己的域名上）

现在结账跑在 `meowerair.myshopify.com`，信任感和品牌都一般。可以：

1. `设置 → 域名` 添加 `shop.meowerair.com`（CNAME → `shops.myshopify.com`），设为 Shopify 店铺主域名；
2. 结账就变成 `shop.meowerair.com/checkouts/...`；
3. Logo 仍会跳到 `shop.meowerair.com/`，用方案 A 同样能跳回主站
   （或在 Cloudflare 加一条 Redirect Rule：`host = shop.meowerair.com` 且 `path = /` → 302 到 `https://meowerair.com/`）。

> 注意：把 Shopify 域名挂到 Cloudflare 代理（橙色云）可能影响结账与 A/B 测试，
> 开代理前先测一遍完整下单流程。

## 六、常见卡点（编辑代码这一步）

| 现象 | 原因 / 解法 |
|---|---|
| 卡片上没有「⋯」或「编辑代码」是灰的 | 需要**店主**账号；员工账号要在 `设置 → 用户和权限 → 该员工 → 在线商店/主题` 勾上权限 |
| 点了「编辑代码」白屏 / 一直转圈 | 换 Chrome、关广告拦截插件、换个网络；或先把模板「复制」一份再试 |
| 左侧文件树里找不到 `layout` | 主题太精简；直接看有没有 `layout/theme.liquid`，没有就用方案 B 上传整包主题 |
| 保存了但点 Logo 还是回 Shopify | ① **密码保护还开着**（最常见，根路径只渲染 password 页）② 访问的是 `/password` 而不是 `/` ③ 普通窗口有缓存，用无痕 ④ 改的是草稿主题，没改已发布那套 |
| 怕改坏 | 先在模板卡片上「⋯ → 复制 / Duplicate」备份一份，原主题留在库里随时能换回 |
| 想撤销 | 编辑器里 `Ctrl/Cmd + Z` 后保存，或把粘贴的那几行删掉保存即可 |

## 七、验收清单

- [ ] `https://meowerair.myshopify.com/` 秒跳 `https://meowerair.com/`
- [ ] 结账页点 Logo → 回主站
- [ ] 下单完成页「Continue shopping」→ 回主站
- [ ] 订单状态页 `/orders/...` 仍可正常打开
- [ ] `curl -sI https://meowerair.myshopify.com/` 不再 302 到 `/password`
