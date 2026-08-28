<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
import { blogArticles } from '../data/blogArticles';

const sortedBlogArticles = computed(() =>
  [...blogArticles].sort((first, second) =>
    (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''),
  ),
);
</script>

<template>
  <main class="site-shell blog-page">
    <SiteHeader />

    <section class="blog-list-hero" aria-labelledby="blog-list-title">
      <p class="eyebrow">Guides and inspiration</p>
      <h1 id="blog-list-title">Explore Our Blogs</h1>
    </section>

    <section class="section blog-list-section" aria-label="Blog articles">
      <div class="blog-grid blog-list-grid">
        <RouterLink
          v-for="article in sortedBlogArticles"
          :key="article.slug"
          class="blog-card blog-card-link"
          :to="{ name: 'blog-detail', params: { slug: article.slug } }"
        >
          <img :src="article.coverImage" :alt="article.title" />
          <div class="blog-card-copy">
            <h2>{{ article.title }}</h2>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
