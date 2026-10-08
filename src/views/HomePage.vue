<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronLeft, ChevronRight, House, Mail, MessageCircle, PhoneCall } from 'lucide-vue-next';
import SiteHeader from '../components/SiteHeader.vue';
import PromoAdModal from '../components/PromoAdModal.vue';
import { blogArticles } from '../data/blogArticles';
import { getProduct } from '../data/products';
import { useSeo } from '../composables/useSeo';

useSeo({
  title: 'Pet-Friendly Air Purifiers & Dehumidifiers',
  description:
    'Meower air purifiers and dehumidifiers for pet-friendly homes and businesses. HEPA H13 air purification and humidity control for distributors, retailers, and OEM/ODM buyers worldwide.',
  path: '/',
});

const mw100Route = { name: 'product-detail', params: { productId: 'mw100' } };
const mw200Route = { name: 'product-detail', params: { productId: 'mw200' } };

const contactEmail =
  'mailto:info@meowerair.com?subject=Product%20enquiry%20from%20meowerair.com';

const slides = [
  {
    image: '/images/carousel/meower-air-purifier.jpg',
    alt: 'Meower air purifier running in a sunlit living room with a cat and a dog playing nearby',
  },
  {
    image: '/images/carousel/meower-100-carousel.jpg',
    alt: 'Meower 100 air purifier beside a bed with a Bengal cat resting on the rug',
  },
  {
    image: '/images/carousel/轮播03.jpg',
    alt: 'Meower dehumidifier in a bright living room with a cream armchair and rug',
  },
  {
    image: '/images/carousel/轮播02.jpg',
    alt: 'Meower dehumidifier in a light living room with plants and large windows',
  },
];

const categories = [
  {
    title: 'Home Use Air Purifier',
    image: '/images/categories/home-use-air-purifier.jpg',
    to: { name: 'products', hash: '#home-air-purifiers' },
  },
  {
    title: 'Home Use Dehumidifier',
    image: '/images/categories/home-use-dehumidifier.jpg',
    to: { name: 'products', hash: '#home-dehumidifiers' },
  },
  {
    title: 'Commercial Dehumidifier',
    image: '/images/categories/commercial-dehumidifier.jpg',
    to: { name: 'products', hash: '#commercial-dehumidifiers' },
  },
];

const featuredProducts = computed(() =>
  ['mw100', 'mw200', 'md001'].map((id) => getProduct(id)).filter(Boolean),
);

const featuredBlogs = computed(() =>
  [...blogArticles]
    .sort((first, second) =>
      (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''),
    )
    .slice(0, 4),
);

