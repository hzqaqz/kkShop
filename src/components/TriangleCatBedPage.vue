<script setup>
import { computed, onMounted } from 'vue';
import { Flame, PawPrint, Ruler, Shapes } from 'lucide-vue-next';
import { formatMoney, isShopifyConfigured } from '../composables/useShopify';
import { useCart } from '../composables/useCart';
import { useShopifyProduct, useShopifyPrices } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * 3-in-1 triangle cat bed.
 *
 * Facts from the seller: waffle-weave outer fabric that does not hold onto loose
 * hair, a white sherpa fleece lining for warmth, PP cotton filling so the sides
 * and cushions keep their shape, 58 × 50 × 40 cm, for cats and small dogs up to
 * about 7.5 kg, and it works in three shapes — triangle, sofa and flat mat. The
 * shapes and the buttoned edges are what the product photos show; nothing
 * beyond them is claimed here.
 *
 * Layout and palette follow `PetBedProductPage.vue` (the Christmas bed) so the
 * two beds read as one range: cream hero, ink CTAs, white cards, teal accents.
 */
const shopifyHandle = getProduct('triangle-cat-bed')?.shopifyHandle;
const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);
const { prices, loadPrice } = useShopifyPrices();

/** Sold by enquiry if the product is ever missing from the Shopify catalogue. */
const shopifyReady = isShopifyConfigured() && Boolean(shopifyHandle);

const variant = computed(() => shopifyProduct.value?.variants?.nodes?.[0] ?? null);
const priceEntry = computed(() => (shopifyHandle ? prices.value[shopifyHandle] ?? null : null));

const priceLabel = computed(() =>
  priceEntry.value
    ? formatMoney(priceEntry.value.amount, priceEntry.value.currencyCode)
    : shopifyReady
      ? 'Loading price…'
      : '',
);

onMounted(() => loadPrice(shopifyHandle));

const { addToCart, loading: cartLoading } = useCart();
const { setVariant } = useVariantSelection();

function addToCartFromPage() {
  const entry = variant.value;
  if (!entry?.id || !entry.availableForSale || cartLoading.value) {
    return;
  }
  setVariant(shopifyHandle, entry.id);
  addToCart(entry.id, 1);
}

/** The three shapes, in the order they are worth explaining. */
const forms = [
  {
    key: 'triangle',
    tag: 'Triangle',
    name: 'Triangle cave',
    note: 'Both sides stood up and buttoned together — a cave with a fleece floor, the warmest of the three.',
    image: '/images/products/triangle-cat-bed/form-triangle.webp',
    alt: 'The waffle-weave cat bed stood up as a triangle cave in front of a yellow sofa',
    layout: 'card',
  },
  {
    key: 'sofa',
    tag: 'Sofa',
    name: 'Sofa',
    note: 'Propped open instead of closed — a backrest to lean on and a seat in front, for a cat that likes to sprawl.',
    image: '/images/products/triangle-cat-bed/form-sofa.webp',
    alt: 'The same bed opened into a small sofa with a backrest and a padded seat',
    layout: 'card',
  },
  {
    key: 'mat',
    tag: 'Sleeping mat',
    name: 'Flat sleeping mat',
    note: 'Folded down flat, both fleece cushions side by side — the biggest sleeping area the bed can make.',
    image: '/images/products/triangle-cat-bed/form-mat.webp',
    alt: 'The bed laid out flat on the floor as a sleeping mat with two fleece cushions',
    layout: 'wide',
  },
];

const features = [
  {
    title: 'Three shapes',
    text: 'Triangle, sofa or flat mat — changed over in a moment, with no loose parts to keep track of.',
    icon: Shapes,
  },
  {
    title: '58 × 50 × 40 cm',
    text: 'The size of the whole bed, shaped to suit a curled-up cat rather than a stretched-out dog.',
    icon: Ruler,
  },
  {
    title: 'Waffle-weave outer',
    text: 'The outer fabric is a waffle weave, so loose hair brushes off it instead of weaving into the surface.',
    icon: PawPrint,
  },
  {
    title: 'Fleece over PP cotton',
    text: 'A white sherpa fleece lining for warmth, over a PP cotton fill that keeps the sides standing instead of sagging.',
    icon: Flame,
  },
];
</script>

