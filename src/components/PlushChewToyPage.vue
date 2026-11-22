<script setup>
import { computed } from 'vue';
import { Bone, Check, Droplets, ShieldCheck, Volume2 } from 'lucide-vue-next';
import ProductPriceTag from './ProductPriceTag.vue';
import { contactEmailHref } from '../data/siteInfo';
import { getProduct } from '../data/products';
import { useShopifyProduct } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';

/**
 * Plush squeaky chew toys.
 *
 * Facts come from the seller: plush bodies with a squeaker inside, roughly
 * 21 cm tall and 12 cm wide, 74 g, machine washable, sold for chewing as well
 * as play. The range photographed for the shop is two puppies, a donkey, a green onion, a
 * banana, three seahorses and a manta ray; the rope tail or loop on the sea
 * animals is what gives the chew something firmer than plush.
 *
 * The nine designs are nine Shopify variants, all the same price, so the design
 * cards double as the variant picker: clicking one hands that design to the buy
 * bar at the bottom of the page (shared `useVariantSelection` state).
 */
const product = getProduct('plush-squeaky-chew-toys');
const shopifyHandle = product?.shopifyHandle ?? '';

const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);
const { selection, setVariant } = useVariantSelection();

/** Design name (the Shopify option value) -> variant, so a card can pick it. */
const variantsByDesign = computed(() => {
  const map = new Map();
  for (const variant of shopifyProduct.value?.variants?.nodes ?? []) {
    const value = variant.selectedOptions?.[0]?.value ?? variant.title;
    map.set(value, variant);
  }
  return map;
});

const selectedVariantId = computed(
  () => selection.value[shopifyHandle] ?? shopifyProduct.value?.variants?.nodes?.[0]?.id ?? '',
);

function chooseDesign(name) {
  const variant = variantsByDesign.value.get(name);
  if (variant) {
    setVariant(shopifyHandle, variant.id);
  }
}

function designState(name) {
  const variant = variantsByDesign.value.get(name);
  if (variant && variant.id === selectedVariantId.value) {
    return 'selected';
  }
  if (variant && !variant.availableForSale) {
    return 'sold-out';
  }
  return '';
}

const highlights = ['Squeaker inside', '21 × 12 cm', '74 g', 'Machine washable'];

const designs = [
  {
    name: 'Puppy — mint & sunshine',
    image: '/images/products/plush-squeaky-toys/puppy-mint.webp',
    width: 942,
    height: 944,
    alt: 'A mint-green plush puppy with sunshine-yellow paws, muzzle and ears',
    note: 'Stands on four paws, with floppy ears, a stitched muzzle and a squeaker in the belly.',
  },
  {
    name: 'Donkey — charcoal & blush',
    image: '/images/products/plush-squeaky-toys/donkey-charcoal.webp',
    width: 946,
    height: 950,
    alt: 'A charcoal-grey plush donkey with a blush-pink muzzle, paws and long ears',
    note: 'Charcoal plush with blush-pink muzzle, paws and ear linings, and a tuft of hair between the long ears.',
  },
  {
    name: 'Puppy — cocoa & cream',
    image: '/images/products/plush-squeaky-toys/puppy-cocoa.webp',
    width: 952,
    height: 950,
    alt: 'A cocoa-brown plush puppy with a cream muzzle and cream paws',
    note: 'Cocoa body with a cream muzzle, paws and ear linings.',
  },
  {
    name: 'Green onion',
    image: '/images/products/plush-squeaky-toys/green-onion.webp',
    width: 1373,
    height: 1373,
    alt: 'A cream ribbed plush green onion with two long sage-green leaves on top and a stitched smile',
    note: 'A ribbed cream bulb with two long sage-green leaves on top — the easiest one for a small mouth.',
  },
  {
    name: 'Banana',
    image: '/images/products/plush-squeaky-toys/banana.webp',
    width: 1394,
    height: 1394,
    alt: 'A cream plush banana with the peel folded open over a green fruit body',
    note: 'A cream peel that folds open over a green body, with a brown stalk at each end.',
  },
  {
    name: 'Seahorse — sunshine & sage',
    image: '/images/products/plush-squeaky-toys/seahorse-sunshine.webp',
    width: 1400,
    height: 1400,
    alt: 'A sunshine-yellow plush seahorse with sage-green fins and a rope loop',
    note: 'Curled body, textured scales, and a cotton rope loop through the snout to hold and tug.',
  },
  {
    name: 'Seahorse — turquoise & rust',
    image: '/images/products/plush-squeaky-toys/seahorse-turquoise.webp',
    width: 1339,
    height: 1339,
    alt: 'A turquoise plush seahorse with rust-red fins and a rope loop',
    note: 'The same seahorse in turquoise with rust fins.',
  },
  {
    name: 'Seahorse — lilac & red',
    image: '/images/products/plush-squeaky-toys/seahorse-lilac.webp',
    width: 1367,
    height: 1367,
    alt: 'A lilac plush seahorse with red fins and a rope loop',
    note: 'The same seahorse in lilac with red fins.',
  },
  {
    name: 'Manta ray — lime & mustard',
    image: '/images/products/plush-squeaky-toys/manta-ray.webp',
    width: 1257,
    height: 1257,
    alt: 'A lime-green plush manta ray with mustard fins and a knotted rope tail',
    note: 'Flat and wide, with mustard fins and a knotted rope tail for tugging.',
  },
];

