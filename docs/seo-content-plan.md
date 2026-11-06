# Meower SEO 内容规划 v2（C 端宠物用品 + B 端设备）

> **目标**：用 12 篇新文章，把「C 端宠物用品（Shop）」这条新的主线补上，同时把「宠物空气」「湿度霉菌」「B2B / OEM」三条已有主线收尾。
> **原则**：一篇一个主关键词；C 端文章负责把流量送进商品页并完成 Shopify 转化，B 端文章负责送询盘。
> **市场**：全球英语站，主攻美国（拼写用 `mold`、`odor`、`traveling`，在正文里各带一次英式变体），新西兰/澳洲作为次要市场复用同一批文章。
> **更新于**：2026-11（v1 只覆盖 B 端空气 / 湿度，已被本文替代；v1 可在 git 历史中查看）

---

## 0. 一页速览：v2 改了什么

| # | v1 | v2 | 为什么 |
|---|---|---|---|
| 1 | 只有「宠物空气 / 湿度霉菌 / 选购 / B2B」4 条支柱 | 增至 **5 条**，新增「猫抓板与猫行为」「宠物出行与睡眠」两条 C 端支柱 | 网站已经上了 6 个 Shop 分类、7 个宠物用品 SKU，博客里却 **0 篇**相关内容 |
| 2 | 10 篇选题，全部指向 MW100 / MW200 / MD001 | **12 篇**：C 端 5 篇、空气 3 篇、湿度 3 篇、B2B 1 篇 | 流量结构跟着商品结构走；C 端才是现在的主营收 |
| 3 | 大量内链写到 **MW100** | 全部改为 **MW200**（或对应 SKU） | MW100 在 `products.js` 里已 `hidden: true`，链过去是无效内链 |
| 4 | P0 是猫砂异味 / 皮屑 / 摆放 / CADR | P0 换成 **抓沙发 / 猫砂异味 / 带猫坐车 / 猫不睡窝** | 皮屑篇已发布；抓沙发与出行是当下最大的空白 + 冬季/圣诞窗口 |
| 5 | 没有和老文章做去重 | 新增「旧 10 篇处置表」+ 「与现有文章的重叠处理」 | 现有的 *How to Choose an Air Purifier for Pets* 已写过 CADR 和 H13，新文必须换角度 |
| 6 | 写作规范是通用 6 条 | 拆成 **C 端 / 权威 / B2B 三套**，加 FAQ 与合规红线 | C 端写法和 B2B 写法不是一回事，尤其"不能写什么" |
| 7 | 没有排期之外的衡量 | 加季节日历 + 30/90 天指标 + 淘汰机制 | 内容要有退出机制，不然越写越散 |

---

## 一、站点现状盘点（2026-11）

### 1.1 页面结构

| 路由 | 页面 | 主要承担的关键词意图 |
|---|---|---|
| `/` | 首页（轮播 + 精选商品 + 分类 + Business 邀请 + 博客） | 品牌词、`pet supplies` 泛词 |
| `/products` | Shop 列表页（6 个分类） | 分类词（`cat scratching posts`、`pet strollers`…） |
| `/products/:id` | 13 个商品详情页（含隐藏的 MW100） | 型号词 + 长尾属性词，**转化落点** |
| `/business` | B2B 页（分销 / OEM-ODM / 项目） | `wholesale`、`OEM`、询盘 |
| `/blogs` | 博客列表（无分类筛选） | 内容入口 |
| `/blogs/:slug` | 13 篇文章 | 长尾信息词 |
| `/support`、`/privacy`、`/refunds`、`/terms` | 支持与合规 | 品牌信任（不指望流量） |

技术侧已经就位、不需要再改：SSG 预渲染（每页都有真实 HTML）、canonical / OG / Twitter Card、Organization / WebSite / BreadcrumbList / FAQPage（商品页）/ BlogPosting 结构化数据、`sitemap.xml`、`robots.txt`、Cloudflare 301。

### 1.2 商品矩阵

**C 端（Shop，Shopify 在线结账）**

| 分类 | SKU（站内 id） | 一句话卖点（写文章时的"钩子"） |
|---|---|---|
| Air Purifiers | `mw200` | 360° 进风 + H13 HEPA，400 m³/h CADR，20–40 m² |
| Cat Scratching Posts | `woven-sisal-cat-scratcher` | 挂墙像装饰画的编织剑麻板，魔术贴不伤墙，210 g |
| Cat Scratching Posts | `sisal-cat-scratcher` | 60×40×8 cm 剑麻绳抓板，抓完能直接躺 |
| Pet Beds | `triangle-cat-bed` | 一床三形（三角窝 / 沙发 / 平垫），华夫格 + 羊羔绒 |
| Pet Beds | `christmas-pet-bed` | 圣诞格纹 + 绒面 + 三个尺码，节日礼品属性 |
| Pet Strollers | `pet-stroller` | 提篮一键分离，车尾箱放车架、后座放提篮，25 kg 承重 |
| Pet Carriers & Bags | `car-pet-seat` | 车载固定 + 手提 + 展开成平垫，防水仿皮 |
| Pet Toys | `pom-pom-cat-toy` | 一键发射 / 一键回收，2 个可换兔毛球 |

**B 端（Business，询盘为主）**

| 产品线 | SKU | 主要买家 |
|---|---|---|
| Air Purifiers | `mw200`、`commercial-air-purifier`（MW1000，877 m³/h，≤105 m²） | 分销商、健身房/办公/教室项目 |
| Dehumidifiers | `md001`（12–15 L/day）、`md002`（20–25 L/day，带干衣）、`commercial-dehumidifier`（MD0001，50–60 L/day）、`ceiling-mounted-dehumidifier`（MD0002，吊顶） | 分销商、仓储/地下室/厂房项目 |

> ⚠️ `mw100` 已 `hidden: true`，不在任何列表、导航、推荐里出现。**任何新文章都不许把 MW100 当内链目标**，用 `mw200` 替代。

### 1.3 博客存量（13 篇）

