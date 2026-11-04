# 到货提醒（Back in stock）— 已暂停

售罄商品的客人可以留下邮箱，补货后由你在后台一键通知。前台纯静态，数据与发信由 Cloudflare Pages Functions 承担。

> **状态：2026-11 暂停，未上线。** 代码已从构建中移出并放在 `parked/back-in-stock/`，
> 线上售罄商品仍显示原来的 `Sold out` 按钮。恢复步骤见同目录 `RESTORE.md`。

## 工作方式

| 环节 | 位置 | 说明 |
|---|---|---|
| 售罄判定 | 前端 | 读 Shopify `variant.availableForSale`；为 `false` 时购买栏 / 尺码卡 / 颜色卡 / 样式卡显示「Notify me when it is back」 |
| 收集邮箱 | `POST /api/back-in-stock` | 写入 D1 表 `back_in_stock`，同一邮箱 + 同一变体只存一条 |
| 后台列表 | `GET /api/admin/requests` | 需要 `x-admin-token` 头（值为 `ADMIN_TOKEN`） |
| 发送通知 | `POST /api/admin/notify` | 按变体批量发信，成功后标记 `notified_at`，不会重复打扰 |
| 后台页面 | `/admin/restock` | 输入 token 后查看待通知名单，显示 Shopify 当前是否有货，点「Send the email」发送 |

> 通知是**手动触发**的：补货后你打开 `/admin/restock`，确认状态是「In stock now」再点发送。这样可以避免「只补了 2 件就群发」的尴尬，也方便你先确认图片/价格无误。

## 一、先回答：没有服务器也能做

这个功能**不需要买服务器、不需要 VPS、也不需要 Docker**。三样东西都是托管服务：

| 需要的东西 | 是什么 | 谁在跑 | 费用 |
|---|---|---|---|
| 数据库 | **Cloudflare D1**（托管 SQLite） | Cloudflare 的边缘网络 | 免费额度够用（5 GB） |
| 接口 | **Cloudflare Pages Functions** | 和网站同一个 Pages 项目 | 免费 |
| 发邮件 | **Resend** 的 API | Resend | 免费 3,000 封/月 |

网站本来就在 Cloudflare Pages 上，所以「建库」只是在你已有的 Cloudflare 后台点几下 —— 和创建这个网站是同一个地方。

## 二、建库：两种方式，任选一种

### 方式 A：全在网页后台点（不装任何东西，推荐）

1. 打开 <https://dash.cloudflare.com> → 左侧 **Storage & Databases → D1 SQL Database**
2. **Create database** → 名字填 `meower-restock` → Create
3. 进入这个库 → 顶部 **Console** 标签 → 粘贴下面整段 SQL → **Execute**：

```sql
CREATE TABLE IF NOT EXISTS back_in_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT,
  variant_id TEXT NOT NULL,
  variant_title TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notified_at TEXT,
  UNIQUE (email, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_back_in_stock_variant_pending
  ON back_in_stock (variant_id, notified_at);
```

4. 回到 **Workers & Pages → 你的网站项目（Meower）→ Settings → Bindings**
   （新版界面在 **Settings → Functions → D1 database bindings**）
5. **Add binding**：
   - Variable name：**`DB`**（必须叫这个，代码里就是这么读的）
   - D1 database：选刚建的 `meower-restock`
6. 保存后**重新部署一次**（Deployments → 最新一次 → Retry deployment），绑定才会生效

> 用这个方式就不需要 `wrangler.toml` 了。仓库里的 `wrangler.toml.example` 只是给方式 B 用的模板。

### 方式 B：在自己电脑上用命令行

不需要服务器，只是在你的 Mac 上跑几条命令：

```bash
# 1. 登录（浏览器里点一下授权）
npx wrangler login

# 2. 建库，输出里会有一行 database_id
npx wrangler d1 create meower-restock

# 3. 把 database_id 填进配置文件
cp wrangler.toml.example wrangler.toml
# 编辑 wrangler.toml，把 <DATABASE_ID> 换成上一步的值

# 4. 建表
npx wrangler d1 execute meower-restock --remote --file=./migrations/0001_back_in_stock.sql
```

之后直接 Git 推送部署，`wrangler.toml` 里的 D1 绑定会随之带上。

## 三、配置环境变量和发信

### 1. 环境变量（网页后台，不需要服务器）

**Workers & Pages → 你的项目 → Settings → Environment variables**（Production 和 Preview 都加）：

| 变量 | 用途 | 示例 |
|---|---|---|
| `ADMIN_TOKEN` | 后台页面的访问口令（自己定，长一点） | `mw_9f2c…` |
| `RESEND_API_KEY` | Resend 发信密钥 | `re_…` |
| `MAIL_FROM` | 发件人（域名需在 Resend 验证） | `Meower <hello@meowerair.com>` |
| `SITE_URL` | 邮件里按钮的落地域名 | `https://meowerair.com` |

加完同样要**重新部署一次**。

### 2. Resend（发邮件）

1. 注册 <https://resend.com>（免费）
2. **Domains → Add domain** → 填 `meowerair.com`
3. 它会给几条 DNS 记录（SPF / DKIM）—— 因为域名也在 Cloudflare，可以在 Cloudflare 的 **DNS** 页面直接照着加，或用 Resend 的 "Auto configure"
4. 验证通过后 → **API Keys → Create API key** → 复制 `re_…` 填到上面的 `RESEND_API_KEY`
5. 域名还没验证好之前：把 `MAIL_FROM` 写成 `onboarding@resend.dev`，只能发到你自己注册 Resend 用的那个邮箱，用来测试足够

### 3. 部署

`functions/` 目录会被 Cloudflare Pages 自动识别，随网站一起发布，无需单独部署。

## 四、日常使用

1. 有客人点了「Notify me」→ 打开 `https://meowerair.com/admin/restock`
2. 输入 `ADMIN_TOKEN`，点 **Load list**
3. 看到分组：商品 / 变体 / 等待人数 / 邮箱列表 / 当前库存状态
4. Shopify 补货后刷新，状态变成 **In stock now**
5. 点 **Send the email (N)** → 每人收到一封「Back in stock」邮件，名单清空

## 五、本地开发

`npm run dev` 时，`scripts/devApiPlugin.js` 会把这些接口用真实代码跑起来：

- D1 用内存模拟（重启 dev server 即清空）
- Resend 用假发信器（不发真邮件，只在终端打印 `[dev mail] → …`）
- 后台口令固定为 `dev-admin-token`

预览售罄界面：浏览器控制台执行后刷新页面

```js
localStorage.setItem('kkshop:force-soldout', '1');   // 打开
localStorage.removeItem('kkshop:force-soldout');     // 关闭
```

这段代码被 `import.meta.env.DEV` 包住，生产构建里会被完全剔除。

## 六、数据结构

```sql
CREATE TABLE back_in_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,        -- 站内 id，例如 christmas-pet-bed
  product_title TEXT,
  variant_id TEXT NOT NULL,        -- Shopify gid://shopify/ProductVariant/…
  variant_title TEXT,              -- 前台显示名（已做中英映射）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notified_at TEXT,                -- 发送成功后写入
  UNIQUE (email, variant_id)
);
```

## 七、还可以加的（按需）

- **自动通知**：Pages Functions 没有定时器，需要再加一个带 Cron 的 Worker，定时查 Shopify 库存并调用同一个 `notify` 逻辑
- **商品卡售罄角标**：Shop 列表页卡片上显示「Sold out」
- **导出 CSV**：后台加一个导出按钮
