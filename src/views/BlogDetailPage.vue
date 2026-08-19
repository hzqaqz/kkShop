<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { RouterLink, useRoute } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
import { getBlogArticle } from '../data/blogArticles';

const route = useRoute();
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const article = computed(() => getBlogArticle(route.params.slug));
const renderedContent = computed(() => (article.value ? markdown.render(article.value.contentMarkdown) : ''));
</script>

<template>
  <main class="site-shell blog-page">
    <SiteHeader />

    <article v-if="article" class="blog-detail" :aria-label="article.title">
      <RouterLink class="blog-back-link" :to="{ name: 'blogs' }">Back to blogs</RouterLink>

      <time class="blog-detail-date" :datetime="article.date">{{ article.date }}</time>
      <div class="blog-detail-body" v-html="renderedContent" />
    </article>

    <section v-else class="blog-empty" aria-label="Blog article not found">
      <h1>Blog article not found</h1>
      <RouterLink class="more-button" :to="{ name: 'blogs' }">Back to blogs</RouterLink>
    </section>
  </main>
</template>
