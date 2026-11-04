import { computed, ref } from 'vue';

/**
 * Back-in-stock requests.
 *
 * The form posts to `/api/back-in-stock` (a Cloudflare Pages Function backed by
 * D1). Asking twice for the same variant is harmless — the row is unique on
 * (email, variant) and the API answers with success either way.
 */

const STORAGE_KEY = 'kkshop:restock-requests';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readStore() {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(list) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-200)));
  } catch {
    /* private mode — the API call already succeeded, so this is cosmetic */
  }
}

/** Remembered locally so a returning shopper sees "you're on the list". */
export function hasRequested(variantId) {
  if (!variantId) {
    return false;
  }
  return readStore().some((entry) => entry.variantId === variantId);
}

export function useBackInStock() {
  const submitting = ref(false);
  const error = ref('');
  const success = ref(false);
  const requested = ref(false);

  async function subscribe({ email, company = '', productId, productTitle, variantId, variantTitle }) {
    error.value = '';
    success.value = false;

    const trimmed = (email ?? '').trim();
    if (!EMAIL_RE.test(trimmed)) {
      error.value = 'Please enter a valid email address.';
      return false;
    }

    submitting.value = true;
    try {
      const response = await fetch('/api/back-in-stock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          company,
          productId,
          productTitle,
          variantId,
          variantTitle,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error || 'Could not save your request. Please try again.');
      }

      const list = readStore();
      if (!list.some((entry) => entry.variantId === variantId && entry.email === trimmed)) {
        list.push({ variantId, email: trimmed, at: new Date().toISOString() });
        writeStore(list);
      }
      success.value = true;
      requested.value = true;
      return true;
    } catch (err) {
      error.value = err.message || 'Could not save your request. Please try again.';
      return false;
    } finally {
      submitting.value = false;
    }
  }

  return { submitting, error, success, requested, subscribe };
}

/** Small helper for admin screens: pulls the token from localStorage. */
export function useAdminToken() {
  const KEY = 'kkshop:admin-token';
  const token = ref(typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) ?? '' : '');
  const hasToken = computed(() => token.value.length > 0);

  function save(next) {
    token.value = next.trim();
    if (typeof localStorage !== 'undefined') {
      if (token.value) {
        localStorage.setItem(KEY, token.value);
      } else {
        localStorage.removeItem(KEY);
      }
    }
  }

  return { token, hasToken, save };
}
