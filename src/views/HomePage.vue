<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ProductFromPrice from '../components/ProductFromPrice.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { blogArticles, getBlogArticle } from '../data/blogArticles';
import { shopCategories } from '../data/catalog';
import { getProduct, productOrder } from '../data/products';
import { contactEmailHref } from '../data/siteInfo';
import { useSeo } from '../composables/useSeo';

useSeo({
  title: 'Pet Beds, Toys, Carriers & Pet-Friendly Air Purifiers',
  description:
    'Meower pet supplies — beds, strollers, carriers, scratching posts and toys for cats and dogs — plus the pet-friendly HEPA H13 air purifiers we started with.',
  path: '/',
});

const mw200Route = { name: 'product-detail', params: { productId: 'mw200' } };
const petBedRoute = { name: 'product-detail', params: { productId: 'christmas-pet-bed' } };


const slides = [
  {
    image: '/images/carousel/hero-festive-bed.webp',
    alt: 'A cream Ragdoll cat lying in the red and cream plaid Christmas pet bed in a sunlit living room',
    to: petBedRoute,
  },
  {
    image: '/images/carousel/hero-pet-stroller.webp',
    alt: 'A corgi sitting in a sage green pet stroller beside a lake at sunset',
    // Dark photo: white copy reads here where ink would disappear.
    theme: 'light',
  },
  {
    // Same artwork as the "How to Choose an Air Purifier for You and Your Pet"
    // guide, so the last slide still leads into the guide's subject.
    image: '/images/products/mw200/hero-armchair.webp',
    alt: 'Meower air purifier beside a linen armchair and houseplants in a sunlit living room',
    to: mw200Route,
  },
];

// Shop categories, in the order defined in `src/data/catalog.js`.
const categories = shopCategories.map((category) => ({
  title: category.label,
  image: category.image,
  icon: category.icon,
  to: { name: 'products', hash: `#${category.id}` },
}));

/**
 * Best sellers are the products listed in the Shop (`shopCategoryId`), so the
 * business range never appears here. Pet products join automatically once they
 * are added to `products.js`.
 */
const featuredProducts = computed(() =>
  productOrder
    .map((id) => getProduct(id))
    .filter((product) => product?.shopCategoryId)
    .slice(0, 4),
);

/** Buying guide teased under the best sellers. */
const GUIDE_SLUG = 'how-to-choose-an-air-purifier-for-pets';
const guide = getBlogArticle(GUIDE_SLUG);

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

/* Swipe left/right on the artwork (touch and mouse drag). A drag must not
   also follow the slide link, so the gesture is tracked and the click that
   follows it is swallowed in `handleSwipeClick`. */
const SWIPE_THRESHOLD_PX = 40;
let swipeStartX = null;
let swipeStartY = null;
let swiped = false;

function handlePointerDown(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swiped = false;
  stopAutoSlide();
}

function handlePointerUp(event) {
  if (swipeStartX === null) {
    return;
  }

  const dx = event.clientX - swipeStartX;
  const dy = event.clientY - swipeStartY;
  swipeStartX = null;
  swipeStartY = null;

  if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
    swiped = true;
    clearSwipeFlagSoon();
    if (dx < 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }

  restartAutoSlideAfterManual();
}

function handlePointerCancel() {
  swipeStartX = null;
  swipeStartY = null;
}

function handleSwipeClick(event) {
  if (!swiped) {
    return;
  }

  swiped = false;
  event.preventDefault();
  event.stopPropagation();
}

/* Some browsers (and synthetic events) never send the follow-up click, so the
   flag is also cleared on a timer. */
function clearSwipeFlagSoon() {
  window.setTimeout(() => {
    swiped = false;
  }, 350);
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
    <SiteHeader halo-hero />

    <section
      id="home"
      class="hero-carousel"
      :class="{ 'hero-carousel--light': slides[currentSlide]?.theme === 'light' }"
      aria-labelledby="hero-title"
      @mouseenter="stopAutoSlide"
      @mouseleave="startAutoSlide"
      @focusin="stopAutoSlide"
      @focusout="startAutoSlide"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
      @click.capture="handleSwipeClick"
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
          </component>
        </div>

        <div class="hero-content">
          <div class="hero-copy">
            <h1 id="hero-title">Good Days for Pets and Their People</h1>
            <p class="hero-card-subline">
              Beds, toys, carriers and scratchers — plus the pet-friendly purifiers we started
              with.
            </p>
            <div class="hero-card-actions">
              <RouterLink class="hero-card-cta hero-card-cta--primary" :to="{ name: 'products' }">
                Shop Now
              </RouterLink>
              <a class="hero-card-cta hero-card-cta--ghost" :href="contactEmailHref">Get a Quote</a>
            </div>
          </div>

          <div class="hero-controls">
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

            <div class="carousel-controls" aria-label="Carousel controls">
              <button class="control-button" type="button" aria-label="Previous slide" @click="handlePreviousSlide">
                <ChevronLeft :size="22" aria-hidden="true" />
              </button>
              <button class="control-button" type="button" aria-label="Next slide" @click="handleNextSlide">
                <ChevronRight :size="22" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
    </section>

    <section id="featured" class="section featured-section" aria-labelledby="featured-title">
      <div class="section-heading centered">
        <p class="eyebrow">Best sellers</p>
        <h2 id="featured-title">Favourites for Pets and Their Homes</h2>
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
          <ProductFromPrice :handle="product.shopifyHandle" />
          <p class="featured-subtitle">{{ product.cardSubtitle }}</p>
          <span>{{ product.category }}</span>
        </RouterLink>
      </div>

      <div class="more-row">
        <RouterLink class="more-button" :to="{ name: 'products' }">View all</RouterLink>
      </div>
    </section>

    <section
      v-if="guide"
      id="air-purifier-guide"
      class="section guide-section"
      aria-labelledby="guide-title"
    >
      <div class="guide-card">
        <img
          class="guide-card-media"
          :src="guide.coverImage"
          :alt="guide.title"
          loading="lazy"
          decoding="async"
        />

        <div class="guide-card-copy">
          <p class="eyebrow">Buying guide</p>
          <h2 id="guide-title">{{ guide.title }}</h2>
          <p>
            CADR, filter grade and noise level — the three figures that decide whether a purifier
            really suits a home with a cat or a dog.
          </p>
          <RouterLink
            class="guide-card-cta"
            :to="{ name: 'blog-detail', params: { slug: GUIDE_SLUG } }"
          >
            Read the guide
          </RouterLink>
        </div>
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
