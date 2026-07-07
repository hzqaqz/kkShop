<script setup>
import { ArrowDownToLine, Droplets, Gauge, Snowflake } from 'lucide-vue-next';

const features = [
  { label: 'Water leak alarm', icon: Droplets },
  { label: 'High performance compressor', icon: Gauge },
  { label: 'Gravity drainage', icon: ArrowDownToLine },
  { label: 'Auto defrost', icon: Snowflake },
];

const spaces = [
  {
    label: 'Basement & Garages',
    image: '/images/products/md0001/basement-garage.png',
    alt: 'MD0001 commercial dehumidifier in a basement garage',
  },
  {
    label: 'Warehouse',
    image: '/images/products/md0001/warehouse-space.png',
    alt: 'MD0001 commercial dehumidifier in a warehouse',
  },
];

const specifications = [
  ['Model', 'MD0001'],
  ['Dehumidification Capacity (Rated)', '1.25 kg/h'],
  ['Dehumidification Capacity (High Temp.)', '50L/day'],
  ['Max. Dehumidification Capacity', '60L/day'],
  ['Rated Power', '650W'],
  ['Max. Current', '4.5A'],
  ['Rated Voltage / Frequency', '220V~50Hz'],
  ['Airflow', '320 m³/h'],
  ['Net Weight', '28kg'],
  ['Dimensions', '375×295×625 mm'],
];
</script>

<template>
  <article class="commercial-dehumidifier">
    <section class="commercial-hero" aria-labelledby="commercial-title">
      <div class="commercial-hero-copy">
        <h1 id="commercial-title">
          <span>Commercial</span>
          Dehumidifier
        </h1>
        <p>Powerful moisture control for<br />demanding commercial environments.</p>
      </div>

      <div class="commercial-feature-grid" aria-label="Key product features">
        <article v-for="feature in features" :key="feature.label" class="commercial-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
      </div>
    </section>

    <section class="performance-section" aria-labelledby="performance-title">
      <div class="performance-copy">
        <span class="section-rule" aria-hidden="true"></span>
        <h2 id="performance-title">Built for Performance</h2>
        <p>
          Designed for high-efficiency dehumidification, our commercial dehumidifier delivers
          reliable moisture control to protect your space, equipment, and inventory.
        </p>
      </div>
      <img
        src="/images/products/md0001/product-white.png"
        alt="MD0001 commercial dehumidifier"
      />
    </section>

    <section class="commercial-spaces-section" aria-labelledby="commercial-spaces-title">
      <div class="commercial-section-heading">
        <h2 id="commercial-spaces-title">Ideal for Commercial Spaces</h2>
        <span class="section-rule" aria-hidden="true"></span>
      </div>

      <div class="commercial-space-grid">
        <article v-for="space in spaces" :key="space.label" class="commercial-space-card">
          <img :src="space.image" :alt="space.alt" />
          <strong>{{ space.label }}</strong>
        </article>
      </div>
    </section>

    <section class="specifications-section" aria-labelledby="specifications-title">
      <div class="commercial-section-heading">
        <h2 id="specifications-title">Technical Specifications</h2>
        <span class="section-rule" aria-hidden="true"></span>
      </div>

      <div class="specifications-table" role="table" aria-label="MD0001 technical specifications">
        <div
          v-for="([label, value], index) in specifications"
          :key="label"
          class="specification-row"
          :class="{ tinted: index % 2 === 0 }"
          role="row"
        >
          <strong role="rowheader">{{ label }}</strong>
          <span role="cell">{{ value }}</span>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.commercial-dehumidifier {
  --commercial-ink: #324f54;
  --commercial-accent: #5f858d;
  --commercial-tint: #bfd8dc;
  color: #0b0b0b;
  background: #fff;
  font-family:
    "Google Sans Flex", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

.commercial-dehumidifier h1,
.commercial-dehumidifier h2,
.commercial-dehumidifier p {
  margin-top: 0;
}

.commercial-hero {
  position: relative;
  min-height: clamp(560px, 48vw, 720px);
  padding: clamp(120px, 11vw, 170px) 9vw clamp(32px, 3vw, 48px);
  background: url("/images/products/md0001/warehouse-hero.png") center / cover no-repeat;
  overflow: hidden;
}

.commercial-hero-copy {
  width: min(560px, 44vw);
  padding: clamp(18px, 2.2vw, 30px) clamp(24px, 3vw, 42px);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 18px 48px rgba(18, 33, 36, 0.16);
  backdrop-filter: blur(8px);
}

.commercial-hero h1 {
  margin-bottom: 12px;
  color: var(--commercial-ink);
  font-size: clamp(48px, 4.8vw, 82px);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.commercial-hero h1 span {
  display: block;
  color: #5f858d;
}

.commercial-hero-copy p {
  color: #241915;
  font-size: clamp(18px, 1.6vw, 26px);
  line-height: 1.35;
  margin-bottom: 0;
}

.commercial-feature-grid {
  position: absolute;
  bottom: clamp(24px, 3vw, 44px);
  left: 4vw;
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: clamp(18px, 2.4vw, 46px);
  width: min(850px, 57vw);
}

.commercial-feature {
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;
}

.commercial-feature svg {
  width: clamp(64px, 6vw, 104px);
  height: clamp(64px, 6vw, 104px);
  color: var(--commercial-ink);
  stroke-width: 1.7;
}

.commercial-feature strong {
  max-width: 190px;
  font-size: clamp(16px, 1.25vw, 22px);
  line-height: 1.15;
}

.performance-section {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  align-items: center;
  min-height: clamp(640px, 52vw, 760px);
  padding: 0 max(6vw, calc((100vw - 1460px) / 2));
  background: #fff;
}

.performance-copy {
  max-width: 700px;
  padding: clamp(40px, 4vw, 64px) 0 clamp(40px, 4vw, 64px) 5vw;
}

.section-rule {
  display: block;
  width: clamp(120px, 12vw, 205px);
  height: 14px;
  margin-bottom: 24px;
  background: var(--commercial-accent);
}

.performance-section h2,
.commercial-section-heading h2 {
  font-size: clamp(36px, 3.6vw, 58px);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.performance-copy p {
  max-width: 650px;
  margin-top: clamp(24px, 2.5vw, 38px);
  font-size: clamp(17px, 1.35vw, 23px);
  line-height: 1.6;
}

.performance-section img {
  align-self: center;
  width: 100%;
  height: calc(100% - 96px);
  margin: 48px 0;
  object-fit: cover;
}

.commercial-spaces-section,
.specifications-section {
  padding: clamp(40px, 4vw, 64px) max(5vw, calc((100vw - 1540px) / 2));
  background: #fff;
}

.commercial-section-heading {
  display: grid;
  justify-items: center;
  margin-bottom: clamp(28px, 3vw, 42px);
  text-align: center;
}

.commercial-section-heading h2 {
  margin-bottom: 20px;
}

.commercial-section-heading .section-rule {
  height: 14px;
  margin-bottom: 0;
}

.commercial-space-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.commercial-space-card {
  position: relative;
  aspect-ratio: 1.75;
  overflow: hidden;
}

.commercial-space-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.commercial-space-card strong {
  position: absolute;
  right: 48%;
  bottom: 28px;
  left: 0;
  padding: 18px 10px;
  background: rgba(95, 133, 141, 0.72);
  color: #fff;
  font-size: clamp(18px, 1.45vw, 25px);
  line-height: 1;
  white-space: nowrap;
}

.specifications-section {
  padding-bottom: clamp(44px, 4vw, 64px);
}

.specifications-table {
  width: min(100%, 1260px);
  margin: 0 auto;
  font-size: clamp(16px, 1.25vw, 21px);
  font-weight: 700;
}

.specification-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  min-height: 50px;
  padding: 6px 38px;
}

.specification-row.tinted {
  background: var(--commercial-tint);
}

.specification-row span {
  font-weight: 700;
}

@media (max-width: 900px) {
  .commercial-hero {
    min-height: 600px;
    padding: 184px 28px 24px;
    background-position: 58% center;
  }

  .commercial-hero::before {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.84), rgba(255, 255, 255, 0.1));
    content: "";
  }

  .commercial-hero-copy,
  .commercial-feature-grid {
    position: relative;
    z-index: 1;
  }

  .commercial-hero-copy {
    width: min(580px, 100%);
    padding: 18px 22px;
  }

  .commercial-hero h1 {
    font-size: clamp(44px, 9vw, 66px);
  }

  .commercial-feature-grid {
    bottom: auto;
    left: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(560px, 100%);
    margin-top: 30px;
  }

  .commercial-feature svg {
    width: 62px;
    height: 62px;
  }

  .performance-section {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 44px 28px;
  }

  .performance-copy {
    max-width: none;
    padding: 0;
  }

  .performance-copy p {
    margin-top: 22px;
  }

  .performance-section img {
    width: min(100%, 460px);
    height: auto;
    margin: 0;
    justify-self: center;
    object-fit: contain;
  }

  .commercial-spaces-section,
  .specifications-section {
    padding: 42px 24px;
  }

  .commercial-space-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .commercial-space-card strong {
    right: 42%;
  }
}