| 主题簇 | 已有文章 | 覆盖的关键词方向 |
|---|---|---|
| 宠物 × 空气 | How to Choose an Air Purifier for You and Your Pet（2026-10-31）<br>Air Purifier for Pet Dander in Bedroom（2026-10-12）<br>How Indoor Air Quality Affects Your Pets | `air purifier for pets`、`pet dander`、`cat allergies` |
| 湿度 × 霉菌 | Beyond Comfort: Humidity Control<br>Data-Driven Science for Mold Control<br>Overcoming the AC Misconception | `humidity control`、`mold prevention`、`dehumidifier vs AC` |
| 家庭场景 | Creating a Fresher Family Living Room<br>The Air Our Children Breathe | `living room air quality`、`classroom CO2` |
| 商业 / 资产 | Focus on Asset Protection<br>Property Management & Asset Protection | `commercial dehumidifier`（B 端偏泛） |
| 维护 / 季节 / 宠物健康 | Filter Care for Everyday Performance<br>Pollen Season in New Zealand<br>How Humid Air Affects Pets | `filter replacement`、`pollen nz`、`humidity and pets` |

### 1.4 三条结论（决定了下面的选题）

1. **内容结构与商品结构错位**：首页、导航、Shop 已经以宠物用品为主（床、推车、包、玩具、抓板），博客却 100% 是空气与湿度。用户从搜索进来看到的是"空气净化器公司"，从首页进来看到的是"宠物用品店"——两条叙事没有接上，C 端商品页也拿不到内容侧的内链和话题权威。
2. **空气/湿度话题已经"够用"**：13 篇全部落在空气、湿度、霉菌这三条线上（其中 2 篇偏 B 端资产保护），信息词覆盖得差不多了。继续加同类文章的边际收益很低，只有**决策期词**（CADR、HEPA 等级、摆放）和 **B2B 采购词**还空着。
3. **C 端是 0**：没有一篇讲抓板、猫窝、推车、车载、玩具。这是全站最大的缺口，也是唯一能直接吃到"宠物用品"这个大盘的入口。

---

## 二、内容支柱 v2

| 支柱 | 目的 | 人群 | 落地页 | 关键词族（示例） |
|---|---|---|---|---|
| **A. 猫抓板与猫行为** | C 端获客 + 建立"懂猫"的品牌感 | 沙发被抓、租房、养猫新手 | `woven-sisal-cat-scratcher`、`sisal-cat-scratcher`、`/products#cat-scratchers` | stop cat scratching furniture、cat scratching post、wall mounted scratcher、sisal vs cardboard |
| **B. 宠物出行与睡眠** | C 端高客单转化 | 带猫出门、老年猫、长途自驾、冬天 | `pet-stroller`、`car-pet-seat`、`triangle-cat-bed`、`christmas-pet-bed`、`pom-pom-cat-toy` | cat stroller、traveling with a cat、cat car seat、cat bed、indoor cat play |
| **C. 宠物空气与过敏** | 已有优势，收口到决策期词 | 养宠 + 过敏/异味家庭 | `mw200` | cat litter box smell、CADR、HEPA H13、air purifier placement |
| **D. 湿度与霉菌** | 除湿机线的信息入口 | 潮湿住宅、租房、南方/沿海 | `md001`、`md002`、`commercial-dehumidifier` | ideal indoor humidity、mold in bathroom、dry clothes indoors |
| **E. B2B / OEM 与商用项目** | 直接产询盘 | 分销商、品牌方、工程项目 | `/business`、`commercial-air-purifier`、商用/吊顶除湿机 | air purifier manufacturer、OEM/ODM、wholesale dehumidifier |

支柱之间的流动：A/B（用品）↔ C（宠物空气）共享"养宠家庭"人群，互为内链；C ↔ D 共享"家里不舒服"人群；D ↔ E 共享"湿度是资产风险"叙事。

---

## 三、关键词地图（支柱 × 漏斗）

| 支柱 | 认知期（信息词） | 考虑期（比较/操作词） | 决策期（商业词） |
|---|---|---|---|
| **A 猫抓板** | how to stop a cat scratching furniture · why do cats scratch | cat scratching post vs cardboard · wall mounted vs floor scratcher | cat scratching post · sisal cat scratcher |
| **B 出行睡眠** | traveling with a cat in the car · why won't my cat sleep in its bed | are pet strollers good for cats · cat bed vs blanket | cat stroller · cat car seat · 3-in-1 cat bed |
| **C 宠物空气** | cat litter box smell · do air purifiers help with cat allergies | what is CADR · where to put an air purifier · H13 vs H12 | air purifier for pets（已有）· air purifier for cat litter |
| **D 湿度霉菌** | how to dry clothes indoors · why mold keeps coming back | ideal indoor humidity · dehumidifier size for room | dehumidifier for drying clothes · home dehumidifier |
| **E B2B** | —— | how to choose an air purifier manufacturer | air purifier OEM/ODM · wholesale dehumidifier · ceiling mounted dehumidifier supplier |

**打法说明（重要）**：head 词（`cat scratcher`、`best cat bed`、`best air purifier`）的 SERP 被 Chewy / Petco / Wirecutter / Amazon 占死，以当前域名权重硬碰是浪费预算。策略是：

1. 用**信息型长尾**（"为什么/怎么办/适不适合"）拿排名和点击；
2. 信息文里把商品页作为"解决方案"自然引出（不在正文堆价格）；
3. 商品页自己承接商业词（`productOverview` 已经有 800–1200 词可爬文本 + FAQPage schema，这是对的，继续保持）；
4. 因此这 12 篇里 **0 篇是"best X 榜单"**——品牌站写榜单既不可信也打不过评测站。

---

## 四、12 篇选题明细

> 排序即排期顺序。`slug` 直接用于 `src/data/blogArticles.js` 和 `/blogs/:slug`。

### P0 — 第 1 个月（1–4 篇）：先把 C 端最大的缺口补上

---

#### 1. 让猫别抓沙发

| 项 | 内容 |
|---|---|
| **主关键词** | `how to stop a cat from scratching furniture` |
| **次要词** | why do cats scratch furniture、cat scratching post、wall mounted cat scratcher、sisal cat scratcher、cat scratching behaviour |
| **意图** | 问题解决（懊恼型搜索，量最大），漏斗：认知 → 考虑 |
| **建议标题** | How to Stop a Cat From Scratching Furniture |
| **slug** | `how-to-stop-cat-scratching-furniture` |
| **支柱** | A |
| **内链** | 产品：`/products/woven-sisal-cat-scratcher`、`/products/sisal-cat-scratcher`；分类：`/products#cat-scratchers` |
| **外链** | iCatCare「Scratching on furniture and carpets」、ASPCA「Destructive Scratching」 |
| **字数** | 1800–2400（**已发布 2026-11-06**，正文约 2,400 词，存档 `docs/blog-drafts/how-to-stop-cat-scratching-furniture.md`） |
| **差异化** | 站内第一篇宠物用品文章，也是抓板两个 SKU 的唯一内容入口；重点写"抓板为什么被冷落"和"放哪里"，而不是罗列产品 |

