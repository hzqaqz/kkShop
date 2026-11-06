<script setup>
import { computed, onMounted } from 'vue';
import { Frame, Layers, Ruler, ShieldCheck } from 'lucide-vue-next';
import { formatMoney, isShopifyConfigured } from '../composables/useShopify';
import { useCart } from '../composables/useCart';
import { useShopifyProduct, useShopifyPrices } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Travel pet stroller.
 *
 * Every figure on this page comes from the seller's specification sheet:
 * aluminium tube frame in matte black powder coat, stitched leather push-handle
 * grip, 600D Oxford fabric with a six-panel canopy and one shopping basket,
 * 8 in + 12 in ETPU quick-release wheels, a frame brake, 25 kg maximum load,
 * 82 × 59 × 95–105 cm open, 72 × 59 × 28.5 cm folded, carrycot 69 × 36 × 64 cm
 * inside (35 cm at the base) and 42.5 × 22 × 76 cm folded, 3.8 kg basket.
 *
 * Also from the seller: the carrycot releases from the frame with one click, so
 * the frame folds into the boot while the carrycot rides on the back seat with
 * the pet in it — which is what makes it usable for a long drive.
 *
 * Layout and palette follow `PetBedProductPage.vue` so the pet range reads as
 * one set of pages.
 */
const shopifyHandle = getProduct('pet-stroller')?.shopifyHandle;
const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);
const { prices, loadPrice } = useShopifyPrices();

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

/** Two canopy positions, taken from the two product photos. */
const canopy = [
  {
    key: 'closed',
    tag: 'Closed',
    title: 'Closed in',
    note: 'The hood pulled forward over the carrycot: shade, and less of the street to look at.',
    image: '/images/products/pet-stroller/canopy-closed.webp',
    alt: 'The pet stroller with the canopy closed and the cream carrycot buttoned up',
  },
  {
    key: 'open',
    tag: 'Opened',
    title: 'Open for air',
    note: 'The same canopy opened back into mesh panels, so the cat can see out and the carrycot still breathes.',
    image: '/images/products/pet-stroller/canopy-open.webp',
    alt: 'The same stroller with the canopy opened into black mesh panels at the back',
  },
];

/** Walking with it, then driving with it — the two halves come apart. */
const travel = [
  {
    tag: '01',
    title: 'One click, two parts',
    text: 'The carrycot releases from the frame on a single catch. No tools, no fiddling: lift it off and the frame stays where it is.',
  },
  {
    tag: '02',
    title: 'The frame goes in the boot',
    text: 'Folded to 72 × 59 × 28.5 cm the frame lies flat in the back of a car, out of the way of the people and the luggage.',
  },
  {
    tag: '03',
    title: 'The carrycot takes the back seat',
    text: 'With the frame in the boot, the carrycot rides on the back seat with the pet still inside it — 69 × 36 × 64 cm of familiar bed, 35 cm across the base.',
  },
  {
    tag: '04',
    title: 'Made for the long drive',
    text: 'Because the pet never has to be moved into a different carrier, the same bed goes from a walk in the park to a motorway service station without a change of scene.',
  },
];

const features = [
  {
    title: '82 × 59 × 95–105 cm',
    text: 'Open size, with the push handle adjustable through 10 cm so a tall or a short walker both find a comfortable grip.',
    icon: Ruler,
  },
  {
    title: '25 kg load',
    text: 'Rated for 25 kg — a cat, or a small dog, plus whatever goes in the shopping basket underneath.',
    icon: ShieldCheck,
  },
  {
    title: 'Aluminium frame',
    text: 'An aluminium tube frame in a matte black powder-coated finish, with a stitched leather grip on the handle.',
    icon: Frame,
  },
  {
    title: '600D Oxford',
    text: 'Single-layer 600D Oxford on the carrycot and the six-panel canopy, with one shopping basket included.',
    icon: Layers,
  },
];
</script>

