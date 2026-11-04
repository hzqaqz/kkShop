<script setup>
import { computed, ref } from 'vue';
import { Anchor, BedDouble, Droplets, Link2, PawPrint, ShieldCheck } from 'lucide-vue-next';
import { useCart } from '../composables/useCart';
import { useShopifyProduct } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Car seat pet bed / carrier.
 *
 * Facts from the seller: straps onto a car seat, lifts out as a carrier, and the
 * side unzips so the whole thing lies flat as a bed. 60 × 50 × 32 cm, waterproof
 * faux leather that wipes clean and does not hold hair, for cats and small dogs
 * up to about 10 kg.
 */
const modes = [
  {
    tag: '01',
    title: 'In the car',
    text: 'The webbing straps loop around the seat and clip on, so the bed stays put while the car is moving.',
    image: '/images/products/car-pet-seat/car-dog.webp',
    alt: 'A corgi riding in the tan car seat pet bed strapped to a car seat',
  },
  {
    tag: '02',
    title: 'Out as a carrier',
    text: 'Unclip it from the seat and lift it out by the handles — the same bed goes from the car to the vet or the café.',
    image: '/images/products/car-pet-seat/car-cat.webp',
    alt: 'A silver tabby cat settled in the car seat bed with the shoulder strap visible',
  },
  {
    tag: '03',
    title: 'Opened flat as a bed',
    text: 'Unzip the front panel and the bolsters fold out, turning the seat into a padded mat for the floor or the park.',
    image: '/images/products/car-pet-seat/flat-bed.webp',
    alt: 'The same bed unzipped flat on the grass with a corgi sleeping on it',
  },
];

const colours = [
  {
    key: 'camel',
    name: 'Camel & cream',
    note: 'Warm tan leather with a cream lining and cream webbing.',
    image: '/images/products/car-pet-seat/product-white.webp',
    alt: 'The car seat bed in camel leather with a cream lining, seen from the front',
  },
  {
    key: 'grey',
    name: 'Grey & cream',
    note: 'Cool grey leather with the same cream lining and grey webbing.',
    image: '/images/products/car-pet-seat/product-grey.webp',
    alt: 'The car seat bed in grey leather with a cream lining, seen from the front',
  },
];

const features = [
  {
    title: 'Waterproof faux leather',
    text: 'A wipe-clean surface: mud, water and accidents stay on top instead of soaking into a fabric cover.',
    icon: Droplets,
  },
  {
    title: 'Hair lifts straight off',
    text: 'The smooth leather does not grip fur the way woven fabric does, so a quick wipe is usually enough.',
    icon: PawPrint,
  },
  {
    title: 'Padded bolsters',
    text: 'Raised sides on all four edges give the pet something to lean against, on the seat and on the floor.',
    icon: BedDouble,
  },
  {
    title: 'Side pocket',
    text: 'A elasticated pocket on the front keeps a lead, treats or a phone within reach of the seat.',
    icon: ShieldCheck,
  },
];

/** Each colour card can add its own Shopify variant straight to the cart. */
const shopifyHandle = getProduct('car-pet-seat')?.shopifyHandle;
const variantLabels = getProduct('car-pet-seat')?.variantLabels ?? {};
const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);

const variantsByColour = computed(() => {
  const map = {};
  for (const variant of shopifyProduct.value?.variants?.nodes ?? []) {
    const optionValue = (variant.selectedOptions ?? [])[0]?.value ?? variant.title;
    const label = variantLabels[optionValue] ?? optionValue;
    const key = label.toLowerCase().includes('grey') ? 'grey' : label.toLowerCase().includes('camel') ? 'camel' : null;
    if (key) {
      map[key] = { id: variant.id, available: variant.availableForSale };
    }
  }
  return map;
});

const { addToCart, loading: cartLoading } = useCart();
const { setVariant } = useVariantSelection();
const addingColour = ref('');

async function addColour(colour) {
  const entry = variantsByColour.value[colour.key];
  if (!entry?.id || !entry.available || addingColour.value) {
    return;
  }
  addingColour.value = colour.key;
  setVariant(shopifyHandle, entry.id);
  await addToCart(entry.id, 1);
  addingColour.value = '';
}

function colourVariant(colour) {
  return variantsByColour.value[colour.key] ?? null;
}

const safety = [
  {
    title: 'Straps around the headrest',
    text: 'The webbing runs behind the headrest and clips back onto the bed, so it cannot slide or tip while the car is moving. It anchors to the seat itself rather than relying on the seat belt.',
    icon: Anchor,
  },
  {
    title: 'A tether for the harness',
    text: 'Inside the bed there is a short clip strap. Fasten it to the pet’s harness and a hard stop will not throw the animal out of the seat.',
    icon: Link2,
  },
];
</script>

