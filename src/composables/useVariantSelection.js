/**
 * Shared "which variant is selected" state, keyed by Shopify product handle.
 *
 * The buy bar and any in-page size selector both read and write this, so
 * picking a size on the page updates the bar (and vice versa) instead of the
 * two drifting apart.
 */
import { ref } from 'vue';

const selection = ref({}); // handle -> variant id

export function useVariantSelection() {
  function setVariant(handle, variantId) {
    if (!handle || !variantId) {
      return;
    }
    selection.value = { ...selection.value, [handle]: variantId };
  }

  function getVariant(handle) {
    return handle ? selection.value[handle] ?? null : null;
  }

  return { selection, setVariant, getVariant };
}
