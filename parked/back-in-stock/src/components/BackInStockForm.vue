<script setup>
import { ref } from 'vue';
import { BellRing, Check, Loader2 } from 'lucide-vue-next';
import { hasRequested, useBackInStock } from '../composables/useBackInStock';

/**
 * "Email me when it's back" — shown instead of buy buttons for sold-out
 * variants. The request lands in D1 and the shop owner notifies people from
 * /admin/restock once Shopify has stock again.
 */
const props = defineProps({
  productId: { type: String, required: true },
  productTitle: { type: String, default: '' },
  variantId: { type: String, required: true },
  variantTitle: { type: String, default: '' },
  /** Compact = inside a size/colour card; default = stands alone. */
  compact: { type: Boolean, default: false },
});

const { submitting, error, success, subscribe } = useBackInStock();
const email = ref('');
const honeypot = ref('');
const onList = ref(hasRequested(props.variantId));

async function submit() {
  const ok = await subscribe({
    email: email.value,
    company: honeypot.value,
    productId: props.productId,
    productTitle: props.productTitle,
    variantId: props.variantId,
    variantTitle: props.variantTitle,
  });
  if (ok) {
    onList.value = true;
  }
}

const label = () => (props.variantTitle && props.variantTitle !== 'Default Title' ? props.variantTitle : '');
</script>

<template>
  <div class="restock" :class="{ 'restock--compact': compact }">
    <template v-if="success || onList">
      <p class="restock-done">
        <Check :size="compact ? 13 : 15" aria-hidden="true" />
        <span>We will email you when it is back in stock.</span>
      </p>
    </template>

    <form v-else class="restock-form" novalidate @submit.prevent="submit">
      <label class="restock-field">
        <span class="sr-only">Email address</span>
        <input
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Your email"
          :disabled="submitting"
          required
        />
      </label>
      <!-- Bot trap: hidden from people, tempting for scripts. -->
      <input v-model="honeypot" type="text" name="company" class="restock-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <button type="submit" class="restock-button" :disabled="submitting">
        <Loader2 v-if="submitting" :size="compact ? 13 : 15" class="spin" aria-hidden="true" />
        <BellRing v-else :size="compact ? 13 : 15" aria-hidden="true" />
        <span>{{ submitting ? 'Saving…' : 'Notify me when it is back' }}</span>
      </button>
    </form>

    <p v-if="error" class="restock-error">{{ error }}</p>
    <p v-else-if="!success && !onList" class="restock-hint">
      Sold out{{ label() ? ` — ${label()}` : '' }}. Leave your email and we will tell you the moment it returns.
    </p>
  </div>
</template>

<style scoped>
.restock {
  display: grid;
  gap: 8px;
  width: 100%;
}

.restock-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: stretch;
}

.restock-field {
  flex: 1 1 180px;
  min-width: 0;
}

.restock-field input {
  width: 100%;
  min-height: 42px;
  padding: 0 13px;
  border: 1px solid rgba(49, 78, 83, 0.24);
  border-radius: 8px;
  background: #fff;
  color: #22383c;
  font: inherit;
  font-size: 14px;
}

.restock-field input:focus-visible {
  border-color: #314e53;
  outline: 2px solid rgba(49, 78, 83, 0.22);
  outline-offset: 1px;
}

.restock-button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid #314e53;
  border-radius: 8px;
  background: #314e53;
  color: #fef5ed;
  font: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.restock-button:hover:not(:disabled),
.restock-button:focus-visible:not(:disabled) {
  background: #22383c;
}

.restock-button:disabled {
  opacity: 0.7;
  cursor: progress;
}

.restock-hint,
.restock-error,
.restock-done {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
}

.restock-hint {
  color: #6c8a90;
}

.restock-error {
  color: #b4453c;
  font-weight: 700;
}

.restock-done {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 9px 12px;
  border-radius: 8px;
  background: rgba(49, 78, 83, 0.08);
  color: #2f4a4f;
  font-weight: 700;
}

.restock-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.restock--compact .restock-form {
  gap: 6px;
}

.restock--compact .restock-field {
  flex: 1 1 100%;
}

.restock--compact .restock-field input {
  min-height: 38px;
  font-size: 13px;
}

.restock--compact .restock-button {
  flex: 1 1 100%;
  min-height: 38px;
  font-size: 12.5px;
}

.restock--compact .restock-hint,
.restock--compact .restock-done {
  font-size: 12px;
}

.spin {
  animation: restock-spin 900ms linear infinite;
}

@keyframes restock-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
