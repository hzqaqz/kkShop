<script setup>
import {
  Activity,
  BedDouble,
  Fan,
  Filter,
  Layers,
  PawPrint,
  RefreshCw,
  ShieldCheck,
  Sofa,
  Sparkles,
  Timer,
  Volume2,
  Wind,
  Zap,
} from 'lucide-vue-next';

/**
 * MW200 air purifier — laid out like Md001DehumidifierPage.vue (split hero with
 * a warm wash, benefits band, "Key Features" icon grid, overview with spec
 * chips, then room-by-room cards) so the two home products read as one family.
 *
 * Every claim here repeats a specification already published for the MW200:
 * 3-stage filtration with H13 HEPA, 360° intake, 400 m³/h CADR, 20–40 m²,
 * 36–50 dB(A), 4 fan speeds with auto mode, 38 W, air-quality monitoring and
 * timer shut-off.
 */
const benefits = [
  {
    title: 'Cleaner air, all day.',
    text: '360° intake draws air in from every direction, so fur and dander are captured instead of settling again.',
    icon: RefreshCw,
  },
  {
    title: 'Quiet enough to sleep.',
    text: 'Runs at 36–50 dB(A) across four fan speeds, so it can stay on overnight in a bedroom.',
    icon: Volume2,
  },
  {
    title: 'Hands-off once it is set.',
    text: 'Auto mode follows the air quality it detects, with a live readout and a timer shut-off.',
    icon: Activity,
  },
];

const features = [
  { label: '360° Air Intake', icon: RefreshCw },
  { label: 'H13 HEPA Media', icon: ShieldCheck },
  { label: '3-Stage Filtration', icon: Layers },
  { label: '400 m³/h CADR', icon: Wind },
  { label: '4 Fan Speeds', icon: Fan },
  { label: 'Auto Mode', icon: Sparkles },
  { label: 'Real-Time Air Quality', icon: Activity },
  { label: 'Timer Shut-Off', icon: Timer },
  { label: '38 W Rated Power', icon: Zap },
  { label: '36–50 dB(A)', icon: Volume2 },
];

const filterStages = [
  { label: 'Pre-filter', icon: Filter },
  { label: 'H13 HEPA', icon: ShieldCheck },
  { label: 'Activated carbon', icon: Layers },
];

const specs = [
  ['Particle CADR', '400 m³/h'],
  ['Recommended room', '20–40 m²'],
  ['Noise level', '36–50 dB(A)'],
  ['Rated power', '38 W'],
];

const spaces = [
  {
    label: 'Living room',
    image: '/images/products/mw200/scene-living-room.webp',
    alt: 'MW200 air purifier standing on a rug in a sunlit living room with a sofa',
  },
  {
    label: 'Bedroom',
    image: '/images/products/mw200/space-bedroom.webp',
    alt: 'MW200 air purifier in a calm bedroom',
  },
  {
    label: 'Pet room',
    image: '/images/products/mw200/space-pet-room.webp',
    alt: 'MW200 air purifier in a room shared with cats and dogs',
  },
];
</script>

