<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { contacts, contactEmailHref } from '../data/siteInfo';
import { supportFaqs, supportTopics } from '../data/supportContent';

useSeo({
  title: 'Support',
  description:
    'Meower support: where to buy, international shipping, quotes and wholesale pricing, OEM/ODM, filter care, returns and warranty enquiries.',
  path: '/support',
});

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Support', to: '/support' },
];

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

    <section class="support-hero" aria-labelledby="support-title">
      <SiteBreadcrumbs :items="breadcrumbs" />
      <p class="support-eyebrow">Support</p>
      <h1 id="support-title">How can we help?</h1>
      <p class="support-lead">
        Questions about a unit you already own, an order on its way, or a project you are
        specifying? Start here, or email us and a person will answer.
      </p>
      <div class="support-hero-actions">
        <a class="support-cta support-cta--primary" :href="contactEmailHref">Email us</a>
        <RouterLink class="support-cta support-cta--ghost" :to="{ name: 'products' }">
          Browse products
        </RouterLink>
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
.support-hero { padding: clamp(140px, 12vw, 200px) max(7vw, calc((100vw - 1240px) / 2)) clamp(48px, 6vw, 78px); }
.support-eyebrow { margin: 0 0 12px; color: var(--ink); font-size: 14px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.support-hero h1, .support-heading h2 { margin: 0; color: var(--ink); font-size: clamp(48px, 6vw, 96px); font-weight: 850; letter-spacing: -.05em; line-height: .98; }
.support-lead { max-width: 780px; margin: 28px 0 0; color: #3f5b60; font-size: clamp(18px, 1.7vw, 25px); line-height: 1.45; }
.support-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.support-cta { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; padding: 0 24px; border-radius: 999px; font-size: 15px; font-weight: 800; text-decoration: none; }
.support-cta--primary { background: var(--ink); color: #fff; }
.support-cta--primary:hover { background: #24444a; }
.support-cta--ghost { border: 1px solid rgba(52, 82, 88, .28); color: var(--ink); }
.support-cta--ghost:hover { border-color: var(--ink); }
.support-section { padding: clamp(56px, 7vw, 104px) max(7vw, calc((100vw - 1240px) / 2)); }
.support-hero + .support-section { padding-top: clamp(24px, 3vw, 44px); }
.support-section + .support-section { padding-top: 0; }
.support-heading { margin-bottom: clamp(28px, 3.4vw, 46px); }
.support-heading h2 { font-size: clamp(32px, 4.2vw, 60px); }
.support-contact-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 32px; margin: 0; padding: 0; list-style: none; }
.support-contact-list li { display: flex; gap: 16px; align-items: center; font-size: clamp(16px, 1.45vw, 22px); }
.support-contact-list svg { flex: 0 0 auto; width: 28px; height: 28px; color: var(--ink); stroke-width: 1.8; }
.support-contact-list strong { font-weight: 750; }
.support-faq-list { display: grid; gap: 12px; max-width: 980px; }
.support-faq-item { padding: 20px 24px; border: 1px solid rgba(52, 82, 88, .16); border-radius: 10px; background: #f8fbfa; }
.support-faq-item[open] { background: #fff; border-color: rgba(52, 82, 88, .28); }
.support-faq-question { cursor: pointer; }
.support-faq-question h3 { display: inline; margin: 0; color: var(--ink); font-size: clamp(17px, 1.5vw, 22px); font-weight: 780; line-height: 1.35; }
.support-faq-answer { margin: 14px 0 0; color: #3f5b60; font-size: clamp(15px, 1.35vw, 19px); line-height: 1.55; }
.support-faq-link { display: inline-block; margin-top: 12px; color: var(--ink); font-size: 14px; font-weight: 800; text-decoration: underline; text-underline-offset: 5px; }
.support-topic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.support-topic-card { display: grid; gap: 10px; padding: 28px; border: 1px solid rgba(52, 82, 88, .16); border-radius: 12px; background: #f8fbfa; color: var(--ink); text-decoration: none; transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease; }
.support-topic-card:hover, .support-topic-card:focus-visible { border-color: rgba(52, 82, 88, .34); background: #fff; box-shadow: 0 16px 30px rgba(52, 82, 88, .12); transform: translateY(-2px); }
.support-topic-card h3 { margin: 0; font-size: clamp(20px, 1.9vw, 27px); font-weight: 820; }
.support-topic-card p { margin: 0; color: #4f6b70; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.5; }
.support-topic-card span { color: var(--ink); font-size: 14px; font-weight: 800; }
@media (max-width: 900px) {
  .support-hero { padding: 152px 28px 48px; }
  .support-section { padding: 56px 28px; }
    .support-hero + .support-section { padding-top: 26px; }
.support-section + .support-section { padding-top: 0; }
  .support-contact-list, .support-topic-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  .support-hero h1 { font-size: 44px; }
  .support-heading h2 { font-size: 30px; }
  .support-faq-item { padding: 17px 18px; }
  .support-topic-card { padding: 22px; }
}
</style>
