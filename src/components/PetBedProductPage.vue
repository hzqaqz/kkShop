<script setup>
import { computed, ref } from 'vue';
import { BedDouble, Feather, Gift, Sparkles } from 'lucide-vue-next';
import { useCart } from '../composables/useCart';
import { formatMoney } from '../composables/useShopify';
import { useShopifyProduct } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Festive plaid pet bed.
 *
 * Sizes and dimensions come from the seller: small 40 × 30 × 20 cm, medium
 * 50 × 40 × 25 cm, large 60 × 50 × 30 cm.
 */
const sizes = [
  {
    id: 'small',
    name: 'Small',
    fit: 'Cat size',
    dimensions: '40 × 30 × 20 cm',
    note: 'Cosy and secure for cats and small pets.',
    image: '/images/products/christmas-pet-bed/small.webp',
    alt: 'A grey tabby cat curled up in the small festive plaid pet bed',
  },
  {
    id: 'medium',
    name: 'Medium',
    fit: 'Beagle size',
    dimensions: '50 × 40 × 25 cm',
    note: 'Spacious and supportive for medium dogs.',
    image: '/images/products/christmas-pet-bed/medium.webp',
    alt: 'A beagle lying in the medium festive plaid pet bed',
  },
  {
    id: 'large',
    name: 'Large',
    fit: 'Labrador size',
    dimensions: '60 × 50 × 30 cm',
    note: 'Roomy and comfortable for large dogs.',
    image: '/images/products/christmas-pet-bed/large.webp',
    alt: 'A labrador resting in the large festive plaid pet bed',
  },
];

/** Prices come from Shopify (one variant per size), never hard-coded. */
const shopifyHandle = getProduct('christmas-pet-bed')?.shopifyHandle;
const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);

const pricesBySize = computed(() => {
  const map = {};
  for (const variant of shopifyProduct.value?.variants?.nodes ?? []) {
    const sizeOption = (variant.selectedOptions ?? []).find(
      (option) => option.name.toLowerCase() === 'size',
    );
    const key = (sizeOption?.value ?? variant.title ?? '').trim().toLowerCase();
    if (!key) {
      continue;
    }
    map[key] = {
      id: variant.id,
      amount: variant.price.amount,
      currencyCode: variant.price.currencyCode,
      available: variant.availableForSale,
    };
  }
  return map;
});

function sizeVariant(size) {
  return pricesBySize.value[size.name.toLowerCase()] ?? null;
}

function sizePrice(size) {
  const entry = sizeVariant(size);
  return entry ? formatMoney(entry.amount, entry.currencyCode) : '';
}

function sizeAvailable(size) {
  const entry = sizeVariant(size);
  return entry ? entry.available : true;
}

/** Picking a size on the card selects it in the buy bar and adds it to the cart. */
const { addToCart, loading: cartLoading } = useCart();
const { setVariant } = useVariantSelection();
const addingSize = ref('');

async function addSize(size) {
  const entry = sizeVariant(size);
  if (!entry?.id || !entry.available || addingSize.value) {
    return;
  }

  addingSize.value = size.name.toLowerCase();
  setVariant(shopifyHandle, entry.id);
  await addToCart(entry.id, 1);
  addingSize.value = '';
}

const features = [
  {
    title: 'Festive plaid',
    text: 'A red-and-cream check with green piping — seasonal without being a novelty.',
    icon: Gift,
  },
  {
    title: 'Short plush surface',
    text: 'A soft short-pile plush across the base and the inside of the bolsters.',
    icon: Feather,
  },
  {
    title: 'Raised bolsters',
    text: 'A rim on every side, so there is always an edge to lean against.',
    icon: BedDouble,
  },
  {
    title: 'Pom-pom trim',
    text: 'Red pom-poms along the corners finish the festive look.',
    icon: Sparkles,
  },
];
</script>

