<script setup>
import { computed, ref } from 'vue';
import { Layers, Ruler, Sticker, TreePine } from 'lucide-vue-next';
import { useCart } from '../composables/useCart';
import { useShopifyProduct } from '../composables/useShopifyPrices';
import { useVariantSelection } from '../composables/useVariantSelection';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Framed cat scratching board.
 *
 * Facts from the seller: four artworks, sisal + EPS core, 42 × 33 × 3 cm,
 * 650 g, mounted with four pairs of velcro pads that leave no residue on walls
 * or furniture. The five fitting steps are the manufacturer's.
 */
const designs = [
  {
    key: 'starry',
    name: 'Starry Night',
    note: 'Deep blue swirls with a black cat silhouette.',
    image: '/images/products/cat-scratcher-frame/design-starry.webp',
  },
  {
    key: 'sunflowers',
    name: 'Sunflowers',
    note: 'Van Gogh sunflowers with a black cat at the vase.',
    image: '/images/products/cat-scratcher-frame/design-sunflowers.webp',
  },
  {
    key: 'pearl',
    name: 'Meow with a Pearl Earring',
    note: 'A cream cat in a yellow turban, pearl earrings and a lilac scarf.',
    image: '/images/products/cat-scratcher-frame/design-hood.webp',
  },
  {
    key: 'cypress',
    name: 'Cypress Field',
    note: 'Swirling sky, tall cypresses, one pair of yellow eyes.',
    image: '/images/products/cat-scratcher-frame/design-landscape.webp',
  },
];

/** Each design card can add its own Shopify variant straight to the cart. */
const shopifyHandle = getProduct('cat-scratcher-frame')?.shopifyHandle;
const variantLabels = getProduct('cat-scratcher-frame')?.variantLabels ?? {};
const { product: shopifyProduct } = useShopifyProduct(shopifyHandle);

const variantsByDesign = computed(() => {
  const map = {};
  for (const variant of shopifyProduct.value?.variants?.nodes ?? []) {
    const optionValue = (variant.selectedOptions ?? [])[0]?.value ?? variant.title;
    const label = variantLabels[optionValue] ?? optionValue;
    const design = designs.find((item) => item.name === label);
    if (design) {
      map[design.key] = { id: variant.id, available: variant.availableForSale };
    }
  }
  return map;
});

const { addToCart, loading: cartLoading } = useCart();
const { setVariant } = useVariantSelection();
const addingDesign = ref('');

async function addDesign(design) {
  const entry = variantsByDesign.value[design.key];
  if (!entry?.id || !entry.available || addingDesign.value) {
    return;
  }
  addingDesign.value = design.key;
  setVariant(shopifyHandle, entry.id);
  await addToCart(entry.id, 1);
  addingDesign.value = '';
}

function designVariant(design) {
  return variantsByDesign.value[design.key] ?? null;
}

const steps = [
  'Clean the wall or furniture surface so there is no dust or grease on it.',
  'Take the velcro pads supplied. Each pair is one soft and one hook side — there are four pairs. Press each pair together first.',
  'Peel the white backing off one side of a pad and stick it to one of the four corners on the back of the frame.',
  'Peel the backing off the other side and press the frame onto the wall or furniture where you want it.',
  'Hold the frame against the surface for about 10 seconds so the adhesive sets.',
];

const features = [
  {
    title: 'Hangs like a picture',
    text: 'A wooden-look frame at 42 × 33 × 3 cm that reads as wall art rather than cat furniture.',
    icon: Ruler,
  },
  {
    title: 'No residue, no drill',
    text: 'Four pairs of velcro pads hold it up. Take it down and the wall or furniture is left as it was.',
    icon: Sticker,
  },
  {
    title: 'Sisal + EPS core',
    text: 'A sisal face for claws over an EPS core that keeps the board light at 650 g.',
    icon: Layers,
  },
  {
    title: 'Wall, sofa or cabinet',
    text: 'Any flat, clean surface with enough room: a hallway wall, the side of a sofa, a cabinet door.',
    icon: TreePine,
  },
];
</script>

