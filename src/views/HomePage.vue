<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import SiteHeader from '../components/SiteHeader.vue';
import { blogArticles } from '../data/blogArticles';
import { shopCategories } from '../data/catalog';
import { getProduct } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';
import { useSeo } from '../composables/useSeo';

useSeo({
  title: 'Pet Supplies & Pet-Friendly Air Purifiers',
  description:
    'Meower pet supplies — strollers, carriers, beds, scratching posts and toys — plus pet-friendly HEPA H13 air purifiers and dehumidifiers for homes and businesses.',
  path: '/',
});

const mw200Route = { name: 'product-detail', params: { productId: 'mw200' } };
const md001Route = { name: 'product-detail', params: { productId: 'md001' } };


const slides = [
  {
    image: '/images/carousel/hero-air-purifier-pets.webp',
    alt: 'Meower air purifier in a sunlit living room while a Bengal cat and a schnauzer play with a toy',
    title: 'Meower Air Purifier',
    subtitle: 'Cleaner Air. Happier Pet Homes.',
    to: mw200Route,
  },
  {
    image: '/images/carousel/hero-dehumidifier-home.webp',
    alt: 'Meower home dehumidifier on a rug in a cream living room with a linen armchair and large windows',
    title: 'Meower Dehumidifier',
    subtitle: 'Cleaner Air. Happier Pet Homes.',
    to: md001Route,
  },
  {
    image: '/images/carousel/hero-dehumidifier-plants.webp',
    alt: 'Meower dehumidifier in a bright living room filled with plants beside floor-to-ceiling windows',
    title: 'Meower Dehumidifier',
    subtitle: 'Cleaner Air. Happier Pet Homes.',
  },
];

// Shop categories, in the order defined in `src/data/catalog.js`.
const categories = shopCategories.map((category) => ({
  title: category.label,
  image: category.image,
  icon: category.icon,
  to: { name: 'products', hash: `#${category.id}` },
}));

const featuredProducts = computed(() =>
  ['mw200', 'md001'].map((id) => getProduct(id)).filter(Boolean),
);

const featuredBlogs = computed(() =>
  [...blogArticles]
    .sort((first, second) =>
      (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''),
    )
    .slice(0, 4),
);

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
          <component
            :is="slide.to ? RouterLink : 'div'"
            v-for="(slide, index) in slides"
            :key="slide.image"
            class="carousel-slide"
            :class="{ 'carousel-slide--link': slide.to }"
            v-bind="slide.to ? { to: slide.to } : {}"
          >
            <div class="slide-media">
              <img
                :src="slide.image"
                :alt="slide.alt"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
              />
            </div>
            <div class="slide-caption">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.subtitle }}</p>
            </div>
          </component>
        </div>

        <div class="hero-card">
          <h1 id="hero-title">
            Pet Supplies &amp; Pet-Friendly Air Purifiers for Homes and Businesses
          </h1>
          <p class="hero-card-subline">
            Strollers, carriers, beds, scratching posts and toys for everyday pet homes — plus
            HEPA H13 air purification and humidity control for buyers worldwide.
          </p>
          <div class="hero-card-actions">
            <RouterLink class="hero-card-cta hero-card-cta--primary" :to="{ name: 'products' }">
              Shop Now
            </RouterLink>
            <a class="hero-card-cta hero-card-cta--ghost" :href="contactEmailHref">Get a Quote</a>
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
        <RouterLink class="more-button" :to="{ name: 'products' }">View all</RouterLink>
      </div>
    </section>

    <section id="air-purifiers" class="section category-section" aria-labelledby="category-title">
      <div class="section-heading centered">
        <p class="eyebrow">Shop by category</p>
        <h2 id="category-title">Shop Pet Supplies &amp; Air Care</h2>
      </div>

      <div class="category-grid">
        <RouterLink
          v-for="item in categories"
          :key="item.title"
          class="category-button"
          :class="{ 'category-button--icon': !item.image }"
          :to="item.to"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            loading="lazy"
            decoding="async"
          />
          <div v-if="!item.image" class="category-button-icon">
            <component :is="item.icon" aria-hidden="true" />
          </div>
          <span>{{ item.title }}</span>
        </RouterLink>
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

  </main>
</template>
