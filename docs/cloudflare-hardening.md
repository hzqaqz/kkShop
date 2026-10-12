# 网站安全加固待办清单

> **写给不熟悉网站后台的人。** 每一步都写了「怎么做」和「做完什么样算对」。
> 预计总耗时 **30–40 分钟**，其中大部分是等待。
> 完成后，你的网站数据会第一次变得可读——**页面浏览量会下降，这是好事，不是坏事**。

---

## 〇、先花 2 分钟搞清楚：你的网站是怎么上线的？

这一步决定第 1 步怎么做，**必须先确认**。

1. 打开 Cloudflare 后台 → 左侧菜单找到「**Workers 和 Pages**」（英文：Workers & Pages）
2. 点进你的项目（名字里应该有 meower 或 kkShop 之类）
3. 点上方「**部署**」（Deployments）标签页，看每次部署的来源

| 你看到什么 | 说明 | 用哪个方式 |
|---|---|---|
| 每次部署旁边显示 **GitHub 的提交信息**（比如「新增博客：xxx」）或写着 `main` 分支 | 网站是**自动**从 GitHub 构建的 | → **方式 A** |
| 写着 **Direct Upload** / **直接上传** / 只有时间没有提交信息 | 网站是**手动上传**的 | → **方式 B** |

把结果记下来，然后跳到第 1 步。

> 💡 **如果你在 Cloudflare 里看到不止一个项目**：这个仓库历史上还连接过一个 Workers 项目（代码仓库里至今留着 `cloudflare/workers-autoconfig` 分支的痕迹），可能是个早期的试验。
> **请以真正在服务 meowerair.com 的那个项目为准**——判断方法：点进项目，看「自定义域」（Custom domains）里哪一个写着 `meowerair.com`，就是它。

---

## 第 1 步：把修好的文件发布上线 ⬜

> **为什么做这一步**：我已经在你电脑上的项目文件夹里改好了代码，但这些改动**还没发布到网上**。
> 现在线上还暴露着一个内部文件（`/.vite/ssr-manifest.json`），所以这步有紧迫性。

### 方式 A：用 GitHub 自动部署

在项目文件夹里执行下面两条命令（把改动提交并推送）：

```bash
cd /Users/zhouyidi/Documents/Codex/2026-08-25/wo-x/kkShop
git add -A
git commit -m "安全与性能加固：404页、WAF配套、WebP图片、字体子集化、图标、OG卡片"
git push
```

推送成功后，Cloudflare 会**自动**开始构建，大约 **2–5 分钟**。

**✅ 做完的标志**：Cloudflare 项目页面的「部署」列表里，出现一条**新的**部署记录，状态从「构建中」变成「成功」。

### 方式 B：本地构建后手动上传

在项目文件夹里执行：

```bash
cd /Users/zhouyidi/Documents/Codex/2026-08-25/wo-x/kkShop
npm run build
```

构建完成后，`dist` 文件夹里就是最终文件。然后：

1. 回到 Cloudflare → Workers 和 Pages → 你的项目 → 「**创建部署**」（Create deployment）
2. 把 **`dist` 这个文件夹整个拖进去**（官方说明是「拖入构建输出目录」，也就是拖 `dist` 文件夹本身）
3. 点「保存并部署」（Save and Deploy）

**✅ 做完的标志**：部署列表出现新记录，状态「成功」。

> 💡 **小提示**：如果你是 Git 集成模式，Cloudflare 的项目页面里**不会**提供拖拽上传的入口——所以「有没有这个入口」本身就能帮你判断自己属于哪种模式。
>
> 💡 **不用担心上传限制**：我核对过，`dist` 一共只有 99 个文件、最大的单个文件 0.36 MB，远低于官方限制（1000 个文件 / 单个 25 MB）。

> ⚠️ **不要跳过这一步去做第 3 步**。WAF 规则和第 1 步是配套的，只做一半效果会打折。

---

## 第 2 步：确认 Cloudflare 的构建命令 ⬜

> **为什么做这一步**：我修的那个内部文件泄露，是靠**改构建命令**来清理的。如果 Cloudflare 用的不是这个命令，修复就不生效。

1. Cloudflare → Workers 和 Pages → 你的项目
2. 找到「**设置**」（Settings）→ 「**构建**」（Build）或「构建配置」（Build configuration）
3. 看「**构建命令**」（Build command）这一栏