<template>
  <article class="mw200-purifier">
    <section class="mw200-hero" aria-labelledby="mw200-title">
      <img
        class="mw200-hero-image"
        src="/images/products/mw200/hero-armchair.webp"
        alt="MW200 air purifier on a wooden floor beside a linen armchair and houseplants"
      />
      <div class="mw200-hero-copy">
        <p class="mw200-eyebrow">Home Use Air Purifier · MW200</p>
        <h1 id="mw200-title">
          <span class="mw200-title-lead">Pet-friendly MW200 H13</span>
          <span class="mw200-title-keep">Air Purifier</span>
        </h1>
        <p>360° Purification, Built for Pet Homes</p>
      </div>
    </section>

    <section class="mw200-benefits" aria-label="Everyday benefits">
      <article v-for="benefit in benefits" :key="benefit.title" class="mw200-benefit">
        <component :is="benefit.icon" aria-hidden="true" />
        <div>
          <h2>{{ benefit.title }}</h2>
          <p>{{ benefit.text }}</p>
        </div>
      </article>
    </section>

    <section class="mw200-features" aria-labelledby="mw200-features-title">
      <div class="mw200-section-heading">
        <p>Smart care for pet households</p>
        <h2 id="mw200-features-title">Key Features</h2>
      </div>
      <div class="mw200-feature-grid">
        <article v-for="feature in features" :key="feature.label" class="mw200-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
      </div>
    </section>

    <section class="mw200-overview" aria-labelledby="mw200-overview-title">
      <div class="mw200-overview-copy">
        <span class="mw200-rule" aria-hidden="true"></span>
        <h2 id="mw200-overview-title">More air,<br />moved properly.</h2>
        <p>
          Fur, dander and the fine particles that carry odour settle into carpets and soft
          furniture, then get lifted back into the air through everyday movement. The MW200 draws
          that air in from every direction, passes it through a pre-filter, H13 HEPA media and an
          activated carbon stage, and puts it back into the room cleaner.
        </p>
        <p>
          A 400 m³/h particle CADR suits rooms of roughly 20–40 m², which covers most bedrooms and
          living areas without the unit running flat out to keep up. Four fan speeds, auto mode and
          a timer let it work around your day rather than the other way round.
        </p>

        <ul class="mw200-chips" aria-label="Key specifications">
          <li v-for="[label, value] in specs" :key="label">
            <span class="mw200-chip-label">{{ label }}</span>
            <span class="mw200-chip-value">{{ value }}</span>
          </li>
        </ul>

        <ul class="mw200-stages" aria-label="Filtration stages">
          <li v-for="stage in filterStages" :key="stage.label">
            <component :is="stage.icon" aria-hidden="true" />
            <span>{{ stage.label }}</span>
          </li>
        </ul>
      </div>
      <img
        src="/images/products/navigation/mw200-transparent.webp"
        alt="White Meower MW200 air purifier"
      />
    </section>

    <section class="mw200-spaces" aria-labelledby="mw200-spaces-title">
      <div class="mw200-section-heading">
        <p>Made for the rooms you live in</p>
        <h2 id="mw200-spaces-title">Comfort, Room by Room</h2>
      </div>
      <div class="mw200-space-grid">
        <article v-for="space in spaces" :key="space.label" class="mw200-space-card">
          <img :src="space.image" :alt="space.alt" loading="lazy" decoding="async" />
          <h3>{{ space.label }}</h3>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Same palette and rhythm as Md001DehumidifierPage.vue. */
