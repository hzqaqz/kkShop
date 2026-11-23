<script setup>
import {
  Feather,
  House,
  Layers,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Usb,
  Volume2,
  Wind,
  Zap,
} from 'lucide-vue-next';
import ProductPriceTag from './ProductPriceTag.vue';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';

/**
 * Desktop air purifier — laid out exactly like Mw200AirPurifierPage.vue (split
 * hero with the warm wash, benefits band, "Key Features" icon grid, overview
 * with spec chips and filter stages, then a three-card strip) so the two
 * air-purifier pages read as one family: same palette (#314e53 ink, #75949a
 * accent, #f5eee5 warm), same type scale, same section rhythm.
 *
 * Every figure repeats the manufacturer data sheet: 114 × 114 × 190 mm body,
 * 119 × 119 × 199 mm packing, 333.3 g net (pack 490 g), EPA11 filter with a VOC
 * pad, 51–150 m³/h airflow, ≤ 37 dB(A), 11–20 m², USB-C 5 V 2 A / 50 Hz,
 * 5–12 W. Keep `products.js`, `productOverview.js` and `productFaqs.js` in sync
 * with any change here.
 */
const shopifyHandle = getProduct('desktop-air-purifier')?.shopifyHandle ?? '';

const benefits = [
  {
    title: 'Cleaner air, where you sit.',
    text: '51–150 m³/h of airflow rated for 11–20 m², aimed at the desk or the bedside table rather than the whole floor.',
    icon: Wind,
  },
  {
    title: 'Quiet enough to leave on.',
    text: 'At ≤ 37 dB(A) it can stay beside you through a working day, an evening of reading or a night’s sleep.',
    icon: Volume2,
  },
  {
    title: 'One cable, no socket.',
    text: 'USB-C at 5 V 2 A draws 5–12 W, so a laptop, a wall charger or a power bank is enough to run it.',
    icon: Usb,
  },
];

const features = [
  { label: '11–20 m² Coverage', icon: House },
  { label: '51–150 m³/h Airflow', icon: Wind },
  { label: '≤ 37 dB(A)', icon: Volume2 },
  { label: '5–12 W Draw', icon: Zap },
  { label: 'USB-C Input', icon: Usb },
  { label: 'EPA11 Filter', icon: ShieldCheck },
  { label: 'VOC Pad', icon: Layers },
  { label: '360° Air Intake', icon: RefreshCw },
  { label: '333.3 g Portable', icon: Feather },
  { label: 'Lift-Off Top', icon: RotateCcw },
];

const filterStages = [
  { label: 'EPA11 filter', icon: ShieldCheck },
  { label: 'VOC pad', icon: Layers },
  { label: '360° intake', icon: RefreshCw },
];

const specs = [
  ['Airflow', '51–150 m³/h'],
  ['Recommended room', '11–20 m²'],
  ['Noise level', '≤ 37 dB(A)'],
  ['Rated power', '5–12 W'],
];

/**
 * Jump to the long-form "Key specifications" table in the SEO block below.
 * Native fragment scrolling ignores that block's `scroll-margin-top`, which
 * would tuck the heading under the fixed header, so scroll it manually.
 */
