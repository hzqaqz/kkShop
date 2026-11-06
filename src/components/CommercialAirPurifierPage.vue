<script setup>
import { House, ShieldCheck, Volume1, Wind } from 'lucide-vue-next';

/**
 * MW1000 commercial air purifier.
 *
 * Every claim on this page comes from the manufacturer specification sheet:
 * H13 filter grade, 877 m³/h particle CADR, up to 105 m² recommended usable
 * area, ≤ 69 dB(A), 3 fan speeds, 105 W, 20 kg gross, 390 × 390 × 760 mm.
 * Add new claims only when they are backed by the same sheet.
 */
/** Selling points, in the same shape as MD001 / MD002: icon + short title + one line. */
const sellingPoints = [
  {
    title: 'Clean air at scale.',
    text: 'H13 filtration with an 877 m³/h particle CADR keeps a large room turning over, not just the metres around the unit.',
    icon: ShieldCheck,
  },
  {
    title: 'Covers up to 105 m².',
    text: 'A recommended usable area of up to 105 m², which suits gyms, offices and classrooms.',
    icon: House,
  },
  {
    title: 'Quiet at full speed.',
    text: 'Three fan speeds with no more than 69 dB(A) at full output, at a rated 105 W.',
    icon: Volume1,
  },
];

const specs = [
  ['Model', 'MW1000'],
  ['Filter grade', 'H13'],
  ['Particle CADR', '877 m³/h'],
  ['Recommended room size', 'Up to 105 m²'],
  ['Noise level', '≤ 69 dB(A)'],
  ['Fan speeds', '3'],
  ['Rated power', '105 W'],
  ['Gross weight', '20 kg'],
  ['Product size', '390 × 390 × 760 mm'],
  ['Packing size', '480 × 480 × 880 mm'],
];

const spaces = [
  {
    label: 'Gyms & fitness studios',
    image: '/images/products/mw1000/space-gym.webp',
    alt: 'MW1000 commercial air purifier beside a weight rack in a gym',
    modifier: 'tall',
  },
  {
    label: 'Offices',
    image: '/images/products/mw1000/space-office.webp',
    alt: 'MW1000 commercial air purifier in an open-plan office',
  },
  {
    label: 'Classrooms',
    image: '/images/products/mw1000/space-classroom.webp',
    alt: 'MW1000 commercial air purifier in a classroom',
  },
];
</script>