const brandPoints = [
  {
    title: 'H13 HEPA filtration',
    text: 'Pet-friendly air purifiers that capture dander, dust and pollen.',
  },
  {
    title: '200–400 m³/h CADR',
    text: 'Across the MW100 and MW200, sized for rooms of roughly 20–40 m².',
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

/** Slower than before: 4s was too fast to read, and it hurt perceived stability. */
const SLIDE_INTERVAL_MS = 7000;

const currentSlide = ref(0);
let slideTimer;
let restartTimer;

function goToSlide(index) {
  currentSlide.value = (index + slides.length) % slides.length;
}

function nextSlide() {
  goToSlide(currentSlide.value + 1);
}

function previousSlide() {
  goToSlide(currentSlide.value - 1);
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function startAutoSlide() {
  stopAutoSlide();
  if (prefersReducedMotion()) {
    return;
  }
  slideTimer = window.setInterval(nextSlide, SLIDE_INTERVAL_MS);
}

function stopAutoSlide() {
  if (slideTimer) {
    window.clearInterval(slideTimer);
    slideTimer = undefined;
  }

  if (restartTimer) {
    window.clearTimeout(restartTimer);
    restartTimer = undefined;
  }
}

function restartAutoSlideAfterManual() {
  restartTimer = window.setTimeout(() => {
    restartTimer = undefined;
    startAutoSlide();
  }, 1600);
}

function handleManualSlide(index) {
  stopAutoSlide();
  goToSlide(index);
  restartAutoSlideAfterManual();
}

function handleNextSlide() {
  stopAutoSlide();
  nextSlide();
  restartAutoSlideAfterManual();
}

function handlePreviousSlide() {
  stopAutoSlide();
  previousSlide();
  restartAutoSlideAfterManual();
}

onMounted(() => {
  startAutoSlide();
});

onBeforeUnmount(() => {
  stopAutoSlide();
});
</script>

<template>
  <main class="site-shell">
    <SiteHeader />

    <section
      id="home"
      class="hero-carousel"
      aria-labelledby="hero-title"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
      @focusin="stopAutoSlide"
      @focusout="startAutoSlide"
    >
      <div class="carousel-track" :style="{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }">
        <div v-for="(slide, index) in slides" :key="slide.image" class="carousel-slide">
          <div class="slide-media">
            <img
              :src="slide.image"
              :alt="slide.alt"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div class="hero-overlay">
        <h1 id="hero-title">
          Pet-Friendly Air Purifiers &amp; Dehumidifiers for Homes and Businesses
        </h1>
        <p class="hero-subline">
          HEPA H13 air purification and humidity control for distributors, retailers and
          OEM/ODM buyers worldwide.
        </p>
        <div class="hero-actions">
          <RouterLink class="hero-cta hero-cta--primary" :to="{ name: 'products' }">
            Explore Products
          </RouterLink>
          <a class="hero-cta hero-cta--ghost" :href="contactEmail">Get a Quote</a>
        </div>
      </div>

      <div class="carousel-controls" aria-label="Carousel controls">
        <button class="control-button" type="button" aria-label="Previous slide" @click="handlePreviousSlide">
          <ChevronLeft :size="22" aria-hidden="true" />
        </button>
        <button class="control-button" type="button" aria-label="Next slide" @click="handleNextSlide">
          <ChevronRight :size="22" aria-hidden="true" />
        </button>
      </div>

      <div class="carousel-dots" aria-label="Choose slide">
        <button
          v-for="(slide, index) in slides"
          :key="`dot-${index}`"
          class="dot"
          :class="{ active: currentSlide === index }"
          type="button"
          :aria-label="`Show slide ${index + 1}`"
          :aria-pressed="currentSlide === index"
          @click="handleManualSlide(index)"
        />
      </div>
    </section>

    <section id="featured" class="section featured-section" aria-labelledby="featured-title">
      <div class="section-heading centered">
        <p class="eyebrow">Best sellers</p>
        <h2 id="featured-title">Air Care That Fits Your Space</h2>
      </div>

      <div class="product-list-grid featured-grid">
        <RouterLink
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-list-card"
          :to="{ name: 'product-detail', params: { productId: product.id } }"
        >
          <img :src="product.image" :alt="product.title" loading="lazy" decoding="async" />
          <h3>{{ product.cardLabel }}</h3>
          <p class="featured-subtitle">{{ product.cardSubtitle }}</p>
          <span>{{ product.category }}</span>
        </RouterLink>
      </div>

      <div class="more-row">
        <RouterLink class="more-button" :to="{ name: 'products' }">View all products</RouterLink>
      </div>
    </section>

    <section id="air-purifiers" class="section category-section" aria-labelledby="category-title">
      <div class="section-heading centered">
        <p class="eyebrow">Shop by category</p>
        <h2 id="category-title">Find The Right Air Care Fit</h2>
      </div>

      <div class="category-grid">
        <RouterLink v-for="item in categories" :key="item.title" class="category-button" :to="item.to">
          <img :src="item.image" :alt="item.title" loading="lazy" decoding="async" />
          <span>{{ item.title }}</span>
        </RouterLink>
      </div>
    </section>

    <section id="why-meower" class="section brand-section" aria-labelledby="brand-title">
      <div class="brand-heading">
        <p class="eyebrow">Why Meower</p>
        <h2 id="brand-title">Air Care Built Around Pets, Made for Business</h2>
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

    <section id="blogs" class="section blog-section" aria-labelledby="blog-title">
      <div class="section-heading centered">
        <p class="eyebrow">Guides and inspiration</p>
        <h2 id="blog-title">Explore Our Blogs</h2>
      </div>

      <div class="blog-grid">
        <RouterLink
          v-for="item in featuredBlogs"
          :key="item.slug"
          class="blog-card blog-card-link"
          :to="{ name: 'blog-detail', params: { slug: item.slug } }"
        >
          <img
            :src="item.coverImage"
            :alt="item.title"
            :class="{ 'blog-card-image--crop-right': item.cardCrop === 'right' }"
            loading="lazy"
            decoding="async"
          />
          <div class="blog-card-copy">
            <h3>{{ item.title }}</h3>
          </div>
        </RouterLink>
      </div>

      <div class="more-row">
        <RouterLink class="more-button" :to="{ name: 'blogs' }">More</RouterLink>
      </div>
    </section>

    <section id="dehumidifier" class="section partner-section" aria-labelledby="contact-title">
      <span id="about" class="contact-anchor" aria-hidden="true"></span>
      <div class="section-heading centered">
        <p class="eyebrow">Partner with Meower</p>
        <h2 id="contact-title">Contact Us</h2>
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
            <li>Wholesale and bulk orders</li>
            <li>OEM and ODM services</li>
            <li>Residential and commercial product solutions</li>
            <li>Long-term distribution partnerships</li>
            <li>Project-based product support</li>
          </ul>
        </div>

        <div class="contact-panel">
          <h3>Contact us to start your business inquiry today.</h3>
          <ul class="contact-list" aria-label="Contact information">
            <li>
              <Mail :size="34" stroke-width="1.8" aria-hidden="true" />
              <span>Email: info@meowerair.com</span>
            </li>
            <li>
              <PhoneCall :size="34" stroke-width="2" aria-hidden="true" />
              <span>Mobile: +86 1337 049 7731</span>
            </li>
            <li>
              <MessageCircle :size="34" stroke-width="2" aria-hidden="true" />
              <span>Whatsapp: 18902169202</span>
            </li>
            <li>
              <House :size="34" stroke-width="2" aria-hidden="true" />
              <span>Address: Beijing, China</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <PromoAdModal />
  </main>
</template>
