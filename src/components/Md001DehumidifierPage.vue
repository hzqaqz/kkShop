<script setup>
import {
  BellRing,
  Box,
  Droplets,
  Gauge,
  LockKeyhole,
  Move,
  Radio,
  Signal,
  Wind,
  Waves,
} from 'lucide-vue-next';

const benefits = [
  {
    title: 'Breathe easy.',
    text: 'Reduces excess humidity for a fresher, more comfortable home.',
    icon: Droplets,
  },
  {
    title: 'Protect what matters.',
    text: 'Helps prevent mold, mildew and moisture damage.',
    icon: Box,
  },
  {
    title: 'Feel the difference.',
    text: 'Cleaner air, better sleep, every day.',
    icon: Waves,
  },
];

const features = [
  { label: 'Efficient Dehumidification', icon: Droplets },
  { label: 'Digital Humidity Display', icon: Gauge },
  { label: '1.6 L Water Tank', icon: Waves },
  { label: '103 m³/h Airflow', icon: Wind },
  { label: 'Easy-Move Casters', icon: Move },
  { label: 'Compact Design', icon: Box },
  { label: 'Overflow Alarm', icon: BellRing },
  { label: 'Child Safety Lock', icon: LockKeyhole },
  { label: 'WiFi Control', icon: Radio },
  { label: 'Ion Generator', icon: Signal },
];

const spaces = [
  { label: 'Closet', image: '/images/products/md001/space-closet.png' },
  { label: 'Bathroom', image: '/images/products/md001/space-bathroom.png' },
  { label: 'Living Room', image: '/images/products/md001/space-living-room.png' },
  { label: 'Bedroom', image: '/images/products/md001/space-bedroom.png' },
];

const specifications = [
  ['Model', 'MD001'],
  ['Nominal Dehumidification Capacity', '0.28 kg/h'],
  ['High-Temperature Dehumidification Capacity', '12 L/day'],
  ['Maximum Dehumidification Capacity', '15 L/day'],
  ['Rated Power', '223 W'],
  ['Maximum Current', '1.6 A'],
  ['Rated Voltage', '220 V'],
  ['Frequency', '50 Hz'],
  ['Airflow', '103 m³/h'],
  ['Water Tank Capacity', '1.6 L'],
  ['Net Weight', '7.3 kg'],
];
</script>