const features = [
  {
    title: 'A squeaker in the body',
    text: 'The squeaker sits inside the plush, which is what turns a quiet toy into something that answers back — the feedback a puppy or a cat is actually looking for.',
    icon: Volume2,
  },
  {
    title: 'Plush plus rope',
    text: 'Soft plush for carrying and mouthing. The seahorses and the manta ray add a cotton rope loop or tail, sewn through the body rather than glued, for holding, tugging and chewing.',
    icon: Bone,
  },
  {
    title: 'Made to be chewed',
    text: 'Both materials give teeth something to work against — the ribbed plush by giving way, the rope by holding firm — which is the chewing a teething puppy or kitten is after.',
    icon: ShieldCheck,
  },
  {
    title: 'Machine washable',
    text: 'The whole toy goes in the machine in a mesh bag on a cold cycle and air-dries. The squeaker is sealed inside the body, so a wash does not fill it with water.',
    icon: Droplets,
  },
];

const care = [
  'Machine wash cold in a mesh bag',
  'Air-dry — do not tumble dry',
  'Check seams and the squeaker now and then',
  'Take the toy away once a seam opens',
  'Supervise chewing, especially with puppies and kittens',
];

</script>

<template>
  <div class="plush-page">
    <section class="plush-hero" aria-labelledby="plush-title">
      <div class="plush-hero-copy">
        <p class="plush-eyebrow">Playtime · New</p>
        <h1 id="plush-title">{{ product?.title ?? 'Meower Plush Squeaky Chew Toys' }}</h1>
        <p class="plush-lead">
          Plush chew toys with a squeaker buried inside: two puppies, a donkey, a green onion, a banana,
          three seahorses and a manta ray. Each one is about 21 cm tall and 12 cm wide, weighs 74 g and can
          go in the washing machine — and the seahorses and the manta ray add a cotton rope loop or
          tail to grab.
        </p>

        <ul class="plush-highlights">
          <li v-for="item in highlights" :key="item">{{ item }}</li>
        </ul>

        <ProductPriceTag :handle="shopifyHandle" note="per toy" />

        <div class="plush-hero-actions">
          <a class="plush-cta plush-cta--primary" href="#plush-designs">See all the designs</a>
          <a class="plush-cta plush-cta--ghost" :href="contactEmailHref">Ask about these toys</a>
        </div>
      </div>

      <img
        class="plush-hero-media"
        src="/images/products/plush-squeaky-toys/puppy-mint.webp"
        width="942"
        height="944"
        alt="A mint-green plush puppy with sunshine-yellow paws and ears, sitting against a pale blue wall"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="plush-designs" class="plush-section" aria-labelledby="plush-designs-title">
      <div class="plush-heading">
        <p class="plush-eyebrow">The line-up</p>
        <h2 id="plush-designs-title">Nine characters, one size</h2>
        <p>
          Every design is built the same way — plush body, squeaker inside, a rope part to grab — and
          every one lands within a centimetre or two of 21 × 12 cm, so a puppy that likes one will
          like the rest. Which ones are in stock changes; ask us and we will confirm what is on the
          shelf.
        </p>
      </div>

      <div class="plush-design-grid">
        <figure
          v-for="design in designs"
          :key="design.name"
          class="plush-design-card"
          :class="designState(design.name) ? `is-${designState(design.name)}` : ''"
        >
          <button
            class="plush-design-pick"
            type="button"
            :aria-pressed="designState(design.name) === 'selected'"
            :aria-label="`Choose ${design.name}`"
            @click="chooseDesign(design.name)"
          >
            <img
              :src="design.image"
              :width="design.width"
              :height="design.height"
              :alt="design.alt"
              loading="lazy"
              decoding="async"
            />
            <span v-if="designState(design.name) === 'selected'" class="plush-design-flag">
              <Check aria-hidden="true" :size="14" />
              Selected
            </span>
            <span v-else-if="designState(design.name) === 'sold-out'" class="plush-design-flag">
              Sold out
            </span>
          </button>
          <figcaption>
            <h3>{{ design.name }}</h3>
            <p>{{ design.note }}</p>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="plush-section" aria-labelledby="plush-features-title">
      <div class="plush-heading">
        <p class="plush-eyebrow">Why it works</p>
        <h2 id="plush-features-title">A squeak, a rope and something to chew</h2>
      </div>

      <div class="plush-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="plush-feature-card">
          <span class="plush-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="plush-section plush-two-col" aria-labelledby="plush-care-title">
      <div class="plush-two-col-copy">
        <p class="plush-eyebrow">Size and care</p>
        <h2 id="plush-care-title">Small enough to carry, tough enough to chew</h2>
        <p>
          At 21 cm by 12 cm and 74 g, these sit in the range a puppy can pick up and shake without
          dragging it along the floor, and a cat can hook with a claw and bunny-kick. The rope part
          is the firm bit: sewn through the body rather than glued on, so it is the last piece to
          come away.
        </p>
        <p>
          Washing is the whole toy, not a cover: cold cycle, mesh bag, air-dry. The squeaker is
          sealed inside the plush, so it keeps working after a wash — as long as the seams are intact,
          which is worth a quick check each week.
        </p>
      </div>

      <div class="plush-two-col-side">
        <h3 class="plush-side-title">Care and safety</h3>
        <ul class="plush-care-list">
          <li v-for="item in care" :key="item">{{ item }}</li>
        </ul>
        <p class="plush-side-note">
          Plush fabric with a cotton rope part and a sealed squeaker. Like any chew toy it is not
          indestructible: once a seam or the rope starts to give, replace it rather than leave it with
          the pet.
        </p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Same tokens as the rest of the pet range (PetBedProductPage, TriangleCatBedPage,
   PetStrollerPage, SisalCatScratcherPage, LoofahCatToyPage). */