<template>
  <div class="cframe-page">
    <section class="cframe-hero" aria-labelledby="cframe-title">
      <div class="cframe-hero-copy">
        <p class="cframe-eyebrow">Cat scratching</p>
        <h1 id="cframe-title">Framed Cat Scratching Board</h1>
        <p class="cframe-lead">
          A scratching board that hangs like a framed painting. Four velcro pads hold it to a wall, a
          sofa side or a cabinet — and when it comes down it leaves no glue behind. Sisal over an EPS
          core, 42 × 33 × 3 cm, 650 g.
        </p>

        <ul class="cframe-highlights">
          <li>42 × 33 × 3 cm · 650 g</li>
          <li>Sisal + EPS</li>
          <li>No-residue velcro mounting</li>
          <li>Four artworks</li>
        </ul>

        <div class="cframe-hero-actions">
          <a class="cframe-cta cframe-cta--primary" href="#cframe-designs">See the designs</a>
          <a class="cframe-cta cframe-cta--ghost" :href="contactEmailHref">Ask about this board</a>
        </div>
      </div>

      <img
        class="cframe-hero-media"
        src="/images/products/cat-scratcher-frame/hero.webp"
        alt="A Bengal cat stretching up to scratch the framed Starry Night board mounted on a wall"
        loading="eager"
        decoding="async"
      />
    </section>

    <section id="cframe-designs" class="cframe-section" aria-labelledby="cframe-designs-title">
      <div class="cframe-heading">
        <p class="cframe-eyebrow">Four designs</p>
        <h2 id="cframe-designs-title">Art the cat is allowed to scratch</h2>
        <p>
          Each board is printed with one of four cat-themed paintings, framed in wood-look moulding
          with a white mount.
        </p>
      </div>

      <div class="cframe-design-grid">
        <article v-for="design in designs" :key="design.name" class="cframe-design">
          <img :src="design.image" :alt="`${design.name} framed cat scratching board`" loading="lazy" decoding="async" />
          <div class="cframe-design-copy">
            <h3>{{ design.name }}</h3>
            <p>{{ design.note }}</p>

            <button
              v-if="designVariant(design)"
              type="button"
              class="cframe-design-add"
              :disabled="!designVariant(design).available || cartLoading || !!addingDesign"
              @click="addDesign(design)"
            >
              {{ !designVariant(design).available ? 'Sold out' : addingDesign === design.key ? 'Adding…' : 'Add to cart' }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="cframe-section" aria-labelledby="cframe-mount-title">
      <div class="cframe-heading">
        <p class="cframe-eyebrow">Mounting</p>
        <h2 id="cframe-mount-title">Sticks where you need it, lifts off clean</h2>
        <p>
          The kit uses velcro pads rather than screws or glue, so the board can move from one room to
          another without marking the surface underneath.
        </p>
      </div>

      <div class="cframe-mount-grid">
        <figure class="cframe-mount-card">
          <img src="/images/products/cat-scratcher-frame/velcro-strip.webp" alt="Velcro pad being peeled apart, showing the hook and loop sides" loading="lazy" decoding="async" />
          <figcaption>Four pairs: one soft side, one hook side.</figcaption>
        </figure>
        <figure class="cframe-mount-card">
          <img src="/images/products/cat-scratcher-frame/velcro-apply.webp" alt="Pad being pressed onto the back corner of the frame" loading="lazy" decoding="async" />
          <figcaption>One side on the frame, the other on the wall.</figcaption>
        </figure>
      </div>
    </section>

    <section class="cframe-section" aria-labelledby="cframe-steps-title">
      <div class="cframe-heading">
        <p class="cframe-eyebrow">Fitting</p>
        <h2 id="cframe-steps-title">How to fit it</h2>
        <p>Takes a couple of minutes and needs no tools.</p>
      </div>

      <ol class="cframe-steps">
        <li v-for="(step, index) in steps" :key="step">
          <span class="cframe-step-number">{{ index + 1 }}</span>
          <p>{{ step }}</p>
        </li>
      </ol>
    </section>

    <section class="cframe-section cframe-specs" aria-labelledby="cframe-specs-title">
      <div class="cframe-specs-copy">
        <p class="cframe-eyebrow">Measurements</p>
        <h2 id="cframe-specs-title">A board that fits the wall it hangs on</h2>
        <p>
          At 42 × 33 cm and 3 cm deep, it covers roughly the width of a cat’s stretch, so the cat can
          reach up and pull down without stepping off the surface.
        </p>
        <p>
          At 650 g it stays up on four small pads, and it can be moved between rooms without leaving
          a mark.
        </p>
      </div>

      <img
        class="cframe-specs-media"
        src="/images/products/cat-scratcher-frame/design-hood.webp"
        alt="The Little Hood framed cat scratching board"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section class="cframe-section" aria-labelledby="cframe-features-title">
      <div class="cframe-heading">
        <p class="cframe-eyebrow">Details</p>
        <h2 id="cframe-features-title">What makes it a scratcher</h2>
      </div>

      <div class="cframe-feature-grid">
        <article v-for="feature in features" :key="feature.title" class="cframe-feature">
          <span class="cframe-feature-icon" aria-hidden="true">
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
.cframe-page {
  --cframe-ink: #314e53;
  --cframe-accent: #8a6a4a;
  --cframe-cream: #f8f3ec;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.cframe-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: center;
  padding: clamp(130px, 11vw, 176px) max(7vw, calc((100vw - 1180px) / 2)) clamp(46px, 6vw, 74px);
  background: linear-gradient(180deg, #fdfaf5, var(--cframe-cream));
}

.cframe-eyebrow {
  margin: 0 0 12px;
  color: var(--cframe-accent);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cframe-hero h1 {
  margin: 0;
  color: var(--cframe-ink);
  font-size: clamp(30px, 4vw, 56px);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.03em;
}

.cframe-lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: #4d666b;
  font-size: clamp(15.5px, 1.22vw, 18.5px);
  line-height: 1.62;
}

.cframe-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.cframe-highlights li {
  padding: 7px 13px;
  border: 1px solid rgba(49, 78, 83, 0.14);
  border-radius: 999px;
  background: #fff;
  color: #4d666b;
  font-size: 12.5px;
  font-weight: 700;
}

.cframe-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.cframe-cta {
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

.cframe-cta--primary {
  background: var(--cframe-ink);
  color: #fef5ed;
}

.cframe-cta--primary:hover,
.cframe-cta--primary:focus-visible {
  background: #22383c;
  transform: translateY(-2px);
}

.cframe-cta--ghost {
  border: 1.5px solid rgba(49, 78, 83, 0.28);
  color: var(--cframe-ink);
}

.cframe-cta--ghost:hover,
.cframe-cta--ghost:focus-visible {
  border-color: var(--cframe-ink);
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.cframe-hero-media {
  width: 100%;
  max-height: 620px;
  border-radius: 16px;
  object-fit: cover;
  object-position: center top;
  box-shadow: 0 24px 48px rgba(49, 78, 83, 0.14);
}

/* ── Shared sections ─────────────────────────────────────────────────────── */
.cframe-section {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(50px, 6vw, 82px) 0 0;
}

.cframe-heading {
  max-width: 720px;
}

.cframe-heading h2,
.cframe-specs-copy h2 {
  margin: 0;
  color: var(--cframe-ink);
  font-size: clamp(25px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.cframe-heading p:not(.cframe-eyebrow),
.cframe-specs-copy p {
  margin: 14px 0 0;
  color: #4d666b;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.62;
}

/* ── Designs ─────────────────────────────────────────────────────────────── */
.cframe-design-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}

.cframe-design {
  overflow: hidden;
  border: 1px solid rgba(49, 78, 83, 0.12);
  border-radius: 12px;
  background: #fff;
}

.cframe-design img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.cframe-design-copy {
  padding: 13px 15px 17px;
}

.cframe-design-copy h3 {
  margin: 0;
  color: var(--cframe-ink);
  font-size: 16.5px;
  font-weight: 900;
}

.cframe-design-copy p {
  margin: 5px 0 0;
  color: #5f7a80;
  font-size: 13px;
  line-height: 1.5;
}

.cframe-design-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  padding: 0 16px;
  border: 1px solid rgba(49, 78, 83, 0.24);
  border-radius: 8px;
  background: #fff;
  color: var(--cframe-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.cframe-design-add:hover:not(:disabled),
.cframe-design-add:focus-visible:not(:disabled) {
  border-color: var(--cframe-ink);
  background: var(--cframe-ink);
  color: #fef5ed;
}

.cframe-design-add:disabled {
  border-color: rgba(49, 78, 83, 0.12);
  background: rgba(248, 243, 236, 0.8);
  color: #93a9ad;
  cursor: not-allowed;
}

/* ── Mounting ────────────────────────────────────────────────────────────── */
.cframe-mount-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.cframe-mount-card {
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(49, 78, 83, 0.12);
}

.cframe-mount-card img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.cframe-mount-card figcaption {
  padding: 12px 16px 15px;
  color: #4d666b;
  font-size: 13.5px;
  font-weight: 700;
}

/* ── Steps ───────────────────────────────────────────────────────────────── */
.cframe-steps {
  display: grid;
  gap: 12px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.cframe-steps li {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 14px 18px;
  border-radius: 10px;
  background: var(--cframe-cream);
}

.cframe-step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--cframe-ink);
  color: #fef5ed;
  font-size: 13px;
  font-weight: 900;
}

.cframe-steps p {
  margin: 3px 0 0;
  color: #3f5c62;
  font-size: 14.5px;
  line-height: 1.55;
}

/* ── Specs ───────────────────────────────────────────────────────────────── */
.cframe-specs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.75fr);
  gap: clamp(24px, 4vw, 54px);
  align-items: center;
}

.cframe-specs-media {
  width: 100%;
  border-radius: 14px;
  object-fit: contain;
}

/* ── Features ────────────────────────────────────────────────────────────── */
.cframe-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.cframe-feature {
  padding: 20px 18px 22px;
  border-radius: 12px;
  background: var(--cframe-cream);
}

.cframe-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff;
  color: var(--cframe-accent);
}

.cframe-feature h3 {
  margin: 12px 0 0;
  color: var(--cframe-ink);
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
}

.cframe-feature p {
  margin: 6px 0 0;
  color: #556f74;
  font-size: 13.5px;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .cframe-hero,
  .cframe-specs {
    grid-template-columns: minmax(0, 1fr);
  }

  .cframe-hero {
    padding-top: 152px;
  }

  .cframe-design-grid,
  .cframe-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .cframe-hero {
    padding: 148px 24px 44px;
  }

  .cframe-section {
    width: calc(100% - 32px);
  }

  .cframe-design-grid,
  .cframe-feature-grid,
  .cframe-mount-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .cframe-steps li {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 10px;
  }
}
</style>