**大纲**（已按此写完，见样稿）
- H2 猫抓家具不是"报复"，是四个刚需（磨爪 / 伸展 / 气味标记 / 情绪出口）
- H2 抓板买了不用，问题出在三点：高度与稳定性 / 材质 / 朝向
- H2 材质怎么选：剑麻绳、编织剑麻、瓦楞纸、地毯的差别
- H2 放哪里：贴着"案发现场"放，而不是塞进角落
- H2 保护沙发（临时手段与局限）：遮挡、双面胶、修剪、猫薄荷
- H2 不要做的事：体罚、去爪术（含 AAFP/AVMA 立场）、只靠驱避喷雾
- H2 4 周执行计划（表格）
- H2 小户型 / 租房：挂墙方案为什么更省地方
- H2 常见问题（FAQ × 4）
- 结尾：自然引出两块抓板（各自的适合场景）

---

#### 2. 猫砂盆异味

| 项 | 内容 |
|---|---|
| **主关键词** | `cat litter box smell` |
| **次要词** | how to get rid of cat litter box smell、air purifier for litter box、cat litter smell in apartment、litter box odor control |
| **意图** | 问题解决（高频、强懊恼），漏斗：认知 → 决策（净化器） |
| **建议标题** | Cat Litter Box Smell: What Actually Works (and What Only Masks It) |
| **slug** | `cat-litter-box-smell` |
| **支柱** | C（兼 A） |
| **内链** | 产品：`/products/mw200`；文章：`/blogs/how-to-choose-an-air-purifier-for-pets`、`/blogs/how-indoor-air-quality-affects-your-pets` |
| **字数** | 1500–2000 |
| **差异化** | v1 保留项（原 P0 #1）。必须写"先解决源头，再用活性炭层处理悬浮气味分子"，否则会变成软文 |

**大纲**
- H2 为什么砂盆味道会弥漫整个房间（氨气 + 悬浮颗粒 + 气流）
- H2 第一步：源头（猫砂选型、铲砂频率、砂盆数量 = 猫数 + 1、位置）
- H2 第二步：通风能做到什么、做不到什么
- H2 第三步：用净化器处理空气中的气味分子（活性炭层到底管什么）
- H2 常见误区：香薰、空气清新剂、除臭喷雾只是遮盖，且可能刺激猫的呼吸道
- H3 MW200 在猫砂盆场景的合理用法（距离、风量、24 小时开着）
- 结尾：一天 5 分钟的流程清单

---

#### 3. 带猫坐车

| 项 | 内容 |
|---|---|
| **主关键词** | `traveling with a cat in the car` |
| **次要词** | cat car seat、cat carrier for car、road trip with a cat、how to keep a cat calm in the car |
| **意图** | 问题解决 + 强商业意图（安全类），漏斗：认知 → 决策 |
| **建议标题** | Traveling With a Cat in the Car: A Practical, Safety-First Guide |
| **slug** | `traveling-with-a-cat-in-the-car` |
| **支柱** | B |
| **内链** | 产品：`/products/car-pet-seat`、`/products/pet-stroller`；文章：`/blogs/how-humid-air-affects-pets`（温湿度与宠物） |
| **字数** | 1500–2000 |
| **差异化** | 不要写"如何治疗晕车/焦虑"（医疗声明）；只写固定、通风、温度、休息节奏、到达后的落脚点 |

**大纲**
- H2 为什么猫在车里会叫（不是叛逆：无固定、震动、气味、密闭）
- H2 安全第一：什么固定在什么位置（安全带路径、气囊、后座）
- H2 三种方案对比：硬壳航空箱 / 软包 / 车载床（各自的适用场景）
- H2 出发前的 30 分钟准备（空腹、猫砂盆、水、遮光）
- H2 路上：温度、通风、休息节奏
- H2 到达后：给猫一个"可以直接躺下"的地方
- H2 常见问题（长途 / 短途 / 两只猫 / 猫晕车要不要看医生 → 转给兽医）
- H3 车载床 + 推车怎么配合（车架放车尾箱、提篮上后座）

---

#### 4. 猫不睡自己的窝

| 项 | 内容 |
|---|---|
| **主关键词** | `why won't my cat sleep in its bed` |
| **次要词** | best cat bed for winter、cat bed vs blanket、cat sleeping habits、3-in-1 cat bed、washable cat bed |
| **意图** | 问题解决 + 冬季/圣诞季节窗口（11–12 月峰值），漏斗：认知 → 决策 |
| **建议标题** | Why Won't My Cat Sleep in Its Bed? 6 Things Cats Actually Care About |
| **slug** | `cat-wont-sleep-in-its-bed` |
| **支柱** | B |
| **内链** | 产品：`/products/triangle-cat-bed`、`/products/christmas-pet-bed`；文章：`/blogs/how-humid-air-affects-pets` |
| **字数** | 1500–1800 |
| **差异化** | 季节红利：11 月中发布，吃"入冬买窝 + 圣诞送礼"两个搜索波；圣诞床只做 H3 场景，不做主推 |

**大纲**
- H2 猫挑睡处只看三件事：温度、遮蔽感、视野
- H2 常见五个原因（太大 / 太开放 / 位置太吵 / 材质不对 / 形状固定）
- H2 尺寸怎么量（身长 + 打滚余量）
- H2 形状：窝、垫、洞穴、三角窝各自的猫
- H2 冬天：为什么"能立起来"的床更受欢迎
- H2 让旧床重新被用起来的四个办法
- H3 节日场景：圣诞格纹床作为礼物怎么选尺码（S/M/L 对应猫、比格、拉布拉多）

---

### P1 — 第 2 个月（5–8 篇）：C 端收口 + 空气决策期

---

#### 5. 猫推车

| 项 | 内容 |
|---|---|
| **主关键词** | `cat stroller` |
| **次要词** | are pet strollers good for cats、cat stroller for senior cats、pet stroller with carrycot、dog stroller |
| **意图** | 比较型（商业意图强，客单最高 $399），漏斗：考虑 → 决策 |
| **建议标题** | Cat Strollers: When They Help, and What to Look For |
| **slug** | `cat-stroller` |
| **支柱** | B |
| **内链** | 产品：`/products/pet-stroller`、`/products/car-pet-seat`；文章：`/blogs/traveling-with-a-cat-in-the-car` |
| **字数** | 1500–1800 |
| **差异化** | 不写"best cat stroller"；写"什么情况下推车是对的、什么情况下是浪费"，把选购标准交给读者，产品作为满足标准的一个例子 |

