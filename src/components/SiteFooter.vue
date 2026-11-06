<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowUp } from 'lucide-vue-next';
import { shopCategories } from '../data/catalog';
import {
  CONTACT_EMAIL,
  contacts,
  contactEmailHref,
  paymentMethods,
  socialLinks,
} from '../data/siteInfo';

/**
 * Site-wide footer: brand, navigation, policies, newsletter and back-to-top.
 *
 * Links point only at pages that exist. The newsletter form has no backend yet,
 * so it never pretends to have subscribed anyone — it tells the visitor to email
 * us instead. `socialLinks` in `src/data/siteInfo.js` has no URLs yet, so the
 * "Follow us" column stays hidden until the TikTok / LinkedIn links are pasted in.
 */

const shopLinks = [
  { label: 'Shop all products', to: { name: 'products' } },
  ...shopCategories.map((category) => ({
    label: category.label,
    to: { name: 'products', hash: `#${category.id}` },
  })),
];

const companyLinks = [
  { label: 'Business & wholesale', to: { name: 'business' } },
  { label: 'About us', to: { name: 'business', hash: '#about' } },
  { label: 'Why Meower', to: { name: 'business', hash: '#why-meower' } },
  { label: 'Blog', to: { name: 'blogs' } },
];

const supportLinks = [
  { label: 'Support home', to: { name: 'support' } },
  { label: 'FAQs', to: { name: 'support', hash: '#faqs' } },
  { label: 'Shipping enquiries', to: { name: 'support', hash: '#faqs' } },
  { label: 'Contact us', to: { name: 'business', hash: '#contact' } },
];

const policyLinks = [
  { label: 'Privacy Policy', to: { name: 'privacy' } },
  { label: 'Refund & Exchanges', to: { name: 'refunds' } },
  { label: 'Terms of Service', to: { name: 'terms' } },
];

const columns = [
  { id: 'shop', heading: 'Shop', links: shopLinks },
  { id: 'company', heading: 'Company', links: companyLinks },
  { id: 'support', heading: 'Support', links: supportLinks },
  { id: 'policies', heading: 'Policies', links: policyLinks },
];

const liveSocialLinks = computed(() => socialLinks.filter((link) => link.href));
const address = contacts.find((contact) => contact.label === 'Address')?.value ?? '';
const year = new Date().getFullYear();

const newsletterEmail = ref('');
const newsletterMessage = ref('');
const showBackToTop = ref(false);
const footerRef = ref(null);

const SCROLL_THRESHOLD = 600;

/** Once the footer is on screen there is nothing left to scroll past, and the
 *  floating button would sit on top of the newsletter row. */
let footerInView = false;
let footerObserver;

function subscribe() {
  // No mailing-list backend yet: be explicit rather than faking a success state.
  newsletterMessage.value = `Newsletter sign-up isn't live yet. Email ${CONTACT_EMAIL} and we will add you to the list.`;
}

function updateBackToTop() {
  showBackToTop.value = window.scrollY > SCROLL_THRESHOLD && !footerInView;
}

function backToTop() {
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
}

onMounted(() => {
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  if (typeof IntersectionObserver === 'function' && footerRef.value) {
    footerObserver = new IntersectionObserver(
      ([entry]) => {
        footerInView = entry.isIntersecting;
        updateBackToTop();
      },
      { threshold: 0 },
    );
    footerObserver.observe(footerRef.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateBackToTop);
  footerObserver?.disconnect();
});
</script>

<template>
  <footer ref="footerRef" class="site-footer" aria-label="Site footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo" aria-label="Meower home">
            <img src="/images/logo-meower.webp" alt="Meower" />
          </RouterLink>
          <p class="footer-tagline">Pet supplies and pet-friendly air care, made for homes with cats and dogs.</p>
          <a class="footer-mail" :href="contactEmailHref">{{ CONTACT_EMAIL }}</a>
        </div>

        <nav class="footer-columns" aria-label="Footer navigation">
          <div v-for="column in columns" :key="column.id" class="footer-column">
            <h2>{{ column.heading }}</h2>
            <ul>
              <li v-for="link in column.links" :key="`${column.id}-${link.label}`">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>

          <div v-if="liveSocialLinks.length" class="footer-column footer-column--social">
            <h2>Follow us</h2>
            <ul class="footer-social">
              <li v-for="link in liveSocialLinks" :key="link.id">
                <a :href="link.href" :aria-label="link.label" rel="noopener">
                  <component :is="link.icon" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="footer-bottom">
        <div class="footer-meta">
          <p v-if="address" class="footer-address">{{ address }}</p>
          <p class="footer-copyright">&copy; {{ year }} Meower. All rights reserved.</p>

          <div class="footer-payments">
            <span class="footer-payments-label">We accept</span>
            <ul class="footer-payment-list" aria-label="Accepted payment methods">
              <li v-for="method in paymentMethods" :key="method.id">
                <img :src="method.image" :alt="method.label" loading="lazy" decoding="async" />
              </li>
            </ul>
          </div>
        </div>

        <form class="footer-newsletter" novalidate @submit.prevent="subscribe">
          <label class="sr-only" for="footer-newsletter-email">Email address</label>
          <input
            id="footer-newsletter-email"
            v-model="newsletterEmail"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Email (no spam, once a month)"
          />
          <button type="submit">Join our Newsletter</button>
          <p v-if="newsletterMessage" class="footer-newsletter-note" role="status">
            {{ newsletterMessage }}
          </p>
        </form>
      </div>
    </div>

    <Transition name="to-top">
      <button
        v-if="showBackToTop"
        class="footer-to-top"
        type="button"
        aria-label="Back to top"
        @click="backToTop"
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </Transition>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #f1f5f4;
  color: #334c51;
  border-top: 1px solid rgba(51, 76, 81, 0.1);
}

