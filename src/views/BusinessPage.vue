<script setup>
import { RouterLink } from 'vue-router';
import PromoAdModal from '../components/PromoAdModal.vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { businessGroups, getBusinessProducts } from '../data/catalog';
import { contacts } from '../data/siteInfo';

useSeo({
  title: 'Business & Wholesale',
  description:
    'Wholesale, OEM/ODM and project supply of Meower pet-friendly air purifiers and dehumidifiers for distributors, retailers and contractors worldwide.',
  path: '/business',
});

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Business', to: '/business' },
];

/** Capability points moved over from the homepage "Why Meower" block. */
const brandPoints = [
  {
    title: 'H13 HEPA filtration',
    text: 'Pet-friendly air purifiers that capture dander, dust and pollen.',
  },
  {
    title: 'High-CADR air purifiers',
    text: 'Built to move a lot of air, so a room is cleaned quickly rather than slowly.',
  },
  {
    title: 'Home to commercial dehumidifiers',
    text: 'Including ceiling-mounted units for factories and facilities.',
  },
  {
    title: 'OEM & ODM services',
    text: 'Custom specification, branding and packaging support.',
  },
  {
    title: 'Wholesale and bulk orders',
    text: 'For distributors, retailers and project buyers worldwide.',
  },
  {
    title: 'Project support',
    text: 'From initial specification through to repeat orders.',
  },
];

const cooperationOptions = [
  'Wholesale and bulk orders',
  'OEM and ODM services',
  'Residential and commercial product solutions',
  'Long-term distribution partnerships',
  'Project-based product support',
];

/**
 * Both ranges come from `src/data/catalog.js`. Placeholders are announced
 * products without a detail page, so they render as non-clickable cards.
 */
const ranges = businessGroups.map((group) => ({
  id: group.id,
  label: group.label,
  description: group.description,
  products: getBusinessProducts(group.id).map((product) => ({
    id: product.id,
    name: product.label,
    image: product.image,
  })),
  placeholders: group.placeholders ?? [],
}));
</script>