**大纲**
- H2 推车解决的是哪一类问题（老年猫 / 恢复期 / 城市遛猫 / 长途）
- H2 什么情况不需要推车（怕出门的猫、极端天气）
- H2 五个必须看的设计：离地高度、顶棚、承重、轮子、能不能拆
- H2 提篮分离为什么重要（上车不用换笼子）
- H2 让猫接受推车的三步
- H2 常见问题
- H3 与车载床的组合用法

---

#### 6. 互动玩具与室内猫运动量

| 项 | 内容 |
|---|---|
| **主关键词** | `best cat toys for indoor cats` |
| **次要词** | how much play does a cat need、interactive cat toys、bored indoor cat、cat play ideas |
| **意图** | 比较型 + 内容型（流量大、转化中等），漏斗：认知 → 考虑 |
| **建议标题** | Indoor Cat Play: How Much They Need and Which Toys Get Used |
| **slug** | `indoor-cat-toys-and-play` |
| **支柱** | B |
| **内链** | 产品：`/products/pom-pom-cat-toy`、`/products/sisal-cat-scratcher`（抓板兼玩具）；文章：`/blogs/cat-wont-sleep-in-its-bed` |
| **字数** | 1400–1800 |
| **差异化** | 标题避开"best"；核心是"每天两段 10 分钟 + 收尾有结果"，玩具只作为工具，不吹"用了就不拆家" |

**大纲**
- H2 猫是短爆发型猎手：一天要几段、每段多长
- H2 玩具的四个类别（追逐 / 埋伏 / 嗅闻 / 抓咬）与缺哪一类
- H2 为什么多数玩具玩三天就废（可预测性）
- H2 会"自己回来"的玩具解决了什么问题（不用趴地上捡）
- H2 收尾：让猫抓到一次，再收起来
- H2 用电玩具的三条安全注意（监督、线材、电池）
- H2 常见问题

---

#### 7. 空气净化器摆放位置

| 项 | 内容 |
|---|---|
| **主关键词** | `where to put an air purifier` |
| **次要词** | air purifier placement bedroom、how far should an air purifier be from the wall、best place for air purifier in living room、air purifier near litter box |
| **意图** | 操作指南（容易被 AI 概览和"怎么做"类 SERP 收录），漏斗：考虑 |
| **建议标题** | Where to Put an Air Purifier (And Where It Stops Working) |
| **slug** | `where-to-place-an-air-purifier` |
| **支柱** | C |
| **内链** | 产品：`/products/mw200`、`/products/commercial-air-purifier`；分类：`/products#air-purifiers`；文章：`/blogs/how-to-choose-an-air-purifier-for-pets` |
| **字数** | 1400–1800 |
| **差异化** | v1 保留项（原 P0 #3）。MW100 换 MW200；加一节"商用空间为什么是另一回事"引到 MW1000 |

**大纲**
- H2 摆放位置为什么决定净化效率（进风、气流短路、循环路径）
- H2 通用规则：离墙距离、避开遮挡、放在人（或猫）常待的位置
- H2 卧室 / 客厅 / 猫砂盆旁 / 宠物房分别怎么放
- H2 五个常见错误（贴墙、躲柜后、贴窗帘、放在门口风口、放在宠物必经路中间）
- H3 360° 进风机型的差异（MW200）
- H3 商用空间为什么不能照搬（MW1000，≤105 m²，877 m³/h）

---

#### 8. 室内晾衣与除湿机

| 项 | 内容 |
|---|---|
| **主关键词** | `dehumidifier for drying clothes` |
| **次要词** | drying clothes indoors without damp、how to dry laundry indoors in winter、condensation from drying clothes、damp smell in clothes |
| **意图** | 问题解决 + 强商业意图（美国/欧洲冬季高频），漏斗：认知 → 决策 |
| **建议标题** | Drying Clothes Indoors: Why It Makes a Room Damp, and How a Dehumidifier Fixes It |
| **slug** | `dehumidifier-for-drying-clothes` |
| **支柱** | D |
| **内链** | 产品：`/products/md002`、`/products/md001`；文章：`/blogs/overcoming-the-ac-misconception` |
| **字数** | 1500–1800 |
| **差异化** | 只在这篇里主打 MD002 的干衣功能——它是全站最独特的一个卖点，v1 完全没用上 |

**大纲**
- H2 一桶湿衣服 = 往房间里倒了几升水（换算表）
- H2 为什么窗上开始结露、墙角开始发霉
- H2 四种晾衣方案对比：开窗 / 烘干机 / 除湿机 / 空调除湿
- H2 除湿机怎么选（除湿量 L/day、水箱、连续排水、气流）
- H2 晾衣实操：怎么摆、开多久、门关不关
- H3 MD002 的干衣模式与 20 L/day 是什么水平
- H2 常见问题

---

### P2 — 第 3 个月（9–12 篇）：权威度 + 湿度收口 + B2B

---

#### 9. 理想室内湿度

| 项 | 内容 |
|---|---|
| **主关键词** | `ideal indoor humidity` |
| **次要词** | what should humidity be in a house、humidity level for cats、how to lower humidity in a room、50% humidity |
| **意图** | 学习型（大流量，导向除湿机），漏斗：认知 → 考虑 |
| **建议标题** | What Should Indoor Humidity Be? A Room-by-Room Guide |
| **slug** | `ideal-indoor-humidity` |
| **支柱** | D |
| **内链** | 产品：`/products/md001`、`/products/md002`；文章：`/blogs/humidity-science-mold-control`、`/blogs/beyond-comfort-humidity-control-indoor-air-quality` |
| **字数** | 1500–2000 |
| **差异化** | v1 保留项（原 P1 #5）。现有两篇已讲"霉菌阈值"，这篇只做"各房间目标值 + 怎么测 + 怎么调"，并把宠物舒适度作为独立小节 |

**大纲**
- H2 30%–50% 这个区间是怎么来的（EPA / ASHRAE）
- H2 各房间的目标值（卧室 / 客厅 / 浴室 / 地下室 / 储物间）
- H2 太湿的四个信号、太干的三个信号
- H2 测：什么湿度计够用、放哪、看几点的读数
- H2 调：通风、暖气、空调、除湿机的分工
- H3 养宠家庭要不要更严格（猫的舒适区 + 霉菌阈值）
- H2 常见问题

