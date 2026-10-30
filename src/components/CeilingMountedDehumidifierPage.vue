<script setup>
import { Droplets, Gauge, Wind } from 'lucide-vue-next';

/** Selling points, in the same shape as MD001 / MD002: icon + short title + one line. */
const sellingPoints = [
  {
    title: 'Off the floor entirely.',
    text: 'Installed overhead, so no floor space is lost to equipment, storage or people moving through.',
    icon: Wind,
  },
  {
    title: 'High-capacity drying.',
    text: 'A rated 3.3 kg/h, 4.0 kg/h at high temperature and 7.0 kg/h maximum, with 800 m³/h airflow.',
    icon: Droplets,
  },
  {
    title: 'Fitted once, low fuss.',
    text: 'High-performance compressor, auto defrost, gravity drainage and a water-leak alarm.',
    icon: Gauge,
  },
];
</script>

<template>
  <article class="ceiling-dehumidifier">
    <section class="ceiling-hero" aria-labelledby="ceiling-title">
      <div class="ceiling-hero-copy">
        <p class="ceiling-eyebrow">Commercial Dehumidifier · MD0002</p>
        <h1 id="ceiling-title">Ceiling-Mounted<br />Dehumidifier</h1>
        <p>Powerful moisture control for demanding commercial environments.</p>
      </div>

      <img
        class="ceiling-hero-scene"
        src="/images/products/md0002/ceiling-mounted-factory-scene.webp"
        alt="White and black MD0002 ceiling-mounted dehumidifiers in a factory"
      />

      <div class="ceiling-selling-bar" aria-label="Key selling points">
        <div v-for="point in sellingPoints" :key="point.title" class="ceiling-selling-point">
          <component :is="point.icon" aria-hidden="true" />
          <div>
            <h2>{{ point.title }}</h2>
            <p>{{ point.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ceiling-engineered" aria-labelledby="ceiling-engineered-title">
      <div class="ceiling-engineered-copy">
        <span class="ceiling-rule" aria-hidden="true"></span>
        <h2 id="ceiling-engineered-title">Engineered for<br />Moisture Control.</h2>
        <p>
          Our industrial dehumidifiers help prevent moisture damage, protect equipment and
          inventory, improve indoor conditions, and support safer, more efficient operations.
        </p>
      </div>
      <img
        src="/images/products/md0002/ceiling-mounted-dehumidifier-white.webp"
        alt="MD0002 industrial dehumidifier"
      />
    </section>

  </article>
</template>

<style scoped>
.ceiling-dehumidifier {
  --ink: #324f54;
  --accent: #5f858d;
  --tint: #bfd8dc;
  --band: #eef4f5;
  color: #101213;
  background: #fff;
}

.ceiling-hero {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(30px, 5vw, 90px);
  align-items: center;
  min-height: clamp(610px, 54vw, 780px);
  /* No bottom padding: the selling-points bar closes the hero. */
  padding: clamp(130px, 12vw, 190px) max(7vw, calc((100vw - 1440px) / 2)) 0;
  background: linear-gradient(112deg, #d5e8ea 0%, #eff6f6 56%, #fff 100%);
}

.ceiling-eyebrow {
  margin: 0 0 20px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ceiling-hero h1,
.ceiling-engineered h2,
.ceiling-section-heading h2 {
  margin: 0;
  color: var(--ink);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.ceiling-hero h1 {
  font-size: clamp(48px, 5.5vw, 84px);
  letter-spacing: -0.015em;
}

.ceiling-hero-copy > p:last-child {
  max-width: 530px;
  margin: 24px 0 0;
  font-size: clamp(18px, 1.7vw, 26px);
  line-height: 1.42;
}

.ceiling-hero-scene {
  width: 100%;
  aspect-ratio: 2523 / 1200;
  border-radius: 10px;
  object-fit: cover;
}

/* Selling points, styled like MD001/MD002's benefits band: three columns of
   icon + title + one line, sitting flush along the bottom of the hero image. */
.ceiling-selling-bar {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(22px, 3vw, 44px);
  margin: 0 calc(-1 * max(7vw, calc((100vw - 1440px) / 2)));
  padding: clamp(30px, 3.4vw, 46px) max(7vw, calc((100vw - 1440px) / 2));
  background: var(--band, #eef4f5);
}

.ceiling-selling-point {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.ceiling-selling-point svg {
  width: 45px;
  height: 45px;
  color: var(--accent);
  stroke-width: 1.55;
}

.ceiling-selling-point h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 850;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.ceiling-selling-point p {
  max-width: 300px;
  margin: 0;
  color: #3f6159;
  font-size: 15px;
  line-height: 1.5;
}

.ceiling-engineered {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.95fr);
  gap: clamp(38px, 6vw, 100px);
  align-items: center;
  min-height: clamp(560px, 48vw, 720px);
  padding: clamp(56px, 7vw, 112px) max(7vw, calc((100vw - 1440px) / 2));
}

.ceiling-engineered-copy {
  max-width: 610px;
}

.ceiling-rule {
  display: block;
  width: clamp(110px, 10vw, 170px);
  height: 12px;
  margin: 0 0 24px;
  background: var(--accent);
}

.ceiling-engineered h2,
.ceiling-section-heading h2 {
  font-size: clamp(38px, 4vw, 62px);
}

.ceiling-engineered p {
  margin: 28px 0 0;
  font-size: clamp(18px, 1.5vw, 24px);
  line-height: 1.6;
}

.ceiling-engineered img {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
}

@media (max-width: 900px) {
  .ceiling-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 184px 28px 0;
  }

  .ceiling-hero-scene {
    max-width: 620px;
    justify-self: center;
  }

  .ceiling-selling-bar {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin: 0 -28px;
    padding: 32px 28px;
  }

  .ceiling-engineered {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 64px 28px;
  }

  .ceiling-engineered img {
    max-width: 580px;
    justify-self: center;
  }
}

@media (max-width: 560px) {
  .ceiling-hero {
    padding: 160px 20px 0;
  }

  .ceiling-hero h1 {
    font-size: clamp(42px, 12vw, 58px);
  }

  .ceiling-hero-copy > p:last-child,
  .ceiling-engineered p {
    font-size: 17px;
  }

  .ceiling-selling-bar {
    gap: 22px;
    margin: 0 -20px;
    padding: 30px 20px;
  }

  .ceiling-engineered {
    padding: 54px 20px;
  }

  .ceiling-engineered h2 {
    font-size: 36px;
  }
}
</style>