<template>
  <main class="site-shell business-page">
    <SiteHeader overlay-hero />

    <section class="business-hero" aria-labelledby="business-title">
      <img
        class="business-hero-bg"
        src="/images/business/partner-hero.webp"
        alt="Meower MW1000 commercial air purifier standing in a gym"
        loading="eager"
        decoding="async"
      />
      <span class="business-hero-scrim" aria-hidden="true"></span>

      <div class="business-hero-copy">
        <SiteBreadcrumbs :items="breadcrumbs" />
        <p class="business-eyebrow">Business</p>
        <h1 id="business-title">Partner with Meower</h1>
        <p class="business-tagline">Cleaner Air for Pets and the People Who Love Them.</p>
      </div>
    </section>


    <!-- Moved from the homepage: why buyers work with us. -->
    <section id="why-meower" class="business-section" aria-labelledby="business-why-title">
      <div class="business-heading">
        <p class="business-eyebrow">Why Meower</p>
        <h2 id="business-why-title">Air Care Built Around Pets, Made for Business</h2>
      </div>

      <div class="brand-layout">
        <div class="brand-copy">
          <p>
            Meower designs air purifiers and dehumidifiers for households where cats and dogs
            share the living space. Fur, dander and the fine particles that carry odour settle
            into carpets, bedding and soft furniture, then get lifted back into the air through
            everyday movement. Our air purifiers combine three-stage composite filtration with
            H13 HEPA media to capture those particles continuously, while the carbon stage helps
            reduce the everyday odours that build up in pet homes.
          </p>

          <p>
            Humidity is the other half of indoor air quality. Excess moisture shows up as fogged
            windows, a musty smell in a closet, or mould that keeps returning to the same corner
            of a bathroom. Meower dehumidifiers range from compact home units for bedrooms and
            closets through to commercial and ceiling-mounted models for warehouses, basements
            and factories, so the same moisture problem can be solved at any scale.
          </p>

          <p>
            We supply distributors, retailers, contractors and project buyers worldwide. Alongside
            our standard range we offer OEM and ODM services, residential and commercial product
            solutions, long-term distribution partnerships and project-based product support —
            from initial specification through to repeat orders.
          </p>
        </div>

        <ul class="brand-points" aria-label="Meower capabilities">
          <li v-for="point in brandPoints" :key="point.title">
            <strong>{{ point.title }}</strong>
            <span>{{ point.text }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="products" class="business-section" aria-labelledby="business-products-title">
      <div class="business-heading">
        <p class="business-eyebrow">Product range</p>
        <h2 id="business-products-title">What we supply</h2>
      </div>

      <div class="business-ranges">
        <div v-for="range in ranges" :id="range.id" :key="range.id" class="business-range">
          <div class="business-range-heading">
            <h3>{{ range.label }}</h3>
            <p>{{ range.description }}</p>
          </div>

          <div class="product-list-grid">
            <RouterLink
              v-for="product in range.products"
              :key="product.id"
              class="product-list-card"
              :to="{ name: 'product-detail', params: { productId: product.id } }"
            >
              <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
              <h3>{{ product.name }}</h3>
              <span>View product</span>
            </RouterLink>

            <!-- Announced but not listed yet: no detail page, so not a link. -->
            <article
              v-for="placeholder in range.placeholders"
              :key="placeholder.label"
              class="product-list-card product-list-card--placeholder"
            >
              <div class="product-list-card-art" aria-hidden="true">+</div>
              <h3>{{ placeholder.label }}</h3>
              <span>{{ placeholder.note }}</span>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- About + contact in one section: story, sign-off, then how to reach us. -->
    <section id="about" class="business-section" aria-labelledby="business-about-title">
      <div class="business-heading">
        <p class="business-eyebrow">About us</p>
        <h2 id="business-about-title">Built around pets, made for business</h2>
      </div>

      <div class="business-story">
        <p>
          Pets spend most of their lives indoors — close to carpets, sofas, beds, litter areas,
          and the quiet corners of home. These are also the places where fur, dander, dust, and
          odors can easily build up.
        </p>
        <p>At Meower, we believe a better home environment should care for both pets and people.</p>
        <p>
          That’s why we create air purifiers designed for cat-loving families: helping reduce
          airborne fur, dander, particles, and everyday odors, while keeping the home fresh,
          calm, and comfortable.
        </p>
        <p>
          Because cleaner air is not just about breathing better. It is about more peaceful naps,
          warmer cuddles, happier playtime, and more everyday moments shared together.
        </p>
      </div>

      <p class="business-signoff">Meower — Cleaner Air. Happier Pet Homes.</p>

      <span id="contact" class="business-anchor" aria-hidden="true"></span>
      <div class="business-heading business-heading--contact">
        <p class="business-eyebrow">Partner with Meower</p>
        <h2 id="business-contact-title">Contact Us</h2>
      </div>

      <div class="about-band">
        <div class="contact-copy">
          <p class="contact-lead">
            Looking for reliable air purifiers and dehumidifiers for your market?
          </p>
          <p>
            We provide residential and commercial air purification and humidity control solutions
            for distributors, retailers, contractors, and project buyers worldwide.
          </p>
          <p class="cooperation-intro">Our cooperation options include:</p>
          <ul class="cooperation-list" aria-label="Cooperation options">
            <li v-for="option in cooperationOptions" :key="option">{{ option }}</li>
          </ul>
        </div>

        <div class="contact-panel">
          <h3>Contact us to start your business inquiry today.</h3>
          <ul class="contact-list" aria-label="Contact information">
            <li v-for="contact in contacts" :key="contact.label">
              <component :is="contact.icon" aria-hidden="true" />
              <span>{{ contact.label }}: {{ contact.value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <img
        class="business-closing-image"
        src="/images/business/about-closing.webp"
        alt="Meower air purifier beside a Bengal cat on a wooden floor"
        loading="lazy"
        decoding="async"
      />
    </section>

    <!-- Distributor offer: only ever mounted on the Business page. -->
    <PromoAdModal />
  </main>
</template>

<style scoped>
.business-page { --ink: #345258; color: #171918; background: #fff; }
.business-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: clamp(560px, 86vh, 900px);
  padding: 0 max(7vw, calc((100vw - 1240px) / 2)) clamp(46px, 6vw, 84px);
  overflow: hidden;
}

/* Photo starts at the very top of the page, behind the fixed navigation. */
.business-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
}

/* Dark scrim: heavier at the top so the navigation reads, heavier again at the
   bottom so the headline reads. */
.business-hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(12, 28, 32, 0.66) 0%, rgba(12, 28, 32, 0.2) 32%, rgba(12, 28, 32, 0.42) 62%, rgba(12, 28, 32, 0.8) 100%);
}