| 你看到什么 | 要做什么 |
|---|---|
| `npm run build` | ✅ 正确，什么都不用改 |
| `vite-ssg build` | ⚠️ 改成 `npm run build`，保存 |
| 没有构建配置（方式 B 的直接上传） | ✅ 不适用，跳过这一步 |

**✅ 做完的标志**：构建命令是 `npm run build`，或者你确认自己是直接上传模式。

---

## 第 3 步：添加拦截规则（WAF） ⬜

> **为什么做这一步**：你网站上的"访问"绝大部分都是扫描器，没有几个真人。
> Netherlands 那批在找 `.env`、`pnpm-lock.yaml`；France 那批在找 WordPress 的 `wp-includes`、`xmlrpc.php`。
> 这条规则会把它们全挡在门外，**而且绝不会影响真实访客**（因为它只拦这些垃圾路径，不看国家、不看 IP）。

### 操作步骤

1. Cloudflare 后台 → 左上角确认当前域名是 **meowerair.com**
2. 左侧菜单 → 「**安全性**」（Security）→ 「**WAF**」→ 「**自定义规则**」（Custom rules）
3. 点「**创建规则**」（Create rule）
4. **名称**填：`Block scanner dictionary probes`
5. **表达式**：把编辑器切到「**编辑表达式**」（Edit expression）模式，然后粘贴下面这一整段：

```
(
  starts_with(http.request.uri.path, "/.env")
  or starts_with(http.request.uri.path, "/.git")
  or starts_with(http.request.uri.path, "/.vite")
  or starts_with(http.request.uri.path, "/.svn")
  or starts_with(http.request.uri.path, "/_next")
  or starts_with(http.request.uri.path, "/node_modules")
  or http.request.uri.path contains "wp-includes"
  or http.request.uri.path contains "wp-admin"
  or http.request.uri.path contains "wp-content"
  or http.request.uri.path contains "wp-login"
  or http.request.uri.path contains "wlwmanifest"
  or http.request.uri.path contains "xmlrpc.php"
  or http.request.uri.path contains "pnpm-lock"
  or http.request.uri.path contains "package-lock"
  or http.request.uri.path contains "yarn.lock"
  or http.request.uri.path contains "composer.lock"
  or ends_with(http.request.uri.path, ".php")
  or ends_with(http.request.uri.path, ".map")
  or ends_with(http.request.uri.path, ".sql")
  or ends_with(http.request.uri.path, ".bak")
  or ends_with(http.request.uri.path, ".old")
  or lower(http.user_agent) contains "reconx"
)
```

6. **动作**（Action）选「**阻止**」（Block）
7. 点「**部署**」（Deploy）

**✅ 做完的标志**：自定义规则列表里出现这条规则，状态是「已启用」/ 绿色。

> 💡 **为什么用 "contains" 而不是 "starts with"**：扫描器的路径长这样 `//cms/wp-includes/wlwmanifest.xml`——前面有双斜杠和随机目录名。用 starts_with 一条都拦不住，用 contains 才能全中。我已经拿你实际观测到的 8 条路径逐条验证过，100% 覆盖。

---

## 第 4 步：验证（在浏览器里做，不用敲命令）⬜

在**浏览器地址栏**依次输入下面 3 个地址，对照结果。手机或电脑都行，建议用**无痕窗口**（避免缓存干扰）。

| # | 在地址栏输入 | 应该看到 | 说明 |
|---|---|---|---|
| 1 | `https://meowerair.com/.vite/ssr-manifest.json` | **404 页面**（我做的那个「We couldn't find that page」） | 内部文件泄露已修复 |
| 2 | `https://meowerair.com/wp-includes/wlwmanifest.xml` | **403 错误页**（Cloudflare 的拦截提示，通常写着 "You are unable to access"） | WAF 规则生效 |
| 3 | `https://meowerair.com/` | **正常首页** | 真实访客不受影响 |

**✅ 做完的标志**：3 条全部符合预期。

### 如果结果不对

| 现象 | 原因 | 怎么办 |
|---|---|---|
| 第 1 条显示的是一堆 `{...}` 代码 | 第 1 步还没成功，或第 2 步构建命令没改 | 回到第 1、2 步 |
| 第 1 条显示**正常的首页**，不是 404 页 | `404.html` 没生效 | 告诉我，我来查（可能是 Pages/Workers 的配置差异） |
| 第 2 条返回 **404** 而不是 403 | 规则没部署，或表达式没粘贴完整 | 回到第 3 步检查 |
| 第 3 条首页打不开 | 出问题了 | 立刻告诉我，并把看到的错误页发我 |

