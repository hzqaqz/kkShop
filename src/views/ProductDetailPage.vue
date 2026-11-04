<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import CarPetSeatPage from '../components/CarPetSeatPage.vue';
import CatScratcherFramePage from '../components/CatScratcherFramePage.vue';
import CatToyProductPage from '../components/CatToyProductPage.vue';
import CeilingMountedDehumidifierPage from '../components/CeilingMountedDehumidifierPage.vue';
import CommercialAirPurifierPage from '../components/CommercialAirPurifierPage.vue';
import CommercialDehumidifierPage from '../components/CommercialDehumidifierPage.vue';
import Md001DehumidifierPage from '../components/Md001DehumidifierPage.vue';
import Md002DehumidifierPage from '../components/Md002DehumidifierPage.vue';
import Mw100ProductPage from '../components/Mw100ProductPage.vue';
import Mw200AirPurifierPage from '../components/Mw200AirPurifierPage.vue';
import PetBedProductPage from '../components/PetBedProductPage.vue';
import PetStrollerPage from '../components/PetStrollerPage.vue';
import SisalCatScratcherPage from '../components/SisalCatScratcherPage.vue';
import TriangleCatBedPage from '../components/TriangleCatBedPage.vue';
import InquiryBar from '../components/InquiryBar.vue';
import ProductBuyBar from '../components/ProductBuyBar.vue';
import ProductFaq from '../components/ProductFaq.vue';
import ProductOverview from '../components/ProductOverview.vue';
import RelatedArticles from '../components/RelatedArticles.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { getArticlesForProduct } from '../data/contentLinks';
import { getProduct, getRelatedProducts } from '../data/products';
import { isShopifyConfigured } from '../composables/useShopify';

const route = useRoute();

/** Each product page supplies its own palette to the SEO content zone. */
const THEME_CLASSES = {
  // The MW pages share MD001's palette, so the SEO zone (overview, FAQ, related
  // cards) uses the same warm theme instead of the old cream/brown one.
  mw100: 'post-theme-warm',
  mw200: 'post-theme-warm',
  md001: 'post-theme-warm',
  md002: 'post-theme-warm',
  'commercial-air-purifier': 'post-theme-teal',
  'commercial-dehumidifier': 'post-theme-teal',
  'ceiling-mounted-dehumidifier': 'post-theme-green',
  'christmas-pet-bed': 'post-theme-warm',
  'pom-pom-cat-toy': 'post-theme-warm',
  'car-pet-seat': 'post-theme-warm',
  'cat-scratcher-frame': 'post-theme-warm',
  'sisal-cat-scratcher': 'post-theme-warm',
  'triangle-cat-bed': 'post-theme-warm',
  'pet-stroller': 'post-theme-warm',
};

const themeClass = computed(() => THEME_CLASSES[route.params.productId] ?? '');

const currentProduct = computed(() => getProduct(route.params.productId));
const relatedProducts = computed(() => getRelatedProducts(route.params.productId, 3));
const relatedArticles = computed(() => getArticlesForProduct(route.params.productId, 3));

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  // Products listed in the Shop sit under /products; the dehumidifier range is
  // presented on the Business page, so its breadcrumb points there instead.
  currentProduct.value?.shopCategoryId
    ? { label: 'Shop', to: '/products' }
    : { label: 'Business', to: { name: 'business', hash: '#products' } },
  { label: currentProduct.value?.label ?? 'Product', to: route.path },
]);

/** A purchasable product only gets the buy bar when Shopify is set up and the
 *  handle actually resolves; otherwise the enquiry bar takes over. */
const shopifyReady = isShopifyConfigured();
const buyBarUnavailable = ref(false);

/** Shop items that are not on Shopify are sold by enquiry, not by quote. */
const inquiryCopy = computed(() => {
  const product = currentProduct.value;
  if (!product?.shopCategoryId) {
    return {};
  }
  return {
    note: product.inquiryNote ?? 'Sizes, stock and delivery — ask us and we will confirm.',
    cta: 'Ask about this item',
    subjectPrefix: 'Product enquiry',
  };
});

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

    <CommercialAirPurifierPage v-if="currentProduct?.page === 'commercial-air-purifier'" />

    <CommercialDehumidifierPage v-else-if="currentProduct?.page === 'commercial'" />

    <CeilingMountedDehumidifierPage v-else-if="currentProduct?.page === 'ceiling-mounted'" />

    <Md001DehumidifierPage v-else-if="currentProduct?.page === 'md001'" />

    <Md002DehumidifierPage v-else-if="currentProduct?.page === 'md002'" />

    <Mw200AirPurifierPage v-else-if="currentProduct?.page === 'mw200'" />

    <PetBedProductPage v-else-if="currentProduct?.page === 'pet-bed'" />

    <TriangleCatBedPage v-else-if="currentProduct?.page === 'triangle-cat-bed'" />

    <PetStrollerPage v-else-if="currentProduct?.page === 'pet-stroller'" />

    <CatToyProductPage v-else-if="currentProduct?.page === 'cat-toy'" />

    <CarPetSeatPage v-else-if="currentProduct?.page === 'car-pet-seat'" />

    <CatScratcherFramePage v-else-if="currentProduct?.page === 'cat-scratcher-frame'" />

    <SisalCatScratcherPage v-else-if="currentProduct?.page === 'sisal-cat-scratcher'" />

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

    <ProductBuyBar
      v-if="currentProduct?.purchasable && shopifyReady && !buyBarUnavailable"
      :handle="currentProduct.shopifyHandle"
      :labels="currentProduct.variantLabels ?? {}"
      @unavailable="buyBarUnavailable = true"
    />
    <InquiryBar v-else-if="currentProduct" :label="currentProduct.label" v-bind="inquiryCopy" />
  </main>
</template>

<style scoped>
/* Keep the last content clear of the fixed bottom action bar (buy / inquiry). */
.product-page {
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
}

@media (max-width: 640px) {
  .product-page {
    padding-bottom: calc(184px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