<template>
  <div class="petbed-page">
    <section class="petbed-hero" aria-labelledby="petbed-title">
      <div class="petbed-hero-copy">
        <p class="petbed-eyebrow">Festive collection</p>
        <h1 id="petbed-title">Christmas Plaid Cat &amp; Dog Bed</h1>
        <p class="petbed-lead">
          A warm bed for the spot your pet has already chosen: festive plaid outside, short plush
          inside with a PP cotton fill, raised bolsters to curl against and red pom-poms along the
          rim. Warm enough for winter, comfortable all year, in three sizes from cats to
          labradors.
        </p>

        <ul class="petbed-hero-sizes" aria-label="Available sizes">
          <li v-for="size in sizes" :key="size.id">
            <strong>{{ size.name }}</strong>
            {{ size.dimensions }}
          </li>
        </ul>

        <div class="petbed-hero-actions">
          <a class="petbed-cta petbed-cta--primary" href="#petbed-sizes">Choose your size</a>
          <a class="petbed-cta petbed-cta--ghost" :href="contactEmailHref">Ask about this bed</a>
        </div>
      </div>

      <img
        class="petbed-hero-media"
        src="/images/products/christmas-pet-bed/hero-sizes.webp"
        alt="The festive plaid pet bed in small, medium and large, with a cat, a beagle and a labrador"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="petbed-sizes" class="petbed-section" aria-labelledby="petbed-sizes-title">
      <div class="petbed-heading">
        <p class="petbed-eyebrow">Sizes</p>
        <h2 id="petbed-sizes-title">One bed, three sizes</h2>
        <p>
          Match the bed to the animal, not to the room. Measure your pet lying down, nose to the
          base of the tail, and pick the size that gives it room to stretch out.
        </p>
      </div>

      <div class="petbed-size-grid">
        <article v-for="size in sizes" :key="size.id" class="petbed-size-card">
          <img :src="size.image" :alt="size.alt" loading="lazy" decoding="async" />
          <div class="petbed-size-copy">
            <p class="petbed-size-fit">{{ size.fit }}</p>
            <h3>{{ size.name }}</h3>
            <p class="petbed-size-dimensions">{{ size.dimensions }}</p>
            <p v-if="sizePrice(size)" class="petbed-size-price">
              {{ sizePrice(size) }}
              <span v-if="!sizeAvailable(size)" class="petbed-size-soldout">Sold out</span>
            </p>
            <p class="petbed-size-note">{{ size.note }}</p>

            <button
              v-if="sizePrice(size)"
              type="button"
              class="petbed-size-add"
              :disabled="!sizeAvailable(size) || cartLoading || !!addingSize"
              @click="addSize(size)"
            >
              {{ !sizeAvailable(size) ? 'Sold out' : addingSize === size.name.toLowerCase() ? 'Adding…' : 'Add to cart' }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="petbed-section" aria-labelledby="petbed-features-title">
      <div class="petbed-heading">
        <p class="petbed-eyebrow">Details</p>
        <h2 id="petbed-features-title">What makes it a bed, not a cushion</h2>
      </div>

      <div class="petbed-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="petbed-feature-card">
          <span class="petbed-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="petbed-section petbed-craft" aria-labelledby="petbed-craft-title">
      <img
        class="petbed-craft-media"
        src="/images/products/christmas-pet-bed/detail.webp"
        alt="Close-up of the festive plaid bed with green piping, red pom-poms and a plush lining"
        loading="lazy"
        decoding="async"
      />

      <div class="petbed-craft-copy">
        <p class="petbed-eyebrow">In the room</p>
        <h2 id="petbed-craft-title">Seasonal on the outside, an everyday bed underneath</h2>
        <p>
          The plaid and the pom-poms give it a festive look; the construction is what your pet uses
          every night. A short plush surface over a PP cotton fill keeps the bed warm without
          making it a winter-only bed — it is comfortable in every season. The padded base sits flat
          on the floor so the bed does not slide when a dog steps in, and the bolsters are deep
          enough for a cat to tuck its chin over the edge.
        </p>

        <dl class="petbed-specs">
          <div>
            <dt>Sizes</dt>
            <dd>Small 40 × 30 × 20 cm · Medium 50 × 40 × 25 cm · Large 60 × 50 × 30 cm</dd>
          </div>
          <div>
            <dt>Outer</dt>
            <dd>Red-and-cream plaid fabric with green piping</dd>
          </div>
          <div>
            <dt>Surface</dt>
            <dd>Short plush fabric</dd>
          </div>
          <div>
            <dt>Filling</dt>
            <dd>PP cotton</dd>
          </div>
          <div>
            <dt>Season</dt>
            <dd>All seasons; warm enough for winter</dd>
          </div>
          <div>
            <dt>Shape</dt>
            <dd>Oval with raised bolsters and pom-pom trim</dd>
          </div>
          <div>
            <dt>Care</dt>
            <dd>Spot clean with a damp cloth and mild soap, then air dry</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.petbed-page {
  --petbed-ink: #314e53;
  --petbed-accent: #75949a;
  --petbed-warm: #f7ece1;
  --petbed-red: #a33a33;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.petbed-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(28px, 4vw, 60px);
  align-items: center;
  padding: clamp(130px, 11vw, 178px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--petbed-warm));
}

