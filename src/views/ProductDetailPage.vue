<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import CeilingMountedDehumidifierPage from '../components/CeilingMountedDehumidifierPage.vue';
import CommercialDehumidifierPage from '../components/CommercialDehumidifierPage.vue';
import Md001DehumidifierPage from '../components/Md001DehumidifierPage.vue';
import Mw100ProductPage from '../components/Mw100ProductPage.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';

const route = useRoute();

const productDetails = {
  mw100: {
    label: 'MW100',
    title: 'MW100 Pet-Friendly Air Purifier',
    description:
      'The Meower MW100 pet-friendly air purifier reduces airborne fur, dander, dust and odors with HEPA filtration for calmer, cleaner cat-friendly homes.',
    image: '/images/products/list/mw100.png',
  },
  mw200: {
    label: 'MW200',
    title: 'MW200 Air Purifier with H13 HEPA',
    description:
      'The Meower MW200 air purifier combines 360° air intake, three-stage composite filtration and H13 HEPA media with a 400 m³/h CADR for rooms of 20–40 m².',
    image: '/images/products/list/mw200.png',
  },
  'commercial-dehumidifier': {
    label: 'Commercial Dehumidifier',
    page: 'commercial',
    title: 'Commercial Dehumidifier',
    description:
      'Meower commercial dehumidifiers provide reliable moisture management for warehouses, basements, garages and larger professional spaces.',
    image: '/images/products/list/commercial-dehumidifier.png',
  },
  'ceiling-mounted-dehumidifier': {
    label: 'Ceiling-Mounted Dehumidifier',
    page: 'ceiling-mounted',
    title: 'Ceiling-Mounted Dehumidifier',
    description:
      'Meower ceiling-mounted dehumidifiers save floor space while keeping factories, facilities and commercial spaces dry and comfortable.',
    image: '/images/products/md0002/ceiling-mounted-dehumidifier-white.png',
  },
  md001: {
    label: 'MD001 Dehumidifier',
    page: 'md001',
    title: 'MD001 Home Dehumidifier',
    description:
      'The Meower MD001 home dehumidifier keeps bedrooms, living rooms, bathrooms and closets comfortably dry for everyday indoor living.',
    image: '/images/products/md001/product-white.png',
  },
};

const currentProduct = computed(() => productDetails[route.params.productId] ?? null);

const currentMeta = computed(() => {
  const product = currentProduct.value;
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested Meower product could not be found.',
      path: route.path,
    };
  }
  return {
    title: product.title,
    description: product.description,
    path: route.path,
    image: `https://meowerair.com${product.image}`,
    type: 'website',
  };
});

useSeo(currentMeta.value);

const productJsonLd = computed(() => {
  const product = currentProduct.value;
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: `https://meowerair.com${product.image}`,
    brand: { '@type': 'Brand', name: 'Meower' },
    url: `https://meowerair.com${route.path}`,
  };
});

useHead(() => ({
  script: productJsonLd.value
    ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(productJsonLd.value) }]
    : [],
}));
</script>

<template>
  <main
    class="site-shell product-page"
    :class="{ 'commercial-product-page': currentProduct?.page === 'commercial' }"
  >
    <SiteHeader />

    <CommercialDehumidifierPage v-if="currentProduct?.page === 'commercial'" />

    <CeilingMountedDehumidifierPage v-else-if="currentProduct?.page === 'ceiling-mounted'" />

    <Md001DehumidifierPage v-else-if="currentProduct?.page === 'md001'" />

    <Mw100ProductPage
      v-else-if="currentProduct"
      :product-id="route.params.productId"
    />

    <section v-else class="product-empty" aria-label="Product not found">
      <h1>Product not found</h1>
      <RouterLink to="/">Back to home</RouterLink>
    </section>
  </main>
</template>
