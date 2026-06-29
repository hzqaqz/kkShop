<script setup>
import {
  BedDouble,
  Fan,
  PawPrint,
  ShieldCheck,
  Smartphone,
  Sofa,
  Volume2,
  Wind,
  Zap,
} from 'lucide-vue-next';

const spaces = [
  {
    title: 'Bedroom',
    description: 'Quiet, comfortable purification for restful nights and fresher mornings.',
    image: '/images/products/mw100/bedroom.webp',
    icon: BedDouble,
    hasImageShadow: true,
  },
  {
    title: 'Living Room',
    description: 'Keeps shared spaces feeling cleaner, calmer, and more comfortable every day.',
    image: '/images/products/mw100/living-room.png',
    icon: Sofa,
  },
  {
    title: 'Pet Room',
    description: 'Helps reduce pet dander and odors in the spaces your cats love most.',
    image: '/images/products/mw100/pet-room.webp',
    icon: PawPrint,
  },
];

const specs = [
  {
    area: 'hepa',
    label: 'H13 HEPA',
    value: 'Captures 99.97% of particles as small as 0.3 microns.',
    icon: ShieldCheck,
  },
  { area: 'power', label: 'Rated Power', value: '36W', icon: Zap },
  { area: 'cadr', label: 'CADR (Particles)', value: '200 m³/h', icon: Wind },
  { area: 'noise', label: 'Noise Level', value: '36-45 dB(A)', icon: Volume2 },
  { area: 'fan', label: 'Fan Speeds', value: '3 Levels', icon: Fan },
];
</script>

