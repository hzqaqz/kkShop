<script setup>
import { ArrowDownToLine, Droplets, Gauge, Snowflake } from 'lucide-vue-next';

const features = [
  { label: 'Water leak alarm', icon: Droplets },
  { label: 'High performance compressor', icon: Gauge },
  { label: 'Gravity drainage', icon: ArrowDownToLine },
  { label: 'Auto defrost', icon: Snowflake },
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
        src="/images/products/md0002/ceiling-mounted-factory-scene.png"
        alt="White and black MD0002 ceiling-mounted dehumidifiers in a factory"
      />

      <div class="ceiling-feature-grid" aria-label="Key product features">
        <article v-for="feature in features" :key="feature.label" class="ceiling-feature">
          <component :is="feature.icon" aria-hidden="true" />
          <strong>{{ feature.label }}</strong>
        </article>
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
        src="/images/products/md0002/ceiling-mounted-dehumidifier-white.png"
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
  color: #101213;
  background: #fff;
}

.ceiling-hero {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(30px, 5vw, 90px);
  align-items: center;
  min-height: clamp(610px, 54vw, 780px);
  padding: clamp(130px, 12vw, 190px) max(7vw, calc((100vw - 1440px) / 2)) clamp(130px, 10vw, 160px);
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

.ceiling-feature-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: clamp(20px, 4vw, 54px);
  width: min(900px, 100%);
}

.ceiling-feature {
  display: grid;
  justify-items: center;
  gap: 13px;
  color: var(--ink);
  text-align: center;
}

.ceiling-feature svg {
  width: clamp(48px, 5vw, 76px);
  height: clamp(48px, 5vw, 76px);
  stroke-width: 1.7;
}

.ceiling-feature strong {
  max-width: 160px;
  font-size: clamp(15px, 1.25vw, 20px);
  line-height: 1.15;
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
    padding: 184px 28px 64px;
  }

  .ceiling-hero-scene {
    max-width: 620px;
    justify-self: center;
  }

  .ceiling-feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-self: center;
    max-width: 600px;
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
    padding: 160px 20px 52px;
  }

  .ceiling-hero h1 {
    font-size: clamp(42px, 12vw, 58px);
  }

  .ceiling-hero-copy > p:last-child,
  .ceiling-engineered p {
    font-size: 17px;
  }

  .ceiling-feature-grid {
    gap: 26px 12px;
  }

  .ceiling-engineered {
    padding: 54px 20px;
  }

  .ceiling-engineered h2 {
    font-size: 36px;
  }
}
</style>
