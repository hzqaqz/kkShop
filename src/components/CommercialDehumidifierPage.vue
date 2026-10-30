<script setup>
import { Droplets, Gauge, Wind } from 'lucide-vue-next';

/** Selling points, in the same shape as MD001 / MD002: icon + short title + one line. */
const sellingPoints = [
  {
    title: 'Commercial-scale extraction.',
    text: 'A rated 1.25 kg/h, up to 50 L/day at high temperature and a maximum capacity of 60 L/day.',
    icon: Droplets,
  },
  {
    title: 'Air that keeps moving.',
    text: '320 m³/h of airflow carries dried air through warehouses, basements and garages rather than one corner.',
    icon: Wind,
  },
  {
    title: 'Built to run unattended.',
    text: 'High-performance compressor, auto defrost, gravity drainage and a water-leak alarm.',
    icon: Gauge,
  },
];

const spaces = [
  {
    label: 'Basement & Garages',
    image: '/images/products/md0001/basement-garage.webp',
    alt: 'MD0001 commercial dehumidifier in a basement garage',
  },
  {
    label: 'Warehouse',
    image: '/images/products/md0001/warehouse-space.webp',
    alt: 'MD0001 commercial dehumidifier in a warehouse',
  },
];
</script>

<template>
  <article class="commercial-dehumidifier">
    <section class="commercial-hero" aria-labelledby="commercial-title">
      <div class="commercial-hero-copy">
        <p class="commercial-eyebrow">Commercial Dehumidifier · MD0001</p>
        <h1 id="commercial-title">Commercial<br />Dehumidifier</h1>
        <p>Powerful moisture control for demanding commercial environments.</p>
      </div>

      <img
        class="commercial-hero-scene"
        src="/images/products/md0001/warehouse-hero.webp"
        alt="White MD0001 commercial dehumidifier standing in a warehouse aisle"
      />

      <div class="commercial-selling-bar" aria-label="Key selling points">
        <div v-for="point in sellingPoints" :key="point.title" class="commercial-selling-point">
          <component :is="point.icon" aria-hidden="true" />
          <div>
            <h2>{{ point.title }}</h2>
            <p>{{ point.text }}</p>
          </div>
        </div>
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
        src="/images/products/md0001/product-white.webp"
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

  </article>
</template>

<style scoped>
.commercial-dehumidifier {
  --commercial-ink: #324f54;
  --commercial-accent: #5f858d;
  --commercial-tint: #bfd8dc;
  --band: #eef4f5;
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
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(30px, 5vw, 90px);
  align-items: center;
  min-height: clamp(610px, 54vw, 780px);
  /* No bottom padding: the selling-points bar closes the hero. */
  padding: clamp(130px, 12vw, 190px) max(7vw, calc((100vw - 1440px) / 2)) 0;
  background: linear-gradient(112deg, #d5e8ea 0%, #eff6f6 56%, #fff 100%);
}

.commercial-hero-copy {
  max-width: 560px;
}

/* Scene photo on the right, framed like the other product heroes. */
.commercial-hero-scene {
  width: 100%;
  aspect-ratio: 1800 / 1013;
  border-radius: 10px;
  object-fit: cover;
}

.commercial-eyebrow {
  margin: 0 0 20px;
  color: var(--commercial-accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Headings mirror CeilingMountedDehumidifierPage.vue: one ink colour, weight 900,
   -0.045em tracking, 1.02 line-height. */
.commercial-hero h1,
.performance-section h2,
.commercial-section-heading h2 {
  margin: 0;
  color: var(--commercial-ink);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.commercial-hero h1 {
  font-size: clamp(48px, 5.5vw, 84px);
  letter-spacing: -0.015em;
}

/* :not(...) so the subtitle rule does not also size the eyebrow above the H1. */
.commercial-hero-copy p:not(.commercial-eyebrow) {
  margin: 24px 0 0;
  font-size: clamp(18px, 1.7vw, 26px);
  line-height: 1.42;
}

/* Selling points, styled like MD001/MD002's benefits band: three columns of
   icon + title + one line, sitting flush along the bottom of the hero image. */
.commercial-selling-bar {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(22px, 3vw, 44px);
  margin: 0 calc(-1 * max(7vw, calc((100vw - 1440px) / 2)));
  padding: clamp(30px, 3.4vw, 46px) max(7vw, calc((100vw - 1440px) / 2));
  background: var(--band, #eef4f5);
}

.commercial-selling-point {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.commercial-selling-point svg {
  width: 45px;
  height: 45px;
  color: var(--commercial-accent);
  stroke-width: 1.55;
}

.commercial-selling-point h2 {
  margin: 0 0 8px;
  color: var(--commercial-ink);
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 850;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.commercial-selling-point p {
  max-width: 300px;
  margin: 0;
  color: #3f6167;
  font-size: 15px;
  line-height: 1.5;
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
  width: clamp(110px, 10vw, 170px);
  height: 12px;
  margin-bottom: 24px;
  background: var(--commercial-accent);
}

.performance-section h2,
.commercial-section-heading h2 {
  font-size: clamp(38px, 4vw, 62px);
}

.performance-copy p {
  max-width: 650px;
  margin: 28px 0 0;
  font-size: clamp(18px, 1.5vw, 24px);
  line-height: 1.6;
}

.performance-section img {
  align-self: center;
  width: 100%;
  height: calc(100% - 96px);
  margin: 48px 0;
  object-fit: cover;
}

.commercial-spaces-section {
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

@media (max-width: 900px) {
  .commercial-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 184px 28px 0;
  }

  .commercial-hero-scene {
    max-width: 620px;
    justify-self: center;
  }

  .commercial-hero h1 {
    font-size: clamp(44px, 9vw, 66px);
  }

  .commercial-selling-bar {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin: 0 -28px;
    padding: 32px 28px;
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

  .commercial-spaces-section {
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
    padding: 160px 20px 0;
  }

  .commercial-hero h1 {
    font-size: clamp(42px, 12vw, 58px);
  }

  .commercial-hero-copy p:not(.commercial-eyebrow) {
    font-size: 17px;
  }

  .commercial-selling-bar {
    gap: 22px;
    margin: 0 -20px;
    padding: 30px 20px;
  }

  .performance-section h2,
  .commercial-section-heading h2 {
    font-size: 36px;
  }

  .performance-copy p {
    font-size: 17px;
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
}
</style>
