<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { RouterLink, useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import AirPurifierCalculator from '../components/guide/AirPurifierCalculator.vue';
import FilterGradeCompare from '../components/guide/FilterGradeCompare.vue';
import FilterStack from '../components/guide/FilterStack.vue';
import NoiseScale from '../components/guide/NoiseScale.vue';
import RelatedArticles from '../components/RelatedArticles.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { getBlogArticle } from '../data/blogArticles';
import { getArticleProducts, getRelatedArticles } from '../data/contentLinks';
import { excerptFromMarkdown, useSeo } from '../composables/useSeo';

const route = useRoute();
const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const article = computed(() => getBlogArticle(route.params.slug));
const heroImage = computed(
  () => article.value?.heroImage ?? article.value?.coverImage ?? null,
);

/**
 * The hero renders the title and the cover artwork, so the body starts after
 * them: the leading `# heading` and an inline image that repeats the hero are
 * stripped before rendering.
 */
const bodyMarkdown = computed(() => {
  const item = article.value;
  if (!item) {
    return '';
  }

  let md = item.contentMarkdown.replace(/^\s*#\s+.*(\r?\n)+/, '');

  const cover = heroImage.value;
  if (cover) {
    const escaped = cover.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    md = md.replace(new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)\\s*\\n?`), '');
  }

  return md;
});

const BLOCK_PATTERN = /\[\[block:(calculator|grade|noise|stack)\]\]/g;
const BLOCK_TOKEN = /(@@guide-block:(?:calculator|grade|noise|stack)@@)/;

const renderedContent = computed(() =>
  bodyMarkdown.value
    ? markdown.render(bodyMarkdown.value.replace(BLOCK_PATTERN, '@@guide-block:$1@@'))
    : '',
);

const segments = computed(() =>
  renderedContent.value
    .split(BLOCK_TOKEN)
    .filter(Boolean)
    .map((chunk) => {
      const block = chunk.match(/^@@guide-block:(calculator|grade|noise|stack)@@$/);
      return block ? { type: 'block', name: block[1] } : { type: 'html', html: chunk };
    }),
);

const relatedArticles = computed(() => getRelatedArticles(route.params.slug, 3));
const articleProducts = computed(() => getArticleProducts(route.params.slug, 2));

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Blogs', to: '/blogs' },
  { label: article.value?.title ?? 'Article', to: route.path },
]);

// Facebook, LinkedIn, X and WhatsApp do not render SVG link previews, so a
// vector cover must fall back to the raster branded card rather than leaving
// the shared link with no image at all.
const RASTER_IMAGE = /\.(jpe?g|png|webp|avif)$/i;

const currentMeta = computed(() => {
  const item = article.value;
  if (!item) {
    return {
      title: 'Blog Not Found',
      description: 'The requested Meower blog article could not be found.',
      path: route.path,
    };
  }
  const cover = item.coverImage;
  const ogImage = cover && RASTER_IMAGE.test(cover) ? `https://meowerair.com${cover}` : undefined;

  return {
    title: item.title,
    description: excerptFromMarkdown(item.contentMarkdown),
    path: route.path,
    image: ogImage,
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
    ? [
        {
          key: 'article-jsonld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(articleJsonLd.value),
        },
      ]
    : [],
}));
</script>

<template>
  <main class="site-shell blog-page">
    <SiteHeader overlay-hero />

    <section v-if="article" class="blog-hero" aria-labelledby="blog-detail-title">
      <img
        v-if="heroImage"
        class="blog-hero-bg"
        :src="heroImage"
        :alt="article.title"
        loading="eager"
        decoding="async"
      />
      <span class="blog-hero-scrim" aria-hidden="true"></span>

      <div class="blog-hero-copy">
        <SiteBreadcrumbs :items="breadcrumbs" />
        <p class="blog-hero-eyebrow">{{ article.guide ? 'Guide' : 'Guides and inspiration' }}</p>
        <h1 id="blog-detail-title">{{ article.title }}</h1>
        <p v-if="article.date" class="blog-hero-meta">
          <time :datetime="article.date">{{ article.date }}</time>
        </p>
      </div>
    </section>

    <article v-if="article" class="blog-detail" :aria-label="article.title">
      <div
        class="blog-detail-body"
        :class="{ 'blog-detail-body--natural': article.imageFit === 'natural' }"
      >
        <template v-for="(segment, index) in segments" :key="index">
          <div v-if="segment.type === 'html'" class="blog-detail-segment" v-html="segment.html" />
          <AirPurifierCalculator v-else-if="segment.name === 'calculator'" />
          <FilterGradeCompare v-else-if="segment.name === 'grade'" />
          <NoiseScale v-else-if="segment.name === 'noise'" />
          <FilterStack v-else-if="segment.name === 'stack'" />
        </template>
      </div>
    </article>

    <section v-else class="blog-empty" aria-label="Blog article not found">
      <h1>Blog article not found</h1>
      <RouterLink class="more-button" :to="{ name: 'blogs' }">Back to blogs</RouterLink>
    </section>

    <div v-if="article" class="blog-related-content">
      <RelatedProducts
        :products="articleProducts"
        eyebrow="Recommended"
        title="Products mentioned in this guide"
      />

      <RelatedArticles :articles="relatedArticles" />
    </div>
  </main>
</template>
