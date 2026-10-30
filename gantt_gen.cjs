const fs = require('fs');

// ---------- 数据 ----------
const START_Y = 2026, START_M = 9, START_D = 19; // 2026-10-19 周一
function weekStartDate(w) {
  const d = new Date(Date.UTC(START_Y, START_M, START_D));
  d.setUTCDate(d.getUTCDate() + (w - 1) * 7);
  return d;
}
function fmt(d) { return d.toISOString().slice(0, 10); }

const PHASES = [
  { key: 'A', name: '调研与合规',     color: '#8E8E93' },
  { key: 'B', name: '产品与认证',     color: '#007AFF' },
  { key: 'C', name: '物流与直邮',     color: '#34C759' },
  { key: 'D', name: '主体与财税',     color: '#AF52DE' },
  { key: 'E', name: '平台与网站',     color: '#FF9500' },
  { key: 'F', name: '备货与上线',     color: '#FF3B30' },
  { key: 'G', name: '营销与上线',     color: '#0A84FF' },
  { key: 'H', name: '运营优化',       color: '#FFCC00' },
];

// p:phase  name  s:startWeek  d:durationWeeks  crit:关键路径
const TASKS = [
  { p:'A', name:'市场/竞品/季节调研', s:1, d:2 },
  { p:'A', name:'电气安全/SDoC要求确认', s:1, d:1 },
  { p:'A', name:'GST低值商品注册要求确认', s:1, d:1 },
  { p:'B', name:'确定净化器SKU与选型', s:2, d:1 },
  { p:'B', name:'电气安全认证/SDoC办理(长周期)', s:2, d:4, crit:true },
  { p:'B', name:'活性炭滤网MSDS+非危鉴定', s:2, d:2, crit:true },
  { p:'B', name:'包装优化+体积重压缩+英文标贴', s:3, d:3 },
  { p:'C', name:'空运专线小包比价(NZ)', s:3, d:2 },
  { p:'C', name:'跨境退货/售后政策设计', s:4, d:2 },
  { p:'C', name:'尾程/清关/GST代收确认', s:4, d:2 },
  { p:'D', name:'公司架构+IRD GST注册', s:2, d:3 },
  { p:'D', name:'收款账户与支付开通', s:3, d:2 },
  { p:'E', name:'渠道选型(独立站+本地渠道)', s:3, d:1 },
  { p:'E', name:'独立站搭建(英文站)', s:4, d:3 },
  { p:'E', name:'定价/运费/GST计税配置', s:5, d:2 },
  { p:'F', name:'首批下单生产', s:5, d:3, crit:true },
  { p:'F', name:'首批入国内仓+质检', s:8, d:1, crit:true },
  { p:'F', name:'直邮测试单(空运专线)', s:9, d:1, crit:true },
  { p:'G', name:'本地化内容(英文页/图片/视频)', s:6, d:3 },
  { p:'G', name:'广告预热(Google/Meta/Trade Me)', s:7, d:3 },
  { p:'G', name:'正式上线销售', s:10, d:1, crit:true },
  { p:'G', name:'客服/售后体系', s:9, d:2 },
  { p:'H', name:'数据复盘+补货计划', s:10, d:3 },
  { p:'H', name:'评价管理+复购营销', s:10, d:3 },
];

const MILESTONES = [
  { name:'非危鉴定通过', w:3 },
  { name:'认证完成', w:5 },
  { name:'首批入仓', w:8 },
  { name:'直邮测试', w:9 },
  { name:'正式上线', w:10 },
];

// ---------- 布局 ----------
const LEFT_W = 300;
const WEEK_W = 30;
const N_WEEKS = 12;
const RIGHT = 64;
const W = LEFT_W + N_WEEKS * WEEK_W + RIGHT;
const X0 = LEFT_W;
const TITLE_Y = 34, SUB_Y = 56, LEGEND_Y = 74, AXIS_Y = 102, TOP = 122;
const ROW_H = 26, PHASE_H = 30;

const rows = [];
for (const ph of PHASES) {
  rows.push({ type: 'phase', name: ph.name, key: ph.key });
  for (const t of TASKS.filter(x => x.p === ph.key)) {
    rows.push({ type: 'task', name: t.name, s: t.s, d: t.d, crit: !!t.crit, key: ph.key });
  }
}
let y = TOP;
const rowTop = {};
let idx = 0;
for (const r of rows) {
  rowTop[idx] = y;
  y += (r.type === 'phase' ? PHASE_H : ROW_H);
  idx++;
}
const CHART_BOTTOM = y + 8;
const MS_H = 52;
const MS_Y = CHART_BOTTOM + 6;
const H = MS_Y + MS_H + 20;

const phaseColor = Object.fromEntries(PHASES.map(p => [p.key, p.color]));
const xForWeek = w => X0 + (w - 1) * WEEK_W;
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

