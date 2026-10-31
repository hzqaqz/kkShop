/**
 * Cached Shopify products for client-side price display.
 *
 * Prices belong to Shopify, so they are fetched in the browser (the site is
 * static and must build without network access). One request per handle is
 * shared by every card / page section that asks for it.
 */
import { computed, onMounted, ref } from 'vue';
import { fetchProductByHandle, isShopifyConfigured } from './useShopify';

const productsByHandle = ref({}); // handle -> Shopify product | null
const loadingHandles = ref({});
const inflight = new Map();

export function useShopifyProducts() {
  async function loadProduct(handle) {
    if (!handle || !isShopifyConfigured()) {
      return null;
    }
    if (handle in productsByHandle.value) {
      return productsByHandle.value[handle];
    }
    if (inflight.has(handle)) {
      return inflight.get(handle);
    }

    const request = (async () => {
      loadingHandles.value = { ...loadingHandles.value, [handle]: true };
      try {
        const product = await fetchProductByHandle(handle);
        productsByHandle.value = { ...productsByHandle.value, [handle]: product ?? null };
        return product ?? null;
      } catch {
        // A missing handle or a network hiccup simply leaves prices hidden —
        // never a broken card.
        productsByHandle.value = { ...productsByHandle.value, [handle]: null };
        return null;
      } finally {
        const nextLoading = { ...loadingHandles.value };
        delete nextLoading[handle];
        loadingHandles.value = nextLoading;
        inflight.delete(handle);
      }
    })();

    inflight.set(handle, request);
    return request;
  }

  return { productsByHandle, loadProduct };
}

/** Cheapest buyable variant, for "From $x" labels on product cards. */
export function useShopifyPrices() {
  const { productsByHandle, loadProduct } = useShopifyProducts();

  const prices = computed(() => {
    const out = {};
    for (const [handle, product] of Object.entries(productsByHandle.value)) {
      const variants = product?.variants?.nodes ?? [];
      if (!variants.length) {
        out[handle] = null;
        continue;
      }

      const available = variants.filter((variant) => variant.availableForSale);
      const pool = available.length ? available : variants;
      const cheapest = pool.reduce(
        (lowest, variant) =>
          !lowest || Number(variant.price.amount) < Number(lowest.price.amount) ? variant : lowest,
        null,
      );

      out[handle] = {
        amount: cheapest.price.amount,
        currencyCode: cheapest.price.currencyCode,
        variantCount: variants.length,
      };
    }
    return out;
  });

  return { prices, loadPrice: loadProduct };
}

/** One product (with all its variants), loaded once and shared. */
export function useShopifyProduct(handle) {
  const { productsByHandle, loadProduct } = useShopifyProducts();

  onMounted(() => loadProduct(handle));

  return {
    product: computed(() => (handle ? productsByHandle.value[handle] ?? null : null)),
    loadProduct,
  };
}
