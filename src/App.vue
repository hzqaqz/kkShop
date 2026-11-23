<script setup>
import { onMounted } from 'vue';
import CartDrawer from './components/CartDrawer.vue';
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
</template>