---

#### 10. 浴室与衣柜反复发霉

| 项 | 内容 |
|---|---|
| **主关键词** | `how to stop mold in the bathroom` |
| **次要词** | bathroom mold prevention、why does mold keep coming back、closet mold、condensation on windows、mold on bathroom ceiling |
| **意图** | 问题解决（季节高峰），漏斗：认知 → 决策 |
| **建议标题** | Bathroom and Closet Mold: How to Stop It Coming Back |
| **slug** | `how-to-stop-mold-in-bathroom` |
| **支柱** | D |
| **内链** | 产品：`/products/md001`、`/products/md002`；文章：`/blogs/humidity-science-mold-control`、`/blogs/ideal-indoor-humidity` |
| **字数** | 1500–2000 |
| **差异化** | v1 保留项（原 P1 #7）。**不写"用某某清洁剂"**，只写湿度机制 + 三步流程；清洁部分引用 EPA/CDC 的公开建议 |

**大纲**
- H2 反复发霉的真实原因：不是擦得不干净，是湿度没解决
- H2 浴室三步：通风 / 刮水 / 除湿
- H2 衣柜为什么是重灾区（背阴 + 无气流 + 衣物吸湿）
- H2 清洁剂能做什么、不能做什么
- H2 已经发霉的处理顺序（含防护）
- H2 长期方案（含租房能做的）
- H2 常见问题

---

#### 11. H13 与 H12 HEPA 的区别

| 项 | 内容 |
|---|---|
| **主关键词** | `H13 vs H12 HEPA` |
| **次要词** | HEPA H13 meaning、true HEPA vs HEPA-type、EN 1822 filter classes、air purifier filter grades |
| **意图** | 学习型（同行也会引用 → 自然外链），漏斗：考虑 → 决策 |
| **建议标题** | H13 vs H12 HEPA Filters: What the Rating Actually Means |
| **slug** | `h13-vs-h12-hepa` |
| **支柱** | C |
| **内链** | 产品：`/products/mw200`、`/products/commercial-air-purifier`；文章：`/blogs/filter-care-everyday-performance`、`/blogs/how-to-choose-an-air-purifier-for-pets` |
| **字数** | 1800–2500 |
| **差异化** | ⚠️ 现有 *How to Choose an Air Purifier for Pets* 已用一节讲"H13 就是 HEPA"。这篇必须**只做** EN 1822 分级、MPPS、真伪 HEPA 命名、滤网寿命与更换——不要再讲"宠物房该选多大的机器" |
| **重叠处理** | 发布后回填：在那篇的第 2 节末尾加一句"各等级的完整解释见 H13 vs H12 HEPA"，双向内链 |

**大纲**
- H2 一张图看懂 EN 1822（E10–U17 与 H 级的关系，MPPS 是什么）
- H2 H12 / H13 / H14 的效率差异（99.5% / 99.95% / 99.995% @ MPPS）
- H2 家用该选哪个等级（以及为什么 H14 对家用是浪费）
- H2 "True HEPA"、"HEPA-type"、"HEPA-like" 三个词分别意味着什么
- H2 滤网寿命：为什么参数表上的寿命不可信，什么信号说明该换了
- H2 常见问题

---

#### 12. B2B：如何挑选空气净化器 / 除湿机供应商（OEM / ODM）

| 项 | 内容 |
|---|---|
| **主关键词** | `how to choose an air purifier manufacturer` |
| **次要词** | air purifier OEM、ODM air purifier、private label air purifier、air purifier supplier China、wholesale dehumidifier |
| **意图** | 商业调研（**直接产询盘**），漏斗：决策 |
| **建议标题** | How to Choose an Air Purifier Manufacturer for Your Brand (OEM & ODM Guide) |
| **slug** | `how-to-choose-an-air-purifier-manufacturer` |
| **支柱** | E |
| **内链** | `/business`、`/products/mw200`、`/products/commercial-air-purifier`、`/products/commercial-dehumidifier`、`/products/ceiling-mounted-dehumidifier` |
| **字数** | 2000–3000 |
| **差异化** | v1 保留项（原 P2 #10）。去掉"关于我们"（已 301 到 `/business`）；清单要能直接当模板用（8 个必问问题 + 验厂表） |

**大纲**
- H2 先分清 OEM 与 ODM（含"你要的是谁的设计、谁的认证"）
- H2 供应商评估清单：认证（CE / RoHS / ETL / SDoC）、产能、质量体系、起订量、贸易条款
- H2 必须问的 8 个问题（附"什么样的回答是红旗"）
- H2 打样与验厂流程（时间线与费用预期）
- H2 五个常见坑（参数虚标、滤网后期成本、认证套牌、MOQ 与模具费、交期）
- H2 怎么判断一家工厂是否真的做过宠物/商用品类
- H3 Meower 的合作方式（批发 / OEM-ODM / 项目支持）+ 询盘方式
- H2 常见问题

---

## 五、v1 那 10 篇的处置

| v1 选题 | v2 处置 | 说明 |
|---|---|---|
| 1. 猫砂盆异味 | **保留 → #2（升 P0）** | 量最大、最贴 C 端+净化器交界 |
| 2. 宠物皮屑过敏 | **已完成**（2026-10-12 已发布） | 发布后需回填内链到 #2 与 #3 |
| 3. 净化器摆放 | **保留 → #7（P1）** | MW100 → MW200 |
| 4. CADR 科普 | **合并进 #11 与 #7** | 现有 *How to Choose an Air Purifier for Pets* 已讲 CADR 与房间匹配；单独成篇会自我竞争，改为在 H13 篇与摆放篇中各占一节，不再单独立项 |
| 5. 理想室内湿度 | **保留 → #9（P2）** | 与已有两篇湿度文章做分工 |
| 6. 地下室潮湿 | **降级到备选池** | 与 #8/#10 抢同一批"潮湿"流量；等 D 支柱有排名后再写（更适合配商用除湿机） |
| 7. 浴室衣柜霉菌 | **保留 → #10（P2）** | 拼写改 US `mold`，正文带一次 `mould` |
| 8. H13 vs H12 | **保留 → #11（P2）** | 加"与现有文章的分工"约束 |
| 9. 除湿机耗电吗 | **降级到备选池** | 决策末期词，量中等；可作为 #9 的一个 H2（"电费怎么估"）先吃掉，不单独成篇 |
| 10. B2B 供应商 | **保留 → #12（P2）** | 内链改到 `/business` |