function scrollToSpecs(event) {
  const target = document.getElementById('product-specs');
  if (!target) {
    return;
  }
  event.preventDefault();
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

const upClose = [
  {
    label: 'Ring outlet',
    image: '/images/products/desktop-air-purifier/top-rings.webp',
    alt: 'Top-down view of the concentric ring outlet on the desktop air purifier',
  },
  {
    label: 'USB-C port',
    image: '/images/products/desktop-air-purifier/front-usb-c.webp',
    alt: 'USB-C port set into the upper band of the desktop air purifier',
  },
  {
    label: 'Lift-off top',
    image: '/images/products/desktop-air-purifier/two-piece.webp',
    alt: 'The desktop air purifier with its top section lifted off beside the perforated body',
  },
];
</script>

<template>
  <article class="dp-purifier">
    <section class="dp-hero" aria-labelledby="dp-title">
      <img
        class="dp-hero-image"
        src="/images/products/desktop-air-purifier/hero-desk.webp"
        width="1600"
        height="1200"
        alt="Meower desktop air purifier standing on a grey desk beside a monitor, a laptop and a mug"
      />
      <div class="dp-hero-copy">
        <p class="dp-eyebrow">USB-C Purification for One Person</p>
        <h1 id="dp-title">
          <span class="dp-title-lead">Meower Desktop EPA11</span>
          <span class="dp-title-keep">Air Purifier</span>
          <span class="dp-title-sub">for the Desk, the Bedside Table &amp; the Study Corner</span>
        </h1>

        <ProductPriceTag :handle="shopifyHandle" fallback="Price on request" />

        <div class="dp-hero-actions">
          <a class="dp-cta dp-cta--primary" href="#product-specs" @click="scrollToSpecs">
            View product specs
          </a>
          <a class="dp-cta dp-cta--ghost" :href="contactEmailHref">Ask about this purifier</a>
        </div>
      </div>
    </section>

    <section class="dp-benefits" aria-label="Everyday benefits">
      <article v-for="benefit in benefits" :key="benefit.title" class="dp-benefit">
        <component :is="benefit.icon" aria-hidden="true" />
        <div>
          <h2>{{ benefit.title }}</h2>
          <p>{{ benefit.text }}</p>
        </div>
      </article>
    </section>

    <section class="dp-features" aria-labelledby="dp-features-title">
      <div class="dp-section-heading">
        <p>Built for the space beside you</p>
        <h2 id="dp-features-title">Key Features</h2>
      </div>
      <div class="dp-feature-grid">
        <article v-for="feature in features" :key="feature.label" class="dp-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
      </div>
    </section>

    <section class="dp-overview" aria-labelledby="dp-overview-title">
      <div class="dp-overview-copy">
        <span class="dp-rule" aria-hidden="true"></span>
        <h2 id="dp-overview-title">More air,<br />where you sit.</h2>
        <p>
          Most purifiers are sized for a room and sold on room coverage. This one starts from the
          other end: the air that matters is the air one person is sitting in. Dust, dander and the
          fine particles that carry odour gather around a desk or a bedside table, and a
          floor-standing unit has to turn over the whole room to reach them.
        </p>
        <p>
          The body is 114 mm across and 190 mm tall, and weighs 333.3 g with the EPA11 filter and
          VOC pad fitted. Air comes in through the perforated lower half from every direction and
          leaves through the concentric rings on top, so the unit only has to be near you rather
          than pointed at you. USB-C at 5 V 2 A draws 5–12 W, which is what lets it run from a
          laptop or a power bank instead of a dedicated socket.
        </p>

        <ul class="dp-chips" aria-label="Key specifications">
          <li v-for="[label, value] in specs" :key="label">
            <span class="dp-chip-label">{{ label }}</span>
            <span class="dp-chip-value">{{ value }}</span>
          </li>
        </ul>

        <ul class="dp-stages" aria-label="Filtration and intake">
          <li v-for="stage in filterStages" :key="stage.label">
            <component :is="stage.icon" aria-hidden="true" />
            <span>{{ stage.label }}</span>
          </li>
        </ul>
      </div>
      <img
        src="/images/products/desktop-air-purifier/overview-desk.webp"
        width="1200"
        height="1600"
        alt="Meower desktop air purifier on a desk beside an open laptop and a monitor"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section class="dp-spaces" aria-labelledby="dp-spaces-title">
      <div class="dp-section-heading">
        <p>Up close</p>
        <h2 id="dp-spaces-title">Rings, Ports and Perforations</h2>
      </div>
      <div class="dp-space-grid">
        <article v-for="shot in upClose" :key="shot.label" class="dp-space-card">
          <img :src="shot.image" :alt="shot.alt" loading="lazy" decoding="async" />
          <h3>{{ shot.label }}</h3>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Same palette and rhythm as Mw200AirPurifierPage.vue. */
.dp-purifier {
  --ink: #314e53;
  --accent: #75949a;
  --warm: #f5eee5;
  --price-ink: var(--ink);
  --price-muted: var(--accent);
  color: #202222;
  background: #fff;
}

/* Hero matched to the MW200 page: the photo fills the band (contain, anchored
   right/bottom) and a warm left-to-right wash keeps the copy readable. */
.dp-hero {
  position: relative;
  min-height: clamp(570px, 48vw, 760px);
  overflow: hidden;
  background: var(--warm);
}

.dp-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: right bottom;
}

.dp-hero::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    90deg,
    rgba(255, 250, 244, 0.93) 0%,
    rgba(255, 250, 244, 0.7) 28%,
    rgba(255, 250, 244, 0) 57%
  );
}

.dp-hero-copy {
  position: relative;
  z-index: 1;
  width: min(600px, 48vw);
  padding: clamp(150px, 13vw, 205px) 8vw 48px;
}

.dp-eyebrow,
.dp-section-heading p {
  margin: 0 0 14px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dp-hero h1,
.dp-section-heading h2,
.dp-overview h2 {
  margin: 0;
  color: var(--ink);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.dp-hero h1 {
  font-size: clamp(52px, 6vw, 94px);
  letter-spacing: -0.045em;
  line-height: 0.98;
}

/* Model and filter grade above, product name large, use case below — the same
   three-line split the MW200 heading uses. */
.dp-title-lead {
  display: block;
  color: #1e2625;
  font-size: 0.28em;
  letter-spacing: -0.025em;
  line-height: 1.35;
}

.dp-title-keep {
  display: block;
  color: var(--ink);
  font-size: 1em;
  white-space: nowrap;
}

.dp-title-sub {
  display: block;
  margin-top: 0.14em;
  color: #403a35;
  font-size: 0.26em;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.dp-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 26px;
}

.dp-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}

.dp-cta--primary {
  background: var(--ink);
  color: #fef5ed;
}

.dp-cta--primary:hover,
.dp-cta--primary:focus-visible {
  background: #24444a;
}

.dp-cta--ghost {
  border: 1px solid rgba(49, 78, 83, 0.28);
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink);
}

