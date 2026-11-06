<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { X } from 'lucide-vue-next';

/**
 * Homepage offer pop-up.
 *
 * Shown once per browser session, a few seconds after the visitor lands, so
 * the hero has a moment to make its point first. Backdrop, Esc, the close
 * button and "No thanks" all dismiss it; focus is trapped while it is open.
 */
const SHOW_DELAY_MS = 5000;
const SESSION_KEY = 'meower-offer-popup-seen';

const isOpen = ref(false);
const dialogRef = ref(null);
const closeButtonRef = ref(null);

let showTimer;
let lastFocusedElement = null;
let previousBodyOverflow = '';
let scrollLocked = false;

function alreadySeen() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* sessionStorage can be unavailable in private modes */
  }
}

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

function openModal() {
  if (isOpen.value) {
    return;
  }
  lastFocusedElement = document.activeElement;
  markSeen();
  lockScroll();
  isOpen.value = true;
  document.addEventListener('keydown', handleKeydown);
  nextTick(() => closeButtonRef.value?.focus());
}

function closeModal() {
  if (!isOpen.value) {
    return;
  }
  isOpen.value = false;
  unlockScroll();
  document.removeEventListener('keydown', handleKeydown);

  if (lastFocusedElement instanceof HTMLElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function focusableElements() {
  if (!dialogRef.value) {
    return [];
  }
  return Array.from(dialogRef.value.querySelectorAll('a[href], button:not([disabled])')).filter(
    (element) => element.getClientRects().length > 0,
  );
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
  if (alreadySeen()) {
    return;
  }
  showTimer = window.setTimeout(openModal, SHOW_DELAY_MS);
});

onBeforeUnmount(() => {
  if (showTimer) {
    window.clearTimeout(showTimer);
  }
  unlockScroll();
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="offer-pop">
      <div v-if="isOpen" class="offer-pop">
        <div class="offer-pop-backdrop" aria-hidden="true" @click="closeModal"></div>

        <div
          ref="dialogRef"
          class="offer-pop-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-pop-title"
        >
          <button
            ref="closeButtonRef"
            class="offer-pop-close"
            type="button"
            aria-label="Close offers"
            @click="closeModal"
          >
            <X :size="20" aria-hidden="true" />
          </button>

          <figure class="offer-pop-media">
            <img
              src="/images/promo/offer-lifestyle.webp"
              alt="A Bengal cat beside the festive plaid bed and a Meower air purifier in a sunlit room"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div class="offer-pop-copy">
            <p class="offer-pop-eyebrow">This week at Meower</p>
            <h2 id="offer-pop-title" class="offer-pop-title">Two little reasons to shop</h2>

            <ul class="offer-pop-list">
              <li>
                <span class="offer-pop-spark" aria-hidden="true">✨</span>
                Free shipping on orders over $99.
              </li>
              <li>
                <span class="offer-pop-spark" aria-hidden="true">✨</span>
                New Customers: Get $10 off your first order.
              </li>
            </ul>

            <RouterLink class="offer-pop-cta" :to="{ name: 'products' }" @click="closeModal">
              Shop now
            </RouterLink>

            <button class="offer-pop-dismiss" type="button" @click="closeModal">
              No thanks
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.offer-pop {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 20px;
}

.offer-pop-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(12, 26, 29, 0.56);
  backdrop-filter: blur(2px);
}

.offer-pop-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  width: min(860px, 100%);
  max-height: calc(100vh - 40px);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 32px 80px rgba(12, 26, 29, 0.38);
  overflow: hidden;
}

.offer-pop-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #22383c;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease;
}

.offer-pop-close:hover,
.offer-pop-close:focus-visible {
  background: #fff;
  transform: scale(1.04);
}

.offer-pop-media {
  margin: 0;
  min-height: 100%;
  background: #f7f1e7;
}

.offer-pop-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-pop-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: clamp(26px, 4vw, 46px);
}

.offer-pop-eyebrow {
  margin: 0;
  color: #75949a;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.offer-pop-title {
  margin: 0;
  color: #22383c;
  font-size: clamp(24px, 2.6vw, 36px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.offer-pop-list {
  display: grid;
  gap: 10px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.offer-pop-list li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  color: #3f6167;
  font-size: clamp(14.5px, 1.15vw, 16.5px);
  line-height: 1.5;
}

.offer-pop-spark {
  font-size: 14px;
  line-height: 1.5;
}

.offer-pop-cta {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  margin-top: 8px;
  padding: 0 30px;
  border-radius: 999px;
  background: #22383c;
  color: #fef5ed;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 180ms ease, transform 180ms ease;
}

.offer-pop-cta:hover,
.offer-pop-cta:focus-visible {
  background: #314e53;
  transform: translateY(-1px);
}

.offer-pop-dismiss {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: #7b9398;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.offer-pop-dismiss:hover,
.offer-pop-dismiss:focus-visible {
  color: #3f6167;
}

.offer-pop-enter-active,
.offer-pop-leave-active {
  transition: opacity 200ms ease;
}

.offer-pop-enter-active .offer-pop-card,
.offer-pop-leave-active .offer-pop-card {
  transition: transform 220ms ease;
}

.offer-pop-enter-from,
.offer-pop-leave-to {
  opacity: 0;
}

.offer-pop-enter-from .offer-pop-card,
.offer-pop-leave-to .offer-pop-card {
  transform: translateY(12px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .offer-pop-enter-active,
  .offer-pop-leave-active,
  .offer-pop-enter-active .offer-pop-card,
  .offer-pop-leave-active .offer-pop-card {
    transition: none;
  }
}

@media (max-width: 720px) {
  .offer-pop-card {
    grid-template-columns: minmax(0, 1fr);
    overflow-y: auto;
  }

  .offer-pop-media {
    min-height: 0;
  }

  .offer-pop-media img {
    height: auto;
    aspect-ratio: 16 / 10;
  }

  .offer-pop-copy {
    padding: 22px 22px 26px;
  }
}
</style>
