<script setup>
import {
  Bath,
  Bed,
  Box,
  Droplets,
  Gauge,
  Home,
  Ruler,
  Shirt,
  Sparkles,
  Waves,
  Warehouse,
  WashingMachine,
  Weight,
  Wind,
  Zap,
} from 'lucide-vue-next';

const benefits = [
  {
    title: 'Breathe easy.',
    text: 'Pulls excess moisture out of the air for a fresher, more comfortable home.',
    icon: Droplets,
  },
  {
    title: 'Dry laundry indoors.',
    text: 'A dedicated clothes-drying function dries washing without waiting on the weather.',
    icon: Shirt,
  },
  {
    title: 'Protect what matters.',
    text: 'Helps prevent mould, mildew and the damp that damages furniture and fabrics.',
    icon: Waves,
  },
];

const features = [
  { label: '0.48 kg/h Nominal Removal', icon: Droplets },
  { label: '20 L/day High-Temp Output', icon: Waves },
  { label: '25 L/day Maximum Capacity', icon: Sparkles },
  { label: '190 m³/h Airflow', icon: Wind },
  { label: '4.0 L Water Tank', icon: Box },
  { label: 'Clothes-Drying Function', icon: Shirt },
  { label: 'Digital Display', icon: Gauge },
  { label: '295 W Rated Power', icon: Zap },
  { label: '300 × 200 × 490 mm', icon: Ruler },
  { label: '13 kg Net Weight', icon: Weight },
];

const dryingSteps = [
  {
    title: 'Hang',
    text: 'Set the rack or indoor line near the unit so drier air moves across the washing.',
    icon: Shirt,
  },
  {
    title: 'Run',
    text: 'Switch on the clothes-drying function and let the 190 m³/h fan keep the air moving.',
    icon: Wind,
  },
  {
    title: 'Dry',
    text: 'Moisture collects in the 4.0 L tank instead of settling back onto walls and windows.',
    icon: Waves,
  },
];

const dimensions = [
  { label: 'Width', value: '300 mm' },
  { label: 'Depth', value: '200 mm' },
  { label: 'Height', value: '490 mm' },
  { label: 'Water Tank', value: '4.0 L' },
  { label: 'Weight', value: '13 kg' },
];

const spaces = [
  {
    label: 'Bathroom',
    text: 'Shower steam cleared before it reaches the walls.',
    icon: Bath,
  },
  {
    label: 'Laundry Room',
    text: 'Washing dried indoors, whatever the weather outside.',
    icon: WashingMachine,
  },
  {
    label: 'Bedroom',
    text: 'Drier air for easier breathing and a fresher bed.',
    icon: Bed,
  },
  {
    label: 'Basement & Storage',
    text: 'Stored goods kept clear of damp and musty odours.',
    icon: Warehouse,
  },
];

const heroStats = [
  { value: '20 L/day', label: 'High-temp output' },
  { value: '190 m³/h', label: 'Airflow' },
  { value: '4.0 L', label: 'Water tank' },
  { value: '295 W', label: 'Rated power' },
];
</script>

