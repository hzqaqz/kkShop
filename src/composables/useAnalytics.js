/**
 * 轻量埋点（默认关闭，由构建期环境变量开启）。
 *
 * 为什么不直接装 GA4：
 * 隐私政策里写着「本网站不使用广告 cookie」。GA4 会种 cookie，等于要同步
 * 加 cookie 同意弹窗，还会把欧盟/英国的流量判成「未同意」直接丢失。
 *
 * 这里接的是无 cookie 的方案（Plausible / Umami）：不写 cookie、不收集
 * 个人数据，因此不需要同意弹窗，政策原文也不用改口径。
 *
 * 开启方式（Cloudflare Pages → Settings → Environment variables，然后重新部署）：
 *   VITE_ANALYTICS_PROVIDER=plausible
 *   VITE_PLAUSIBLE_DOMAIN=meowerair.com
 * 自建 Plausible 或换成 Umami：
 *   VITE_PLAUSIBLE_SCRIPT=https://stats.example.com/js/script.js
 *   VITE_ANALYTICS_PROVIDER=umami
 *   VITE_UMAMI_SRC=https://cloud.umami.is/script.js
 *   VITE_UMAMI_WEBSITE_ID=xxxxxxxx
 *
 * 注意：`purchase` 事件不在前端上报 —— 结账在 myshopify.com 的独立域名上，
 * 本站在那一步既拿不到也不该拿数据。订单以 Shopify 后台为准，按天对账。
 */

const PROVIDER = String(import.meta.env.VITE_ANALYTICS_PROVIDER || 'none')
  .trim()
  .toLowerCase();
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'meowerair.com';
const PLAUSIBLE_SCRIPT =
  import.meta.env.VITE_PLAUSIBLE_SCRIPT || 'https://plausible.io/js/script.js';
const UMAMI_SRC = import.meta.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js';
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID || '';

let scriptInjected = false;

function enabled() {
  if (PROVIDER === 'plausible') return true;
  if (PROVIDER === 'umami') return Boolean(UMAMI_WEBSITE_ID);
  return false;
}

function ensureScript() {
  if (scriptInjected || typeof document === 'undefined') return;
  scriptInjected = true;

  const script = document.createElement('script');
  script.defer = true;
  if (PROVIDER === 'plausible') {
    script.src = PLAUSIBLE_SCRIPT;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
  } else {
    script.src = UMAMI_SRC;
    script.dataset.websiteId = UMAMI_WEBSITE_ID;
  }
  document.head.appendChild(script);
}

/**
 * Plausible 官方推荐的排队写法：在 script.js 下载完成之前调用的事件
 * 会进 `plausible.q`，脚本加载后回放，不会丢首屏那几个事件。
 */
function ensureQueue() {
  if (PROVIDER !== 'plausible' || typeof window === 'undefined') return;
  window.plausible =
    window.plausible ||
    function queuePlausible() {
      // eslint-disable-next-line prefer-rest-params
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
}

/**
 * 上报一个自定义事件。未配置 provider 时是彻底的 no-op，
 * 所以本地开发和 CI 构建不会冒出任何请求。
 */
export function track(name, props = {}) {
  if (typeof window === 'undefined' || !enabled()) return;
  ensureQueue();
  ensureScript();

  if (PROVIDER === 'plausible') {
    window.plausible(name, { props });
    return;
  }
  window.umami?.track?.(name, props);
}

/**
 * 在应用启动时调用一次。注意 vite-ssg 会在 Node 里预渲染，所以这里必须
 * 严格判断浏览器环境，否则构建期会因为 `window` 未定义直接挂掉。
 */
export function initAnalytics(router) {
  if (typeof window === 'undefined' || !enabled()) return;

  ensureQueue();
  ensureScript();

  // 页面级 pageview 由统计脚本自己接管（两者都监听 history 变化），
  // 这里只补电商语义的事件。
  router.afterEach((to) => {
    const product = to.path.match(/^\/products\/([^/]+)\/?$/);
    if (product) {
      track('view_item', { item_id: product[1] });
    }
  });
}