<template>
  <article class="commercial-purifier">
    <section class="purifier-hero" aria-labelledby="commercial-purifier-title">
      <div class="purifier-hero-copy">
        <p class="purifier-eyebrow">Commercial Air Purifier · MW1000</p>
        <h1 id="commercial-purifier-title">Commercial<br />Air Purifier</h1>
        <p>
          High-efficiency purification for large commercial spaces — reliable clean-air
          performance that helps keep shared rooms healthier, fresher and more comfortable.
        </p>
      </div>

      <img
        class="purifier-hero-scene"
        src="/images/products/mw1000/hero-gym.webp"
        alt="MW1000 commercial air purifier standing in a sunlit gym"
      />

      <div class="purifier-selling-bar" aria-label="Key selling points">
        <div v-for="point in sellingPoints" :key="point.title" class="purifier-selling-point">
          <component :is="point.icon" aria-hidden="true" />
          <div>
            <h2>{{ point.title }}</h2>
            <p>{{ point.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="purifier-engineered" aria-labelledby="purifier-engineered-title">
      <div class="purifier-engineered-copy">
        <span class="purifier-rule" aria-hidden="true"></span>
        <h2 id="purifier-engineered-title">Engineered for<br />Large Spaces.</h2>
        <p>
          The MW1000 pairs an H13 filter with an 877 m³/h particle CADR, so it can keep turning
          over the air in rooms where people, equipment and foot traffic keep particles moving.
          Three fan speeds cover day-to-day running through to heavy use, at a rated 105 W.
        </p>
      </div>
      <img
        src="/images/products/mw1000/product-white.webp"
        alt="Meower MW1000 commercial air purifier with front display"
      />
    </section>

    <section class="purifier-specs" aria-labelledby="purifier-specs-title">
      <div class="purifier-specs-copy">
        <span class="purifier-rule" aria-hidden="true"></span>
        <h2 id="purifier-specs-title">Technical<br />Specification</h2>
        <p>
          Recommended usable area is up to 105 m². The tower stands 760 mm tall on a
          390 × 390 mm footprint, so it fits beside a wall without taking up floor space people
          need to walk through.
        </p>
      </div>

      <dl class="purifier-spec-list">
        <div v-for="[label, value] in specs" :key="label" class="purifier-spec-row">
          <dt>{{ label }}</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
    </section>

    <section class="purifier-spaces" aria-labelledby="purifier-spaces-title">
      <div class="purifier-section-heading">
        <span class="purifier-rule" aria-hidden="true"></span>
        <h2 id="purifier-spaces-title">Built for<br />Shared Spaces.</h2>
      </div>

      <div class="purifier-space-grid">
        <figure
          v-for="space in spaces"
          :key="space.label"
          class="purifier-space"
          :class="{ 'purifier-space--tall': space.modifier === 'tall' }"
        >
          <img :src="space.image" :alt="space.alt" loading="lazy" decoding="async" />
          <figcaption>{{ space.label }}</figcaption>
        </figure>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Heading system matched to CommercialDehumidifierPage.vue and
   CeilingMountedDehumidifierPage.vue so the commercial family reads as one set. */
.commercial-purifier {
  --ink: #324f54;
  --accent: #5f858d;
  --tint: #bfd8dc;
  --band: #eef4f5;
  color: #101213;
  background: #fff;
}

.commercial-purifier h1,
.commercial-purifier h2 {
  margin: 0;
  color: var(--ink);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.purifier-hero {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(30px, 5vw, 90px);
  align-items: center;
  min-height: clamp(610px, 54vw, 780px);
  /* No bottom padding: the selling-points bar closes the hero. */
  padding: clamp(130px, 12vw, 190px) max(7vw, calc((100vw - 1440px) / 2)) 0;
  background: linear-gradient(112deg, #d5e8ea 0%, #eff6f6 56%, #fff 100%);
}

.purifier-eyebrow {
  margin: 0 0 20px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.purifier-hero h1 {
  font-size: clamp(48px, 5.5vw, 84px);
  letter-spacing: -0.015em;
}

.purifier-hero-copy > p:last-child {
  max-width: 530px;
  margin: 24px 0 0;
  font-size: clamp(18px, 1.7vw, 26px);
  line-height: 1.42;
}

.purifier-hero-scene {
  width: 100%;
  aspect-ratio: 1374 / 1145;
  border-radius: 10px;
  object-fit: cover;
}

/* Selling points, styled like MD001/MD002's benefits band: three columns of
   icon + title + one line, sitting flush along the bottom of the hero image. */
.purifier-selling-bar {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(22px, 3vw, 44px);
  margin: 0 calc(-1 * max(7vw, calc((100vw - 1440px) / 2)));
  padding: clamp(30px, 3.4vw, 46px) max(7vw, calc((100vw - 1440px) / 2));
  background: var(--band, #eef4f5);
}

.purifier-selling-point {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.purifier-selling-point svg {
  width: 45px;
  height: 45px;
  color: var(--accent);
  stroke-width: 1.55;
}

.purifier-selling-point h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.purifier-selling-point p {
  max-width: 300px;
  margin: 0;
  color: #3f6167;
  font-size: 15px;
  line-height: 1.5;
}

.purifier-engineered {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.95fr);
  gap: clamp(38px, 6vw, 100px);
  align-items: center;
  min-height: clamp(560px, 48vw, 720px);
  padding: clamp(56px, 7vw, 112px) max(7vw, calc((100vw - 1440px) / 2));
}

.purifier-engineered-copy {
  max-width: 610px;
}

.purifier-rule {
  display: block;
  width: clamp(110px, 10vw, 170px);
  height: 12px;
  margin: 0 0 24px;
  background: var(--accent);
}

.purifier-engineered h2,
.purifier-specs h2,
.purifier-section-heading h2 {
  font-size: clamp(38px, 4vw, 62px);
}

.purifier-engineered p {
  margin: 28px 0 0;
  font-size: clamp(18px, 1.5vw, 24px);
  line-height: 1.6;
}

.purifier-engineered img {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
}

.purifier-specs {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(340px, 1fr);
  gap: clamp(34px, 5vw, 80px);
  align-items: start;
  padding: clamp(56px, 7vw, 112px) max(7vw, calc((100vw - 1440px) / 2));
  background: #f6fafb;
}

.purifier-specs-copy {
  max-width: 520px;
}

.purifier-specs-copy p {
  margin: 28px 0 0;
  font-size: clamp(17px, 1.4vw, 22px);
  line-height: 1.6;
}

.purifier-spec-list {
  display: grid;
  gap: 0;
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
}

.purifier-spec-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 16px;
  padding: 14px 20px;
  background: #fff;
}

.purifier-spec-row:nth-child(odd) {
  background: var(--tint);
}

.purifier-spec-row dt {
  color: var(--ink);
  font-size: clamp(14px, 1.15vw, 17px);
  font-weight: 600;
  line-height: 1.35;
}

.purifier-spec-row dd {
  margin: 0;
  color: #101213;
  font-size: clamp(14px, 1.15vw, 17px);
  font-weight: 600;
  line-height: 1.35;
}

.purifier-spaces {
  padding: clamp(56px, 7vw, 112px) max(7vw, calc((100vw - 1440px) / 2));
}

.purifier-section-heading {
  margin-bottom: clamp(28px, 3.4vw, 46px);
}

.purifier-space-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.purifier-space {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: 10px;
  aspect-ratio: 682 / 539;
}

.purifier-space--tall {
  grid-row: span 2;
  aspect-ratio: auto;
}

.purifier-space img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.purifier-space figcaption {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 12px 22px;
  background: rgba(50, 79, 84, 0.82);
  color: #fff;
  font-size: clamp(15px, 1.3vw, 20px);
  font-weight: 600;
  line-height: 1.2;
}

@media (max-width: 900px) {
  .purifier-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 184px 28px 64px;
  }

  .purifier-hero-scene {
    max-width: 620px;
    justify-self: center;
  }

  .purifier-selling-bar {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin: 0 -28px;
    padding: 32px 28px;
  }

  .purifier-engineered,
  .purifier-specs {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    padding: 64px 28px;
  }

  .purifier-engineered img {
    max-width: 420px;
    justify-self: center;
  }

  .purifier-spaces {
    padding: 64px 28px;
  }
}

@media (max-width: 560px) {
  .purifier-hero {
    padding: 160px 20px 52px;
  }

  .purifier-hero h1 {
    font-size: clamp(42px, 12vw, 58px);
  }

  .purifier-hero-copy > p:last-child,
  .purifier-engineered p,
  .purifier-specs-copy p {
    font-size: 17px;
  }

  .purifier-selling-bar {
    gap: 22px;
    margin: 0 -20px;
    padding: 30px 20px;
  }

  .purifier-engineered,
  .purifier-specs {
    padding: 54px 20px;
  }

  .purifier-engineered h2,
  .purifier-specs h2,
  .purifier-section-heading h2 {
    font-size: 36px;
  }

  .purifier-spec-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
    padding: 12px 16px;
  }

  .purifier-spaces {
    padding: 54px 20px;
  }

  .purifier-space-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .purifier-space,
  .purifier-space--tall {
    grid-row: auto;
    aspect-ratio: 4 / 3;
  }
}
</style>