<template>
  <div class="tbed-page">
    <section class="tbed-hero" aria-labelledby="tbed-title">
      <div class="tbed-hero-copy">
        <p class="tbed-eyebrow">Winter collection</p>
        <h1 id="tbed-title">3-in-1 Triangle Cat Bed</h1>
        <p class="tbed-lead">
          One bed for the spot your cat has already chosen, in three shapes: stood up and buttoned
          together it is a triangle cave with a fleece floor, propped open it becomes a sofa, folded
          down it is a flat sleeping mat. Waffle weave outside, white sherpa fleece inside, and a PP
          cotton fill that keeps the sides standing.
        </p>

        <ul class="tbed-hero-facts" aria-label="Key facts">
          <li><strong>Size</strong> 58 × 50 × 40 cm</li>
          <li><strong>Outer</strong> Waffle weave</li>
          <li><strong>Lining</strong> Sherpa fleece</li>
          <li><strong>Filling</strong> PP cotton</li>
        </ul>

        <div class="tbed-hero-actions">
          <a class="tbed-cta tbed-cta--primary" href="#tbed-forms">See the three shapes</a>
          <a class="tbed-cta tbed-cta--ghost" :href="contactEmailHref">Ask about this bed</a>
        </div>
      </div>

      <img
        class="tbed-hero-media"
        src="/images/products/triangle-cat-bed/hero.webp"
        alt="A Bengal cat investigating the waffle-weave triangle cat bed in a sunlit living room"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="tbed-forms" class="tbed-section" aria-labelledby="tbed-forms-title">
      <div class="tbed-heading">
        <p class="tbed-eyebrow">Three shapes</p>
        <h2 id="tbed-forms-title">One bed, reshaped in a moment</h2>
        <p>
          The two padded sides are held with buttons, so the bed does not need to be unzipped,
          unfolded or packed away to change shape — it is the same piece of furniture in a different
          position.
        </p>
      </div>

      <div class="tbed-form-grid">
        <article
          v-for="form in forms"
          :key="form.key"
          class="tbed-form-card"
          :class="`tbed-form-card--${form.layout}`"
        >
          <img :src="form.image" :alt="form.alt" loading="lazy" decoding="async" />
          <div class="tbed-form-copy">
            <p class="tbed-form-tag">{{ form.tag }}</p>
            <h3>{{ form.name }}</h3>
            <p class="tbed-form-note">{{ form.note }}</p>
          </div>
        </article>
      </div>

      <div class="tbed-buy">
        <div class="tbed-buy-copy">
          <p class="tbed-buy-label">One size</p>
          <p class="tbed-buy-details">58 × 50 × 40 cm · cats and small dogs up to about 7.5 kg</p>
          <p v-if="priceLabel" class="tbed-buy-price">{{ priceLabel }}</p>
        </div>

        <button
          v-if="shopifyReady && variant?.availableForSale !== false"
          type="button"
          class="tbed-buy-add"
          :disabled="!variant?.availableForSale || cartLoading"
          @click="addToCartFromPage"
        >
          {{ cartLoading ? 'Adding…' : 'Add to cart' }}
        </button>
        <a v-else class="tbed-buy-add" :href="contactEmailHref">
          {{ variant ? 'Ask about availability' : 'Ask about this bed' }}
        </a>
      </div>
    </section>

    <section class="tbed-section" aria-labelledby="tbed-features-title">
      <div class="tbed-heading">
        <p class="tbed-eyebrow">Details</p>
        <h2 id="tbed-features-title">What makes it a winter bed</h2>
      </div>

      <div class="tbed-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="tbed-feature-card">
          <span class="tbed-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="tbed-section tbed-craft" aria-labelledby="tbed-craft-title">
      <img
        class="tbed-craft-media"
        src="/images/products/triangle-cat-bed/cat-inside.webp"
        alt="A grey tabby cat lying inside the triangle cat bed, looking out"
        loading="lazy"
        decoding="async"
      />

      <div class="tbed-craft-copy">
        <p class="tbed-eyebrow">In the room</p>
        <h2 id="tbed-craft-title">Warm in the triangle, open in the sun</h2>
        <p>
          Three layers do the work. The outer fabric is a waffle weave — a textured grid that holds
          the shape it is folded into and lets loose hair brush off instead of clinging to it. Inside,
          the white sherpa fleece is what the cat lies on, deep enough to work its paws into.
        </p>
        <p>
          Between them, the PP cotton fill gives the sides and the cushions enough body to stand up on
          their own, so the triangle stays a triangle instead of sagging into a pancake. Closed up, the
          sides keep the warmth the cat brings with it; open the bed out into a sofa or a mat in spring
          and it stops being a cave and starts being somewhere to sprawl.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Palette and type scale copied from `PetBedProductPage.vue` so the two beds
   share one visual language. */