<template>
  <article class="mw100">
    <section class="mw-hero" aria-labelledby="mw100-title">
      <div class="hero-copy">
        <h1 id="mw100-title">Meower 100</h1>
        <p class="hero-subtitle">Smart Air Purifier for Pet Homes</p>
        <p class="hero-description">
          Designed for pet-loving families with cleaner air, quieter comfort, and smarter control.
        </p>
      </div>

      <div class="hero-features" aria-label="Key features">
        <div class="hero-feature">
          <span class="round-icon"><Smartphone aria-hidden="true" /></span>
          <span>
            <strong>Smart App Control</strong>
            <small>Control your air purifier anytime, anywhere.</small>
          </span>
        </div>
        <div class="hero-feature">
          <span class="round-icon"><i class="quality-ring" aria-hidden="true"></i></span>
          <span>
            <strong>3-Color Air Quality Indicator</strong>
            <small>Real-time air quality feedback with a 3-color LED light.</small>
          </span>
        </div>
        <div class="hero-feature">
          <span class="round-icon"><ShieldCheck aria-hidden="true" /></span>
          <span>
            <strong>3-Stage Composite Filtration</strong>
            <small>Captures particles and helps reduce odors for fresher air.</small>
          </span>
        </div>
      </div>
    </section>

    <section class="space-section" aria-labelledby="spaces-title">
      <div class="section-heading">
        <h2 id="spaces-title">Perfect for Every<br />Pet-Friendly Space</h2>
        <p>
          Meower 100 Air Purifier fits naturally into the places where pets and people spend the
          most time.
        </p>
      </div>

      <div class="space-grid">
        <article
          v-for="space in spaces"
          :key="space.title"
          class="space-card"
          :class="{ 'bedroom-card': space.hasImageShadow }"
        >
          <img :src="space.image" :alt="`Meower 100 in a ${space.title.toLowerCase()}`" />
          <div class="space-copy">
            <span class="space-icon"><component :is="space.icon" aria-hidden="true" /></span>
            <span>
              <h3>{{ space.title }}</h3>
              <p>{{ space.description }}</p>
            </span>
          </div>
        </article>
      </div>
    </section>

    <section class="why-section" aria-labelledby="why-title">
      <div class="why-layout">
        <div class="why-left">
          <div class="why-heading">
            <h2 id="why-title">Why Meower 100</h2>
            <p class="why-tagline">Cleaner Air. Happier Cats. Healthier Homes.</p>
            <p class="why-intro">
              Advanced filtration, smart control, and real-time quality feedback work together for
              a fresher, more comfortable home for every pet-loving family.
            </p>
          </div>

          <div class="benefit-grid">
            <article class="benefit-card">
              <span class="benefit-icon"><Smartphone aria-hidden="true" /></span>
              <h3>Smart App Control</h3>
              <p>Control your air purifier anytime, anywhere.</p>
            </article>
            <article class="benefit-card">
              <span class="benefit-icon"><i class="quality-ring" aria-hidden="true"></i></span>
              <h3>3-Color Air Quality Indicator</h3>
              <p>Real-time air quality feedback with a 3-color LED light.</p>
            </article>
            <article class="benefit-card">
              <span class="benefit-icon"><ShieldCheck aria-hidden="true" /></span>
              <h3>3-Stage Composite Filtration</h3>
              <p>Captures particles and helps reduce odors for fresher air.</p>
            </article>
          </div>

          <article class="filter-card">
            <h3>3-Stage Composite Filtration</h3>
            <div class="filter-flow">
              <div class="filter-stage">
                <span class="filter-visual pre-filter"></span>
                <strong>Pre-Filter</strong>
                <p>Captures large particles such as dust, hair, and pet dander.</p>
              </div>
              <div class="filter-stage">
                <span class="filter-visual hepa-filter"></span>
                <strong>HEPA Filter</strong>
                <p>Captures 99.97% of particles as small as 0.3 microns.</p>
              </div>
              <div class="filter-stage">
                <span class="filter-visual carbon-filter"></span>
                <strong>Activated Carbon Filter</strong>
                <p>Helps absorb common household odors and harmful gases.</p>
              </div>
            </div>
          </article>
        </div>

        <div class="why-right">
          <img
            class="why-image bedroom-image-shadow"
            src="/images/products/mw100/bedroom.webp"
            alt="Meower 100 beside a cat in a bright bedroom"
          />
          <div class="spec-grid">
            <article
              v-for="spec in specs"
              :key="spec.label"
              class="spec-card"
              :class="`spec-card--${spec.area}`"
            >
              <component :is="spec.icon" aria-hidden="true" />
              <span>
                <strong>{{ spec.label }}</strong>
                <small>{{ spec.value }}</small>
              </span>
            </article>
            <article class="coverage-card">
              <span class="coverage-label">Ideal for</span>
              <strong>20–30&nbsp;m<sup>2</sup></strong>
              <p>Perfect for bedrooms, living rooms, and home offices.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="closing-section" aria-labelledby="self-grooming-title">
      <img
        src="/images/products/mw100/04-mw100-with-cat.png"
        alt="MW100 smart air purifier with a cat"
      />
      <div>
        <h2 id="self-grooming-title">Self-Grooming Brush</h2>
        <p>
          While cats rub and groom themselves, loose fur is lifted and pulled into the perimeter intake and filtered - helping keep the air cleaner.
        </p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.mw100 {
  --ink: #21150f;
  --cream: #fff8ee;
  --card: rgba(255, 252, 247, 0.88);
  --section-title-size: clamp(38px, 4.4vw, 64px);
  --section-subtitle-size: clamp(22px, 2.2vw, 32px);
  --section-content-size: clamp(15px, 1.2vw, 18px);
  color: var(--ink);
  background:
    radial-gradient(circle at 42% 46%, rgba(238, 218, 189, 0.34), transparent 32%),
    var(--cream);
  font-family:
    "Google Sans Flex", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

.mw100 h1,
.mw100 h2,
.mw100 h3 {
  margin-top: 0;
  font-family: inherit;
  font-weight: 800;
}

.mw100 p {
  margin-top: 0;
}

.mw100 strong {
  font-family: inherit;
}

.mw-hero {
  position: relative;
  min-height: min(920px, 70vw);
  padding: clamp(130px, 11vw, 175px) max(5vw, calc((100vw - 1180px) / 2)) 64px;
  background:
    linear-gradient(90deg, rgba(255, 246, 232, 0.2), transparent 58%), 
    url("/images/products/mw100/hero-scene.png") center / cover no-repeat;
  overflow: hidden;
}

.hero-copy {
  width: min(560px, 46vw);
}

.hero-copy h1 {
  margin-bottom: 24px;
  font-size: var(--section-title-size);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.section-heading h2,
.why-heading h2 {
  margin-bottom: 4px;
  font-size: var(--section-title-size);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.closing-section h2 {
  margin-bottom: 24px;
  font-size: var(--section-title-size);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.hero-subtitle,
.why-tagline,
.closing-tagline {
  font-size: var(--section-subtitle-size);
  line-height: 1.15;
}

.hero-subtitle {
  margin-bottom: 14px;
}

.hero-description,
.section-heading p,
.why-intro,
.closing-section > div > p:last-child {
  font-size: var(--section-content-size);
  line-height: 1.5;
}

.hero-description {
  max-width: 430px;
}

.hero-features {
  display: grid;
  gap: 2px;
  width: min(430px, 34vw);
  margin: clamp(70px, 9vw, 140px) 0 0 23%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 55px rgba(95, 68, 43, 0.12);
}

.hero-feature {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 14px;
  align-items: center;
  min-height: 96px;
  padding: 14px 22px;
  background: rgba(255, 250, 243, 0.55);
  backdrop-filter: blur(10px);
}

.hero-feature strong,
.hero-feature small {
  display: block;
}

.hero-feature strong {
  margin-bottom: 4px;
  font-size: 16px;
}

.hero-feature small {
  font-size: 13px;
  line-height: 1.35;
}

.round-icon,
.benefit-icon,
.space-icon {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f4e6d2;
}

.round-icon {
  width: 56px;
  height: 56px;
}

.round-icon svg,
.benefit-icon svg,
.space-icon svg {
  width: 29px;
  height: 29px;
  stroke-width: 1.8;
}

.quality-ring {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  
  /* 核心：三段颜色无缝平分 360°（从 -24deg 开始，保持原倾斜感） */
  background: conic-gradient(from -24deg, 
    #e96f66 0deg 120deg,   /* 红色 占 1/3 */
    #f5d76b 120deg 240deg, /* 黄色 占 1/3 */
    #9dd783 240deg 360deg  /* 绿色 占 1/3 */
  );

  /* 挖空中间，形成“圆环”效果（模拟你原来的 border 粗度） */
  mask: radial-gradient(circle at center, transparent 7.5px, #000 8.5px);
  -webkit-mask: radial-gradient(circle at center, transparent 7.5px, #000 8.5px);
}

.space-section,
.why-section,
.closing-section {
  padding: clamp(64px, 7vw, 110px) max(4vw, calc((100vw - 1180px) / 2));
}

.section-heading {
  max-width: 760px;
  margin-bottom: 48px;
}

.section-heading h2 {
  margin-bottom: 22px;
  color: var(--ink);
}

.section-heading p,
.why-intro,
.closing-section > div > p:last-child {
  max-width: 620px;
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.space-card {
  border: 1px solid rgba(111, 77, 50, 0.08);
  border-radius: 22px;
  background: rgba(255, 252, 247, 0.82);
  box-shadow: 0 16px 38px rgba(112, 78, 48, 0.1);
  overflow: hidden;
}

.bedroom-card,
.bedroom-image-shadow {
  box-shadow: 0 18px 42px rgba(112, 78, 48, 0.2);
}

.space-card img {
  width: 100%;
  aspect-ratio: 1.35;
  object-fit: cover;
}

.space-copy {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 14px;
  align-items: center;
  min-height: 126px;
  padding: 18px;
}

.space-icon {
  width: 50px;
  height: 50px;
}

.space-copy h3 {
  margin-bottom: 5px;
  font-size: 19px;
}

.space-copy p {
  margin-bottom: 0;
  font-size: 13px;
  line-height: 1.4;
}

.why-section {
  padding: clamp(42px, 3vw, 60px) max(4vw, calc((100vw - 1180px) / 2));
  background:
    radial-gradient(circle at 50% 25%, rgba(232, 201, 166, 0.25), transparent 42%),
    #fff7ec;
}

.why-heading {
  min-width: 0;
}

.why-heading h2 {
  margin-bottom: 6px;
  line-height: 0.94;
}

.closing-tagline {
  margin-bottom: 8px;
}

.why-tagline {
  margin-bottom: clamp(10px, 0.8vw, 14px);
}

.why-intro {
  max-width: 960px;
  margin-bottom: 0;
}

.why-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  gap: clamp(24px, 2vw, 28px);
  align-items: stretch;
}

.why-left,
.why-right {
  display: grid;
  min-width: 0;
  gap: clamp(18px, 1.4vw, 22px);
  align-content: start;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(12px, 1vw, 14px);
  min-width: 0;
}

.benefit-card,
.filter-card,
.spec-card,
.coverage-card {
  border: 1px solid rgba(111, 77, 50, 0.08);
  background: var(--card);
  box-shadow: 0 12px 32px rgba(112, 78, 48, 0.07);
}

.benefit-card {
  display: flex;
  min-width: 0;
  min-height: clamp(230px, 18vw, 260px);
  padding: clamp(20px, 1.5vw, 24px) clamp(12px, 1vw, 16px);
  flex-direction: column;
  align-items: center;
  border-radius: clamp(20px, 1.7vw, 24px);
  text-align: center;
}

.benefit-icon {
  width: clamp(64px, 5vw, 76px);
  height: clamp(64px, 5vw, 76px);
  margin: 0 auto clamp(14px, 1vw, 18px);
  flex: 0 0 auto;
}

.benefit-icon svg {
  width: clamp(30px, 2.6vw, 40px);
  height: clamp(30px, 2.6vw, 40px);
}

.benefit-icon .quality-ring {
  width: clamp(34px, 2.8vw, 44px);
  height: clamp(34px, 2.8vw, 44px);
  mask: radial-gradient(circle at center, transparent 29%, #000 31%);
  -webkit-mask: radial-gradient(circle at center, transparent 29%, #000 31%);
}

.benefit-card h3 {
  display: grid;
  min-height: 2.4em;
  margin: 0 0 clamp(10px, 0.8vw, 14px);
  place-items: center;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.2;
  overflow-wrap: break-word;
}

.benefit-card p {
  margin-bottom: 0;
  font-size: clamp(12px, 0.85vw, 14px);
  line-height: 1.35;
  overflow-wrap: break-word;
}

.filter-card {
  min-width: 0;
  min-height: clamp(280px, 20vw, 310px);
  padding: clamp(18px, 1.3vw, 20px);
  border-radius: clamp(20px, 1.7vw, 24px);
}

.filter-card h3 {
  margin-bottom: clamp(12px, 1vw, 20px);
  font-size: clamp(17px, 1.15vw, 19px);
  line-height: 1.2;
}

.filter-flow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(12px, 1vw, 16px);
  min-width: 0;
}

.filter-stage {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.filter-stage:not(:last-child)::after {
  position: absolute;
  top: clamp(48px, 4vw, 62px);
  right: clamp(-14px, -0.8vw, -10px);
  width: clamp(20px, 1.7vw, 26px);
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(90deg, #b9dff0, #7ab6dc);
  content: "";
}

.filter-visual {
  display: block;
  width: clamp(68px, 5.4vw, 84px);
  height: clamp(96px, 7.7vw, 120px);
  margin: 0 auto clamp(12px, 0.8vw, 16px);
  flex: 0 0 auto;
  border-radius: 3px;
  box-shadow: 4px 5px 8px rgba(64, 48, 40, 0.16);
}

.pre-filter {
  border: 6px double #b5bcc1;
  background:
    linear-gradient(90deg, transparent 46%, #c2c8cc 47% 53%, transparent 54%),
    linear-gradient(#f7f8f8, #e8ecee);
}

.hepa-filter {
  border: 4px solid #e2e5e7;
  background: repeating-linear-gradient(90deg, #f7f8f8 0 4px, #d7dde0 4px 6px);
}

.carbon-filter {
  border: 4px solid #252525;
  background: repeating-linear-gradient(90deg, #141414 0 3px, #373737 3px 5px);
}

.filter-stage strong {
  display: block;
  margin-bottom: clamp(5px, 0.4vw, 8px);
  font-size: clamp(12px, 0.85vw, 14px);
  line-height: 1.2;
  overflow-wrap: break-word;
}

.filter-stage p {
  margin-bottom: 0;
  max-width: 250px;
  font-size: clamp(10px, 0.72vw, 12px);
  line-height: 1.35;
  overflow-wrap: break-word;
}

.why-image {
  width: 100%;
  min-width: 0;
  min-height: 0;
  aspect-ratio: 1.7;
  border-radius: clamp(22px, 1.7vw, 26px);
  object-fit: cover;
}

.spec-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  grid-template-areas:
    "hepa power"
    "cadr coverage"
    "noise coverage"
    "fan coverage";
  grid-template-rows: repeat(4, minmax(clamp(96px, 7vw, 108px), auto));
  gap: clamp(12px, 0.9vw, 14px);
  min-width: 0;
}

.spec-card {
  display: grid;
  grid-template-columns: clamp(44px, 3.3vw, 52px) minmax(0, 1fr);
  gap: clamp(8px, 0.7vw, 10px);
  align-items: center;
  min-width: 0;
  min-height: 0;
  padding: clamp(14px, 1vw, 16px);
  border-radius: clamp(24px, 1.8vw, 28px);
}

.spec-card--hepa {
  grid-area: hepa;
}

.spec-card--power {
  grid-area: power;
}

.spec-card--cadr {
  grid-area: cadr;
}

.spec-card--noise {
  grid-area: noise;
}

.spec-card--fan {
  grid-area: fan;
}

.spec-card > svg {
  width: clamp(42px, 3.2vw, 50px);
  height: clamp(42px, 3.2vw, 50px);
  stroke-width: 1.7;
}

.spec-card > span {
  min-width: 0;
}

.spec-card strong,
.spec-card small {
  display: block;
  overflow-wrap: break-word;
}

.spec-card strong {
  margin-bottom: clamp(5px, 0.4vw, 8px);
  font-size: clamp(15px, 1vw, 16px);
  line-height: 1.2;
}

.spec-card small {
  font-size: clamp(12px, 0.85vw, 14px);
  line-height: 1.35;
}

.coverage-card {
  grid-area: coverage;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: clamp(22px, 1.8vw, 30px);
  border-radius: clamp(26px, 1.9vw, 30px);
}

.coverage-label {
  display: block;
  font-family: inherit;
  font-size: clamp(22px, 1.8vw, 30px);
  font-weight: 800;
}

.coverage-card > strong {
  display: block;
  max-width: 100%;
  margin: clamp(6px, 0.5vw, 8px) 0 clamp(24px, 2.5vw, 38px);
  font-size: clamp(32px, 2.8vw, 40px);
  letter-spacing: -0.055em;
  line-height: 1;
  white-space: nowrap;
}

.coverage-card sup {
  position: relative;
  top: -0.15em;
  font-size: 0.45em;
}

.coverage-card p {
  margin-bottom: 0;
  max-width: 300px;
  font-size: clamp(14px, 1vw, 16px);
  line-height: 1.45;
  overflow-wrap: break-word;
}

.closing-section {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 50px;
  align-items: start;
  min-height: 610px;
}

.closing-section > div:last-of-type {
  padding-top: 48px;
}

.closing-section img {
  width: 100%;
  border-radius: 22px;
  object-fit: cover;
}

@media (min-width: 901px) {
  .why-left {
    grid-template-rows: auto auto minmax(0, 1fr);
    align-content: stretch;
  }

  .why-right {
    grid-template-rows: auto minmax(0, 1fr);
    align-content: stretch;
  }

  .spec-grid {
    grid-template-rows: repeat(4, minmax(clamp(96px, 7vw, 108px), 1fr));
  }
}

@media (max-width: 900px) {
  .mw-hero {
    min-height: 840px;
    padding-top: 150px;
    background-position: 55% center;
  }

  .hero-copy {
    width: min(620px, 86vw);
  }

  .hero-features {
    width: min(430px, 80vw);
    margin: 270px 0 0;
  }

  .space-grid,
  .why-layout,
  .closing-section {
    grid-template-columns: 1fr;
  }

  .why-image {
    min-height: 430px;
  }

  .closing-section {
    min-height: auto;
  }
}

@media (max-width: 620px) {
  .mw100 {
    --section-title-size: 36px;
    --section-subtitle-size: 24px;
    --section-content-size: 15px;
  }

  .mw-hero {
    min-height: 930px;
    padding: 132px 18px 36px;
    background-position: 58% center;
  }

  .hero-copy {
    width: 100%;
    padding: 20px;
    border-radius: 20px;
    background: rgba(255, 248, 238, 0.78);
    backdrop-filter: blur(8px);
  }

  .hero-features {
    width: 100%;
   margin: 20px 0 0 0;
  }

  .hero-feature {
    grid-template-columns: 52px 1fr;
    min-height: 88px;
    padding: 12px 16px;
  }

  .round-icon {
    width: 48px;
    height: 48px;
  }

  .space-section,
  .why-section,
  .closing-section {
    padding: 58px 18px;
  }

  .space-grid {
    gap: 18px;
  }

  .space-card img {
    aspect-ratio: 1.25;
  }

  .benefit-grid,
  .filter-flow {
    grid-template-columns: 1fr;
  }

  .spec-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "hepa"
      "power"
      "cadr"
      "noise"
      "fan"
      "coverage";
    grid-template-rows: none;
  }

  .benefit-card {
    min-height: 0;
  }

  .filter-stage:not(:last-child)::after {
    top: auto;
    right: 50%;
    bottom: -12px;
    width: 4px;
    height: 18px;
  }

  .filter-stage {
    padding-bottom: 15px;
  }

  .coverage-card {
    min-height: 300px;
  }

  .why-image {
    min-height: 260px;
  }

  .closing-section {
    gap: 28px;
  }
}
</style>
