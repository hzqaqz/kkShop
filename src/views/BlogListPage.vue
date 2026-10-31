<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { blogArticles } from '../data/blogArticles';
import { useSeo } from '../composables/useSeo';

useSeo({
  title: 'Air Quality & Pet Care Guides',
  description:
    'Guides and inspiration from Meower on indoor air quality, pet-friendly air purification, humidity control, pollen season, and more.',
  path: '/blogs',
});

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Blogs', to: '/blogs' },
];

/** Editorial artwork for the index hero (the newest guide cover). */
const heroImage = '/images/carousel/hero-dehumidifier-plants.webp';

const sortedBlogArticles = computed(() =>
  [...blogArticles].sort((first, second) =>
    (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''),
  ),
);
</script>

<template>
  <main class="site-shell blog-page">
    <SiteHeader overlay-hero />

    <section class="blog-hero blog-hero--index" aria-labelledby="blog-list-title">
      <img
        class="blog-hero-bg"
        :src="heroImage"
        alt="A bright living room filled with plants beside floor-to-ceiling windows"
        loading="eager"
        decoding="async"
      />
      <span class="blog-hero-scrim" aria-hidden="true"></span>

      <div class="blog-hero-copy">
        <SiteBreadcrumbs :items="breadcrumbs" />
        <p class="blog-hero-eyebrow">Guides and inspiration</p>
        <h1 id="blog-list-title">Explore Our Blogs</h1>
        <p class="blog-hero-lead">
          Practical guides on indoor air quality, pet-friendly purification, humidity and the
          everyday choices that keep a home comfortable.
        </p>
      </div>
    </section>

    <section class="section blog-list-section" aria-label="Blog articles">
      <div class="blog-grid blog-list-grid">
        <RouterLink
          v-for="article in sortedBlogArticles"
          :key="article.slug"
          class="blog-card blog-card-link"
          :to="{ name: 'blog-detail', params: { slug: article.slug } }"
        >
          <img
            :src="article.coverImage"
            :alt="article.title"
            :class="{ 'blog-card-image--crop-right': article.cardCrop === 'right' }"
          />
          <div class="blog-card-copy">
            <h2>{{ article.title }}</h2>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
