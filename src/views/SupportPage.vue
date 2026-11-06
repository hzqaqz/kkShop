<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { getBlogArticle } from '../data/blogArticles';
import { contacts } from '../data/siteInfo';
import { supportFaqs, supportTopics } from '../data/supportContent';

useSeo({
  title: 'Support',
  description:
    'Meower support: where to buy, international shipping, quotes and wholesale pricing, OEM/ODM, filter care, returns and warranty enquiries.',
  path: '/support',
});

/** Buying-guide teaser, moved here from the homepage. */
const GUIDE_SLUG = 'how-to-choose-an-air-purifier-for-pets';
const guide = getBlogArticle(GUIDE_SLUG);

const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: supportFaqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}));

useHead(() => ({
  script: [
    {
      key: 'support-faq-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqJsonLd.value),
    },
  ],
}));
</script>

<template>
  <main class="site-shell support-page">
    <SiteHeader />

    <!-- The intro block was removed by request. The h1 stays for search
         engines and screen readers so the page still has a named heading. -->
    <h1 class="sr-only">Support</h1>

    <section v-if="guide" id="buying-guide" class="support-guide" aria-labelledby="guide-title">
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

    <section id="faqs" class="support-section" aria-labelledby="support-faq-title">
      <div class="support-heading">
        <p class="support-eyebrow">Air purifier basics</p>
        <h2 id="support-faq-title">Frequently asked questions</h2>
      </div>

      <div class="support-faq-list">
        <details
          v-for="(item, index) in supportFaqs"
          :key="item.question"
          class="support-faq-item"
          :open="index === 0"
        >
          <summary class="support-faq-question">
            <h3>{{ item.question }}</h3>
          </summary>
          <p class="support-faq-answer">{{ item.answer }}</p>
          <RouterLink
            v-if="item.blogSlug"
            class="support-faq-link"
            :to="{ name: 'blog-detail', params: { slug: item.blogSlug } }"
          >
            Read the guide
          </RouterLink>
        </details>
      </div>
    </section>

    <section id="contact" class="support-section" aria-labelledby="support-contact-title">
      <div class="support-heading">
        <p class="support-eyebrow">Talk to us</p>
        <h2 id="support-contact-title">Contact</h2>
      </div>

      <ul class="support-contact-list">
        <li v-for="contact in contacts" :key="contact.label">
          <component :is="contact.icon" aria-hidden="true" />
          <span><strong>{{ contact.label }}:</strong> {{ contact.value }}</span>
        </li>
      </ul>
    </section>

    <section class="support-section" aria-labelledby="support-topics-title">
      <div class="support-heading">
        <p class="support-eyebrow">Next step</p>
        <h2 id="support-topics-title">Where to go from here</h2>
      </div>

      <div class="support-topic-grid">
        <RouterLink
          v-for="topic in supportTopics"
          :key="topic.title"
          class="support-topic-card"
          :to="topic.to"
        >
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.text }}</p>
          <span>{{ topic.linkLabel }}</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.support-page { --ink: #345258; --mint: #d9eee8; color: #171918; background: #fff; }
.support-eyebrow { margin: 0 0 12px; color: var(--ink); font-size: 14px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
.support-heading h2 { margin: 0; color: var(--ink); font-weight: 600; letter-spacing: -.05em; line-height: .98; }
.support-section { padding: clamp(56px, 7vw, 104px) max(7vw, calc((100vw - 1240px) / 2)); }
.support-section + .support-section { padding-top: 0; }
.support-heading { margin-bottom: clamp(28px, 3.4vw, 46px); }
.support-heading h2 { font-size: clamp(32px, 4.2vw, 60px); }
.support-contact-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 32px; margin: 0; padding: 0; list-style: none; }
.support-contact-list li { display: flex; gap: 16px; align-items: center; font-size: clamp(16px, 1.45vw, 22px); }
.support-contact-list svg { flex: 0 0 auto; width: 28px; height: 28px; color: var(--ink); stroke-width: 1.8; }
.support-contact-list strong { font-weight: 600; }
.support-faq-list { display: grid; gap: 12px; max-width: 980px; }
.support-faq-item { padding: 20px 24px; border: 1px solid rgba(52, 82, 88, .16); border-radius: 10px; background: #f8fbfa; }
.support-faq-item[open] { background: #fff; border-color: rgba(52, 82, 88, .28); }
.support-faq-question { cursor: pointer; }
.support-faq-question h3 { display: inline; margin: 0; color: var(--ink); font-size: clamp(17px, 1.5vw, 22px); font-weight: 600; line-height: 1.35; }
.support-faq-answer { margin: 14px 0 0; color: #3f5b60; font-size: clamp(15px, 1.35vw, 19px); line-height: 1.55; }
.support-faq-link { display: inline-block; margin-top: 12px; color: var(--ink); font-size: 14px; font-weight: 600; text-decoration: underline; text-underline-offset: 5px; }
.support-topic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.support-topic-card { display: grid; gap: 10px; padding: 28px; border: 1px solid rgba(52, 82, 88, .16); border-radius: 12px; background: #f8fbfa; color: var(--ink); text-decoration: none; transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease; }
.support-topic-card:hover, .support-topic-card:focus-visible { border-color: rgba(52, 82, 88, .34); background: #fff; box-shadow: 0 16px 30px rgba(52, 82, 88, .12); transform: translateY(-2px); }
.support-topic-card h3 { margin: 0; font-size: clamp(20px, 1.9vw, 27px); font-weight: 600; }
.support-topic-card p { margin: 0; color: #4f6b70; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.5; }
.support-topic-card span { color: var(--ink); font-size: 14px; font-weight: 600; }
/* Buying-guide teaser: the first block on the page, so it carries the top
   clearance for the fixed header as well as the side padding. */
.support-guide { padding: clamp(140px, 11vw, 176px) max(7vw, calc((100vw - 1240px) / 2)) 0; }
.support-guide .guide-card { margin-top: 0; }
.support-guide .guide-card .eyebrow { color: var(--ink); }
@media (max-width: 900px) {
  .support-section { padding: 56px 28px; }
.support-section + .support-section { padding-top: 0; }
  .support-guide { padding: 152px 28px 0; }
  .support-contact-list, .support-topic-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  .support-heading h2 { font-size: 30px; }
  .support-faq-item { padding: 17px 18px; }
  .support-topic-card { padding: 22px; }
}
</style>
