<script setup>
/**
 * `/cart`（以及 `/checkout`）：把静态站接不住的那一步交给 Shopify。
 *
 * 为什么需要这个页面：
 * 无头店的购物车和结账都在 Shopify 侧，真实结账地址是
 * `https://<store>.myshopify.com/cart/c/<token>` —— token 每个购物车都不同，
 * 不可能预先写成一个固定 URL。而 Google Merchant Center 的
 * 「Business info → Checkout」要求填一个**能被自动检测的结账入口**，
 * 之前填的 `https://meowerair.com/cart/{id}:1` 在这个站上根本不存在（404）。
 *
 * 所以这里提供一个稳定的同域入口 `https://meowerair.com/cart`：
 * 读取 localStorage 里保存的购物车 → 取 Shopify 返回的 `checkoutUrl`
 * → 浏览器直接跳过去。对 Google 是一个可用的 cart URL，对用户是一个
 * 可以分享/直接敲的购物车链接。
 */
import { onMounted, ref } from 'vue';
import { useHead } from '@unhead/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useCart } from '../composables/useCart';
import { useSeo } from '../composables/useSeo';
import { track } from '../composables/useAnalytics';

const { initCart, checkoutUrl, count } = useCart();

/** idle → redirecting | empty | error */
const state = ref('idle');

useSeo({
  // 不要自带 “| Meower”：useSeo 会给不以品牌开头的标题补上后缀。
  title: 'Your Cart',
  description: 'Continue to checkout.',
  path: '/cart',
});

// 这个页面不该出现在搜索结果里：它要么重定向，要么是个空状态。
useHead({ meta: [{ name: 'robots', content: 'noindex,follow' }] });

onMounted(async () => {
  try {
    await initCart();
  } catch {
    state.value = 'error';
    return;
  }

  if (checkoutUrl.value) {
    state.value = 'redirecting';
    // 跳走之前上报：这是本站能观测到的最后一步，再往后就交给 Shopify 了。
    // 所以「加购 → 结账跳转 → Shopify 订单」这条漏斗里，本站负责前两段。
    track('begin_checkout', { items: count.value });
    // `replace` 而不是 `assign`：不要把这个中转页留在浏览器历史里。
    window.location.replace(checkoutUrl.value);
    return;
  }

  state.value = count.value > 0 ? 'error' : 'empty';
});
</script>

<template>
  <main class="site-shell cart-redirect">
    <SiteHeader />

    <section class="cart-redirect__panel">
      <template v-if="state === 'redirecting' || state === 'idle'">
        <p class="cart-redirect__eyebrow">Checkout</p>
        <h1>Taking you to checkout…</h1>
        <p class="cart-redirect__text">
          If nothing happens in a few seconds,
          <a :href="checkoutUrl || '/products'">continue here</a>.
        </p>
      </template>

      <template v-else-if="state === 'empty'">
        <p class="cart-redirect__eyebrow">Your cart</p>
        <h1>Your cart is empty</h1>
        <p class="cart-redirect__text">Add something you like and the checkout link will work again.</p>
        <RouterLink class="cart-redirect__cta" :to="{ name: 'products' }">Browse products</RouterLink>
      </template>

      <template v-else>
        <p class="cart-redirect__eyebrow">Checkout</p>
        <h1>We could not load your cart</h1>
        <p class="cart-redirect__text">
          Please try again, or email
          <a href="mailto:info@meowerair.com">info@meowerair.com</a> and we will sort it out.
        </p>
        <RouterLink class="cart-redirect__cta" :to="{ name: 'products' }">Back to products</RouterLink>
      </template>
    </section>
  </main>
</template>

<style scoped>
.cart-redirect { min-height: 60vh; background: #fff; color: #202222; }
.cart-redirect__panel {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(150px, 16vw, 220px) 28px clamp(70px, 9vw, 120px);
}
.cart-redirect__eyebrow {
  margin: 0 0 12px;
  color: #345258;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.cart-redirect__panel h1 {
  margin: 0 0 16px;
  color: #314e53;
  font-size: clamp(32px, 4vw, 54px);
  font-weight: 600;
  letter-spacing: -.04em;
  line-height: 1.02;
}
.cart-redirect__text { margin: 0 0 24px; color: #40595e; font-size: 17px; line-height: 1.6; }
.cart-redirect__text a { color: #2f6d78; text-decoration: underline; text-underline-offset: 2px; }
.cart-redirect__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 26px;
  border-radius: 999px;
  background: #334c51;
  color: #fef5ed;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}
.cart-redirect__cta:hover { background: #5a7c85; }
</style>