<template>
  <div class="carseat-page">
    <section class="carseat-hero" aria-labelledby="carseat-title">
      <div class="carseat-hero-copy">
        <p class="carseat-eyebrow">Travel &amp; car</p>
        <h1 id="carseat-title">Car Seat Pet Bed &amp; Travel Carrier</h1>
        <p class="carseat-lead">
          A padded seat that straps into the car, lifts out as a carrier, and unzips into a flat bed.
          Waterproof faux leather wipes clean and does not hold onto hair — for cats and small dogs
          up to about 10 kg.
        </p>

        <ul class="carseat-highlights">
          <li>60 × 50 × 32 cm</li>
          <li>Waterproof faux leather</li>
          <li>Seat, carrier and flat bed</li>
          <li>Headrest straps + harness tether</li>
          <li>Two colours</li>
        </ul>

        <div class="carseat-hero-actions">
          <a class="carseat-cta carseat-cta--primary" href="#carseat-modes">See the three modes</a>
          <a class="carseat-cta carseat-cta--ghost" :href="contactEmailHref">Ask about this bed</a>
        </div>
      </div>

      <img
        class="carseat-hero-media"
        src="/images/products/car-pet-seat/car-cat.webp"
        alt="A silver tabby cat sitting in the car seat pet bed on a car seat"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="carseat-modes" class="carseat-section" aria-labelledby="carseat-modes-title">
      <div class="carseat-heading">
        <p class="carseat-eyebrow">Three ways to use it</p>
        <h2 id="carseat-modes-title">One bed, from the car to the floor</h2>
        <p>
          Most travel beds do one job. This one is strapped in for the drive, carried by the handles
          once you park, and unzipped flat when the pet would rather stretch out.
        </p>
      </div>

      <div class="carseat-mode-grid">
        <article v-for="mode in modes" :key="mode.tag" class="carseat-mode">
          <img :src="mode.image" :alt="mode.alt" loading="lazy" decoding="async" />
          <div class="carseat-mode-copy">
            <p class="carseat-mode-tag">{{ mode.tag }}</p>
            <h3>{{ mode.title }}</h3>
            <p>{{ mode.text }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="carseat-section" aria-labelledby="carseat-features-title">
      <div class="carseat-heading">
        <p class="carseat-eyebrow">Details</p>
        <h2 id="carseat-features-title">Built for messy days</h2>
      </div>

      <div class="carseat-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="carseat-feature">
          <span class="carseat-feature-icon" aria-hidden="true">
            <component :is="feature.icon" :size="20" />
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>
    </section>

    <section class="carseat-section" aria-labelledby="carseat-safety-title">
      <div class="carseat-heading">
        <p class="carseat-eyebrow">Safety</p>
        <h2 id="carseat-safety-title">Anchored to the seat, tethered to the harness</h2>
        <p>
          A travel bed only helps if it stays where you put it, and if the pet stays in it. Both are
          handled inside the car: the bed is tied to the seat, and the pet is tied to the bed.
        </p>
      </div>

      <div class="carseat-safety-grid">
        <article v-for="item in safety" :key="item.title" class="carseat-safety-card">
          <span class="carseat-safety-icon" aria-hidden="true">
            <component :is="item.icon" :size="22" />
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>

      <p class="carseat-safety-note">
        Use the tether with a properly fitted harness — a collar alone is not a safe anchor point.
      </p>
    </section>

    <section class="carseat-section" aria-labelledby="carseat-colours-title">
      <div class="carseat-heading">
        <p class="carseat-eyebrow">Two colours</p>
        <h2 id="carseat-colours-title">Camel or grey, same cream lining</h2>
        <p>
          Both colourways use the same waterproof faux leather and the same padded bolsters — only
          the outer leather and the webbing change.
        </p>
      </div>

      <div class="carseat-colour-grid">
        <article v-for="colour in colours" :key="colour.name" class="carseat-colour">
          <img :src="colour.image" :alt="colour.alt" loading="lazy" decoding="async" />
          <div class="carseat-colour-copy">
            <h3>{{ colour.name }}</h3>
            <p>{{ colour.note }}</p>

            <button
              v-if="colourVariant(colour)"
              type="button"
              class="carseat-colour-add"
              :disabled="!colourVariant(colour).available || cartLoading || !!addingColour"
              @click="addColour(colour)"
            >
              {{ !colourVariant(colour).available ? 'Sold out' : addingColour === colour.key ? 'Adding…' : 'Add to cart' }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="carseat-section carseat-scene" aria-labelledby="carseat-scene-title">
      <img
        class="carseat-scene-media"
        src="/images/products/car-pet-seat/product-grey.webp"
        alt="The grey car seat pet bed photographed from the front, with its straps, pocket and zip"
        loading="lazy"
        decoding="async"
      />

      <div class="carseat-scene-copy">
        <p class="carseat-eyebrow">Measurements</p>
        <h2 id="carseat-scene-title">Fits a seat, fits a small pet</h2>
        <p>
          At 60 × 50 × 32 cm the bed sits inside a normal passenger seat, with enough room for a cat
          or a small dog to turn around. The bolsters are deep enough to lean on, and low enough that
          a nervous traveller can still see out.
        </p>
        <p>
          It suits cats and small dogs up to about 10 kg — most cats, and breeds such as a corgi or
          a beagle.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.carseat-page {
  --carseat-ink: #314e53;
  --carseat-tan: #b98a5c;
  --carseat-cream: #f7f1e8;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.carseat-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: center;
  padding: clamp(130px, 11vw, 176px) max(7vw, calc((100vw - 1180px) / 2)) clamp(46px, 6vw, 74px);
  background: linear-gradient(180deg, #fdfaf6, var(--carseat-cream));
}

.carseat-eyebrow {
  margin: 0 0 12px;
  color: var(--carseat-tan);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.carseat-hero h1 {
  margin: 0;
  color: var(--carseat-ink);
  font-size: clamp(30px, 4vw, 56px);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.03em;
}

.carseat-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.22vw, 18.5px);
  line-height: 1.62;
}

.carseat-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.carseat-highlights li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 999px;
  background: #fff;
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 700;
}

.carseat-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.carseat-cta {
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

.carseat-cta--primary {
  background: var(--carseat-ink);
  color: #fef5ed;
}

.carseat-cta--primary:hover,
.carseat-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.carseat-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.28);
  color: var(--carseat-ink);
}