<template>
  <article class="md002-dehumidifier">
    <section class="md002-hero" aria-labelledby="md002-title">
      <img
        class="md002-hero-image"
        src="/images/products/md002/hero-living-room.webp"
        alt="MD002 dehumidifier standing on a jute rug in a sunlit living room with a linen sofa"
      />
      <div class="md002-hero-copy">
        <p class="md002-eyebrow">Home Use Dehumidifier · MD002</p>
        <h1 id="md002-title"><span>Meower MD002</span> Dehumidifier</h1>
        <p class="md002-hero-sub">Dry Laundry, Dry Rooms, Healthier Home</p>
        <ul class="md002-stats">
          <li v-for="stat in heroStats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="md002-benefits" aria-label="Everyday benefits">
      <article v-for="benefit in benefits" :key="benefit.title" class="md002-benefit">
        <component :is="benefit.icon" aria-hidden="true" />
        <div>
          <h2>{{ benefit.title }}</h2>
          <p>{{ benefit.text }}</p>
        </div>
      </article>
    </section>

    <section class="md002-features" aria-labelledby="md002-features-title">
      <div class="md002-section-heading">
        <p>Built for humid rooms and wet laundry</p>
        <h2 id="md002-features-title">Key Features</h2>
      </div>
      <div class="md002-feature-grid">
        <article v-for="feature in features" :key="feature.label" class="md002-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
      </div>
    </section>

    <section class="md002-drying" aria-labelledby="md002-drying-title">
      <div class="md002-drying-copy">
        <span class="md002-rule" aria-hidden="true"></span>
        <h2 id="md002-drying-title">Laundry day,<br />solved.</h2>
        <p>
          Drying washing indoors usually means the moisture you took out of the clothes ends up in
          the room instead. The MD002 has a clothes-drying function built for exactly that job: the
          190 m³/h fan keeps air moving across a rack or an indoor line, and the moisture it lifts
          out of the fabric is collected in the 4.0 L tank rather than settling on windows, walls
          and furniture.
        </p>
        <ol class="md002-steps">
          <li v-for="step in dryingSteps" :key="step.title" class="md002-step">
            <component :is="step.icon" aria-hidden="true" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
      <div class="md002-drying-panel">
        <div class="md002-panel-screen">
          <span class="md002-led" aria-hidden="true"></span>
          <Shirt aria-hidden="true" />
          <div>
            <strong>Clothes drying</strong>
            <span>Selected mode</span>
          </div>
        </div>
        <ul class="md002-panel-facts">
          <li>
            <Wind aria-hidden="true" />
            <span><strong>190 m³/h</strong> of air moving across the washing</span>
          </li>
          <li>
            <Droplets aria-hidden="true" />
            <span>Moisture collected in the <strong>4.0 L tank</strong>, not the room</span>
          </li>
          <li>
            <Home aria-hidden="true" />
            <span>Washing dries <strong>indoors</strong>, whatever the weather</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="md002-overview" aria-labelledby="md002-overview-title">
      <div class="md002-overview-copy">
        <span class="md002-rule" aria-hidden="true"></span>
        <h2 id="md002-overview-title">More capacity.<br />Same footprint.</h2>
        <p>
          Where the compact MD001 pairs a small body with a 1.6 L tank, the MD002 pairs a 4.0 L tank
          with 20 L/day of high-temperature capacity and a clothes-drying function. It removes more
          moisture each day while staying a domestic unit: 13 kg, no permanent installation, and a
          footprint of just 300 × 200 mm.
        </p>
        <p>
          At 295 W on 220 V~50 Hz it draws more power than a compact unit because it moves far more
          air — 190 m³/h, against 103 m³/h on the MD001. That airflow is what dries a laundry load
          as well as a room, and it is why the MD002 suits bathrooms, laundry rooms, bedrooms and
          storage areas where humidity builds up every day.
        </p>
        <dl class="md002-dimensions">
          <div v-for="item in dimensions" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </div>
      <img
        src="/images/products/md002/product-transparent.webp"
        alt="White MD002 home dehumidifier shown from the front"
      />
    </section>

    <section class="md002-spaces" aria-labelledby="md002-spaces-title">
      <div class="md002-section-heading">
        <p>Made for the rooms where moisture builds</p>
        <h2 id="md002-spaces-title">Comfort, Room by Room</h2>
      </div>
      <div class="md002-space-grid">
        <article v-for="space in spaces" :key="space.label" class="md002-space-card">
          <component :is="space.icon" aria-hidden="true" />
          <h3>{{ space.label }}</h3>
          <p>{{ space.text }}</p>
        </article>
      </div>
    </section>
  </article>
</template>

