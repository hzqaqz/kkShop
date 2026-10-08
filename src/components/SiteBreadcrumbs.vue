<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';

const props = defineProps({
  /** [{ label, to }] — `to` is a router path or a route location object. */
  items: {
    type: Array,
    required: true,
  },
});

const SITE_URL = 'https://meowerair.com';

function toPath(to) {
  if (!to) return null;
  if (typeof to === 'string') return to;
  if (to.path) return to.path;
  if (to.name === 'home') return '/';
  if (to.name === 'products') return '/products';
  if (to.name === 'blogs') return '/blogs';
  if (to.name === 'about') return '/about';
  if (to.name === 'product-detail') return `/products/${to.params?.productId ?? ''}`;
  if (to.name === 'blog-detail') return `/blogs/${to.params?.slug ?? ''}`;
  return null;
}

const crumbs = computed(() =>
  props.items.map((item) => ({ label: item.label, path: toPath(item.to) })),
);

const breadcrumbJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.value.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.label,
    ...(crumb.path ? { item: `${SITE_URL}${crumb.path}` } : {}),
  })),
}));

useHead(() => ({
  script: [
    {
      key: 'breadcrumb-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd.value),
    },
  ],
}));
</script>

<template>
  <nav class="site-breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, index) in crumbs" :key="crumb.label">
        <RouterLink v-if="crumb.path && index < crumbs.length - 1" :to="crumb.path">
          {{ crumb.label }}
        </RouterLink>
        <span v-else aria-current="page">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>