<template>
  <div class="ps-page">
    <section class="ps-hero" aria-labelledby="ps-title">
      <div class="ps-hero-copy">
        <p class="ps-eyebrow">For getting out</p>
        <h1 id="ps-title">Travel Pet Stroller</h1>
        <p class="ps-lead">
          An aluminium stroller with a carrycot and a six-panel canopy, for cats and small dogs up to
          25 kg — and the carrycot lifts off the frame with one click. Walk to the car, put the carrycot
          on the back seat with the pet still in it, and fold the frame into the boot.
        </p>

        <ul class="ps-hero-facts" aria-label="Key facts">
          <li><strong>Open</strong> 82 × 59 × 95–105 cm</li>
          <li><strong>Folded</strong> 72 × 59 × 28.5 cm</li>
          <li><strong>Load</strong> 25 kg</li>
          <li><strong>Carrycot</strong> Clicks off</li>
        </ul>

        <div class="ps-hero-actions">
          <a class="ps-cta ps-cta--primary" href="#ps-travel">See how it travels</a>
          <a class="ps-cta ps-cta--ghost" :href="contactEmailHref">Ask about this stroller</a>
        </div>
      </div>

      <div class="ps-hero-media">
        <img
          src="/images/products/pet-stroller/hero-sunset.jpg"
          alt="A corgi sitting in the cream travel pet stroller beside a lake at sunset"
          loading="eager"
          decoding="async"
        />
      </div>
    </section>

    <section class="ps-section ps-section--buy" aria-label="Buy this stroller">
      <div class="ps-buy">
        <div class="ps-buy-copy">
          <p class="ps-card-tag">One size</p>
          <p class="ps-buy-details">
            Cream grey · 82 × 59 × 95–105 cm open · 25 kg load · carrycot and canopy included
          </p>
          <p v-if="priceLabel" class="ps-buy-price">{{ priceLabel }}</p>
        </div>

        <button
          v-if="shopifyReady && variant?.availableForSale !== false"
          type="button"
          class="ps-buy-add"
          :disabled="!variant?.availableForSale || cartLoading"
          @click="addToCartFromPage"
        >
          {{ cartLoading ? 'Adding…' : 'Add to cart' }}
        </button>
        <a v-else class="ps-buy-add" :href="contactEmailHref">
          {{ variant ? 'Ask about availability' : 'Ask about this stroller' }}
        </a>
      </div>
    </section>

    <section class="ps-section" aria-labelledby="ps-canopy-title">
      <div class="ps-heading">
        <p class="ps-eyebrow">The canopy</p>
        <h2 id="ps-canopy-title">Down for the wind, up for the view</h2>
        <p>
          The six-panel canopy is adjustable. Closed, it keeps wind and attention off the cat; opened, the
          back turns into mesh panels, so the cat can see out while the carrycot still gets air.
        </p>
      </div>

      <div class="ps-view-grid">
        <article v-for="item in canopy" :key="item.key" class="ps-view-card">
          <div class="ps-view-media">
            <img :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
          </div>
          <div class="ps-view-copy">
            <p class="ps-card-tag">{{ item.tag }}</p>
            <h3>{{ item.title }}</h3>
            <p class="ps-card-text">{{ item.note }}</p>
          </div>
        </article>
      </div>
    </section>

    <section id="ps-travel" class="ps-section" aria-labelledby="ps-travel-title">
      <div class="ps-heading">
        <p class="ps-eyebrow">Strolling, then driving</p>
        <h2 id="ps-travel-title">Lift the carrycot off, fold the frame away</h2>
        <p>
          The two halves are meant to be separated. That is what turns a stroller into something you can
          take on a long drive: the carrycot becomes the pet’s seat in the car, and the frame disappears
          into the boot.
        </p>
      </div>

      <div class="ps-card-grid">
        <article v-for="item in travel" :key="item.title" class="ps-card">
          <p class="ps-card-tag">{{ item.tag }}</p>
          <h3>{{ item.title }}</h3>
          <p class="ps-card-text">{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="ps-section" aria-labelledby="ps-features-title">
      <div class="ps-heading">
        <p class="ps-eyebrow">Details</p>
        <h2 id="ps-features-title">What you are pushing</h2>
      </div>

      <div class="ps-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="ps-feature-card">
          <span class="ps-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Palette and type scale copied from `PetBedProductPage.vue` so the pet range
   shares one visual language. */
.ps-page {
  --ps-ink: #314e53;
  --ps-accent: #75949a;
  --ps-warm: #f7ece1;
  --ps-red: #a33a33;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.ps-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
  gap: clamp(28px, 4vw, 60px);
  align-items: center;
  padding: clamp(130px, 11vw, 178px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--ps-warm));
}

