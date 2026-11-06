<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import FeaturedProductCard from '../components/FeaturedProductCard.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { blogArticles } from '../data/blogArticles';
import { shopCategories } from '../data/catalog';
import { quoteHref } from '../data/siteInfo';
import { useSeo } from '../composables/useSeo';

useSeo({
  title: 'Pet Beds, Toys, Carriers & Pet-Friendly Air Purifiers',
  description:
    'Meower pet supplies — beds, strollers, carriers, scratching posts and toys for cats and dogs — plus the pet-friendly HEPA H13 air purifiers we started with.',
  path: '/',
});

const mw200Route = { name: 'product-detail', params: { productId: 'mw200' } };
const petBedRoute = { name: 'product-detail', params: { productId: 'christmas-pet-bed' } };
const petStrollerRoute = { name: 'product-detail', params: { productId: 'pet-stroller' } };

/** Trade enquiries from the homepage go to the shared business inbox. */
const businessEnquiryHref = quoteHref('', 'Distribution and wholesale enquiry');

/** Latest articles, newest first — same ordering as the blog index. */
const featuredBlogs = computed(() =>
  [...blogArticles]
    .sort((first, second) =>
      (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''),
    )
    .slice(0, 4),
);


const slides = [
  {
    image: '/images/carousel/hero-festive-bed.webp',
    alt: 'A cream Ragdoll cat lying in the red and cream plaid Christmas pet bed in a sunlit living room',
    // The newline is a phone-only break after the comma (see the mobile
    // `white-space: pre-line` rule); on wider screens it collapses to a space.
    slogan: 'A Little Gift,\nA Lot of Comfort',
    to: petBedRoute,
  },
  {
    image: '/images/products/pet-stroller/hero-sunset.jpg',
    alt: 'A corgi sitting in a cream pet stroller beside a lake at sunset',
    slogan: 'Easy Travel, Together',
    // A dark photo: the Shop Now button flips to light glass so it stays legible.
    theme: 'light',
    to: petStrollerRoute,
  },
  {
    // Same artwork as the "How to Choose an Air Purifier for You and Your Pet"
    // guide, so the last slide still leads into the guide's subject.
    image: '/images/products/mw200/hero-armchair.webp',
    alt: 'Meower air purifier beside a linen armchair and houseplants in a sunlit living room',
    slogan: 'Cleaner Air. Comfier Pets. Happier Homes.',
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
 * Featured products under the carousel. The pitch lines are homepage copy, so
 * they live here rather than in `products.js`; the artwork is the widest shot
 * available for a card this size.
 */
const featuredCards = [
  {
    id: 'christmas-pet-bed',
    image: '/images/products/christmas-pet-bed/small.webp',
    pitch: 'Short plush, raised bolsters and a fill that keeps its shape — warm all year.',
  },
  {
    id: 'pom-pom-cat-toy',
    image: '/images/products/cat-toy/lifestyle-hero.webp',
    // Square lifestyle shot: show it whole rather than cropping the toy.
    contain: true,
    pitch: 'One button fires the pom-pom, the other reels it back in — play without bending down.',
  },
  {
    id: 'car-pet-seat',
    name: 'Car Seat Pet Bed & Travel Carrier',
    image: '/images/products/car-pet-seat/car-dog.webp',
    pitch: 'Straps into the car, carries like a bag and unzips into a flat bed.',
  },
  {
    id: 'woven-sisal-cat-scratcher',
    image: '/images/products/woven-sisal-cat-scratcher/hero.jpg',
    imagePosition: 'center 38%',
    pitch: 'Woven sisal with a colour-matched border — a scratcher that saves the sofa without looking like one.',
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

/* Plays on its own and keeps playing while the pointer rests on the artwork;
   only keyboard focus and a drag slow it down. */
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

onMounted(() => {
  startAutoSlide();
});

onBeforeUnmount(() => {
  stopAutoSlide();
});
</script>

<template>
  <main class="site-shell home-page">
    <SiteHeader halo-hero />

    <section
      id="home"
      class="hero-carousel"
      :class="{ 'hero-carousel--light': slides[currentSlide]?.theme === 'light' }"
      aria-labelledby="hero-title"
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
          <div class="hero-card-copy">
            <h1 id="hero-title" class="hero-card-title">
              <span :key="currentSlide">{{ slides[currentSlide]?.slogan }}</span>
            </h1>

            <RouterLink class="hero-card-cta hero-card-cta--primary" :to="{ name: 'products' }">
              Shop Now
            </RouterLink>
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
        </div>
    </section>

    <section id="featured" class="section featured-section" aria-label="Featured products">
      <FeaturedProductCard
        v-for="(item, index) in featuredCards"
        :key="item.id"
        :product-id="item.id"
        :image="item.image"
        :image-position="item.imagePosition"
        :contain="item.contain"
        :name="item.name"
        :pitch="item.pitch"
        :reverse="index % 2 === 1"
      />
    </section>

    <section id="air-purifiers" class="section category-section" aria-labelledby="category-title">
      <div class="section-heading centered section-heading--compact">
        <p class="eyebrow">Shop by category</p>
        <h2 id="category-title">Our Product Lines</h2>
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

    <section
      id="business"
      class="section business-invite"
      aria-labelledby="business-invite-title"
    >
      <div class="business-invite-card">
        <img
          class="business-invite-media"
          src="/images/business/partner-hero.webp"
          alt="Meower MW1000 commercial air purifier standing in a gym"
          loading="lazy"
          decoding="async"
        />

        <div class="business-invite-copy">
          <p class="business-invite-eyebrow">For distributors &amp; commercial buyers</p>
          <h2 id="business-invite-title">Become a Meower Partner</h2>
          <p class="business-invite-lead">
            We are recruiting distributors, retailers and commercial buyers for our air purifiers
            and dehumidifiers — home, commercial and ceiling-mounted units, with OEM/ODM and project
            supply available.
          </p>
          <p class="business-invite-note">
            Tell us your market and we will come back with trade pricing and lead times.
          </p>

          <div class="business-invite-actions">
            <a class="business-invite-cta" :href="businessEnquiryHref">
              Enquire about distribution
            </a>
            <RouterLink class="business-invite-link" :to="{ name: 'business' }">
              Business &amp; wholesale
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section id="blogs" class="section blog-section" aria-labelledby="blog-title">
      <div class="section-heading centered section-heading--compact">
        <p class="eyebrow">Guides and inspiration</p>
        <h2 id="blog-title">Our Blogs</h2>
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