**备选池（第二批，12 篇跑完再动）**

| 选题 | 主关键词 | 触发条件 |
|---|---|---|
| 地下室潮湿处理 | `how to fix a damp basement` | D 支柱有 2 篇进前 20 名 |
| 除湿机耗电 | `do dehumidifiers use a lot of electricity` | MD001/MD002 商品页开始有自然流量 |
| 吊顶除湿机怎么选型 | `ceiling mounted dehumidifier` | 有第一个项目询盘来自自然搜索 |
| 商用净化器选型（健身房/教室） | `commercial air purifier for gyms` | B 端询盘量起来后 |
| 猫玩具与玩耍（若 #6 表现好拆成两篇） | `interactive cat toys` | #6 进前 10 名 |
| 老年猫出行 | `senior cat mobility` | 推车页转化率确认后 |
| 圣诞宠物礼物指南（季节） | `christmas gifts for cats` | 每年 10 月排一期 |
| 狗用同类品（推车/车载/床） | `dog stroller`、`dog car seat` | 现有 SKU 的实际买家画像确认后 |

---

## 六、内链与标签体系（代码层）

### 6.1 可用的 product id（`contentLinks.js` 的 `products` 字段只认这些）

```
C 端：mw200 · woven-sisal-cat-scratcher · sisal-cat-scratcher · car-pet-seat
      pet-stroller · triangle-cat-bed · pom-pom-cat-toy · christmas-pet-bed
B 端：commercial-air-purifier · md001 · md002 · commercial-dehumidifier · ceiling-mounted-dehumidifier
```

> ❌ 不要写 `mw100`（已隐藏，`getArticleProducts` 会把它过滤掉，等于白写）。
> ⚠️ 文末推荐产品卡片取前 2 个（`getArticleProducts(slug, 2)`），所以 `products` 数组**顺序就是优先级**，第三个别往里塞。

### 6.2 tag 词表（新老统一，每个 tag 至少 3 篇才成立）

| 现有 tag | 继续用 | 说明 |
|---|---|---|
| `pets` `air-purifier` `filters` `allergies` `family` `air-quality` | ✅ | 老文章已在用，新文章尽量挂上其中 1–2 个，保证"相关阅读"能跨支柱匹配 |
| `humidity` `dehumidifier` `mold` `commercial` `maintenance` `buying-guide` | ✅ | `mold` 命名保留，不改成 `mould` |

| 新增 tag | 用在哪几篇 |
|---|---|
| `cats` | #1 #2 #3 #4 #5 #6 |
| `cat-scratchers` | #1 #6 |
| `cat-behaviour` | #1 #4 #6 |
| `pet-beds` | #4 |
| `pet-travel` | #3 #5 |
| `pet-toys` | #6 |
| `seasonal` | #4（圣诞）、#8（冬季）、#12 备用 |

> `cat-scratchers` 起步只有 2 篇（#1 #6），所以两篇都同时挂 `cats`：`getRelatedArticles` 按共享 tag 数排序，窄 tag 靠共享的宽 tag 兜底，不会出现"相关阅读为空"（都为 0 时回落到最新文章）。同理，#7 / #11 这类空气文共享 `air-purifier` 与 `buying-guide`，能互相推荐。

### 6.3 每篇要加的 `contentLinks.js` 片段

```js
// 1
'how-to-stop-cat-scratching-furniture': {
  tags: ['cats', 'cat-scratchers', 'cat-behaviour', 'buying-guide'],
  products: ['woven-sisal-cat-scratcher', 'sisal-cat-scratcher'],
},
// 2
'cat-litter-box-smell': {
  tags: ['cats', 'air-purifier', 'air-quality'],
  products: ['mw200'],
},
// 3
'traveling-with-a-cat-in-the-car': {
  tags: ['cats', 'pet-travel', 'buying-guide'],
  products: ['car-pet-seat', 'pet-stroller'],
},
// 4
'cat-wont-sleep-in-its-bed': {
  tags: ['cats', 'pet-beds', 'cat-behaviour', 'seasonal'],
  products: ['triangle-cat-bed', 'christmas-pet-bed'],
},
// 5
'cat-stroller': {
  tags: ['cats', 'pet-travel', 'buying-guide'],
  products: ['pet-stroller', 'car-pet-seat'],
},
// 6
'indoor-cat-toys-and-play': {
  tags: ['cats', 'pet-toys', 'cat-behaviour', 'cat-scratchers'],
  products: ['pom-pom-cat-toy', 'sisal-cat-scratcher'],
},
// 7
'where-to-place-an-air-purifier': {
  tags: ['air-purifier', 'air-quality', 'buying-guide'],
  products: ['mw200', 'commercial-air-purifier'],
},
// 8
'dehumidifier-for-drying-clothes': {
  tags: ['humidity', 'dehumidifier', 'seasonal'],
  products: ['md002', 'md001'],
},
// 9
'ideal-indoor-humidity': {
  tags: ['humidity', 'dehumidifier', 'air-quality'],
  products: ['md001', 'md002'],
},
// 10
'how-to-stop-mold-in-bathroom': {
  tags: ['humidity', 'mold', 'dehumidifier'],
  products: ['md001', 'md002'],
},
// 11
'h13-vs-h12-hepa': {
  tags: ['air-purifier', 'filters', 'buying-guide'],
  products: ['mw200', 'commercial-air-purifier'],
},
// 12
'how-to-choose-an-air-purifier-manufacturer': {
  tags: ['commercial', 'buying-guide'],
  products: ['commercial-air-purifier', 'commercial-dehumidifier'],
},
```

### 6.4 发布清单（每篇都要走一遍，漏一步就不算发布）

1. `src/data/blogArticles.js` — 加文章对象：`slug` / `title` / `date` / `sortDate` / `coverImage` / `contentMarkdown`（正文首行 `# 标题` 会被详情页剥掉，别重复写两次标题）。
2. `src/data/contentLinks.js` — 加 6.3 里对应的 `tags` + `products`。
3. `public/sitemap.xml` — 手动补一行：
   ```xml
   <url><loc>https://meowerair.com/blogs/your-slug</loc><lastmod>2026-11-20</lastmod><priority>0.7</priority></url>
   ```
4. `npm run build` — 预渲染会自动带上 `/blogs/:slug`（`vite.config.js` 里的 `includedRoutes` 从 `blogArticles` 读，不用改）。
5. 上线后到 Search Console → URL 检查 → 请求编入索引。
6. 回填：在 2–3 篇老文章里找到合适段落，加一条指向新文章的内链（否则新文章只有列表页一个入口，收录慢）。