.dp-cta--ghost:hover,
.dp-cta--ghost:focus-visible {
  border-color: var(--ink);
  background: #fff;
}

.dp-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  padding: clamp(42px, 5vw, 78px) max(7vw, calc((100vw - 1440px) / 2));
  background: var(--warm);
}

.dp-benefit {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 18px;
  align-items: start;
}

.dp-benefit svg {
  width: 45px;
  height: 45px;
  color: var(--accent);
  stroke-width: 1.55;
}

.dp-benefit h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: clamp(18px, 1.5vw, 23px);
}

.dp-benefit p {
  max-width: 290px;
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
}

.dp-features,
.dp-spaces {
  padding: clamp(62px, 7vw, 108px) max(7vw, calc((100vw - 1440px) / 2));
}

.dp-features {
  background: #fff;
}

.dp-section-heading {
  margin-bottom: clamp(30px, 4vw, 54px);
  text-align: center;
}

.dp-section-heading h2 {
  font-size: clamp(38px, 4vw, 64px);
}

.dp-feature-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(130px, 1fr));
  gap: 16px;
  width: min(1160px, 100%);
  margin: 0 auto;
}

.dp-feature {
  display: grid;
  min-height: 146px;
  padding: 20px 12px;
  place-items: center;
  gap: 12px;
  border: 1px solid #ebe0d4;
  border-radius: 16px;
  background: #fdfaf6;
  text-align: center;
}

.dp-feature svg {
  width: 34px;
  height: 34px;
  color: var(--accent);
  stroke-width: 1.65;
}

.dp-feature strong {
  font-size: 14px;
  line-height: 1.2;
}

.dp-overview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
  align-items: center;
  gap: clamp(38px, 7vw, 110px);
  min-height: 610px;
  padding: clamp(58px, 7vw, 106px) max(7vw, calc((100vw - 1440px) / 2));
  background: #f8f4ee;
}

.dp-overview-copy {
  max-width: 640px;
}

.dp-rule {
  display: block;
  width: 130px;
  height: 10px;
  margin-bottom: 24px;
  background: var(--accent);
}

.dp-overview h2 {
  font-size: clamp(40px, 4.3vw, 66px);
}

.dp-overview p {
  margin: 26px 0;
  font-size: clamp(17px, 1.35vw, 22px);
  line-height: 1.62;
}

/* Four chips: two tidy columns instead of orphaning the fourth. */
.dp-chips {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  max-width: 430px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dp-chips li {
  min-width: 128px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fff;
}

.dp-chip-label {
  display: block;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.dp-chip-value {
  display: block;
  margin-top: 5px;
  color: var(--ink);
  font-size: 18px;
  font-weight: 600;
}

.dp-stages {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.dp-stages li {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #40595e;
  font-size: 14px;
  font-weight: 600;
}

.dp-stages svg {
  width: 20px;
  height: 20px;
  color: var(--accent);
  stroke-width: 1.7;
}

/* A photograph rather than a cut-out here, so it gets the same corner radius
   as the "Up close" cards instead of floating as a hard rectangle. */
.dp-overview > img {
  width: min(100%, 420px);
  max-height: 520px;
  justify-self: center;
  border-radius: 14px;
  object-fit: contain;
}

.dp-spaces {
  background: #fff;
}

.dp-space-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  width: min(1260px, 100%);
  margin: 0 auto;
}

.dp-space-card {
  overflow: hidden;
  border-radius: 14px;
  background: var(--warm);
}

.dp-space-card img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.dp-space-card h3 {
  margin: 0;
  padding: 16px;
  color: var(--ink);
  font-size: 18px;
  text-align: center;
}

@media (max-width: 900px) {
  /* Same hero treatment as MW200 on small screens. */
  .dp-hero {
    min-height: 590px;
  }

  .dp-hero::after {
    background: linear-gradient(90deg, rgba(255, 250, 244, 0.93), rgba(255, 250, 244, 0.22));
  }

  .dp-hero-copy {
    width: min(620px, 100%);
    padding: 176px 28px 48px;
  }

  .dp-benefits {
    grid-template-columns: 1fr;
    padding: 48px 28px;
  }

  .dp-features,
  .dp-spaces {
    padding: 64px 28px;
  }

  .dp-feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dp-overview {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 64px 28px;
  }

  .dp-overview > img {
    max-width: 320px;
  }

  .dp-space-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .dp-hero {
    min-height: 640px;
  }

  .dp-hero-copy {
    padding-top: 170px;
  }

  .dp-title-keep {
    white-space: normal;
  }

  .dp-feature {
    min-height: 126px;
  }

  .dp-space-grid {
    grid-template-columns: 1fr;
  }
}
</style>