.carseat-cta--ghost:hover,
.carseat-cta--ghost:focus-visible {
  border-color: var(--carseat-ink);
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.carseat-hero-media {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.14);
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.carseat-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(50px, 6vw, 82px) 0 0;
}

.carseat-heading {
  max-width: 720px;
}

.carseat-heading h2,
.carseat-scene-copy h2 {
  margin: 0;
  color: var(--carseat-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.carseat-heading p:not(.carseat-eyebrow),
.carseat-scene-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Modes ───────────────────────────────────────────────────────────────── */
.carseat-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.carseat-mode {
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.13);
  border-radius: 12px;
  background: #fff;
}

.carseat-mode img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.carseat-mode-copy {
  padding: 16px 18px 20px;
}

.carseat-mode-tag {
  margin: 0;
  color: var(--carseat-tan);
  font-size: 11.5px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.carseat-mode-copy h3 {
  margin: 6px 0 0;
  color: var(--carseat-ink);
  font-size: 18px;
  font-weight: 900;
}

.carseat-mode-copy p:not(.carseat-mode-tag) {
  margin: 8px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.58;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.carseat-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.carseat-feature {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--carseat-cream);
}

.carseat-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--carseat-tan);
}

.carseat-feature h3 {
  margin: 12px 0 0;
  color: var(--carseat-ink);
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
}

.carseat-feature p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

/* ── Safety ──────────────────────────────────────────────────────────────── */
.carseat-safety-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.carseat-safety-card {
  padding: 24px 22px 26px;
  border: 1px solid rgba(49, 78, 83, 0.1);
  border-radius: 14px;
  background: var(--carseat-cream);
}

.carseat-safety-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #fff;
  color: var(--carseat-tan);
}

.carseat-safety-card h3 {
  margin: 14px 0 0;
  color: var(--carseat-ink);
  font-size: 19px;
  font-weight: 900;
  line-height: 1.25;
}

.carseat-safety-card p {
  margin: 8px 0 0;
  color: #4d666b;
  font-size: 14.5px;
  line-height: 1.6;
}

.carseat-safety-note {
  margin: 18px 0 0;
  color: #6c8a90;
  font-size: 13px;
  font-weight: 600;
}

/* ── Colours ─────────────────────────────────────────────────────────────── */
.carseat-colour-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.carseat-colour {
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.13);
  border-radius: 12px;
  background: #fff;
}

.carseat-colour img {
  display: block;
  width: 100%;
  background: #fff;
  object-fit: contain;
}

.carseat-colour-copy {
  padding: 14px 18px 20px;
  border-top: 1px solid rgba(49, 78, 83, 0.09);
}

.carseat-colour-copy h3 {
  margin: 0;
  color: var(--carseat-ink);
  font-size: 17px;
  font-weight: 900;
}

.carseat-colour-copy p {
  margin: 6px 0 0;
  color: #5f7a80;
  font-size: 13.5px;
  line-height: 1.55;
}

.carseat-colour-add {
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
  color: var(--carseat-ink);
  font: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.carseat-colour-add:hover:not(:disabled),
.carseat-colour-add:focus-visible:not(:disabled) {
  border-color: var(--carseat-ink);
  background: var(--carseat-ink);
  color: #fef5ed;
}

.carseat-colour-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(247, 241, 232, 0.7);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Scene ───────────────────────────────────────────────────────────────── */
.carseat-scene {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.carseat-scene-media {
  width: 100%;
  border-radius: 16px;
  background: #fff;
  object-fit: contain;
}

@media (max-width: 900px) {
  .carseat-hero,
  .carseat-scene {
    grid-template-columns: minmax(0, 1fr);
  }

  .carseat-hero {
    padding-top: 152px;
  }

  .carseat-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .carseat-hero {
    padding: 148px 24px 44px;
  }

  .carseat-section {
    width: calc(100% - 32px);
  }

  .carseat-mode-grid,
  .carseat-feature-grid,
  .carseat-colour-grid,
  .carseat-safety-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
