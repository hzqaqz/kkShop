<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import { getProductFaqs } from '../data/productFaqs';

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const faqs = computed(() => getProductFaqs(props.productId));

const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.value.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}));

useHead(() => ({
  script: faqs.value.length
    ? [
        {
          key: 'faq-jsonld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(faqJsonLd.value),
        },
      ]
    : [],
}));
</script>

<template>
  <section v-if="faqs.length" class="product-faq" aria-labelledby="product-faq-title">
    <div class="section-heading centered">
      <p class="eyebrow">Good to know</p>
      <h2 id="product-faq-title">Frequently asked questions</h2>
    </div>

    <div class="faq-list">
      <details
        v-for="(item, index) in faqs"
        :key="item.question"
        class="faq-item"
        :open="index === 0"
      >
        <summary class="faq-question">
          <h3>{{ item.question }}</h3>
        </summary>
        <p class="faq-answer">{{ item.answer }}</p>
      </details>
    </div>
  </section>
</template>
