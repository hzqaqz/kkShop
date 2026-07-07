<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const SCROLL_FADE_DISTANCE = 120;

const activeMenu = ref(null);
const activeCategory = ref(null);
const scrollProgress = ref(0);

const menuPanels = {
  airPurifiers: {
    eyebrow: 'Air Purifier',
    title: 'Shop Air Purifiers',
    categories: [
      {
        id: 'home',
        label: '家用',
        links: [
          { label: 'MW100', to: { name: 'product-detail', params: { productId: 'mw100' } } },
          { label: 'MW200', to: { name: 'product-detail', params: { productId: 'mw200' } } },
        ],
      },
      { id: 'commercial', label: '商用', links: [] },
      { id: 'filter', label: '滤网', links: [] },
    ],
  },
  dehumidifier: {
    eyebrow: 'Dehumidifier',
    title: 'Shop Dehumidifiers',
    categories: [
      { id: 'home', label: '家用', links: [] },
      {
        id: 'commercial',
        label: '商用',
        links: [
          {
            label: 'Commercial Dehumidifier',
            to: { name: 'product-detail', params: { productId: 'commercial-dehumidifier' } },
          },
        ],
      },
    ],
  },
};

const navItems = [
  { label: 'Air Purifiers', menu: 'airPurifiers' },
  { label: 'Dehumidifier', menu: 'dehumidifier' },
  { label: 'Blogs' },
  { label: 'About Us' },
];

const activeMenuPanel = computed(() => (activeMenu.value ? menuPanels[activeMenu.value] : null));
const activeCategoryPanel = computed(() => {
  if (!activeMenuPanel.value) {
    return null;
  }

  return (
    activeMenuPanel.value.categories.find((category) => category.id === activeCategory.value) ??
    activeMenuPanel.value.categories[0]
  );
});

function openMenu(menu) {
  activeMenu.value = menu ?? null;
  activeCategory.value = activeMenuPanel.value?.categories[0]?.id ?? null;
}

function closeMenu() {
  activeMenu.value = null;
  activeCategory.value = null;
}

function selectCategory(categoryId) {
  activeCategory.value = categoryId;
}

function updateScrollProgress() {
  scrollProgress.value = Math.min(window.scrollY / SCROLL_FADE_DISTANCE, 1);
}

onMounted(() => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress);
});
</script>

<template>
  <header
    class="topbar"
    aria-label="kkShop navigation"
    :style="{ '--topbar-bg-alpha': scrollProgress }"
    @mouseleave="closeMenu"
  >
    <RouterLink class="brand" to="/" aria-label="kkShop home">
      <img class="brand-logo" src="/images/logo-meower.png" alt="Meower" />
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <div v-for="item in navItems" :key="item.label" class="nav-item">
        <button
          v-if="item.menu"
          class="nav-trigger"
          type="button"
          :aria-expanded="activeMenu === item.menu"
          :aria-label="`${item.label} products`"
          @focus="openMenu(item.menu)"
          @mouseenter="openMenu(item.menu)"
        >
          {{ item.label }}
        </button>
        <span v-else class="nav-label" @mouseenter="closeMenu">{{ item.label }}</span>
      </div>
    </nav>

    <Transition name="mega-menu">
      <div v-if="activeMenuPanel" class="mega-menu" role="region" :aria-label="activeMenuPanel.title">
        <div class="mega-menu-inner">
          <p class="mega-menu-eyebrow">{{ activeMenuPanel.eyebrow }}</p>
          <div class="mega-menu-content">
            <div class="mega-menu-categories" aria-label="Product categories">
              <button
                v-for="category in activeMenuPanel.categories"
                :key="category.id"
                class="mega-menu-category"
                :class="{ active: activeCategoryPanel?.id === category.id }"
                type="button"
                @focus="selectCategory(category.id)"
                @mouseenter="selectCategory(category.id)"
              >
                {{ category.label }}
              </button>
            </div>

            <div class="mega-menu-products">
              <h2>{{ activeCategoryPanel?.label }}</h2>
              <RouterLink
                v-for="link in activeCategoryPanel?.links"
                :key="link.label"
                class="mega-menu-link"
                :to="link.to"
                @click="closeMenu"
              >
                {{ link.label }}
              </RouterLink>
              <p v-if="!activeCategoryPanel?.links.length" class="mega-menu-empty">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