<style scoped>
.md002-dehumidifier { --ink: #314e53; --accent: #75949a; --warm: #f5eee5; color: #202222; background: #fff; }
/* Hero panel: same two-tone split as MD001 — a light #fefaf3 panel that falls to
   #f9f3eb where the photo starts, against the #f5eee5 benefits band below. MD001
   gets this from a white overlay; here it is the panel itself, because a CSS
   overlay would veil the product sitting in the left third of the artwork read here. */
.md002-hero { position: relative; min-height: clamp(570px, 48vw, 760px); overflow: hidden; background: linear-gradient(90deg, #fefaf3 0%, #fcf6ef 28%, #f9f3eb 40%, #f7f0e8 100%); }
.md002-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: right bottom; }
/* The left-edge wash that blends the photo into the panel is baked into
   hero-living-room.webp (in #f9f3eb, the panel colour at the photo's left edge),
   so it can stop short of the unit. */
.md002-hero-copy { position: relative; z-index: 1; width: min(600px, 48vw); padding: clamp(150px, 13vw, 205px) 8vw 48px; }
.md002-eyebrow, .md002-section-heading p { margin: 0 0 14px; color: var(--accent); font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.md002-hero h1, .md002-section-heading h2, .md002-drying h2, .md002-overview h2 { margin: 0; color: var(--ink); font-weight: 850; letter-spacing: -.045em; line-height: .98; }
.md002-hero h1 { font-size: clamp(52px, 6vw, 94px); }
.md002-hero h1 span { display: block; color: #1e2625; white-space: nowrap; }
.md002-hero-sub { margin: 24px 0 0; color: #403a35; font-size: clamp(19px, 1.7vw, 28px); font-weight: 600; }
.md002-stats { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 26px 0 0; list-style: none; }
.md002-stats li { min-width: 104px; padding: 9px 14px; border: 1px solid rgba(117, 148, 154, .26); border-radius: 11px; background: rgba(255, 255, 255, .86); }
.md002-stats strong { display: block; color: var(--ink); font-size: clamp(16px, 1.15vw, 19px); font-weight: 850; }
.md002-stats span { color: #5c6f72; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.md002-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; padding: clamp(42px, 5vw, 78px) max(7vw, calc((100vw - 1440px) / 2)); background: var(--warm); }
.md002-benefit { display: grid; grid-template-columns: 54px 1fr; gap: 18px; align-items: start; }
.md002-benefit svg { width: 45px; height: 45px; color: var(--accent); stroke-width: 1.55; }
.md002-benefit h2 { margin: 0 0 8px; color: var(--ink); font-size: clamp(18px, 1.5vw, 23px); }
.md002-benefit p { max-width: 290px; margin: 0; font-size: 15px; line-height: 1.5; }
.md002-features, .md002-spaces { padding: clamp(62px, 7vw, 108px) max(7vw, calc((100vw - 1440px) / 2)); }
.md002-features { background: #fff; }
.md002-section-heading { margin-bottom: clamp(30px, 4vw, 54px); text-align: center; }
.md002-section-heading h2 { font-size: clamp(38px, 4vw, 64px); }
.md002-feature-grid { display: grid; grid-template-columns: repeat(5, minmax(130px, 1fr)); gap: 16px; width: min(1160px, 100%); margin: 0 auto; }
.md002-feature { display: grid; min-height: 146px; padding: 20px 12px; place-items: center; gap: 12px; border: 1px solid #ebe0d4; border-radius: 16px; background: #fdfaf6; text-align: center; }
.md002-feature svg { width: 34px; height: 34px; color: var(--accent); stroke-width: 1.65; }
.md002-feature strong { font-size: 14px; line-height: 1.2; }
.md002-drying { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr); gap: clamp(38px, 6vw, 96px); align-items: center; padding: clamp(58px, 7vw, 106px) max(7vw, calc((100vw - 1440px) / 2)); background: var(--warm); }
.md002-drying-copy { max-width: 660px; }
.md002-rule { display: block; width: 130px; height: 10px; margin-bottom: 24px; background: var(--accent); }
.md002-drying h2 { font-size: clamp(40px, 4.3vw, 66px); }
.md002-drying-copy > p { margin: 26px 0; font-size: clamp(17px, 1.35vw, 22px); line-height: 1.62; }
.md002-steps { display: grid; gap: 18px; padding: 0; margin: 0; list-style: none; }
.md002-step { display: grid; grid-template-columns: 46px 1fr; gap: 16px; align-items: start; padding: 16px 18px; border-radius: 14px; background: rgba(255, 255, 255, .78); }
.md002-step svg { width: 28px; height: 28px; color: var(--accent); stroke-width: 1.7; }
.md002-step h3 { margin: 0 0 4px; color: var(--ink); font-size: 17px; font-weight: 800; }
.md002-step p { margin: 0; font-size: 15px; line-height: 1.5; }
.md002-drying-panel { display: grid; gap: 22px; max-width: 620px; padding: clamp(26px, 2.6vw, 38px); border: 1px solid rgba(117, 148, 154, .22); border-radius: 22px; background: #fff; box-shadow: 0 24px 60px rgba(49, 78, 83, .08); }
.md002-panel-screen { position: relative; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center; padding: 30px 24px 22px; border-radius: 16px; background: #1e2625; }
.md002-led { position: absolute; top: 14px; right: 24px; width: 92px; height: 5px; border-radius: 5px; background: #62d8d3; }
.md002-panel-screen > svg { width: 40px; height: 40px; color: #8fdcd6; stroke-width: 1.5; }
.md002-panel-screen strong { display: block; color: #f4f8f7; font-size: clamp(18px, 1.5vw, 22px); font-weight: 800; letter-spacing: -.02em; }
.md002-panel-screen div > span { color: #9db4b3; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.md002-panel-facts { display: grid; gap: 14px; margin: 0; padding: 0; list-style: none; }
.md002-panel-facts li { display: grid; grid-template-columns: 24px 1fr; gap: 12px; align-items: start; color: #40595e; font-size: 15px; line-height: 1.5; }
.md002-panel-facts svg { width: 22px; height: 22px; margin-top: 2px; color: var(--accent); stroke-width: 1.8; }
.md002-panel-facts strong { color: var(--ink); font-weight: 850; }
.md002-overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, .85fr); align-items: center; gap: clamp(38px, 7vw, 110px); padding: clamp(58px, 7vw, 106px) max(7vw, calc((100vw - 1440px) / 2)); background: #f8f4ee; }
.md002-overview-copy { max-width: 680px; }
.md002-overview h2 { font-size: clamp(40px, 4.3vw, 66px); }
.md002-overview p { margin: 26px 0 0; font-size: clamp(17px, 1.35vw, 22px); line-height: 1.62; }
.md002-overview > img { width: min(100%, 460px); max-height: 460px; justify-self: center; object-fit: contain; }
.md002-dimensions { display: flex; flex-wrap: wrap; gap: 12px; margin: 30px 0 0; }
.md002-dimensions div { min-width: 112px; padding: 12px 16px; border-radius: 10px; background: #fff; }
.md002-dimensions dt { color: var(--accent); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.md002-dimensions dd { margin: 5px 0 0; color: var(--ink); font-size: 18px; font-weight: 800; }
.md002-spaces { background: #fff; }
.md002-space-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; width: min(1260px, 100%); margin: 0 auto; }
.md002-space-card { display: grid; gap: 12px; padding: 28px 22px; border: 1px solid #ebe0d4; border-radius: 16px; background: #fdfaf6; text-align: center; }
.md002-space-card svg { width: 40px; height: 40px; margin: 0 auto; color: var(--accent); stroke-width: 1.5; }
.md002-space-card h3 { margin: 0; color: var(--ink); font-size: 18px; }
.md002-space-card p { margin: 0; font-size: 15px; line-height: 1.5; }
/* On narrow screens the photo would fill the whole hero and sit behind the copy.
   Stack it under the text instead and fade its top edge into the panel colour. */
@media (max-width: 900px) { .md002-hero { display: flex; flex-direction: column; min-height: 0; } .md002-hero-copy { order: 1; width: 100%; max-width: 640px; padding: 132px 28px 26px; } .md002-hero h1 { font-size: clamp(40px, 9.5vw, 64px); } .md002-hero-image { order: 2; position: static; display: block; width: 100%; height: auto; -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 26%); mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 26%); } .md002-benefits { grid-template-columns: 1fr; padding: 48px 28px; } .md002-features, .md002-spaces { padding: 64px 28px; } .md002-feature-grid { grid-template-columns: repeat(2, 1fr); } .md002-drying, .md002-overview { grid-template-columns: minmax(0, 1fr); padding: 64px 28px; } .md002-space-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .md002-feature { min-height: 126px; } .md002-space-grid { grid-template-columns: 1fr; } }
</style>
