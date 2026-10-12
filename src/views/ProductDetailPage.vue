<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CeilingMountedDehumidifierPage from '../components/CeilingMountedDehumidifierPage.vue';
import CommercialDehumidifierPage from '../components/CommercialDehumidifierPage.vue';
import Md001DehumidifierPage from '../components/Md001DehumidifierPage.vue';
import Mw100ProductPage from '../components/Mw100ProductPage.vue';
import ProductFaq from '../components/ProductFaq.vue';
import ProductOverview from '../components/ProductOverview.vue';
import RelatedArticles from '../components/RelatedArticles.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { getArticlesForProduct } from '../data/contentLinks';
import { getProduct, getRelatedProducts } from '../data/products';

const route = useRoute();

/** Each product page supplies its own palette to the SEO content zone. */
const THEME_CLASSES = {
  mw100: 'post-theme-cream',
  mw200: 'post-theme-cream',
  md001: 'post-theme-warm',
  'commercial-dehumidifier': 'post-theme-teal',
  'ceiling-mounted-dehumidifier': 'post-theme-green',
};

const themeClass = computed(() => THEME_CLASSES[route.params.productId] ?? '');

const currentProduct = computed(() => getProduct(route.params.productId));
const relatedProducts = computed(() => getRelatedProducts(route.params.productId, 3));
const relatedArticles = computed(() => getArticlesForProduct(route.params.productId, 3));

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: currentProduct.value?.label ?? 'Product', to: route.path },
]);

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
    image: `https://meowerair.com${product.ogImage ?? product.image}`,
    type: 'website',
  };
});

useSeo(currentMeta.value);
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

    <div v-if="currentProduct" class="product-post-content" :class="themeClass">
      <SiteBreadcrumbs :items="breadcrumbs" />

      <ProductOverview :product-id="route.params.productId" />

      <ProductFaq :product-id="route.params.productId" />

      <RelatedArticles
        :articles="relatedArticles"
        eyebrow="Guides and inspiration"
        title="Related reading"
      />

      <RelatedProducts :products="relatedProducts" />
    </div>
  </main>
</template>
