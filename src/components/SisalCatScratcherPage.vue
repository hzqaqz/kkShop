<script setup>
import { computed, onMounted } from 'vue';
import { BedDouble, Feather, Layers, Ruler } from 'lucide-vue-next';
import { formatMoney, isShopifyConfigured } from '../composables/useShopify';
import { useCart } from '../composables/useCart';
import { useShopifyProduct, useShopifyPrices } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Sisal cat scratcher and lounger.
 *
 * Facts from the seller: sisal rope, 60 × 40 × 8 cm, 600 g, the cat can scratch
 * and sleep on it, and the rope wrap does not crumble into flakes the way a
 * cardboard board does. The raised rim and the ball on a cord are what the
 * product photos show; nothing beyond them is claimed here.
 *
 * Layout and palette follow `PetBedProductPage.vue` (the Christmas bed) so the
 * pet range reads as one set of pages: cream hero, ink CTAs, white cards.
 */
const shopifyHandle = getProduct('sisal-cat-scratcher')?.shopifyHandle;
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

/** Why a rope surface instead of the pressed-cardboard board most cats start on. */
const reasons = [
  {
    tag: '01',
    title: 'No flakes under the board',
    text: 'A cardboard scratcher is pressed paper: it works, but it sheds a drift of flakes onto the floor around it. The surface here is wrapped sisal rope, which holds together and does not crumble away as the cat scratches.',
  },
  {
    tag: '02',
    title: 'A surface that keeps its shape',
    text: 'Rope wound around the board takes claws again and again without going soft in the middle, so the scratching surface stays flat and the cat keeps using it.',
  },
  {
    tag: '03',
    title: 'A rim the cat can lean on',
    text: 'The board stands 8 cm tall in total, with the edge raised all the way round. That holds the scratching area together and gives the cat something to brace against mid-stretch.',
  },
];

const features = [
  {
    title: '60 × 40 cm of surface',
    text: 'Roughly the length of a cat from chest to hind leg, and wide enough to stretch out across it.',
    icon: Ruler,
  },
  {
    title: 'Wrapped sisal rope',
    text: 'A rope surface rather than pressed paper, so scratching does not leave flakes behind.',
    icon: Layers,
  },
  {
    title: 'Scratch, then sleep',
    text: 'The raised rim turns the whole board into a shallow bed the cat can curl up in afterwards.',
    icon: BedDouble,
  },
  {
    title: '600 g, one hand',
    text: 'Light enough to carry from the living room to the bedroom when the cat changes favourite spot.',
    icon: Feather,
  },
];

const care = [
  {
    tag: '01',
    title: 'Vacuum, do not scrub',
    text: 'Run a vacuum brush or a soft hand brush over the surface every week or so to lift out the fibres the cat works loose.',
  },
  {
    tag: '02',
    title: 'Trim loose strands',
    text: 'If a strand works itself free, cut it off at the base with scissors instead of pulling it — pulling can unwind the wrap further.',
  },
  {
    tag: '03',
    title: 'Keep it dry',
    text: 'Sisal is a plant fibre, so keep the board out of the rain and wipe it with a dry or barely damp cloth rather than soaking it.',
  },
  {
    tag: '04',
    title: 'Turn it around',
    text: 'Cats pick a corner and work it hardest. Rotating the board now and then spreads the wear instead of wearing a hollow in one spot.',
  },
];
</script>

