/**
 * Google Analytics 4 —— 站点侧（meowerair.com）。
 *
 * 为什么站点上必须装它，光在 Shopify 结账页装不够：
 *
 * 1. Google Ads 的转化来源只有三种（Ads 自己的标签、GA4 导入、Firebase/离线导入）。
 *    Plausible 不在其中，所以「广告能不能学到东西」取决于 GA4 有没有数据。
 * 2. 结账在 `meowerair.myshopify.com`，是另一个域。要在那边把订单算到同一个人头上，
 *    必须把 GA 的 client_id 交过去 —— 见下面的 `withGaClientId`。
 *
 * client_id 怎么交：本站的结账跳转是 `window.location.assign(checkoutUrl)`
 * （CartDrawer、CartRedirectPage），不是点链接，所以 gtag 的自动跨域装饰不会跑。
 * 我们改为在 URL 上追加 `gacid=<client_id>`，Shopify 侧的「客户事件」自定义像素
 * 读它作为 purchase 的 client_id。已实测：Shopify 的
 * `/cart/c/<token>` → `/checkouts/...` 跳转链会保留自定义查询参数。
 *
 * 合规：欧盟/英国/瑞士走 Consent Mode 默认拒绝（不种 cookie、只发无标识 ping），
 * 因此**不需要 cookie 弹窗**；其他地区默认允许。政策文本见 legalContent.js 的
 * `analyticsNotice`。注意：默认拒绝的地区拿不到 client_id，那些订单在 GA4 里
 * 只能记为无归因会话 —— 当前只投美国，可以接受。
 */

const GA4_ID = String(import.meta.env.VITE_GA4_ID || 'G-6GE07B3EPL').trim();

/** 需要先征得同意再种 cookie 的地区：EEA + 英国 + 瑞士。 */
const CONSENT_REQUIRED_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

let started = false;
let lastPagePath = null;
let cachedClientId = null;

/** vite-ssg 会在 Node 里预渲染，所以这里的判断不能少。 */
function shouldRun() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (!GA4_ID) return false;
  const host = window.location.hostname;
  // 本地开发不上报，避免污染 GA 数据（Plausible 也是同样的行为）。
  return host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('.local');
}

function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** 从 `_ga` cookie 读 client_id：`GA1.1.123456789.1667890123` → `123456789.1667890123`。 */
function clientIdFromCookie() {
  try {
    const hit = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith('_ga='));
    if (!hit) return null;
    const value = hit.slice('_ga='.length);
    const parts = value.split('.');
    return parts.length >= 4 ? parts.slice(2).join('.') : null;
  } catch {
    return null;
  }
}

function sendPageView(path) {
  if (path === lastPagePath) return;
  lastPagePath = path;
  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * 在应用启动时调用一次（`main.js` 的 ViteSSG 钩子里）。
 * 只接管 page_view：加购/结账这类站内事件仍走 `useAnalytics.js`（Plausible），
 * 两套统计并存、互不干扰，数字不需要对齐。
 */
export function initGoogleAnalytics(router) {
  if (started || !shouldRun()) return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  // Consent Mode：先声明「这些地区默认拒绝」，再声明其他地区默认允许。
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: CONSENT_REQUIRED_REGIONS,
    wait_for_update: 500,
  });
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  // 关掉自动 page_view：SPA 换页时 gtag 自己看不见，这里统一手动发，避免首屏算两次。
  gtag('config', GA4_ID, { send_page_view: false });

  // 首屏单独发一次（afterEach 注册时首跳可能已经发生），再接管后续跳转。
  sendPageView(router.currentRoute.value.fullPath);
  router.afterEach((to) => sendPageView(to.fullPath));
}

/**
 * 取当前访客的 GA client_id，交给 `withGaClientId` 拼到结账链接上。
 * 800ms 后仍拿不到就退回 cookie（或 null），不能让「去结账」按钮卡住。
 */
export function getGaClientId() {
  if (!shouldRun()) return Promise.resolve(null);
  if (cachedClientId) return Promise.resolve(cachedClientId);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (id) => {
      if (settled) return;
      settled = true;
      if (id) cachedClientId = id;
      resolve(id || null);
    };

    setTimeout(() => finish(clientIdFromCookie()), 800);

    try {
      window.gtag('get', GA4_ID, 'client_id', (id) => finish(id || clientIdFromCookie()));
    } catch {
      finish(clientIdFromCookie());
    }
  });
}

/**
 * 给结账链接追加 `gacid=<client_id>`。
 * 拿不到 client_id 时原样返回 —— 宁可少一次归因，也不能让结账失败。
 */
export async function withGaClientId(url) {
  if (!url) return url;
  const clientId = await getGaClientId();
  if (!clientId) return url;
  try {
    const target = new URL(url);
    target.searchParams.set('gacid', clientId);
    return target.toString();
  } catch {
    return url;
  }
}
