<script setup>
import { onMounted } from 'vue';
import CartDrawer from './components/CartDrawer.vue';
import ShopifyInboxChat from './components/ShopifyInboxChat.vue';
import SiteFooter from './components/SiteFooter.vue';
import { useCart } from './composables/useCart';

// Restore any cart saved in localStorage once the app hydrates in the browser.
const { initCart } = useCart();
onMounted(initCart);
</script>

<template>
  <RouterView />
  <SiteFooter />
  <CartDrawer />
  <!-- Shopify Inbox chat launcher; inert unless VITE_SHOPIFY_INBOX_SHOP_ID is set. -->
  <ShopifyInboxChat />
</template>