<template>
  <article class="md001-dehumidifier">
    <section class="md001-hero" aria-labelledby="md001-title">
      <img
        class="md001-hero-image"
        src="/images/products/md001/hero-living-room.png"
        alt="MD001 dehumidifier in a sunlit living room"
      />
      <div class="md001-hero-copy">
        <p class="md001-eyebrow">Home Use Dehumidifier · MD001</p>
        <h1 id="md001-title"><span>Meower</span> Dehumidifier</h1>
        <p>Comfortable Living, Healthier Home</p>
      </div>
    </section>

    <section class="md001-benefits" aria-label="Everyday benefits">
      <article v-for="benefit in benefits" :key="benefit.title" class="md001-benefit">
        <component :is="benefit.icon" aria-hidden="true" />
        <div>
          <h2>{{ benefit.title }}</h2>
          <p>{{ benefit.text }}</p>
        </div>
      </article>
    </section>

    <section class="md001-features" aria-labelledby="md001-features-title">
      <div class="md001-section-heading">
        <p>Smart care for everyday humidity</p>
        <h2 id="md001-features-title">Key Features</h2>
      </div>
      <div class="md001-feature-grid">
        <article v-for="feature in features" :key="feature.label" class="md001-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
      </div>
    </section>

    <section class="md001-overview" aria-labelledby="md001-overview-title">
      <div class="md001-overview-copy">
        <span class="md001-rule" aria-hidden="true"></span>
        <h2 id="md001-overview-title">Small footprint.<br />Comfortable home.</h2>
        <p>
          Compact enough for everyday rooms and equipped for dependable moisture control,
          MD001 helps create a fresher indoor environment wherever comfort matters most.
        </p>
        <dl class="md001-dimensions">
          <div><dt>Width</dt><dd>272 mm</dd></div>
          <div><dt>Depth</dt><dd>170 mm</dd></div>
          <div><dt>Height</dt><dd>385 mm</dd></div>
        </dl>
      </div>
      <img src="/images/products/md001/product-transparent.png" alt="White MD001 home dehumidifier" />
    </section>

    <section class="md001-spaces" aria-labelledby="md001-spaces-title">
      <div class="md001-section-heading">
        <p>Made for the rooms you live in</p>
        <h2 id="md001-spaces-title">Comfort, Room by Room</h2>
      </div>
      <div class="md001-space-grid">
        <article v-for="space in spaces" :key="space.label" class="md001-space-card">
          <img :src="space.image" :alt="`MD001 dehumidifier in a ${space.label.toLowerCase()}`" />
          <h3>{{ space.label }}</h3>
        </article>
      </div>
    </section>

    <section class="md001-specifications" aria-labelledby="md001-specifications-title">
      <div class="md001-section-heading">
        <p>MD001 at a glance</p>
        <h2 id="md001-specifications-title">Technical Specifications</h2>
      </div>
      <div class="md001-specification-table" role="table" aria-label="MD001 technical specifications">
        <div v-for="([label, value], index) in specifications" :key="label" class="md001-specification-row" :class="{ tinted: index % 2 === 0 }" role="row">
          <strong role="rowheader">{{ label }}</strong>
          <span role="cell">{{ value }}</span>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.md001-dehumidifier { --ink: #314e53; --accent: #75949a; --warm: #f5eee5; color: #202222; background: #fff; }
.md001-hero { position: relative; min-height: clamp(570px, 48vw, 760px); overflow: hidden; background: #f5eee5; }
.md001-hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: right bottom; }
.md001-hero::after { position: absolute; inset: 0; content: ''; background: linear-gradient(90deg, rgba(255,250,244,.93) 0%, rgba(255,250,244,.7) 28%, rgba(255,250,244,0) 57%); }
.md001-hero-copy { position: relative; z-index: 1; width: min(600px, 48vw); padding: clamp(150px, 13vw, 205px) 8vw 48px; }
.md001-eyebrow, .md001-section-heading p { margin: 0 0 14px; color: var(--accent); font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.md001-hero h1, .md001-section-heading h2, .md001-overview h2 { margin: 0; color: var(--ink); font-weight: 850; letter-spacing: -.045em; line-height: .98; }
.md001-hero h1 { font-size: clamp(52px, 6vw, 94px); }
.md001-hero h1 span { display: block; color: #1e2625; }
.md001-hero-copy > p:last-child { margin: 24px 0 0; color: #403a35; font-size: clamp(19px, 1.7vw, 28px); font-weight: 600; }
.md001-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; padding: clamp(42px, 5vw, 78px) max(7vw, calc((100vw - 1440px) / 2)); background: var(--warm); }
.md001-benefit { display: grid; grid-template-columns: 54px 1fr; gap: 18px; align-items: start; }
.md001-benefit svg { width: 45px; height: 45px; color: var(--accent); stroke-width: 1.55; }
.md001-benefit h2 { margin: 0 0 8px; color: var(--ink); font-size: clamp(18px, 1.5vw, 23px); }
.md001-benefit p { max-width: 280px; margin: 0; font-size: 15px; line-height: 1.5; }
.md001-features, .md001-spaces, .md001-specifications { padding: clamp(62px, 7vw, 108px) max(7vw, calc((100vw - 1440px) / 2)); }
.md001-features { background: #fff; }
.md001-section-heading { margin-bottom: clamp(30px, 4vw, 54px); text-align: center; }
.md001-section-heading h2 { font-size: clamp(38px, 4vw, 64px); }
.md001-feature-grid { display: grid; grid-template-columns: repeat(5, minmax(130px, 1fr)); gap: 16px; width: min(1160px, 100%); margin: 0 auto; }
.md001-feature { display: grid; min-height: 146px; padding: 20px 12px; place-items: center; gap: 12px; border: 1px solid #ebe0d4; border-radius: 16px; background: #fdfaf6; text-align: center; }
.md001-feature svg { width: 34px; height: 34px; color: var(--accent); stroke-width: 1.65; }
.md001-feature strong { font-size: 14px; line-height: 1.2; }
.md001-overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, .9fr); align-items: center; gap: clamp(38px, 7vw, 110px); min-height: 610px; padding: clamp(58px, 7vw, 106px) max(7vw, calc((100vw - 1440px) / 2)); background: #f8f4ee; }
.md001-overview-copy { max-width: 610px; }
.md001-rule { display: block; width: 130px; height: 10px; margin-bottom: 24px; background: var(--accent); }
.md001-overview h2 { font-size: clamp(40px, 4.3vw, 66px); }
.md001-overview p { margin: 26px 0; font-size: clamp(17px, 1.35vw, 22px); line-height: 1.62; }
.md001-overview > img { width: min(100%, 480px); max-height: 480px; justify-self: center; object-fit: contain; }
.md001-dimensions { display: flex; flex-wrap: wrap; gap: 12px; margin: 0; }
.md001-dimensions div { min-width: 112px; padding: 12px 16px; border-radius: 10px; background: #fff; }
.md001-dimensions dt { color: var(--accent); font-size: 12px; font-weight: 800; text-transform: uppercase; }
.md001-dimensions dd { margin: 5px 0 0; color: var(--ink); font-size: 18px; font-weight: 800; }
.md001-spaces { background: #fff; }
.md001-space-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; width: min(1260px, 100%); margin: 0 auto; }
.md001-space-card { overflow: hidden; border-radius: 14px; background: var(--warm); }
.md001-space-card img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
.md001-space-card h3 { margin: 0; padding: 16px; color: var(--ink); font-size: 18px; text-align: center; }
.md001-specifications { background: var(--warm); }
.md001-specification-table { width: min(100%, 1080px); margin: 0 auto; font-size: clamp(15px, 1.3vw, 20px); }
.md001-specification-row { display: grid; grid-template-columns: 1.3fr .7fr; align-items: center; min-height: 52px; padding: 8px 28px; border-bottom: 1px solid #efe7dc; background: #fff; }
.md001-specification-row.tinted { background: var(--warm); }
.md001-specification-row strong, .md001-specification-row span { font-weight: 750; }
@media (max-width: 900px) { .md001-hero { min-height: 590px; } .md001-hero::after { background: linear-gradient(90deg, rgba(255,250,244,.93), rgba(255,250,244,.22)); } .md001-hero-copy { width: min(620px, 100%); padding: 176px 28px 48px; } .md001-benefits { grid-template-columns: 1fr; padding: 48px 28px; } .md001-features, .md001-spaces, .md001-specifications { padding: 64px 28px; } .md001-feature-grid { grid-template-columns: repeat(2, 1fr); } .md001-overview { grid-template-columns: 1fr; min-height: 0; padding: 64px 28px; } .md001-space-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .md001-hero { min-height: 640px; } .md001-hero-copy { padding-top: 170px; } .md001-feature { min-height: 126px; } .md001-space-grid { grid-template-columns: 1fr; } .md001-specification-row { grid-template-columns: 1fr; gap: 3px; padding: 14px 18px; } }
</style>
