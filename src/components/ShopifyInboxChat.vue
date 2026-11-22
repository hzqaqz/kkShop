<script setup>
import { onMounted } from 'vue';

/**
 * Shopify Inbox chat launcher for this headless storefront.
 *
 * Why this is not the official switch: Inbox's on/off lives in a Liquid theme's
 * "Online store chat" app embed, and this site is a pre-rendered Vue storefront
 * talking to Shopify over the Storefront API — there is no theme to embed into.
 * So the app block Shopify generates for the theme is reproduced here by hand.
 *
 * That block (taken from the store's own theme preview) is three pieces:
 *
 *   1. a config <script id="shopify-chat-app-embed-data" type="application/json">
 *   2. a few --shopify-chat-* CSS variables for colours/position
 *   3. <script type="module" src="https://cdn.shopify.com/storefront/web-components/chat.js">
 *
 * The current web component has no `shop_id` in its markup any more: it reads
 * the shop from Shopify's own analytics runtime —
 *
 *   window.ShopifyAnalytics.lib.trekkie.defaultAttributes
 *     → { shopId, uniqToken, visitToken }
 *
 * — which a Liquid storefront loads for free and a headless one does not. The
 * shim below supplies exactly those three values, using `shopId` = the store's
 * numeric id and locally generated ids for the per-browser / per-session tokens.
 * This is the part Shopify does not document: if Inbox ever changes how it
 * authenticates, this file is what needs updating (or the widget needs replacing
 * with a third-party chat).
 *
 * Opt-in: nothing is injected unless `VITE_SHOPIFY_INBOX_SHOP_ID` is set.
 * Note: Shopify's bot protection blocks localhost, so verify on a real domain.
 */
const SHOP_ID = (import.meta.env.VITE_SHOPIFY_INBOX_SHOP_ID || '').trim();

const CHAT_SCRIPT = 'https://cdn.shopify.com/storefront/web-components/chat.js';
const DATA_SCRIPT_ID = 'shopify-chat-app-embed-data';
const ANALYTICS_KEY = 'meower-inbox-browser-id';
const SESSION_KEY = 'meower-inbox-visit-id';
const MARKER = 'data-meower-inbox';

/** `crypto.randomUUID` needs a secure context, so keep a fallback for http. */
function randomId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `meower-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Stable per-browser id, like trekkie's `uniqToken`. */
function browserToken() {
  try {
    const existing = window.localStorage.getItem(ANALYTICS_KEY);
    if (existing) {
      return existing;
    }
    const fresh = randomId();
    window.localStorage.setItem(ANALYTICS_KEY, fresh);
    return fresh;
  } catch {
    return randomId();
  }
}

/** Per-session id, like trekkie's `visitToken`. */
function visitToken() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) {
      return existing;
    }
    const fresh = randomId();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return randomId();
  }
}

/**
 * Two gates have to be satisfied before chat.js renders anything:
 *
 *   1. `window.Shopify.customerPrivacy.analyticsProcessingAllowed()` must exist
 *      and report at least one allowed consent type — on a Liquid storefront
 *      Shopify's privacy banner provides this, and without it the widget waits
 *      forever ("status: waiting", no launcher, no console error).
 *   2. `window.ShopifyAnalytics.lib.trekkie.defaultAttributes` must carry
 *      `shopId` + `uniqToken`.
 *
 * This site uses no cookie banner (analytics are cookieless), so consent is
 * reported as allowed. If a consent tool is ever added, point these three
 * callbacks at it instead of returning `true`.
 */
function installPrivacyShim() {
  const existing = window.Shopify ?? {};
  window.Shopify = {
    ...existing,
    shop: 'meowerair.myshopify.com',
    customerPrivacy: {
      ...(existing.customerPrivacy ?? {}),
      analyticsProcessingAllowed: () => true,
      marketingAllowed: () => true,
      preferencesProcessingAllowed: () => true,
      saleOfDataAllowed: () => false,
    },
  };
}

/**
 * The analytics shape chat.js waits for. Without it the widget stays in its
 * "waiting" state and never renders a launcher.
 */
function installAnalyticsShim() {
  const existing = window.ShopifyAnalytics ?? {};
  const lib = existing.lib ?? {};
  const trekkie = lib.trekkie ?? {};
  const defaultAttributes = trekkie.defaultAttributes ?? {};

  window.ShopifyAnalytics = {
    ...existing,
    lib: {
      ...lib,
      trekkie: {
        ...trekkie,
        defaultAttributes: {
          ...defaultAttributes,
          shopId: SHOP_ID,
          uniqToken: browserToken(),
          visitToken: visitToken(),
        },
      },
    },
  };
}

/** Page context shown in the chat's empty state. */
function pageContext() {
  const path = window.location.pathname;
  const productMatch = path.match(/^\/products\/([^/]+)/);
  return {
    pagePath: path,
    pageType: productMatch ? 'product' : path === '/' ? 'index' : 'page',
    title: document.title,
    searchTerms: null,
    searchPerformed: false,
    available: true,
    priceMin: null,
    priceMax: null,
    products: [],
  };
}

function injectChat() {
  if (document.getElementById(DATA_SCRIPT_ID)) {
    return;
  }

  /* 1. Config, mirroring the theme's app block: white panel, ink accent,
        bottom-right launcher, greeting written in the Inbox app. */
  const data = document.createElement('script');
  data.id = DATA_SCRIPT_ID;
  data.type = 'application/json';
  data.setAttribute(MARKER, '');
  data.textContent = JSON.stringify({
    settings: {
      invertActivatorColors: true,
      greetingMessage: 'Hi! Ask us anything about sizes, stock or delivery.',
      showFeaturedProducts: true,
      horizontalPosition: 'bottom_right',
      icon: 'chat_bubble',
      buttonLabel: 'Chat',
    },
    floatingInputContext: pageContext(),
  });
  document.body.appendChild(data);

  /* 2. Theme variables the component reads (same values as the Shopify theme). */
  const styles = document.createElement('style');
  styles.setAttribute(MARKER, '');
  styles.textContent = `
    shopify-chat:defined:empty { display: grid; }
    :root {
      --shopify-chat-bg-color: #ffffff;
      --shopify-chat-text-color: #314e53;
      --shopify-chat-accent-bg-color: #314e53;
      --shopify-chat-accent-text-color: #ffffff;
      --shopify-chat-activator-offset: 20px;
      --shopify-chat-activator-font-size: 16px;
      --shopify-chat-border-radius: 16px;
    }
  `;
  document.head.appendChild(styles);

  /* 3. The component itself. */
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = CHAT_SCRIPT;
  script.setAttribute(MARKER, '');
  document.body.appendChild(script);
}

onMounted(() => {
  if (typeof window === 'undefined' || !SHOP_ID) {
    return;
  }

  installPrivacyShim();
  installAnalyticsShim();

  /* The Inbox runtime expects to own the page's load cycle; injecting after
     `load` keeps it from being re-initialised mid-flight. */
  if (document.readyState === 'complete') {
    injectChat();
    return;
  }
  window.addEventListener('load', injectChat, { once: true });
});
</script>

<template>
  <!--
    Renders nothing: the launcher is a <shopify-chat> web component appended by
    Shopify's chat.js, styled by the variables injected above.
  -->
</template>