---

## 第 5 步：第二天回来看数据 ⬜

**等 24 小时**，回到 Cloudflare → Analytics（就是你之前截图那个页面）。

| 指标 | 预期变化 | 怎么理解 |
|---|---|---|
| **页面浏览量** | **明显下降** | ✅ **这是好事**。之前每个扫描探测都被算成一次「浏览」，现在它们返回 404 或 403，不再计入 |
| 热门路径里的 `wp-*`、`/.env`、`pnpm-lock.yaml` | **全部消失** | ✅ 干净了 |
| Netherlands / France 的柱子 | 变 0 或极少量 | ✅ 扫描器被挡住了 |
| 5xx 错误率 | 保持 0 | 说明源站一直健康 |

> ⚠️ **别把浏览量下降当坏消息。** 你现在的任务不是把数字做大，而是搞清楚"真人在哪"。数字掉了，说明剩下的才是真的。

---

## 附录 A：术语小抄（看不懂就回来查）

| 词 | 大白话 |
|---|---|
| **部署 / Deploy** | 把你在电脑上改好的文件"发布到网上"，让访客能看到 |
| **构建 / Build** | 把源代码加工成浏览器能直接打开的文件（你的项目要跑一次 `npm run build`） |
| **WAF** | Cloudflare 的"门卫"，按规则决定放行还是拦住某个请求 |
| **自定义规则** | 你自己写的门卫条例，比如"带 `.env` 的请求一律拦掉" |
| **404** | 正常但"这里没有这个文件"的回应 |
| **403** | "你不许访问"——被门卫拦了 |
| **CDN** | Cloudflare 在全球的缓存节点，让各地访客就近拿到内容 |
| **扫描器 / 爬虫** | 自动程序。爬虫（Google/Ahrefs）是正常的；扫描器是来找漏洞的 |
| **本地 / 线上** | 本地 = 你电脑上；线上 = 已经发布、别人能访问的版本 |

---

## 附录 B：这份清单在修什么（背景，可跳过）

| 问题 | 现状 | 修法 |
|---|---|---|
| **内部文件泄露** | `/.vite/ssr-manifest.json` **线上可直接下载**，暴露 111 条内部模块路径 | 已改构建命令，部署后消失（第 1、2 步） |
| **扫描器把假页面算成浏览量** | 之前没有 404 页，任何不存在的路径都返回「200 + 首页」，被 Cloudflare 记成一次页面浏览 | 新增 `404.html`，部署后变真 404（第 1 步） |
| **扫描器持续骚扰** | 法国每天约 14 次（WordPress 扫描）、荷兰周期性爆发（找 `_next`/`pnpm`/`.env`） | WAF 规则（第 3 步） |
| **页面太重** | 首页曾经要下载 6.6 MB（含 4 MB 字体 + 2.3 MB 图片） | 已优化到约 1 MB（图片转 WebP、字体子集化） |

**一个重要的说明**：前面对网站做的排查中，我用了命令行工具（curl）测试你的线上站约 30–40 次。这些请求会出现在你的 Analytics 里，被归类为 `curl/8.7.1`（22 次左右）。**建基线时请把这一天的数据排除掉。**

---

## 附录 C：出问题了怎么办

1. **不要慌**：网站的代码都在 git 里，任何改动都可以回退。
2. **先截图**：把看到的错误页面完整截图。
3. **告诉我三件事**：① 你在做第几步 ② 看到什么 ③ 截图。
4. **紧急回退**（网站完全打不开时）：Cloudflare → Workers 和 Pages → 你的项目 → 部署列表 → 找到**上一条成功的部署** → 点旁边的「⋯」→「**回滚到此部署**」（Rollback to this deployment）。这样网站会在 1 分钟内恢复到之前的正常状态。

---

## 完成情况记录

| 步骤 | 状态 | 完成时间 |
|---|---|---|
| 〇、确认上线方式 | ⬜ | |
| 1、发布上线 | ⬜ | |
| 2、确认构建命令 | ⬜ | |
| 3、添加 WAF 规则 | ⬜ | |
| 4、浏览器验证 3 条 | ⬜ | |
| 5、第二天看数据 | ⬜ | |
