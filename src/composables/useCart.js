/**
 * Shared, reactive Shopify cart store (module-level singleton).
 *
 * The cart lives on Shopify's side; we only keep its `id` in localStorage so it
 * survives reloads. Every component calling `useCart()` reads/writes the same
 * state, so the header badge and the drawer always stay in sync.
 */
import { computed, ref } from 'vue';
import { track } from './useAnalytics';
import {
  addCartLines as shopifyAddLines,
  createCart,
  getCart,
  isShopifyConfigured,
  removeCartLines as shopifyRemoveLines,
  updateCartLines as shopifyUpdateLines,
} from './useShopify';

const CART_STORAGE_KEY = 'kkshop:shopify-cart-id';

const cart = ref(null); // Shopify `Cart` object, or null when there is no cart yet.
// Cart-level work (restoring the cart, changing quantities). Deliberately NOT
// set by addToCart(): one shared flag made every "Add to cart" button on a page
// spin at once when a single card was clicked.
const loading = ref(false);
const error = ref(null);
// Merchandise ids with an add request in flight, so each button can show its
// own spinner instead of the whole grid reacting to one click.
const pendingAdds = ref(new Set());
// Merchandise id the current `error` came from; lets a card show only errors
// about the item it owns.
const errorMerchandiseId = ref(null);
const isOpen = ref(false); // cart drawer visibility

const count = computed(() => cart.value?.totalQuantity ?? 0);
const subtotal = computed(() => cart.value?.cost?.subtotalAmount ?? null);
const checkoutUrl = computed(() => cart.value?.checkoutUrl ?? null);

/** Whether this exact merchandise id is mid-add. Safe to call from a template. */
function isAdding(merchandiseId) {
  return Boolean(merchandiseId) && pendingAdds.value.has(merchandiseId);
}

/** The current error when it belongs to `merchandiseId` (or to the cart as a whole). */
function errorFor(merchandiseId) {
  if (!error.value) {
    return null;
  }
  if (errorMerchandiseId.value && errorMerchandiseId.value !== merchandiseId) {
    return null;
  }
  return error.value;
}

function setError(message, merchandiseId = null) {
  error.value = message;
  errorMerchandiseId.value = message ? merchandiseId : null;
}

function clearError() {
  error.value = null;
  errorMerchandiseId.value = null;
}

function readStoredCartId() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(CART_STORAGE_KEY);
}

function persistCartId(id) {
  if (typeof window === 'undefined') {
    return;
  }
  if (id) {
    window.localStorage.setItem(CART_STORAGE_KEY, id);
  } else {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }
}

/** Restore any previously saved cart on app start. Safe to call in any setup(). */
async function initCart() {
  if (!isShopifyConfigured() || typeof window === 'undefined') {
    return;
  }

  const existing = readStoredCartId();
  if (!existing) {
    cart.value = null;
    return;
  }

  loading.value = true;
  try {
    cart.value = await getCart(existing);
  } catch {
    // Stale or expired cart id — drop it and start fresh.
    persistCartId(null);
    cart.value = null;
  } finally {
    loading.value = false;
  }
}

async function addToCart(merchandiseId, quantity = 1) {
  // No credentials means nothing can ever be added. Report it instead of
  // returning silently: a missing build-time env var used to make every
  // "Add to cart" button on the live site look like a dead button.
  if (!isShopifyConfigured()) {
    setError(
      'Online checkout is unavailable right now. Please email us and we will take your order.',
      merchandiseId,
    );
    return false;
  }

  if (!merchandiseId) {
    return false;
  }

  if (quantity < 1) {
    return false;
  }

  // The same variant can be reachable from two buttons (a size card and the buy
  // bar); the first click owns the request, so ignore the second.
  if (isAdding(merchandiseId)) {
    return false;
  }

  pendingAdds.value.add(merchandiseId);
  clearError();
  try {
    const lines = [{ merchandiseId, quantity }];
    const nextCart =
      cart.value?.id !== undefined && cart.value?.id !== null
        ? await shopifyAddLines(cart.value.id, lines)
        : await createCart(lines);

    cart.value = nextCart;
    if (nextCart?.id) {
      persistCartId(nextCart.id);
    }

    // Shopify still returns a cart when a line could not be added (for example
    // an item that is out of stock), so check that something was really added
    // before opening the drawer — otherwise the shopper just sees an empty cart.
    const addedQuantity = (nextCart?.lines?.nodes ?? []).reduce(
      (total, line) => total + (line.quantity ?? 0),
      0,
    );

    if (addedQuantity < 1) {
      setError(
        'This item is out of stock right now. Email us and we will confirm availability.',
        merchandiseId,
      );
      return false;
    }

    isOpen.value = true;

    // 加购是整条漏斗里第一个「真人信号」。没有它，$15/天的广告跑一周也分不清
    // 是没人来、还是来了没人加购 —— 这两个结论对应的动作完全相反。
    track('add_to_cart', {
      item_id: String(merchandiseId).split('/').pop(),
      quantity: addedQuantity,
    });

    return true;
  } catch (err) {
    setError(err.message || 'Could not add to cart.', merchandiseId);
    return false;
  } finally {
    pendingAdds.value.delete(merchandiseId);
  }
}

async function updateQuantity(lineId, quantity) {
  if (!cart.value?.id) {
    return;
  }
  loading.value = true;
  clearError();
  try {
    if (quantity <= 0) {
      cart.value = await shopifyRemoveLines(cart.value.id, [lineId]);
    } else {
      cart.value = await shopifyUpdateLines(cart.value.id, [{ id: lineId, quantity }]);
    }
  } catch (err) {
    setError(err.message || 'Could not update cart.');
  } finally {
    loading.value = false;
  }
}

async function removeLine(lineId) {
  if (!cart.value?.id) {
    return;
  }
  loading.value = true;
  clearError();
  try {
    cart.value = await shopifyRemoveLines(cart.value.id, [lineId]);
  } catch (err) {
    setError(err.message || 'Could not remove item.');
  } finally {
    loading.value = false;
  }
}

function openCart() {
  isOpen.value = true;
}
function closeCart() {
  isOpen.value = false;
}
function toggleCart() {
  isOpen.value = !isOpen.value;
}

export function useCart() {
  return {
    cart,
    count,
    subtotal,
    checkoutUrl,
    loading,
    error,
    isAdding,
    errorFor,
    isOpen,
    initCart,
    addToCart,
    updateQuantity,
    removeLine,
    openCart,
    closeCart,
    toggleCart,
  };
}