> 顺带提醒：**新增商品**时才需要动 `vite.config.js` 里的 `PRODUCT_IDS` 和 `productOrder`；新增文章不需要。

### 6.5 老文章回填补丁（不做这步，新文章只能靠"相关阅读"排队）

| 老文章 | 加什么 |
|---|---|
| How to Choose an Air Purifier for You and Your Pet | → `#11 H13 vs H12`、`#7 摆放`（等它们发布后各加一句） |
| Air Purifier for Pet Dander in Bedroom | → `#2 猫砂异味` |
| How Indoor Air Quality Affects Your Pets | ✅ 已回填 → `#1`（2026-11-06）；仍待加 → `#6 室内猫玩耍` |
| How Humid Air Affects Pets | → `#9 理想湿度`、`#4 猫窝`（湿度/温度舒适） |
| Beyond Comfort / Data-Driven Science | → `#9`、`#10` |
| Filter Care for Everyday Performance | → `#11` |
| 每篇新宠物用品文章 | → `/products#对应分类` + 1 篇空气/湿度文章（把人群接到净化器线） |

### 6.6 可选的结构升级（不是这一轮必须做的）

| 升级 | 价值 | 代价 |
|---|---|---|
| 博客 tag 归档页（`/blogs?tag=cat-scratchers` 或 `/blogs/tag/:tag`） | 让 3–5 篇文章聚成主题簇，比单篇更容易拿到"话题权威" | 中等：改 `BlogListPage` + 路由 + 预渲染 + sitemap |
| 文章底部 FAQ 区块 + `FAQPage` schema | 抓 AI 概览与"People also ask" | 小：`BlogDetailPage` 已有结构化数据基建，商品页 FAQPage 可复用 |
| 商品页加"相关阅读"（`RelatedArticles` 已存在） | 反向导流，形成闭环 | 已就绪，只需文章进 `contentLinks` 即可生效 |

---

## 七、写作规范 v2

### 7.1 三套标准

| 类型 | 篇幅 | H2 数 | 结构重点 | 转化目标 |
|---|---|---|---|---|
| **C 端信息/比较文**（#1–#8） | 1400–2400 | 6–9 | 先解决问题 → 再给选购标准 → 最后才提产品 | 商品页 → Shopify 结账 |
| **权威/科普文**（#9–#11） | 1800–2500 | 6–10 | 数据 + 标准 + 常见误解 | 商品页 + 被动外链 |
| **B2B 决策文**（#12） | 2000–3000 | 8–12 | 清单化、可打印、可当采购模板 | `/business` → 邮件询盘 |

### 7.2 每篇都要做到的

1. **一个主关键词**出现在：`title`、H1、正文前 100 字、至少一个 H2、`meta description`（`excerptFromMarkdown` 自动取正文前 160 字，所以开头那段必须自带主关键词）。
2. **首段 100 字内**回答搜索者的问题，不要用"在当今快节奏的生活中"这类开场。
3. **H2 用问句或具体承诺**，不用"介绍""概述"。
4. **内链 ≥ 3 条**：≥2 条到商品页（除了 6.3 里 `products` 字段自动生成的文末推荐卡，正文里也要有 1 条自然链接）+ 1–2 条到其他文章。链接文字写清是什么（`the woven sisal scratching board`），不要写 `click here`。
5. **外链 1–2 条**权威来源：EPA、WHO、ASHRAE、EN 1822、iCatCare、ASPCA、AAFP、Cornell Feline Health Center。**发布前点一遍确认可访问**。
6. **配图**：优先复用站内已有实拍图（`public/images/products/...`），alt 写画面内容而不是堆词；没有合适的图就先用现有图，不要找网图（版权风险）。
7. **结尾 CTA** 只出现一次，且是"下一步建议"而不是"立即购买"。

> 篇幅宁短勿虚：1600 词把一个动作讲清楚，比 3000 词凑小节更能留住读者，也更容易被 AI 概览引用。

### 7.3 红线（写之前先记住）

- **不做医疗声明**：不写"净化器/除湿机能治疗过敏、哮喘"；统一写"帮助减少空气中的颗粒物/降低湿度"，并建议就医咨询。
- **去爪术一律定性为虐待**：任何提到 declawing 的地方都要明确写"这是虐待、绝对不可以"，不能写成"不推荐"或"权衡利弊"；同时写明法律禁令与兽医机构立场（AAFP / ISFM 反对，AVMA 不鼓励）。
- **不虚构参数**：所有数字只能来自 `productOverview.js` / 商品页已公开的规格；没有数据就写"厂商标称"或干脆不写。
- **不点名竞品**：可以说"纸板抓板会掉屑"这类品类特征，不写品牌。
- **不用"best"做主标题**：品牌站写榜单不可信，也打不过评测站；用"how to choose / what actually works"。
- **用词跟商品页对齐**：写 "H13 HEPA media"、"HEPA-type" 时沿用 `productOverview.js` / 商品页的措辞，不要发明"医用级 HEPA""99.99% 除菌"这类说法。
- **别重复已有文章**：动笔前先 `grep` 一下现有 13 篇的 H2（现在已经有 CADR、H13、湿度阈值、霉菌清洁），重叠就换角度或做内链。

---

## 八、排期与季节日历

### 8.1 三个月执行表

| 时间 | 交付 | 备注 |
|---|---|---|
| 第 1 周 | #1 抓沙发 — **已完成（2026-11-06 上线）** | 已回填 1 篇老文内链；抓板两个商品页已自动出现「相关阅读」 |
| 第 2 周 | #2 猫砂盆异味 | 与 #1 互相内链，共吃"养猫家庭"人群 |
| 第 3 周 | #3 带猫坐车 | 圣诞/冬季出行 + 车载床 |
| 第 4 周 | #4 猫不睡窝 | **必须 11 月内上线**，吃入冬 + 圣诞送礼两个波 |
| 第 5 周 | #5 猫推车 | 春季前铺好，3–5 月回暖时开始吃量 |
| 第 6 周 | #6 室内猫玩耍 | 可与 #1 复用素材 |
| 第 7 周 | #7 净化器摆放 | 顺手把 `how-to-choose` 那篇的内链补上 |
| 第 8 周 | #8 干衣除湿 | 冬季潮湿地区（英/欧/美东北）当季 |
| 第 9 周 | #9 理想湿度 | 春季前完成，赶回南天/梅雨 |
| 第 10 周 | #10 浴室霉菌 | 同上 |
| 第 11 周 | #11 H13 vs H12 | 慢工，允许两周 |
| 第 12 周 | #12 B2B 供应商 | 同步发给现有/潜在客户，一举两得 |