@media (max-width: 560px) {
  .commercial-hero {
    min-height: 580px;
    padding: 184px 20px 22px;
  }

  .commercial-hero h1 {
    font-size: clamp(40px, 12vw, 54px);
  }

  .commercial-hero-copy p {
    font-size: 17px;
  }

  .commercial-feature-grid {
    gap: 28px 12px;
    margin-top: 26px;
  }

  .commercial-feature {
    gap: 10px;
  }

  .commercial-feature svg {
    width: 52px;
    height: 52px;
  }

  .commercial-feature strong {
    font-size: 15px;
  }

  .performance-section h2,
  .commercial-section-heading h2 {
    font-size: 32px;
  }

  .performance-copy p {
    font-size: 16px;
  }

  .section-rule,
  .commercial-section-heading .section-rule {
    height: 9px;
  }

  .commercial-section-heading {
    margin-bottom: 28px;
  }

  .commercial-space-card {
    aspect-ratio: 1.35;
  }

  .commercial-space-card strong {
    right: 20%;
    bottom: 18px;
    padding: 14px 8px;
    font-size: 18px;
  }

  .specifications-table {
    font-size: 14px;
  }

  .specification-row {
    grid-template-columns: minmax(0, 1.2fr) minmax(110px, 0.8fr);
    gap: 16px;
    min-height: 50px;
    padding: 7px 14px;
  }
}
</style>
