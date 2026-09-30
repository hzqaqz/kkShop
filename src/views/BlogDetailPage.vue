<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { RouterLink, useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { getBlogArticle } from '../data/blogArticles';
import { excerptFromMarkdown, useSeo } from '../composables/useSeo';

const route = useRoute();
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const article = computed(() => getBlogArticle(route.params.slug));
const renderedContent = computed(() => (article.value ? markdown.render(article.value.contentMarkdown) : ''));

const currentMeta = computed(() => {
  const item = article.value;
  if (!item) {
    return {
      title: 'Blog Not Found',
      description: 'The requested Meower blog article could not be found.',
      path: route.path,
    };
  }
  return {
    title: item.title,
    description: excerptFromMarkdown(item.contentMarkdown),
    path: route.path,
    image: item.coverImage ? `https://meowerair.com${item.coverImage}` : undefined,
    type: 'article',
  };
});

useSeo(currentMeta.value);

const articleJsonLd = computed(() => {
  const item = article.value;
  if (!item) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: item.title,
    description: excerptFromMarkdown(item.contentMarkdown),
    image: item.coverImage ? `https://meowerair.com${item.coverImage}` : undefined,
    datePublished: item.date,
    dateModified: item.date,
    author: { '@type': 'Organization', name: 'Meower', url: 'https://meowerair.com/' },
    publisher: { '@type': 'Organization', name: 'Meower', url: 'https://meowerair.com/' },
    mainEntityOfPage: `https://meowerair.com${route.path}`,
  };
});

useHead(() => ({
  script: articleJsonLd.value
    ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd.value) }]
    : [],
}));
</script>

<template>
  <main class="site-shell blog-page">
    <SiteHeader />

    <article v-if="article" class="blog-detail" :aria-label="article.title">
      <RouterLink class="blog-back-link" :to="{ name: 'blogs' }">Back to blogs</RouterLink>

      <time v-if="article.date" class="blog-detail-date" :datetime="article.date">{{ article.date }}</time>
      <div
        class="blog-detail-body"
        :class="{ 'blog-detail-body--natural': article.imageFit === 'natural' }"
        v-html="renderedContent"
      />
    </article>

    <section v-else class="blog-empty" aria-label="Blog article not found">
      <h1>Blog article not found</h1>
      <RouterLink class="more-button" :to="{ name: 'blogs' }">Back to blogs</RouterLink>
    </section>
  </main>
</template>