.plush-page {
  --plush-ink: #314e53;
  --plush-accent: #75949a;
  --plush-warm: #f7ece1;
  --plush-red: #a33a33;
  /* Price lockup colours (see ProductPriceTag.vue). */
  --price-ink: var(--plush-ink);
  --price-muted: #7a9499;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.plush-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: center;
  padding: clamp(130px, 11vw, 176px) max(7vw, calc((100vw - 1180px) / 2)) clamp(48px, 6vw, 76px);
  background: linear-gradient(180deg, #fdf8f3, var(--plush-warm));
}

.plush-eyebrow {
  margin: 0 0 12px;
  color: var(--plush-red);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.plush-hero h1 {
  text-wrap: balance;
  margin: 0;
  color: var(--plush-ink);
  font-size: clamp(26px, 4vw, 54px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.plush-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.25vw, 19px);
  line-height: 1.6;
}

.plush-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.plush-highlights li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 600;
}

.plush-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.plush-cta {
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

.plush-cta--primary {
  background: var(--plush-ink);
  color: #fef5ed;
}

.plush-cta--primary:hover,
.plush-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.plush-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.3);
  color: var(--plush-ink);
}

.plush-cta--ghost:hover,
.plush-cta--ghost:focus-visible {
  border-color: var(--plush-ink);
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.plush-hero-media {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.16);
}

/* ── Shared section shell ────────────────────────────────────────────────── */
.plush-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(50px, 6vw, 82px) 0 0;
}

.plush-heading {
  max-width: 720px;
}

.plush-heading h2,
.plush-two-col-copy h2 {
  margin: 0;
  color: var(--plush-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.plush-heading p:not(.plush-eyebrow),
.plush-two-col-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Designs ─────────────────────────────────────────────────────────────── */
.plush-design-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}

.plush-design-card {
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 12px;
  background: #fff;
}

.plush-design-card {
  transition: border-color 160ms ease;
}

.plush-design-card.is-selected {
  border-color: var(--plush-ink);
}

/* The artwork is the variant picker: square shots, whether they came straight
   from the studio (blue backdrop) or trimmed to the toy on white. */
.plush-design-pick {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.plush-design-pick img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #fff;
  transition: opacity 160ms ease;
}

.plush-design-pick:hover img,
.plush-design-pick:focus-visible img {
  opacity: 0.88;
}

.plush-design-pick:focus-visible {
  outline: 2px solid var(--plush-ink);
  outline-offset: -2px;
}

.plush-design-flag {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--plush-ink);
  color: #fef5ed;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.plush-design-card.is-sold-out .plush-design-flag {
  background: rgba(49, 78, 83, 0.72);
}

.plush-design-card figcaption {
  padding: 14px 16px 18px;
}

.plush-design-card h3 {
  margin: 0;
  color: var(--plush-ink);
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.3;
}

.plush-design-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13px;
  line-height: 1.55;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.plush-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.plush-feature-card {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--plush-warm);
}

.plush-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--plush-red);
}

.plush-feature-card h3 {
  margin: 12px 0 0;
  color: var(--plush-ink);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.plush-feature-card p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Size + care ─────────────────────────────────────────────────────────── */
.plush-two-col {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: start;
}

.plush-two-col-side {
  padding: 24px 22px 26px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 14px;
  background: var(--plush-warm);
}

.plush-side-title {
  margin: 0;
  color: var(--plush-ink);
  font-size: 16px;
  font-weight: 600;
}

.plush-care-list {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.plush-care-list li {
  position: relative;
  padding-left: 20px;
  color: #4d666b;
  font-size: 14px;
  line-height: 1.5;
}

.plush-care-list li::before {
  position: absolute;
  top: 7px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--plush-accent);
  content: '';
}

.plush-side-note {
  margin: 16px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .plush-hero,
  .plush-two-col {
    grid-template-columns: minmax(0, 1fr);
  }

  .plush-hero {
    padding-top: 152px;
  }

  .plush-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .plush-design-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .plush-hero {
    padding: 148px 24px 44px;
  }

  .plush-section {
    width: calc(100% - 32px);
  }

  .plush-feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