.mw200-purifier { --ink: #314e53; --accent: #75949a; --warm: #f5eee5; color: #202222; background: #fff; }
.mw200-hero { position: relative; min-height: clamp(680px, 60vw, 920px); overflow: hidden; background: var(--warm); }
.mw200-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: right bottom;
}
.mw200-hero-copy {
  position: relative;
  z-index: 1;
  width: min(760px, calc(100% - 12vw));
  margin-left: max(6vw, calc((100vw - 1440px) / 2));
  padding: clamp(150px, 13vw, 205px) 0 56px;
}
.mw200-eyebrow, .mw200-section-heading p { margin: 0 0 14px; color: var(--accent); font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.mw200-hero h1, .mw200-section-heading h2, .mw200-overview h2 { margin: 0; color: var(--ink); font-weight: 850; letter-spacing: -.045em; line-height: .98; }
/* Long headline: 34–52px keeps both lines inside the copy column, and the
   nowrap line keeps "Air Purifier" together. */
.mw200-hero h1 { font-size: clamp(44px, 5.6vw, 84px); letter-spacing: -.04em; line-height: 1.02; }
/* Smaller lead, larger product name — the second line is the one that should
   read as the headline. */
.mw200-title-lead { display: block; color: #1e2625; font-size: .58em; letter-spacing: -.02em; line-height: 1.3; }
.mw200-title-keep { display: block; color: var(--ink); font-size: 1em; white-space: nowrap; }
.mw200-hero-copy > p:last-child { margin: 24px 0 0; color: #403a35; font-size: clamp(19px, 1.7vw, 28px); font-weight: 600; }
.mw200-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; padding: clamp(42px, 5vw, 78px) max(7vw, calc((100vw - 1440px) / 2)); background: var(--warm); }
.mw200-benefit { display: grid; grid-template-columns: 54px 1fr; gap: 18px; align-items: start; }
.mw200-benefit svg { width: 45px; height: 45px; color: var(--accent); stroke-width: 1.55; }
.mw200-benefit h2 { margin: 0 0 8px; color: var(--ink); font-size: clamp(18px, 1.5vw, 23px); }
.mw200-benefit p { max-width: 290px; margin: 0; font-size: 15px; line-height: 1.5; }
.mw200-features, .mw200-spaces { padding: clamp(62px, 7vw, 108px) max(7vw, calc((100vw - 1440px) / 2)); }
.mw200-features { background: #fff; }
.mw200-section-heading { margin-bottom: clamp(30px, 4vw, 54px); text-align: center; }
.mw200-section-heading h2 { font-size: clamp(38px, 4vw, 64px); }
.mw200-feature-grid { display: grid; grid-template-columns: repeat(5, minmax(130px, 1fr)); gap: 16px; width: min(1160px, 100%); margin: 0 auto; }
.mw200-feature { display: grid; min-height: 146px; padding: 20px 12px; place-items: center; gap: 12px; border: 1px solid #ebe0d4; border-radius: 16px; background: #fdfaf6; text-align: center; }
.mw200-feature svg { width: 34px; height: 34px; color: var(--accent); stroke-width: 1.65; }
.mw200-feature strong { font-size: 14px; line-height: 1.2; }
.mw200-overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, .9fr); align-items: center; gap: clamp(38px, 7vw, 110px); min-height: 610px; padding: clamp(58px, 7vw, 106px) max(7vw, calc((100vw - 1440px) / 2)); background: #f8f4ee; }
.mw200-overview-copy { max-width: 640px; }
.mw200-rule { display: block; width: 130px; height: 10px; margin-bottom: 24px; background: var(--accent); }
.mw200-overview h2 { font-size: clamp(40px, 4.3vw, 66px); }
.mw200-overview p { margin: 26px 0; font-size: clamp(17px, 1.35vw, 22px); line-height: 1.62; }
/* Four chips: two tidy columns instead of orphaning the fourth. */
.mw200-chips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; max-width: 430px; margin: 0; padding: 0; list-style: none; }
.mw200-chips li { min-width: 128px; padding: 12px 16px; border-radius: 10px; background: #fff; }
.mw200-chip-label { display: block; color: var(--accent); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.mw200-chip-value { display: block; margin-top: 5px; color: var(--ink); font-size: 18px; font-weight: 800; }
.mw200-stages { display: flex; flex-wrap: wrap; gap: 18px; margin: 22px 0 0; padding: 0; list-style: none; }
.mw200-stages li { display: inline-flex; gap: 8px; align-items: center; color: #40595e; font-size: 14px; font-weight: 700; }
.mw200-stages svg { width: 20px; height: 20px; color: var(--accent); stroke-width: 1.7; }
.mw200-overview > img { width: min(100%, 420px); max-height: 520px; justify-self: center; object-fit: contain; }
.mw200-spaces { background: #fff; }
.mw200-space-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; width: min(1260px, 100%); margin: 0 auto; }
.mw200-space-card { overflow: hidden; border-radius: 14px; background: var(--warm); }
.mw200-space-card img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
.mw200-space-card h3 { margin: 0; padding: 16px; color: var(--ink); font-size: 18px; text-align: center; }
@media (max-width: 900px) {
  /* Stacked hero (same approach as MD002): copy first, then the photo, so no
     text ends up sitting across the artwork on a narrow screen. */
  .mw200-hero { display: flex; flex-direction: column; min-height: 0; }
  .mw200-hero-copy { order: 1; width: 100%; max-width: 620px; margin-left: 0; padding: 158px 28px 30px; }
  .mw200-hero-image {
    order: 2;
    position: static;
    display: block;
    width: 100%;
    height: auto;
  }
  .mw200-benefits { grid-template-columns: 1fr; padding: 48px 28px; }
  .mw200-features, .mw200-spaces { padding: 64px 28px; }
  .mw200-feature-grid { grid-template-columns: repeat(2, 1fr); }
  .mw200-overview { grid-template-columns: 1fr; min-height: 0; padding: 64px 28px; }
  .mw200-overview > img { max-width: 320px; }
  .mw200-space-grid { grid-template-columns: repeat(2, 1fr); }
  /* Small enough that the lead line holds together on a phone. */
  .mw200-hero h1 { font-size: clamp(34px, 8.8vw, 50px); }
}
@media (max-width: 520px) {
  .mw200-hero-copy { padding-top: 150px; }
  .mw200-feature { min-height: 126px; }
  .mw200-space-grid { grid-template-columns: 1fr; }
}
</style>
