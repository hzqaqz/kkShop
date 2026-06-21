<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const homeHashPrefix = computed(() => (route.path === '/' ? '' : '/'));

const navItems = [
  { label: 'Air Purifiers', hash: '#air-purifiers' },
  { label: 'Dehumidifier', hash: '#dehumidifier' },
  { label: 'Blogs', hash: '#blogs' },
  { label: 'About Us', hash: '#about' },
];

function sectionHref(hash) {
  return `${homeHashPrefix.value}${hash}`;
}
</script>

<template>
  <header class="topbar" aria-label="kkShop navigation">
    <RouterLink class="brand" to="/" aria-label="kkShop home">
      <img class="brand-logo" src="/images/logo-meower.png" alt="Meower" />
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <a v-for="item in navItems" :key="item.hash" :href="sectionHref(item.hash)">
        {{ item.label }}
      </a>
    </nav>
  </header>
</template>