.ps-eyebrow {
  margin: 0 0 12px;
  color: var(--ps-red);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.ps-hero h1 {
  margin: 0;
  color: var(--ps-ink);
  font-size: clamp(32px, 4.4vw, 62px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.ps-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.ps-hero-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.ps-hero-facts li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 600;
}

.ps-hero-facts strong {
  margin-right: 5px;
  color: var(--ps-ink);
  font-weight: 600;
}

.ps-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.ps-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.ps-cta--primary {
  background: var(--ps-ink);
  color: #fef5ed;
}

.ps-cta--primary:hover,
.ps-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.ps-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--ps-ink);
}

.ps-cta--ghost:hover,
.ps-cta--ghost:focus-visible {
  border-color: var(--ps-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

/* Lifestyle hero, so the photo runs edge to edge in its rounded panel. */
.ps-hero-media {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

.ps-hero-media img {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.ps-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(52px, 6vw, 84px) 0 0;
}

/* The buy strip sits directly under the hero, so it needs less breathing room. */
.ps-section--buy {
  padding-top: clamp(20px, 2.5vw, 32px);
}

.ps-heading {
  max-width: 720px;
}

.ps-heading h2 {
  margin: 0;
  color: var(--ps-ink);
  font-size: clamp(26px, 3.1vw, 42px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.ps-heading p:not(.ps-eyebrow) {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Canopy cards ────────────────────────────────────────────────────────── */
.ps-view-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.ps-view-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.ps-view-media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 420px;
  padding: 12px;
  background: #fff;
}

.ps-view-media img {
  width: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ps-view-copy {
  padding: 16px 18px 20px;
}

/* ── Buy strip ───────────────────────────────────────────────────────────── */
.ps-buy {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.ps-buy-copy {
  min-width: 0;
}

.ps-buy-details {
  margin: 6px 0 0;
  color: #4d666b;
  font-size: 14px;
  font-weight: 600;
}

.ps-buy-price {
  margin: 8px 0 0;
  color: var(--ps-ink);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.ps-buy-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  min-height: 44px;
  padding: 0 24px;
  border: 1px solid var(--ps-ink);
  border-radius: 8px;
  background: var(--ps-ink);
  color: #fef5ed;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.ps-buy-add:hover:not(:disabled),
.ps-buy-add:focus-visible:not(:disabled) {
  background: #22383c;
  border-color: #22383c;
}

.ps-buy-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(247, 236, 225, 0.6);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Text cards ──────────────────────────────────────────────────────────── */
.ps-card-grid {
  display: grid;
  /* Four cards with two short paragraphs each: two columns read better than
     four, and it keeps the pair "strolling / driving" side by side. */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.ps-card {
  padding: 18px 20px 22px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.ps-card-tag {
  margin: 0;
  color: var(--ps-red);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ps-card h3,
.ps-view-copy h3 {
  margin: 6px 0 0;
  color: var(--ps-ink);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
}

.ps-card-text {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Feature cards ───────────────────────────────────────────────────────── */
.ps-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.ps-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--ps-warm);
}

.ps-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--ps-red);
}

.ps-feature-card h3 {
  margin: 12px 0 0;
  color: var(--ps-ink);
  font-size: 16.5px;
  font-weight: 600;
}

.ps-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Media queries ───────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .ps-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .ps-hero {
    padding-top: 152px;
  }

  .ps-card-grid,
  .ps-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .ps-hero {
    padding: 148px 24px 44px;
  }

  .ps-section {
    width: calc(100% - 32px);
  }

  .ps-view-grid,
  .ps-card-grid,
  .ps-feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ps-view-media {
    height: 360px;
  }

  .ps-buy {
    align-items: stretch;
  }

  .ps-buy-add {
    width: 100%;
  }
}
</style>
