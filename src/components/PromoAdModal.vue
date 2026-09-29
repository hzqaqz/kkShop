<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { X } from 'lucide-vue-next';

const OPEN_DELAY_MS = 600;

const isOpen = ref(false);
const dialogRef = ref(null);
const closeButtonRef = ref(null);

let openTimer;
let previousBodyOverflow = '';
let lastFocusedElement = null;
let scrollLocked = false;

const sellingPoints = ['Low MOQ', 'Certification support', 'Marketing materials', 'Territory protection'];

const partnershipBullets = [
  'We support small distributors',
  'Certification handled by us',
  'Stable supply, consistent quality',
  'Long-term partnership',
];

const ctaMailto = 'mailto:info@meowerair.com?subject=Distributor%20pricing%20inquiry';

function lockScroll() {
  if (scrollLocked) {
    return;
  }

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  scrollLocked = true;
}

function unlockScroll() {
  if (!scrollLocked) {
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  scrollLocked = false;
}

function closeModal() {
  isOpen.value = false;
  unlockScroll();
  restoreFocus();
}

function restoreFocus() {
  if (lastFocusedElement instanceof HTMLElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
}

function focusableElements() {
  if (!dialogRef.value) {
    return [];
  }

  return Array.from(
    dialogRef.value.querySelectorAll('a[href], button:not([disabled])'),
  ).filter((element) => element.getClientRects().length > 0);
}

function trapFocus(event) {
  const focusables = focusableElements();

  if (!focusables.length) {
    event.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !dialogRef.value?.contains(active)) {
      event.preventDefault();
      last.focus();
    }

    return;
  }

  if (active === last || !dialogRef.value?.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

function handleKeydown(event) {
  if (!isOpen.value) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === 'Tab') {
    trapFocus(event);
  }
}

onMounted(() => {
  lastFocusedElement = document.activeElement;
  window.addEventListener('keydown', handleKeydown);

  openTimer = window.setTimeout(() => {
    openTimer = undefined;
    lockScroll();
    isOpen.value = true;
    nextTick(() => closeButtonRef.value?.focus());
  }, OPEN_DELAY_MS);
});

onBeforeUnmount(() => {
  if (openTimer) {
    window.clearTimeout(openTimer);
    openTimer = undefined;
  }

  window.removeEventListener('keydown', handleKeydown);
  unlockScroll();
  restoreFocus();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="promo-ad">
      <div v-if="isOpen" class="promo-ad">
        <div class="promo-ad-backdrop" aria-hidden="true" @click="closeModal"></div>

        <div
          ref="dialogRef"
          class="promo-ad-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-ad-title"
        >
          <button
            ref="closeButtonRef"
            class="promo-ad-close"
            type="button"
            aria-label="Close advertisement"
            @click="closeModal"
          >
            <X :size="20" aria-hidden="true" />
          </button>

          <figure class="promo-ad-media">
            <img
              src="/images/promo-ad-lifestyle.jpg"
              alt="Meower air purifier beside a cat in a sunlit room with a yellow pet bowl"
            />
            <figcaption class="promo-ad-headline-wrap">
              <h2 id="promo-ad-title" class="promo-ad-headline">
                A supply partner who supports your market.
              </h2>
            </figcaption>
          </figure>

          <div class="promo-ad-copy">
            <div class="promo-ad-copy-body">
              <ul class="promo-ad-points">
                <li v-for="point in sellingPoints" :key="point">{{ point }}</li>
              </ul>

              <ul class="promo-ad-bullets">
                <li v-for="bullet in partnershipBullets" :key="bullet">{{ bullet }}</li>
              </ul>
            </div>

            <a class="promo-ad-cta" :href="ctaMailto" @click="closeModal">
              <span class="promo-ad-cta-label">Apply for distributor pricing</span>
              <span class="promo-ad-cta-email"><span aria-hidden="true">→</span> info@meowerair.com</span>
            </a>

            <img class="promo-ad-logo" src="/images/logo-meower.png" alt="Meower" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.promo-ad {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
}

.promo-ad-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(20, 42, 48, 0.58);
  backdrop-filter: blur(6px);
}

.promo-ad-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
  /* 让行高可收缩：视口很矮时卡片被 max-height 限制，内部改为滚动而不是被裁切 */
  grid-template-rows: minmax(0, 1fr);
  width: min(1000px, 100%);
  max-height: min(720px, 88vh);
  overflow: hidden;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 30px 60px rgba(24, 48, 54, 0.28);
}

.promo-ad-close {
  position: absolute;
  z-index: 2;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #334c51;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.promo-ad-close:hover,
.promo-ad-close:focus-visible {
  background: #334c51;
  color: #fef5ed;
}

.promo-ad-media {
  position: relative;
  min-height: 0;
  margin: 0;
}

.promo-ad-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-ad-headline-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  padding: 34px 30px;
  background: linear-gradient(
    180deg,
    rgba(18, 40, 46, 0.76) 0%,
    rgba(18, 40, 46, 0.28) 42%,
    rgba(18, 40, 46, 0) 70%
  );
  pointer-events: none;
}

.promo-ad-headline {
  margin: 0;
  color: #fff;
  font-size: clamp(20px, 2vw, 30px);
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.28);
}

.promo-ad-copy {
  display: grid;
  /* 卖点/列表可滚动，CTA 与 logo 固定为页脚，任何屏幕都不被裁切 */
  grid-template-rows: minmax(0, 1fr) auto auto;
  gap: 16px;
  min-height: 0;
  padding: 40px 36px 30px;
  overflow: hidden;
  background: linear-gradient(180deg, #f7faf9, #fff);
}

.promo-ad-copy-body {
  display: grid;
  align-content: start;
  gap: 18px;
  min-height: 0;
  overflow-y: auto;
}

.promo-ad-points {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #274b52;
  font-size: clamp(20px, 1.9vw, 27px);
  font-weight: 800;
  line-height: 1.28;
}

.promo-ad-bullets {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 20px;
  color: #334c51;
  font-size: clamp(14px, 1.05vw, 16px);
  line-height: 1.6;
}

.promo-ad-cta {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: 2px;
  min-height: 50px;
  padding: 12px 22px;
  border-radius: 10px;
  background: #334c51;
  color: #fef5ed;
  font-size: 15px;
  font-weight: 800;
  text-align: center;
  transition: background-color 160ms ease;
}

.promo-ad-cta:hover,
.promo-ad-cta:focus-visible {
  background: #5a7c85;
}

.promo-ad-cta-label {
  line-height: 1.25;
}

.promo-ad-cta-email {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
}

.promo-ad-logo {
  align-self: end;
  justify-self: end;
  width: 128px;
  height: auto;
}

.promo-ad-enter-active,
.promo-ad-leave-active {
  transition: opacity 200ms ease;
}

.promo-ad-enter-active .promo-ad-card,
.promo-ad-leave-active .promo-ad-card {
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease;
}

.promo-ad-enter-from,
.promo-ad-leave-to {
  opacity: 0;
}

.promo-ad-enter-from .promo-ad-card,
.promo-ad-leave-to .promo-ad-card {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

@media (max-width: 900px) {
  .promo-ad {
    padding: 16px;
  }

  .promo-ad-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    max-width: 560px;
    max-height: 88vh;
  }

  .promo-ad-close {
    top: 12px;
    right: 12px;
  }

  .promo-ad-media {
    aspect-ratio: 16 / 9;
    min-height: 0;
    max-height: 38vh;
  }

  .promo-ad-media img {
    position: absolute;
    inset: 0;
  }

  .promo-ad-headline-wrap {
    padding: 22px 20px;
  }

  .promo-ad-headline {
    font-size: clamp(18px, 4.6vw, 26px);
  }

  .promo-ad-copy {
    padding: 26px 22px 22px;
  }
}

@media (max-width: 560px) {
  .promo-ad-copy {
    gap: 14px;
    padding: 22px 18px 18px;
  }

  .promo-ad-cta {
    padding: 12px 14px;
    font-size: 14px;
  }

  .promo-ad-cta-email {
    font-size: 13px;
  }

  .promo-ad-logo {
    width: 104px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .promo-ad-enter-active,
  .promo-ad-leave-active,
  .promo-ad-enter-active .promo-ad-card,
  .promo-ad-leave-active .promo-ad-card {
    transition-duration: 1ms;
  }

  .promo-ad-enter-from .promo-ad-card,
  .promo-ad-leave-to .promo-ad-card {
    transform: none;
  }
}
</style>