<template>
  <div class="sisal-page">
    <section class="sisal-hero" aria-labelledby="sisal-title">
      <div class="sisal-hero-copy">
        <p class="sisal-eyebrow">Cat scratching</p>
        <h1 id="sisal-title">Sisal Cat Scratcher &amp; Lounger</h1>
        <p class="sisal-lead">
          A scratching board made from wrapped sisal rope instead of pressed cardboard, so it does not
          leave flakes on the floor. At 60 × 40 × 8 cm the raised rim also turns it into somewhere the cat
          can curl up — scratch first, sleep after.
        </p>

        <ul class="sisal-hero-facts" aria-label="Key facts">
          <li><strong>Size</strong> 60 × 40 × 8 cm</li>
          <li><strong>Weight</strong> 600 g</li>
          <li><strong>Surface</strong> Sisal rope</li>
          <li><strong>Use</strong> Scratch and sleep</li>
        </ul>

        <div class="sisal-hero-actions">
          <a class="sisal-cta sisal-cta--primary" href="#sisal-why">See what makes it different</a>
          <a class="sisal-cta sisal-cta--ghost" :href="contactEmailHref">Ask about this board</a>
        </div>
      </div>

      <img
        class="sisal-hero-media"
        src="/images/products/sisal-cat-scratcher/hero.webp"
        alt="A Bengal cat stretching forward to scratch the sisal rope cat scratcher in a sunlit living room"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="sisal-why" class="sisal-section" aria-labelledby="sisal-why-title">
      <div class="sisal-heading">
        <p class="sisal-eyebrow">Sisal, not cardboard</p>
        <h2 id="sisal-why-title">Why the surface matters more than the shape</h2>
        <p>
          Most first scratchers are pressed cardboard. They work, and cats take to them, but they are also
          a consumable: the paper breaks down under claws and ends up as flakes on the floor around the
          board. This one is wrapped sisal rope — a surface that keeps its shape under repeated scratching
          and does not crumble away.
        </p>
      </div>

      <div class="sisal-card-grid">
        <article v-for="reason in reasons" :key="reason.title" class="sisal-card">
          <p class="sisal-card-tag">{{ reason.tag }}</p>
          <h3>{{ reason.title }}</h3>
          <p class="sisal-card-text">{{ reason.text }}</p>
        </article>
      </div>

      <div class="sisal-buy">
        <div class="sisal-buy-copy">
          <p class="sisal-buy-label">One size</p>
          <p class="sisal-buy-details">60 × 40 × 8 cm · 600 g · wrapped sisal rope</p>
          <p v-if="priceLabel" class="sisal-buy-price">{{ priceLabel }}</p>
        </div>

        <button
          v-if="shopifyReady && variant?.availableForSale !== false"
          type="button"
          class="sisal-buy-add"
          :disabled="!variant?.availableForSale || cartLoading"
          @click="addToCartFromPage"
        >
          {{ cartLoading ? 'Adding…' : 'Add to cart' }}
        </button>
        <a v-else class="sisal-buy-add" :href="contactEmailHref">
          {{ variant ? 'Ask about availability' : 'Ask about this board' }}
        </a>
      </div>
    </section>

    <section class="sisal-section" aria-labelledby="sisal-features-title">
      <div class="sisal-heading">
        <p class="sisal-eyebrow">Details</p>
        <h2 id="sisal-features-title">What you are getting</h2>
      </div>

      <div class="sisal-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="sisal-feature-card">
          <span class="sisal-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="sisal-section sisal-craft" aria-labelledby="sisal-sleep-title">
      <img
        class="sisal-craft-media"
        src="/images/products/sisal-cat-scratcher/lounging.webp"
        alt="A Bengal cat curled up asleep on the sisal cat scratcher"
        loading="lazy"
        decoding="async"
      />

      <div class="sisal-craft-copy">
        <p class="sisal-eyebrow">Two jobs, one board</p>
        <h2 id="sisal-sleep-title">Scratch, then sleep in it</h2>
        <p>
          Cats scratch where they already spend time, and the spot they scratch is usually the spot they
          sleep. The board is 8 cm tall overall, so its raised edge gives the whole thing a shallow tray
          shape — after the stretching and the clawing the cat can simply settle into it instead of walking
          off to a separate bed.
        </p>
        <p>
          The 60 × 40 cm surface is enough for one cat to curl up on, with the rim to lean a chin against.
          There is also a sisal ball on a cord at the edge for batting at — the same rope the cat is already
          scratching.
        </p>
      </div>
    </section>

    <section class="sisal-section" aria-labelledby="sisal-care-title">
      <div class="sisal-heading">
        <p class="sisal-eyebrow">Looking after it</p>
        <h2 id="sisal-care-title">A rope surface, kept in good order</h2>
        <p>
          Nothing to replace and nothing to recharge — a little upkeep keeps the scratching surface usable
          for longer.
        </p>
      </div>

      <div class="sisal-card-grid sisal-card-grid--four">
        <article v-for="item in care" :key="item.title" class="sisal-card sisal-card--cream">
          <p class="sisal-card-tag">{{ item.tag }}</p>
          <h3>{{ item.title }}</h3>
          <p class="sisal-card-text">{{ item.text }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Palette and type scale copied from `PetBedProductPage.vue` so the pet range
   shares one visual language. */
.sisal-page {
  --sisal-ink: #314e53;
  --sisal-accent: #75949a;
  --sisal-warm: #f7ece1;
  --sisal-red: #a33a33;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.sisal-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(28px, 4vw, 60px);
  align-items: center;
  padding: clamp(130px, 11vw, 178px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--sisal-warm));
}

