<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Loader2, ShoppingBag } from 'lucide-vue-next';
import ProductFromPrice from './ProductFromPrice.vue';
import { useCart } from '../composables/useCart';
import { useShopifyProduct } from '../composables/useShopifyPrices';
import { getProduct } from '../data/products';

/**
 * Large alternating product card used for the homepage's featured products:
 * artwork on one side, copy on the other, price plus a quick Add to cart.
 */
const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  /** Optional display name; falls back to the product's card label. */
  name: {
    type: String,
    default: '',
  },
  /** One line of selling copy, written for the homepage. */
  pitch: {
    type: String,
    required: true,
  },
  /** Artwork for the card; falls back to the product card image. */
  image: {
    type: String,
    default: '',
  },
  /** CSS object-position for artwork that needs a different crop. */
  imagePosition: {
    type: String,
    default: '',
  },
  /** Shows the artwork whole (object-fit: contain) on a blurred blow-up of it. */
  contain: {
    type: Boolean,
    default: false,
  },
  /** Puts the artwork on the right instead of the left. */
  reverse: {
    type: Boolean,
    default: false,
  },
});

const product = getProduct(props.productId);
const handle = product?.shopifyHandle ?? '';
const imageSrc = computed(() => props.image || product?.image || '');
const route = computed(() => ({
  name: 'product-detail',
  params: { productId: props.productId },
}));

/* Prices and variant ids belong to Shopify; the price label is shared with the
   product cards, and the same cached product supplies the quick-add variant. */
const { product: shopifyProduct } = useShopifyProduct(handle);
const { addToCart, loading: cartLoading, error: cartError } = useCart();

/**
 * Quick add takes the first purchasable variant — the same default the product
 * page's buy bar picks. Sizes and finishes are chosen on the product page.
 */
const variant = computed(() => {
  const variants = shopifyProduct.value?.variants?.nodes ?? [];
  return variants.find((item) => item.availableForSale) ?? variants[0] ?? null;
});

function addToCartFromCard() {
  if (!variant.value?.id || cartLoading.value) {
    return;
  }
  addToCart(variant.value.id, 1);
}
</script>

<template>
  <article v-if="product" class="feature-card" :class="{ 'feature-card--reverse': reverse }">
    <RouterLink
      class="feature-card-media"
      :class="{ 'feature-card-media--contain': contain }"
      :style="contain ? { '--feature-card-backdrop': `url(${imageSrc})` } : null"
      :to="route"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        :src="imageSrc"
        :alt="product.title"
        :style="imagePosition ? { objectPosition: imagePosition } : null"
        loading="lazy"
        decoding="async"
      />
    </RouterLink>

    <div class="feature-card-copy">
      <p class="feature-card-eyebrow">{{ product.category }}</p>

      <h3 class="feature-card-title">
        <RouterLink :to="route">{{ name || product.cardLabel }}</RouterLink>
      </h3>

      <p class="feature-card-pitch">{{ pitch }}</p>

      <div class="feature-card-footer">
        <ProductFromPrice class="feature-card-price" :handle="handle" />

        <button
          class="feature-card-add"
          type="button"
          :disabled="!variant || cartLoading"
          @click="addToCartFromCard"
        >
          <Loader2
            v-if="cartLoading"
            class="feature-card-spinner"
            :size="18"
            aria-hidden="true"
          />
          <ShoppingBag v-else :size="18" aria-hidden="true" />
          <span>{{ cartLoading ? 'Adding…' : 'Add to cart' }}</span>
        </button>
      </div>

      <p v-if="cartError" class="feature-card-error" role="status">{{ cartError }}</p>
    </div>
  </article>
</template>

<style scoped>
/* Same card recipe as the Buying guide card (`styles.css` .guide-card) so the
   featured products sit at the same size and rhythm. */
.feature-card {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
  padding: clamp(20px, 2.4vw, 30px);
  border: 1px solid rgba(51, 76, 81, 0.14);
  border-radius: 14px;
  background: #f7f1e7;
}

.feature-card + .feature-card {
  margin-top: clamp(18px, 2.4vw, 30px);
}

.feature-card-media {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  background: #f5efe5;
  overflow: hidden;
}

.feature-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.feature-card-media:hover img,
.feature-card-media:focus-visible img {
  transform: scale(1.03);
}

/* Artwork that would be cropped badly (a square lifestyle shot in a 4:3 card)
   is shown whole, with a blurred copy of itself filling the card behind it. */
.feature-card-media--contain::before {
  position: absolute;
  inset: -8%;
  content: "";
  background-image: var(--feature-card-backdrop);
  background-position: center;
  background-size: cover;
  filter: blur(26px) saturate(1.05) brightness(0.96);
}

.feature-card-media--contain img {
  position: relative;
  object-fit: contain;
}

.feature-card-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(10px, 1.1vw, 16px);
  padding: 0;
}

.feature-card-eyebrow {
  margin: 0;
  color: #6f9096;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.feature-card-title {
  margin: 0;
  color: #22383c;
  font-size: clamp(24px, 2.6vw, 38px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.feature-card-title a:hover,
.feature-card-title a:focus-visible {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.feature-card-pitch {
  max-width: 46ch;
  margin: 0;
  color: #4f6b70;
  font-size: clamp(15px, 1.2vw, 18px);
  line-height: 1.6;
}

.feature-card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: clamp(16px, 2vw, 26px);
}
/* The price label lives in `ProductFromPrice.vue`, so it needs a deeper
   selector to follow the homepage's lighter type. */
.feature-card :deep(.product-card-price) {
  margin: 0;
  color: #22383c;
  font-size: clamp(18px, 1.5vw, 22px);
  font-weight: 600;
  letter-spacing: 0;
}

.feature-card :deep(.product-card-price-from) {
  font-weight: 600;
}

.feature-card-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 50px;
  margin-left: auto;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  background: #22383c;
  color: #fef5ed;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    transform 180ms ease,
    opacity 180ms ease;
}

.feature-card-add:hover:not(:disabled),
.feature-card-add:focus-visible:not(:disabled) {
  background: #314e53;
  transform: translateY(-1px);
}

.feature-card-add:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.feature-card-spinner {
  animation: feature-card-spin 900ms linear infinite;
}

@keyframes feature-card-spin {
  to {
    transform: rotate(360deg);
  }
}

.feature-card-error {
  margin: 10px 0 0;
  color: #a5452f;
  font-size: 13px;
  line-height: 1.45;
}

.feature-card--reverse {
  /* Mirror the columns as well as the order, so the artwork keeps the same
     0.85fr column (and therefore the same size) on every card. */
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
}

.feature-card--reverse .feature-card-media {
  order: 2;
}

@media (max-width: 900px) {
  .feature-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-card--reverse .feature-card-media {
    order: 0;
  }

  /* Same single-column proportions as the Buying guide card. */
  .feature-card-media {
    aspect-ratio: 16 / 9;
  }

  .feature-card-footer {
    margin-top: 18px;
  }
}
</style>
