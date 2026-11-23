<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Truck } from 'lucide-vue-next';
import CarPetSeatPage from '../components/CarPetSeatPage.vue';
import WovenCatScratcherPage from '../components/WovenCatScratcherPage.vue';
import CatToyProductPage from '../components/CatToyProductPage.vue';
import CeilingMountedDehumidifierPage from '../components/CeilingMountedDehumidifierPage.vue';
import CommercialAirPurifierPage from '../components/CommercialAirPurifierPage.vue';
import CommercialDehumidifierPage from '../components/CommercialDehumidifierPage.vue';
import DesktopAirPurifierPage from '../components/DesktopAirPurifierPage.vue';
import Md001DehumidifierPage from '../components/Md001DehumidifierPage.vue';
import Md002DehumidifierPage from '../components/Md002DehumidifierPage.vue';
import Mw100ProductPage from '../components/Mw100ProductPage.vue';
import Mw200AirPurifierPage from '../components/Mw200AirPurifierPage.vue';
import PetBedProductPage from '../components/PetBedProductPage.vue';
import PetStrollerPage from '../components/PetStrollerPage.vue';
import SisalCatScratcherPage from '../components/SisalCatScratcherPage.vue';
import TriangleCatBedPage from '../components/TriangleCatBedPage.vue';
import LoofahCatToyPage from '../components/LoofahCatToyPage.vue';
import PlushChewToyPage from '../components/PlushChewToyPage.vue';
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
import { fulfilment } from '../data/siteInfo';
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
  // Same warm theme as MW100/MW200 — the page itself uses the MW200 palette.
  'desktop-air-purifier': 'post-theme-warm',
  'commercial-dehumidifier': 'post-theme-teal',
  'ceiling-mounted-dehumidifier': 'post-theme-green',
  'christmas-pet-bed': 'post-theme-warm',
  'pom-pom-cat-toy': 'post-theme-warm',
  'loofah-cat-toy': 'post-theme-warm',
  'plush-squeaky-chew-toys': 'post-theme-warm',
  'car-pet-seat': 'post-theme-warm',
  'woven-sisal-cat-scratcher': 'post-theme-warm',
  'sisal-cat-scratcher': 'post-theme-warm',
  'triangle-cat-bed': 'post-theme-warm',
  'pet-stroller': 'post-theme-warm',
};

const themeClass = computed(() => THEME_CLASSES[route.params.productId] ?? '');

const currentProduct = computed(() => getProduct(route.params.productId));
/* Ask for a bigger pool: `RelatedProducts` keeps only the ones in stock. */
const relatedProducts = computed(() => getRelatedProducts(route.params.productId, 8));
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

    <DesktopAirPurifierPage v-else-if="currentProduct?.page === 'desktop-air-purifier'" />

    <PetBedProductPage v-else-if="currentProduct?.page === 'pet-bed'" />

    <TriangleCatBedPage v-else-if="currentProduct?.page === 'triangle-cat-bed'" />

    <PetStrollerPage v-else-if="currentProduct?.page === 'pet-stroller'" />

    <CatToyProductPage v-else-if="currentProduct?.page === 'cat-toy'" />

    <LoofahCatToyPage v-else-if="currentProduct?.page === 'loofah-cat-toy'" />

    <PlushChewToyPage v-else-if="currentProduct?.page === 'plush-chew-toys'" />

    <CarPetSeatPage v-else-if="currentProduct?.page === 'car-pet-seat'" />

    <WovenCatScratcherPage v-else-if="currentProduct?.page === 'woven-sisal-cat-scratcher'" />

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

      <!-- Shipping origin, delivery window and return window, on the landing
           page itself. Merchant Center checks this page for the delivery terms
           it shows next to the product, and a product page that never mentions
           where it ships from is one of the classic Misrepresentation triggers.
           Wrapped so the 80px `breadcrumbs + *` rhythm of this zone can be
           overridden without touching the global rule. -->
      <div class="product-fulfilment-row">
        <p class="product-fulfilment">
          <Truck aria-hidden="true" />
          <span>
            Ships from {{ fulfilment.shipsFrom }} · Dispatched in
            {{ fulfilment.dispatchWindow }} · Delivery to the US
            <strong>{{ fulfilment.usDelivery }}</strong> ·
            <RouterLink :to="{ name: 'refunds' }">{{ fulfilment.returnsShortLabel }}</RouterLink>
          </span>
        </p>
      </div>

      <ProductOverview :product-id="route.params.productId" />

      <ProductFaq :product-id="route.params.productId" />

      <RelatedArticles
        :articles="relatedArticles"
        eyebrow="Guides and inspiration"
        title="Related reading"
      />

      <RelatedProducts :products="relatedProducts" in-stock-only />
    </div>

    <ProductBuyBar
      v-if="currentProduct?.purchasable && shopifyReady && !buyBarUnavailable"
      :handle="currentProduct.shopifyHandle"
      :title="currentProduct.title"
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

/* Sits right under the breadcrumbs, so the `breadcrumbs + *` gap of the SEO
   zone (80px) is overridden: the delivery facts belong to the product, not to
   a new section. */
.product-fulfilment-row {
  margin-top: clamp(16px, 2.2vw, 26px) !important;
}

.product-fulfilment {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 860px;
  margin: 0;
  padding: 12px 16px;
  border: 1px solid var(--seo-border, rgba(51, 76, 81, 0.16));
  border-radius: 10px;
  background: var(--seo-surface, rgba(248, 251, 250, 0.8));
  color: var(--seo-body, #40595e);
  font-size: 14.5px;
  line-height: 1.5;
}

.product-fulfilment svg {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  color: var(--seo-ink, #345258);
  stroke-width: 1.9;
}

.product-fulfilment strong {
  color: var(--seo-ink, #22383c);
  font-weight: 600;
}

.product-fulfilment a {
  color: var(--seo-ink, #274b52);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 640px) {
  .product-page {
    padding-bottom: calc(184px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