.sisal-eyebrow {
  margin: 0 0 12px;
  color: var(--sisal-red);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sisal-hero h1 {
  margin: 0;
  color: var(--sisal-ink);
  font-size: clamp(32px, 4.4vw, 62px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.sisal-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.sisal-hero-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.sisal-hero-facts li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 600;
}

.sisal-hero-facts strong {
  margin-right: 5px;
  color: var(--sisal-ink);
  font-weight: 600;
}

.sisal-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.sisal-cta {
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

.sisal-cta--primary {
  background: var(--sisal-ink);
  color: #fef5ed;
}

.sisal-cta--primary:hover,
.sisal-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.sisal-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--sisal-ink);
}

.sisal-cta--ghost:hover,
.sisal-cta--ghost:focus-visible {
  border-color: var(--sisal-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.sisal-hero-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.sisal-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(52px, 6vw, 84px) 0 0;
}

.sisal-heading {
  max-width: 720px;
}

.sisal-heading h2,
.sisal-craft-copy h2 {
  margin: 0;
  color: var(--sisal-ink);
  font-size: clamp(26px, 3.1vw, 42px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.sisal-heading p:not(.sisal-eyebrow),
.sisal-craft-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Reason / care cards ─────────────────────────────────────────────────── */
.sisal-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.sisal-card-grid--four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.sisal-card {
  padding: 18px 20px 22px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.sisal-card--cream {
  border-color: transparent;
  background: var(--sisal-warm);
}

.sisal-card-tag {
  margin: 0;
  color: var(--sisal-red);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sisal-card h3 {
  margin: 6px 0 0;
  color: var(--sisal-ink);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
}

.sisal-card-text {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Buy row ─────────────────────────────────────────────────────────────── */
.sisal-buy {
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

.sisal-buy-copy {
  min-width: 0;
}

.sisal-buy-label {
  margin: 0;
  color: var(--sisal-red);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sisal-buy-details {
  margin: 6px 0 0;
  color: #4d666b;
  font-size: 14px;
  font-weight: 600;
}

.sisal-buy-price {
  margin: 8px 0 0;
  color: var(--sisal-ink);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.sisal-buy-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  min-height: 44px;
  padding: 0 24px;
  border: 1px solid var(--sisal-ink);
  border-radius: 8px;
  background: var(--sisal-ink);
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

.sisal-buy-add:hover:not(:disabled),
.sisal-buy-add:focus-visible:not(:disabled) {
  background: #22383c;
  border-color: #22383c;
}

.sisal-buy-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(247, 236, 225, 0.6);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.sisal-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.sisal-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--sisal-warm);
}

.sisal-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--sisal-red);
}

.sisal-feature-card h3 {
  margin: 12px 0 0;
  color: var(--sisal-ink);
  font-size: 16.5px;
  font-weight: 600;
}

.sisal-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Craft ───────────────────────────────────────────────────────────────── */
.sisal-craft {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.sisal-craft-media {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

/* The full specification table lives in the SEO block at the bottom of the
   page (`productOverview.js`), so this section stops at the copy. */

@media (max-width: 900px) {
  .sisal-hero,
  .sisal-craft {
    grid-template-columns: minmax(0, 1fr);
  }

  .sisal-hero {
    padding-top: 152px;
  }

  .sisal-card-grid,
  .sisal-card-grid--four,
  .sisal-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .sisal-hero {
    padding: 148px 24px 44px;
  }

  .sisal-section {
    width: calc(100% - 32px);
  }

  .sisal-card-grid,
  .sisal-card-grid--four,
  .sisal-feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .sisal-buy {
    align-items: stretch;
  }

  .sisal-buy-add {
    width: 100%;
  }
}
</style>
