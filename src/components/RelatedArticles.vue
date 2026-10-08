<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  articles: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Related reading',
  },
  eyebrow: {
    type: String,
    default: 'Keep exploring',
  },
});
</script>

<template>
  <section v-if="articles.length" class="related-section" aria-labelledby="related-articles-title">
    <div class="section-heading centered">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2 id="related-articles-title">{{ title }}</h2>
    </div>

    <div class="blog-grid related-blog-grid">
      <RouterLink
        v-for="article in articles"
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
          <h3>{{ article.title }}</h3>
        </div>
      </RouterLink>
    </div>

    <div class="more-row">
      <RouterLink class="more-button" :to="{ name: 'blogs' }">All articles</RouterLink>
    </div>
  </section>
</template>