.petbed-eyebrow {
  margin: 0 0 12px;
  color: var(--petbed-red);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.petbed-hero h1 {
  margin: 0;
  color: var(--petbed-ink);
  font-size: clamp(32px, 4.4vw, 62px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.petbed-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.petbed-hero-sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.petbed-hero-sizes li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 700;
}

.petbed-hero-sizes strong {
  margin-right: 5px;
  color: var(--petbed-ink);
  font-weight: 900;
}

.petbed-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.petbed-cta {
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

.petbed-cta--primary {
  background: var(--petbed-ink);
  color: #fef5ed;
}

.petbed-cta--primary:hover,
.petbed-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.petbed-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--petbed-ink);
}

.petbed-cta--ghost:hover,
.petbed-cta--ghost:focus-visible {
  border-color: var(--petbed-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.petbed-hero-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.petbed-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(52px, 6vw, 84px) 0 0;
}

.petbed-heading {
  max-width: 720px;
}

.petbed-heading h2,
.petbed-craft-copy h2 {
  margin: 0;
  color: var(--petbed-ink);
  font-size: clamp(26px, 3.1vw, 42px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.petbed-heading p:not(.petbed-eyebrow),
.petbed-craft-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Sizes ───────────────────────────────────────────────────────────────── */
.petbed-size-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.petbed-size-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.petbed-size-card img {
  display: block;
  /* Natural ratio: the size artwork must not be cropped. */
  width: 100%;
  height: auto;
}

.petbed-size-copy {
  padding: 16px 18px 20px;
}

.petbed-size-fit {
  margin: 0;
  color: var(--petbed-red);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.petbed-size-copy h3 {
  margin: 6px 0 0;
  color: var(--petbed-ink);
  font-size: 20px;
  font-weight: 900;
}

.petbed-size-dimensions {
  margin: 4px 0 0;
  color: #4d666b;
  font-size: 14px;
  font-weight: 800;
}

.petbed-size-price {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin: 10px 0 0;
  color: var(--petbed-ink);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.petbed-size-soldout {
  color: #a03a33;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.petbed-size-note {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.55;
}

.petbed-size-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 42px;
  margin-top: 14px;
  padding: 0 18px;
  border: 1px solid rgba(49, 78, 83, 0.24);
  border-radius: 8px;
  background: #fff;
  color: var(--petbed-ink);
  font: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.petbed-size-add:hover:not(:disabled),
.petbed-size-add:focus-visible:not(:disabled) {
  border-color: var(--petbed-ink);
  background: var(--petbed-ink);
  color: #fef5ed;
}

.petbed-size-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(247, 236, 225, 0.6);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.petbed-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.petbed-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--petbed-warm);
}

.petbed-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--petbed-red);
}

.petbed-feature-card h3 {
  margin: 12px 0 0;
  color: var(--petbed-ink);
  font-size: 16.5px;
  font-weight: 900;
}

.petbed-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Craft + specs ───────────────────────────────────────────────────────── */
.petbed-craft {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.petbed-craft-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

.petbed-specs {
  display: grid;
  gap: 0;
  margin: 24px 0 0;
}

.petbed-specs div {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 14px;
  padding: 11px 0;
  border-top: 1px solid rgba(49, 78, 83, 0.12);
}

.petbed-specs dt {
  color: #7a9499;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.petbed-specs dd {
  margin: 0;
  color: var(--petbed-ink);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .petbed-hero,
  .petbed-craft {
    grid-template-columns: minmax(0, 1fr);
  }

  .petbed-hero {
    padding-top: 152px;
  }

  .petbed-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .petbed-hero {
    padding: 148px 24px 44px;
  }

  .petbed-section {
    width: calc(100% - 32px);
  }

  .petbed-size-grid,
  .petbed-feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .petbed-specs div {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