.tbed-page {
  --tbed-ink: #314e53;
  --tbed-accent: #75949a;
  --tbed-warm: #f7ece1;
  --tbed-red: #a33a33;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.tbed-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(28px, 4vw, 60px);
  align-items: center;
  padding: clamp(130px, 11vw, 178px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--tbed-warm));
}

.tbed-eyebrow {
  margin: 0 0 12px;
  color: var(--tbed-red);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tbed-hero h1 {
  margin: 0;
  color: var(--tbed-ink);
  font-size: clamp(32px, 4.4vw, 62px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.tbed-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.tbed-hero-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.tbed-hero-facts li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 700;
}

.tbed-hero-facts strong {
  margin-right: 5px;
  color: var(--tbed-ink);
  font-weight: 900;
}

.tbed-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.tbed-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.tbed-cta--primary {
  background: var(--tbed-ink);
  color: #fef5ed;
}

.tbed-cta--primary:hover,
.tbed-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.tbed-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--tbed-ink);
}

.tbed-cta--ghost:hover,
.tbed-cta--ghost:focus-visible {
  border-color: var(--tbed-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.tbed-hero-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.tbed-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(52px, 6vw, 84px) 0 0;
}

.tbed-heading {
  max-width: 720px;
}

.tbed-heading h2,
.tbed-craft-copy h2 {
  margin: 0;
  color: var(--tbed-ink);
  font-size: clamp(26px, 3.1vw, 42px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.tbed-heading p:not(.tbed-eyebrow),
.tbed-craft-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Shapes ──────────────────────────────────────────────────────────────── */
.tbed-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.tbed-form-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.tbed-form-card img {
  display: block;
  /* Natural ratio, like the size artwork on the Christmas bed page. */
  width: 100%;
  height: auto;
}

/* The mat photo only works as a wide strip: cropping it to a portrait card
   would cut the folded wings off, which is the whole point of that shape. */
.tbed-form-card--wide {
  grid-column: 1 / -1;
}

.tbed-form-copy {
  padding: 16px 18px 20px;
}

.tbed-form-tag {
  margin: 0;
  color: var(--tbed-red);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tbed-form-copy h3 {
  margin: 6px 0 0;
  color: var(--tbed-ink);
  font-size: 20px;
  font-weight: 900;
}

.tbed-form-note {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Buy row ─────────────────────────────────────────────────────────────── */
.tbed-buy {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding: 18px 22px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.tbed-buy-copy {
  min-width: 0;
}

.tbed-buy-label {
  margin: 0;
  color: var(--tbed-red);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tbed-buy-details {
  margin: 6px 0 0;
  color: #4d666b;
  font-size: 14px;
  font-weight: 800;
}

.tbed-buy-price {
  margin: 8px 0 0;
  color: var(--tbed-ink);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.tbed-buy-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  min-height: 44px;
  padding: 0 24px;
  border: 1px solid var(--tbed-ink);
  border-radius: 8px;
  background: var(--tbed-ink);
  color: #fef5ed;
  font: inherit;
  font-size: 13.5px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.tbed-buy-add:hover:not(:disabled),
.tbed-buy-add:focus-visible:not(:disabled) {
  background: #22383c;
  border-color: #22383c;
}

.tbed-buy-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(247, 236, 225, 0.6);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.tbed-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.tbed-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--tbed-warm);
}

.tbed-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--tbed-red);
}

.tbed-feature-card h3 {
  margin: 12px 0 0;
  color: var(--tbed-ink);
  font-size: 16.5px;
  font-weight: 900;
}

.tbed-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Craft ───────────────────────────────────────────────────────────────── */
.tbed-craft {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.tbed-craft-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

/* The full specification table lives in the SEO block at the bottom of the
   page (`productOverview.js`), so this section stops at the copy. */

@media (max-width: 900px) {
  .tbed-hero,
  .tbed-craft {
    grid-template-columns: minmax(0, 1fr);
  }

  .tbed-hero {
    padding-top: 152px;
  }

  .tbed-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .tbed-hero {
    padding: 148px 24px 44px;
  }

  .tbed-section {
    width: calc(100% - 32px);
  }

  .tbed-form-grid,
  .tbed-feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .tbed-buy {
    align-items: stretch;
  }

  .tbed-buy-add {
    width: 100%;
  }
}
</style>
