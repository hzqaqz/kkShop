/**
 * Shared, reactive Shopify cart store (module-level singleton).
 *
 * The cart lives on Shopify's side; we only keep its `id` in localStorage so it
 * survives reloads. Every component calling `useCart()` reads/writes the same
 * state, so the header badge and the drawer always stay in sync.
 */
import { computed, ref } from 'vue';
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
const loading = ref(false);
const error = ref(null);
const isOpen = ref(false); // cart drawer visibility

const count = computed(() => cart.value?.totalQuantity ?? 0);
const subtotal = computed(() => cart.value?.cost?.subtotalAmount ?? null);
const checkoutUrl = computed(() => cart.value?.checkoutUrl ?? null);

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
  if (!isShopifyConfigured() || !merchandiseId) {
    return;
  }

  if (quantity < 1) {
    return false;
  }

  loading.value = true;
  error.value = null;
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
      error.value = 'This item is out of stock right now. Email us and we will confirm availability.';
      return false;
    }

    isOpen.value = true;
    return true;
  } catch (err) {
    error.value = err.message || 'Could not add to cart.';
    return false;
  } finally {
    loading.value = false;
  }
}

async function updateQuantity(lineId, quantity) {
  if (!cart.value?.id) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    if (quantity <= 0) {
      cart.value = await shopifyRemoveLines(cart.value.id, [lineId]);
    } else {
      cart.value = await shopifyUpdateLines(cart.value.id, [{ id: lineId, quantity }]);
    }
  } catch (err) {
    error.value = err.message || 'Could not update cart.';
  } finally {
    loading.value = false;
  }
}

async function removeLine(lineId) {
  if (!cart.value?.id) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    cart.value = await shopifyRemoveLines(cart.value.id, [lineId]);
  } catch (err) {
    error.value = err.message || 'Could not remove item.';
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