.business-hero-copy { position: relative; z-index: 1; max-width: 1040px; }
.business-eyebrow { margin: 0 0 12px; color: var(--ink); font-size: 14px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.business-hero h1, .business-heading h2 { margin: 0; color: var(--ink); font-size: clamp(52px, 6.6vw, 104px); font-weight: 850; letter-spacing: -.055em; line-height: .96; }
/* Copy sits on the photo, so it switches to light colours. */
.business-hero h1 { color: #fff; text-shadow: 0 2px 24px rgba(0, 0, 0, 0.32); }
.business-hero .business-eyebrow { color: #d9eee8; }
.business-tagline { max-width: 850px; margin: 30px 0 0; font-size: clamp(21px, 2.1vw, 33px); font-weight: 520; line-height: 1.3; }
.business-hero .business-tagline { color: rgba(255, 255, 255, 0.94); }
.business-hero-copy :deep(.site-breadcrumbs) { --seo-muted: rgba(255, 255, 255, 0.72); --seo-border: rgba(255, 255, 255, 0.45); --seo-ink: #fff; }
.business-section { padding: clamp(64px, 8vw, 118px) max(7vw, calc((100vw - 1240px) / 2)); }
.business-hero + .business-section { padding-top: clamp(18px, 2.6vw, 40px); }
.business-section + .business-section { padding-top: 0; }
.business-heading { margin-bottom: clamp(34px, 4vw, 56px); }
.business-heading h2 { font-size: clamp(36px, 4.6vw, 68px); letter-spacing: -.04em; }
.business-story { display: grid; gap: clamp(20px, 2.6vw, 34px); max-width: 1080px; font-size: clamp(18px, 1.6vw, 25px); line-height: 1.5; }
.business-story p { margin: 0; }
.business-signoff { margin: clamp(32px, 4vw, 56px) 0 0; color: var(--ink); font-size: clamp(21px, 1.9vw, 30px); font-weight: 680; }
.business-ranges { display: grid; gap: clamp(44px, 5vw, 72px); }
.business-range { scroll-margin-top: 118px; }
/* Range titles ("Air Purifiers" / "Dehumidifiers") stay on one line; product
   card titles inside the range keep normal wrapping. */
.business-range-heading h3 { margin: 0; color: var(--ink); font-size: clamp(27px, 3vw, 40px); font-weight: 820; letter-spacing: -.02em; white-space: nowrap; }
.business-range h3 { margin: 0; }
.business-range-heading p { max-width: 720px; margin: 12px 0 0; color: #5a7c85; font-size: clamp(16px, 1.4vw, 20px); line-height: 1.5; }
.business-range :deep(.product-list-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
/* The contact band was designed for the homepage: centre it in the section's
   own content width so its edges line up with the cards above, and let the
   section padding provide the vertical rhythm. */
.business-section .about-band { width: 100%; margin-top: 0; margin-bottom: 0; }
/* Anchor for the footer's "Contact us" link inside the merged section. */
.business-anchor { display: block; height: 0; scroll-margin-top: 118px; }
.business-heading--contact { margin-top: clamp(52px, 7vw, 92px); }
/* Closing photo of the merged about + contact section. */
.business-closing-image {
  display: block;
  width: 100%;
  margin-top: clamp(34px, 4.4vw, 64px);
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  object-fit: cover;
  object-position: center 45%;
}
@media (max-width: 900px) {
  .business-hero { min-height: clamp(520px, 78vh, 680px); padding: 0 28px 44px; }
  .business-hero-bg { object-position: 58% 50%; }
  .business-section { padding: 62px 28px; }
    .business-hero + .business-section { padding-top: 22px; }
.business-section + .business-section { padding-top: 0; }
  .business-range :deep(.product-list-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .business-hero h1 { font-size: 52px; }
  .business-tagline { margin-top: 22px; }
  .business-heading h2 { font-size: 34px; }
  .business-story { font-size: 18px; }
  .business-range :deep(.product-list-grid) { grid-template-columns: minmax(0, 1fr); }
}
</style>