### 8.2 季节日历（每年复用）

| 月份 | 该推什么 | 对应文章 |
|---|---|---|
| 11–12 | 猫窝、圣诞床、礼品 | #4 |
| 1–2 | 湿冷、结露、干衣、霉菌 | #8 #9 #10 |
| 3–5 | 过敏季、花粉、空气净化器 | #2 #7 #11 |
| 6–8 | 室内开空调、湿度、宠物中暑相关（不写医疗） | #9 #10 |
| 9–10 | 出行（推车）、换季整理 | #3 #5 #6 |

---

## 九、衡量指标与迭代

### 9.1 看什么

| 指标 | 位置 | 30 天 | 90 天 |
|---|---|---|---|
| 新文章被收录 | GSC → 网页 | 12/12 | 保持 100% |
| 每篇的主关键词排名 | GSC → 效果（按页面筛） | 进入前 50 | 2–5 篇进前 20 |
| C 端文章带来的商品页点击 | GSC → 效果（按页面 `/products/*` 筛）+ 站内 `RelatedProducts` | 有稳定点击 | 商品页自然流量较基线 +30% |
| 品牌+品类词（`Meower cat scratcher` 等） | GSC | 出现展现 | 进前 10 |
| B2B 询盘来源 | `info@meowerair.com` 邮件 + WhatsApp | 记录基线 | 至少 1 条来自自然搜索 |

### 9.2 迭代规则

- **每两周**：GSC 找"有展现、没点击"的页面 → 改 title / 首段（这两个改动的性价比最高）。
- **每月**：找"排名 11–20"的词 → 在对应文章里加一节 H2 或补 FAQ，不要新开一篇。
- **每季度**：按"是否进前 20 / 是否带来商品页点击"给 12 篇打分，末尾 2 篇进"待重写或合并"名单。
- **淘汰机制**：12 个月仍无展现的文章，合并进同主题更强的一篇，做 301 到那一篇；不要让死页面留在 sitemap 里。

---

## 十、红线与风险（和内容相关的运营风险）

| 风险 | 表现 | 处理 |
|---|---|---|
| 医疗/健康声明 | 写"去除过敏原所以治好过敏" | 统一改成"减少空气中的颗粒物"，并加"如有症状请咨询医生" |
| 参数虚标 | 文章里的 CADR / 除湿量和商品页不一致 | 只引用 `productOverview.js` 的值，写文章时对照一遍 |
| 关键词自我竞争 | CADR、H13、除湿机耗电被反复写 | 按第五节的分工表执行，发布前检查 H2 是否重复 |
| 死内链 | 指向 MW100 或已 301 的 `/about` | 只用 6.1 的 id 列表；`/about` 一律写 `/business` |
| 图片版权 | 从网上抓宠物图 | 只用 `public/images` 内已有素材，或供应商提供的原图 |
| AI 内容被识别 | 通篇正确但没有个人经验 | 每篇至少一处"具体到尺寸/天数/动作"的实操细节（现有商品页的写法就是模板） |
| 收录延迟 | 新文章只有列表页一个入口 | 按 6.4 第 6 步回填老文章内链 + 主动提交索引 |

---

## 附录 A：12 篇速查表

| # | slug | 主关键词 | 支柱 | 产品 | 优先级 |
|---|---|---|---|---|---|
| 1 | `how-to-stop-cat-scratching-furniture` | how to stop a cat from scratching furniture | A | woven-sisal-cat-scratcher, sisal-cat-scratcher | P0 |
| 2 | `cat-litter-box-smell` | cat litter box smell | C | mw200 | P0 |
| 3 | `traveling-with-a-cat-in-the-car` | traveling with a cat in the car | B | car-pet-seat, pet-stroller | P0 |
| 4 | `cat-wont-sleep-in-its-bed` | why won't my cat sleep in its bed | B | triangle-cat-bed, christmas-pet-bed | P0 |
| 5 | `cat-stroller` | cat stroller | B | pet-stroller, car-pet-seat | P1 |
| 6 | `indoor-cat-toys-and-play` | best cat toys for indoor cats | B | pom-pom-cat-toy, sisal-cat-scratcher | P1 |
| 7 | `where-to-place-an-air-purifier` | where to put an air purifier | C | mw200, commercial-air-purifier | P1 |
| 8 | `dehumidifier-for-drying-clothes` | dehumidifier for drying clothes | D | md002, md001 | P1 |
| 9 | `ideal-indoor-humidity` | ideal indoor humidity | D | md001, md002 | P2 |
| 10 | `how-to-stop-mold-in-bathroom` | how to stop mold in the bathroom | D | md001, md002 | P2 |
| 11 | `h13-vs-h12-hepa` | H13 vs H12 HEPA | C | mw200, commercial-air-purifier | P2 |
| 12 | `how-to-choose-an-air-purifier-manufacturer` | how to choose an air purifier manufacturer | E | commercial-air-purifier, commercial-dehumidifier | P2 |

---

## 附录 B：素材缺口（拍摄/制图清单）

| 文章 | 缺什么图 | 能不能先用现有图顶上 |
|---|---|---|
| #1 抓沙发 | 被抓坏的沙发角 + 抓板并置的对比图 | ✅ 已有实拍：`/images/blogs/cat-scratching-furniture/`（猫抓星空挂毯场景，封面已裁到猫头 + 四爪完整） |
| #3 带猫坐车 | 车内视角（后排固定 + 猫在床里） | 部分：`car-pet-seat/car-dog.webp` |
| #4 猫不睡窝 | 三种形态对比 | 可以：`triangle-cat-bed/form-*.webp` 已有三张 |
| #5 猫推车 | 提篮分离动作图 | 缺，需要补拍（关键卖点没有图） |
| #8 干衣除湿 | 室内晾衣 + 除湿机同框 | 缺，可用 `md002` 商品图 + 场景图拼接 |
| #9/#10 湿度霉菌 | 结露窗、霉斑墙（真实、不吓人） | 缺，站内暂无；建议用图库授权图（避免网图） |
| #12 B2B | 产线/验厂/包装图片 | 缺，建议从现有产品素材中挑选或补拍产线 |
