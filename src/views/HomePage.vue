<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import SiteHeader from '../components/SiteHeader.vue';

const mw100Route = { name: 'product-detail', params: { productId: 'mw100' } };
const mw200Route = { name: 'product-detail', params: { productId: 'mw200' } };

const slides = [
  { image: '/images/carousel/轮播01.png', to: mw100Route },
  { image: '/images/carousel/轮播02.png', to: mw200Route },
  { image: '/images/carousel/轮播03.png', to: '#' },
  { image: '/images/carousel/轮播04.png', to: '#' },
];

const categories = [
  { title: 'MW100', image: '/images/products/mw100/04-hero-overview.png', to: mw100Route },
  { title: 'MW200', image: '/images/products/mw200/01-hero-overview.png', to: mw200Route },
  { title: 'Category 03', image: '/images/collection-gift.png', to: '#' },
  { title: 'Category 04', image: '/images/collection-limited.png', to: '#' },
  { title: 'Category 05', image: '/images/hero-lifestyle.png', to: '#' },
];

const blogs = [
  {
    title: 'How to place an air purifier in a bedroom',
    text: 'Simple placement tips for quieter nights and better airflow.',
    image: '/images/collection-daily.png',
  },
  {
    title: 'When your home needs a dehumidifier',
    text: 'Common signs of excess moisture and how to respond early.',
    image: '/images/collection-gift.png',
  },
  {
    title: 'Filter care for everyday performance',
    text: 'A practical rhythm for keeping fresh air routines consistent.',
    image: '/images/collection-limited.png',
  },
  {
    title: 'Creating a fresher family living room',
    text: 'Small changes that help shared spaces feel lighter and cleaner.',
    image: '/images/hero-lifestyle.png',
  },
];

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

function startAutoSlide() {
  stopAutoSlide();
  slideTimer = window.setInterval(nextSlide, 4000);
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
  }, 1100);
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

    <section id="home" class="hero-carousel" aria-label="Product lifestyle scenes">
      <div class="carousel-track" :style="{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }">
        <RouterLink
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :to="slide.to"
          :aria-label="slide.image"
        >
          <div class="slide-media">
            <img :src="slide.image" alt="" />
          </div>
        </RouterLink>
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
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          type="button"
          :aria-label="`Show slide ${index + 1}`"
          :aria-pressed="currentSlide === index"
          @click="handleManualSlide(index)"
        />
      </div>
    </section>

    <section id="air-purifiers" class="section category-section" aria-labelledby="category-title">
      <div class="section-heading">
        <p class="eyebrow">Shop by category</p>
        <h2 id="category-title">Find the right air care fit</h2>
      </div>

      <div class="category-grid">
        <RouterLink v-for="item in categories" :key="item.title" class="category-button" :to="item.to">
          <img :src="item.image" :alt="item.title" />
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
        <article v-for="item in blogs" :key="item.title" class="blog-card">
          <img :src="item.image" :alt="item.title" />
          <div class="blog-card-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </article>
      </div>

      <div class="more-row">
        <a class="more-button" href="#">More</a>
      </div>
    </section>

    <section id="dehumidifier" class="about-band" aria-label="Dehumidifier and About Us">
      <div>
        <p class="eyebrow">Air Purifiers & Dehumidifier</p>
        <h2>Designed for cleaner air and calmer indoor comfort.</h2>
      </div>
      <p id="about">
        kkShop brings together practical air purifiers, dehumidifier solutions, and everyday care
        guides for healthier-feeling home routines.
      </p>
    </section>
  </main>
</template>