let svg = [];
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="PingFang SC, Helvetica Neue, Arial, sans-serif">`);
svg.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);

svg.push(`<text x="24" y="${TITLE_Y}" font-size="22" font-weight="700" fill="#111">新西兰 C 端市场启动甘特图（空气净化器 · 国内仓直邮）</text>`);
svg.push(`<text x="24" y="${SUB_Y}" font-size="13" fill="#666">项目起点 2026-10-19（周一）· 共 12 周 · 仅空气净化器 · 国内仓单件直邮（空运专线小包）</text>`);

let lx = 24;
for (const p of PHASES) {
  svg.push(`<rect x="${lx}" y="${LEGEND_Y - 11}" width="12" height="12" rx="2" fill="${p.color}"/>`);
  svg.push(`<text x="${lx + 16}" y="${LEGEND_Y}" font-size="12" fill="#333">${esc(p.name)}</text>`);
  lx += 16 + 12 + p.name.length * 13 + 14;
}

for (let w = 1; w <= N_WEEKS; w++) {
  const x = xForWeek(w);
  const cx = x + WEEK_W / 2;
  svg.push(`<line x1="${x}" y1="${AXIS_Y + 6}" x2="${x}" y2="${MS_Y}" stroke="${w % 4 === 1 ? '#d0d0d0' : '#ededed'}" stroke-width="1"/>`);
  svg.push(`<text x="${cx}" y="${AXIS_Y}" font-size="11" fill="#999" text-anchor="middle">W${w}</text>`);
  if ([1, 5, 9, 12].includes(w)) {
    const d = weekStartDate(w);
    svg.push(`<text x="${cx}" y="${AXIS_Y + 16}" font-size="9" fill="#bbb" text-anchor="middle">${d.toISOString().slice(5,10)}</text>`);
  }
}
svg.push(`<line x1="${X0}" y1="${AXIS_Y + 6}" x2="${X0}" y2="${MS_Y}" stroke="#bbb" stroke-width="1"/>`);

let ri = 0;
for (const r of rows) {
  const ty = rowTop[ri];
  if (r.type === 'phase') {
    svg.push(`<rect x="${X0}" y="${ty}" width="${W - X0 - RIGHT + 40}" height="${PHASE_H}" fill="#f5f5f7"/>`);
    svg.push(`<text x="24" y="${ty + 19}" font-size="13" font-weight="600" fill="#333">${esc(r.name)}</text>`);
  } else {
    const x = xForWeek(r.s);
    const bw = r.d * WEEK_W - 4;
    const by = ty + 5;
    const col = phaseColor[r.key];
    svg.push(`<rect x="${x}" y="${by}" width="${bw}" height="16" rx="3" fill="${col}" stroke="${r.crit ? '#000' : col}" stroke-width="${r.crit ? 1.4 : 0}"/>`);
    svg.push(`<text x="${x + bw + 6}" y="${by + 12}" font-size="11" fill="#666">W${r.s}–W${r.s + r.d - 1}</text>`);
    svg.push(`<text x="24" y="${ty + 17}" font-size="12.5" fill="#222">${esc(r.name)}${r.crit ? '  ★' : ''}</text>`);
  }
  ri++;
}

svg.push(`<rect x="${X0}" y="${MS_Y}" width="${W - X0 - RIGHT + 40}" height="${MS_H}" fill="#fffbe6"/>`);
svg.push(`<text x="24" y="${MS_Y + 20}" font-size="13" font-weight="600" fill="#b58900">里程碑</text>`);
for (const m of MILESTONES) {
  const cx = xForWeek(m.w) + WEEK_W / 2;
  const cy = MS_Y + 22;
  svg.push(`<path d="M ${cx} ${cy - 7} L ${cx + 7} ${cy} L ${cx} ${cy + 7} L ${cx - 7} ${cy} Z" fill="#b58900"/>`);
  svg.push(`<text x="${cx}" y="${MS_Y + 42}" font-size="10" fill="#8a6d00" text-anchor="middle">${esc(m.name)}</text>`);
}

svg.push(`<text x="24" y="${H - 8}" font-size="11" fill="#999">★ = 关键路径：非危鉴定 + SDoC 认证（两条硬门槛）→ 生产 → 入仓 → 直邮测试 → 上线，约 10 周 ≈ 2.5 个月</text>`);

svg.push(`</svg>`);
const svgText = svg.join('\n');
fs.writeFileSync('NZ市场启动甘特图.svg', svgText, 'utf8');

// ---------- CSV ----------
let csv = ['阶段,任务ID,任务,开始周,时长(周),开始日期,结束日期,关键路径,前置/说明'];
let ti = 0;
for (const t of TASKS) {
  ti++;
  const sd = weekStartDate(t.s);
  const ed = weekStartDate(t.s);
  ed.setUTCDate(ed.getUTCDate() + t.d * 7 - 1);
  const phName = PHASES.find(p => p.key === t.p).name;
  csv.push(`${phName},T${String(ti).padStart(2,'0')},${t.name},${t.s},${t.d},${fmt(sd)},${fmt(ed)},${t.crit ? '是' : ''},`);
}
fs.writeFileSync('NZ市场启动甘特图.csv', '\ufeff' + csv.join('\n'), 'utf8');

console.log('SVG bytes:', svgText.length, '| size', W + 'x' + H, '| tasks', TASKS.length);
