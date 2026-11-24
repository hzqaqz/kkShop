<script setup>
import { computed } from 'vue';
import CompanyDetails from '../components/CompanyDetails.vue';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { contactEmailHref } from '../data/siteInfo';
import { getLegalDocument, analyticsNotice } from '../data/legalContent';
import { getShopifyPolicy } from '../data/policies';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const doc = computed(() => getLegalDocument(props.slug));

/**
 * 正文优先用 Shopify 后台的政策（`npm run sync:policies` 同步过来）。
 * 这样改后台 → 跑同步 → 部署就生效，不用在两处维护同一份条款。
 * 后台没填时退回 `legalContent.js` 的手写版本。
 */
const policy = computed(() => getShopifyPolicy(props.slug));

/**
 * The shipping origin, delivery window, return window and payment method, in a
 * box above the prose.
 *
 * Why a separate box instead of trusting the prose: when a Shopify policy has
 * been synced, `v-html` renders the Shopify text and the hand-written fallback
 * in `legalContent.js` is skipped — and the Shopify template does not mention
 * "9–16 days to the United States" or where the parcels ship from. A Merchant
 * Center reviewer (and the automated check) needs those numbers on this page.
 */
const FULFILMENT_SLUGS = ['shipping', 'refunds'];
const showFulfilment = computed(() => FULFILMENT_SLUGS.includes(props.slug));

/**
 * Analytics and advertising disclosure on /privacy.
 *
 * Same reason as the fulfilment box above: the synced Shopify privacy template
 * never names the services this shop actually uses (Plausible, GA4, Google Ads),
 * so the disclosure is rendered here instead of inside the `v-html` body, where
 * the next policy sync would replace it.
 */
const showAnalyticsNotice = computed(() => props.slug === 'privacy');

const pageTitle = computed(() => doc.value?.title ?? policy.value?.title ?? 'Information');
const lastUpdated = computed(() => policy.value?.lastUpdated || doc.value?.lastUpdated || '');

useSeo({
  title: pageTitle.value,
  description: doc.value?.description,
  path: doc.value?.path ?? '/',
});

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: pageTitle.value, to: doc.value?.path ?? '/' },
]);
</script>

<template>
  <main class="site-shell legal-page">
    <SiteHeader />

    <header class="legal-hero">
      <SiteBreadcrumbs :items="breadcrumbs" />
      <p class="legal-eyebrow">Policies</p>
      <h1>{{ pageTitle }}</h1>
      <p v-if="lastUpdated" class="legal-updated">Last updated: {{ lastUpdated }}</p>
      <p class="legal-intro">{{ doc?.intro }}</p>
    </header>

    <div class="legal-body">
      <div v-if="showFulfilment" class="legal-fulfilment">
        <CompanyDetails variant="compact" heading="Fulfilment at a glance" />
      </div>

      <div v-if="policy" class="legal-prose" v-html="policy.bodyHtml"></div>

      <template v-else>
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
      </template>

      <section
        v-if="showAnalyticsNotice"
        class="legal-notice"
        aria-labelledby="analytics-and-advertising"
      >
        <h2 id="analytics-and-advertising">{{ analyticsNotice.heading }}</h2>
        <p v-for="paragraph in analyticsNotice.paragraphs" :key="paragraph">{{ paragraph }}</p>
        <ul>
          <li v-for="link in analyticsNotice.links" :key="link.href">
            <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
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
/* The fulfilment summary sits between the hero and the legal prose, so it needs
   the same measure and a clear gap below it — and no gap above, because the
   `.legal-body` padding already provides it. */
.legal-fulfilment { max-width: 860px; margin-bottom: clamp(26px, 3vw, 40px); }
.legal-fulfilment :deep(.company-details) { margin-top: 0; }
/* The analytics / advertising disclosure sits after the policy body and is
   rendered outside `v-html`, so it needs its own typography to match
   `.legal-prose` — scoped styles would not reach into the injected HTML, and
   :deep() rules would not apply to this element's own children. */