.footer-inner {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: clamp(46px, 6vw, 78px) 0 clamp(28px, 3vw, 40px);
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(220px, 1.1fr) minmax(0, 3fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}

.footer-logo {
  display: inline-block;
  width: 168px;
}

.footer-logo img {
  width: 100%;
  height: auto;
}

.footer-tagline {
  max-width: 300px;
  margin: 18px 0 0;
  color: #4f6b70;
  font-size: 15px;
  line-height: 1.55;
}

.footer-mail {
  display: inline-block;
  margin-top: 14px;
  color: #334c51;
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* auto-fit so the grid looks balanced whether or not the social column exists. */
.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: clamp(20px, 2.6vw, 40px);
  align-items: start;
}

.footer-column h2 {
  margin: 0 0 14px;
  color: #274b52;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
}

.footer-column ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-column a {
  color: #3f6167;
  font-size: 14.5px;
  line-height: 1.4;
  text-decoration: none;
}

.footer-column a:hover,
.footer-column a:focus-visible {
  color: #274b52;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.footer-social {
  display: flex !important;
  gap: 12px;
}

.footer-social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #334c51;
  color: #fef5ed;
}

.footer-social a:hover {
  background: #5a7c85;
}

.footer-social svg {
  width: 18px;
  height: 18px;
}

.footer-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
  gap: clamp(20px, 3vw, 48px);
  align-items: end;
  margin-top: clamp(38px, 5vw, 64px);
  padding-top: clamp(22px, 2.4vw, 30px);
  border-top: 1px solid rgba(51, 76, 81, 0.14);
}

.footer-meta p {
  margin: 0;
}

.footer-address {
  color: #4f6b70;
  font-size: 14.5px;
}

.footer-copyright {
  margin-top: 8px !important;
  color: #5a7c85;
  font-size: 13.5px;
}

.footer-payments {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.footer-payments-label {
  color: #5a7c85;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer-payment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-payment-list li {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* The PayPal artwork is already a white rounded card, so it needs no chip of
   its own. */
.footer-payment-list img {
  display: block;
  width: auto;
  height: 30px;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(51, 76, 81, 0.12);
}

.footer-newsletter {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.footer-newsletter input {
  min-width: 0;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid rgba(51, 76, 81, 0.26);
  border-radius: 8px;
  background: #fff;
  color: #202222;
  font: inherit;
  font-size: 15px;
}

.footer-newsletter input::placeholder {
  color: #8fa5a9;
}

.footer-newsletter input:focus-visible {
  border-color: #334c51;
  outline: 2px solid rgba(51, 76, 81, 0.2);
  outline-offset: 1px;
}

.footer-newsletter button {
  min-height: 50px;
  padding: 0 24px;
  white-space: nowrap;
  border: 0;
  border-radius: 8px;
  background: #334c51;
  color: #fef5ed;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 160ms ease;
}

.footer-newsletter button:hover,
.footer-newsletter button:focus-visible {
  background: #5a7c85;
}

.footer-newsletter-note {
  grid-column: 1 / -1;
  margin: 0;
  color: #4f6b70;
  font-size: 13.5px;
  line-height: 1.5;
}

.footer-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(51, 76, 81, 0.16);
  border-radius: 50%;
  background: #eaf2f0;
  color: #334c51;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(51, 76, 81, 0.16);
  transition: background-color 160ms ease, transform 160ms ease;
}

.footer-to-top:hover,
.footer-to-top:focus-visible {
  background: #d9eee8;
  transform: translateY(-2px);
}

.footer-to-top svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.to-top-enter-active,
.to-top-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.to-top-enter-from,
.to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 1080px) {
  .footer-top {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-columns {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px 32px;
  }

  .footer-bottom {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-inner {
    width: min(100% - 36px, 1180px);
  }

  .footer-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 20px;
  }

  .footer-logo {
    width: 148px;
  }

  .footer-newsletter {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-to-top {
    right: 16px;
    bottom: 16px;
    width: 46px;
    height: 46px;
  }
}
</style>
