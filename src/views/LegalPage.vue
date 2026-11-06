<script setup>
import { computed } from 'vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { contactEmailHref } from '../data/siteInfo';
import { getLegalDocument } from '../data/legalContent';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const doc = computed(() => getLegalDocument(props.slug));

useSeo({
  title: doc.value?.title ?? 'Information',
  description: doc.value?.description,
  path: doc.value?.path ?? '/',
});

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: doc.value?.title ?? 'Information', to: doc.value?.path ?? '/' },
]);
</script>

<template>
  <main class="site-shell legal-page">
    <SiteHeader />

    <header class="legal-hero">
      <SiteBreadcrumbs :items="breadcrumbs" />
      <p class="legal-eyebrow">Policies</p>
      <h1>{{ doc?.title }}</h1>
      <p class="legal-updated">Last updated: {{ doc?.lastUpdated }}</p>
      <p class="legal-intro">{{ doc?.intro }}</p>
    </header>

    <div class="legal-body">
      <section
        v-for="section in doc?.sections"
        :key="section.heading"
        class="legal-section"
        :aria-labelledby="`section-${section.heading.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`"
      >
        <h2 :id="`section-${section.heading.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`">
          {{ section.heading }}
        </h2>

        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>

        <ul v-if="section.bullets">
          <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </section>

      <aside class="legal-contact" aria-label="Contact about policies">
        <p>Something unclear, or a question about your own order?</p>
        <a class="legal-contact-link" :href="contactEmailHref">Email info@meowerair.com</a>
        <RouterLink class="legal-contact-link legal-contact-link--ghost" :to="{ name: 'support' }">
          Go to Support
        </RouterLink>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.legal-page { background: #fff; color: #202222; }
.legal-hero { padding: clamp(140px, 12vw, 200px) max(7vw, calc((100vw - 1080px) / 2)) clamp(20px, 3vw, 40px); }
.legal-eyebrow { margin: 24px 0 12px; color: #345258; font-size: 13px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
.legal-hero h1 { margin: 0; color: #314e53; font-size: clamp(44px, 5.6vw, 88px); font-weight: 600; letter-spacing: -.05em; line-height: .98; }
.legal-updated { margin: 22px 0 0; color: #75949a; font-size: 14px; font-weight: 600; }
.legal-intro { max-width: 780px; margin: 18px 0 0; color: #40595e; font-size: clamp(17px, 1.6vw, 22px); line-height: 1.55; }
.legal-body { padding: clamp(24px, 4vw, 56px) max(7vw, calc((100vw - 1080px) / 2)) clamp(70px, 9vw, 120px); }
.legal-section { max-width: 860px; padding-top: clamp(26px, 3vw, 42px); border-top: 1px solid #ebe0d4; }
.legal-section + .legal-section { margin-top: clamp(26px, 3vw, 42px); }
.legal-section h2 { margin: 0 0 14px; color: #314e53; font-size: clamp(22px, 2.2vw, 30px); font-weight: 600; letter-spacing: -.02em; }
.legal-section p { margin: 0 0 14px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.65; }
.legal-section p:last-child { margin-bottom: 0; }
.legal-section ul { display: grid; gap: 8px; margin: 0 0 14px; padding-left: 20px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.6; }
.legal-contact { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: clamp(36px, 4vw, 56px); padding: clamp(22px, 2.6vw, 32px); border: 1px dashed rgba(51, 76, 81, .24); border-radius: 12px; background: #f8fbfa; }
.legal-contact p { flex: 1 1 320px; margin: 0; color: #334c51; font-size: 16px; font-weight: 600; }
.legal-contact-link { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 22px; border-radius: 999px; background: #334c51; color: #fef5ed; font-size: 15px; font-weight: 600; text-decoration: none; }
.legal-contact-link:hover { background: #5a7c85; }
.legal-contact-link--ghost { border: 1px solid rgba(51, 76, 81, .28); background: transparent; color: #334c51; }
.legal-contact-link--ghost:hover { border-color: #334c51; background: #fff; }
@media (max-width: 900px) { .legal-hero { padding: 152px 28px 24px; } .legal-body { padding: 20px 28px 72px; } }
</style>