.legal-notice { max-width: 860px; margin-top: clamp(30px, 3.4vw, 46px); padding-top: clamp(26px, 3vw, 42px); border-top: 1px solid #ebe0d4; }
.legal-notice h2 { margin: 0 0 14px; color: #314e53; font-size: clamp(22px, 2.2vw, 30px); font-weight: 600; letter-spacing: -.02em; line-height: 1.2; }
.legal-notice p { margin: 0 0 14px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.65; }
.legal-notice ul { display: grid; gap: 8px; margin: 0; padding-left: 22px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.6; }
.legal-notice a { color: #2f6d78; text-decoration: underline; text-underline-offset: 2px; }
.legal-notice a:hover { color: #334c51; }
.legal-section { max-width: 860px; padding-top: clamp(26px, 3vw, 42px); border-top: 1px solid #ebe0d4; }
.legal-section + .legal-section { margin-top: clamp(26px, 3vw, 42px); }
.legal-section h2 { margin: 0 0 14px; color: #314e53; font-size: clamp(22px, 2.2vw, 30px); font-weight: 600; letter-spacing: -.02em; }
.legal-section p { margin: 0 0 14px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.65; }
.legal-section p:last-child { margin-bottom: 0; }
.legal-section ul { display: grid; gap: 8px; margin: 0 0 14px; padding-left: 20px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.6; }
/* Shopify 后台的政策正文是富文本 HTML，用 v-html 注入，所以要穿透 scoped。 */
.legal-prose { max-width: 860px; }
.legal-prose :deep(h2) { margin: 38px 0 14px; color: #314e53; font-size: clamp(22px, 2.2vw, 30px); font-weight: 600; letter-spacing: -.02em; line-height: 1.2; }
.legal-prose :deep(h3) { margin: 26px 0 10px; color: #314e53; font-size: clamp(17px, 1.7vw, 21px); font-weight: 600; letter-spacing: -.01em; }
.legal-prose :deep(h4) { margin: 22px 0 8px; color: #334c51; font-size: 16px; font-weight: 700; }
.legal-prose :deep(p) { margin: 0 0 14px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.65; }
.legal-prose :deep(ul),
.legal-prose :deep(ol) { display: grid; gap: 8px; margin: 0 0 16px; padding-left: 22px; color: #40595e; font-size: clamp(15px, 1.35vw, 18px); line-height: 1.6; }
.legal-prose :deep(li > p) { margin: 0 0 8px; }
.legal-prose :deep(a) { color: #2f6d78; text-decoration: underline; text-underline-offset: 2px; }
.legal-prose :deep(a:hover) { color: #334c51; }
.legal-prose :deep(strong) { color: #26393d; font-weight: 700; }
.legal-prose :deep(table) { width: 100%; margin: 0 0 18px; border-collapse: collapse; font-size: 15px; }
.legal-prose :deep(th),
.legal-prose :deep(td) { padding: 10px 12px; border: 1px solid #ebe0d4; text-align: left; vertical-align: top; }
.legal-prose :deep(th) { background: #f8fbfa; color: #314e53; font-weight: 600; }
.legal-prose :deep(hr) { margin: 28px 0; border: 0; border-top: 1px solid #ebe0d4; }
.legal-prose :deep(> div > :first-child),
.legal-prose :deep(> :first-child) { margin-top: 0; }
.legal-prose :deep(> div > :last-child),
.legal-prose :deep(> :last-child) { margin-bottom: 0; }

.legal-contact { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: clamp(36px, 4vw, 56px); padding: clamp(22px, 2.6vw, 32px); border: 1px dashed rgba(51, 76, 81, .24); border-radius: 12px; background: #f8fbfa; }
.legal-contact p { flex: 1 1 320px; margin: 0; color: #334c51; font-size: 16px; font-weight: 600; }
.legal-contact-link { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 22px; border-radius: 999px; background: #334c51; color: #fef5ed; font-size: 15px; font-weight: 600; text-decoration: none; }
.legal-contact-link:hover { background: #5a7c85; }
.legal-contact-link--ghost { border: 1px solid rgba(51, 76, 81, .28); background: transparent; color: #334c51; }
.legal-contact-link--ghost:hover { border-color: #334c51; background: #fff; }
@media (max-width: 900px) { .legal-hero { padding: 152px 28px 24px; } .legal-body { padding: 20px 28px 72px; } }
</style>
