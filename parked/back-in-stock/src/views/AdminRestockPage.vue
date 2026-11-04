<script setup>
import { computed, ref } from 'vue';
import { BellRing, Loader2, RefreshCw, ShieldCheck } from 'lucide-vue-next';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { useAdminToken } from '../composables/useBackInStock';
import { fetchProductByHandle } from '../composables/useShopify';
import { getProduct } from '../data/products';

/**
 * Staff-only screen for the "email me when it's back" list.
 *
 * It talks to two APIs: `/api/admin/requests` (our D1 table) and the Shopify
 * Storefront API (to see whether the variant can be bought again). Sending is a
 * deliberate click — nothing goes out automatically, so a restock that turns
 * out to be two units does not spam the list.
 */
useSeo({
  title: 'Restock requests',
  description: 'Staff screen for back-in-stock requests.',
  noindex: true,
});

const { token, save } = useAdminToken();
const draftToken = ref(token.value);

const loading = ref(false);
const notifying = ref('');
const error = ref('');
const notice = ref('');
const requests = ref([]);

/** Variant id → Shopify availability, fetched lazily per product. */
const stock = ref({});

async function load() {
  if (!draftToken.value.trim()) {
    error.value = 'Enter the admin token first.';
    return;
  }
  save(draftToken.value);
  loading.value = true;
  error.value = '';
  notice.value = '';
  try {
    const response = await fetch('/api/admin/requests', {
      headers: { 'x-admin-token': token.value },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || 'Could not load the list.');
    }
    requests.value = payload.requests ?? [];
    await loadStock();
  } catch (err) {
    error.value = err.message;
    requests.value = [];
  } finally {
    loading.value = false;
  }
}

/** Checks Shopify so the button can say "available now" vs "still sold out". */
async function loadStock() {
  const handles = [...new Set(requests.value.map((row) => getProduct(row.productId)?.shopifyHandle).filter(Boolean))];
  const next = {};
  await Promise.all(
    handles.map(async (handle) => {
      try {
        const product = await fetchProductByHandle(handle);
        for (const variant of product?.variants?.nodes ?? []) {
          next[variant.id] = variant.availableForSale;
        }
      } catch {
        /* leave unknown — the button stays available either way */
      }
    }),
  );
  stock.value = next;
}

const groups = computed(() => {
  const map = new Map();
  for (const row of requests.value) {
    const key = row.variantId;
    if (!map.has(key)) {
      map.set(key, {
        variantId: key,
        productId: row.productId,
        productTitle: row.productTitle,
        variantTitle: row.variantTitle,
        emails: [],
        oldest: row.createdAt,
      });
    }
    const group = map.get(key);
    group.emails.push(row.email);
    if (row.createdAt < group.oldest) {
      group.oldest = row.createdAt;
    }
  }
  return [...map.values()].sort((a, b) => b.emails.length - a.emails.length);
});

const availableGroups = computed(() => groups.value.filter((group) => stock.value[group.variantId] === true));

async function notify(group) {
  notifying.value = group.variantId;
  error.value = '';
  notice.value = '';
  try {
    const response = await fetch('/api/admin/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-token': token.value },
      body: JSON.stringify({ variantId: group.variantId }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || 'Could not send the emails.');
    }
    const result = payload.results?.[0];
    notice.value = result
      ? `Sent ${result.sent} of ${result.waiting} email${result.waiting === 1 ? '' : 's'}${result.failed ? ` · ${result.failed} failed` : ''}.`
      : 'Done.';
    await load();
  } catch (err) {
    error.value = err.message;
  } finally {
    notifying.value = '';
  }
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
</script>

<template>
  <main class="admin-restock">
    <SiteHeader />
    <header class="admin-head">
      <p class="admin-eyebrow">Staff</p>
      <h1>Restock requests</h1>
      <p class="admin-lead">
        Shoppers who asked to be emailed when a sold-out item returns. When Shopify has stock again,
        press “Send the email” for that variant — everyone waiting gets one email, once.
      </p>

      <form class="admin-token" @submit.prevent="load">
        <label>
          <span>Admin token</span>
          <input v-model="draftToken" type="password" autocomplete="off" placeholder="ADMIN_TOKEN" />
        </label>
        <button type="submit" :disabled="loading">
          <Loader2 v-if="loading" :size="15" class="spin" aria-hidden="true" />
          <ShieldCheck v-else :size="15" aria-hidden="true" />
          {{ loading ? 'Loading…' : 'Load list' }}
        </button>
      </form>

      <p v-if="error" class="admin-error">{{ error }}</p>
      <p v-if="notice" class="admin-notice">{{ notice }}</p>
    </header>

    <section v-if="groups.length" class="admin-body">
      <div class="admin-summary">
        <p>
          <strong>{{ requests.length }}</strong> request{{ requests.length === 1 ? '' : 's' }}
          across <strong>{{ groups.length }}</strong> variant{{ groups.length === 1 ? '' : 's' }}.
          <template v-if="availableGroups.length">
            <span class="admin-ok">{{ availableGroups.length }} back in stock now.</span>
          </template>
        </p>
        <button type="button" class="admin-refresh" :disabled="loading" @click="load">
          <RefreshCw :size="14" aria-hidden="true" />
          Refresh
        </button>
      </div>

      <ul class="admin-groups">
        <li v-for="group in groups" :key="group.variantId" class="admin-group">
          <div class="admin-group-head">
            <div>
              <h2>{{ group.productTitle || group.productId }}</h2>
              <p class="admin-variant">
                {{ group.variantTitle && group.variantTitle !== 'Default Title' ? group.variantTitle : 'Default variant' }}
                · first request {{ formatDate(group.oldest) }}
              </p>
            </div>
            <span
              class="admin-badge"
              :class="stock[group.variantId] === true ? 'is-ok' : stock[group.variantId] === false ? 'is-out' : 'is-unknown'"
            >
              {{ stock[group.variantId] === true ? 'In stock now' : stock[group.variantId] === false ? 'Still sold out' : 'Stock unknown' }}
            </span>
          </div>

          <div class="admin-group-body">
            <p class="admin-count">{{ group.emails.length }} waiting</p>
            <ul class="admin-emails">
              <li v-for="email in group.emails.slice(0, 6)" :key="email">{{ email }}</li>
              <li v-if="group.emails.length > 6" class="admin-more">+{{ group.emails.length - 6 }} more</li>
            </ul>

            <button
              type="button"
              class="admin-send"
              :disabled="notifying === group.variantId"
              @click="notify(group)"
            >
              <Loader2 v-if="notifying === group.variantId" :size="14" class="spin" aria-hidden="true" />
              <BellRing v-else :size="14" aria-hidden="true" />
              {{ notifying === group.variantId ? 'Sending…' : `Send the email (${group.emails.length})` }}
            </button>
          </div>
        </li>
      </ul>
    </section>

    <p v-else-if="!loading && token" class="admin-empty">
      Nothing waiting right now — when someone asks for a restock it appears here.
    </p>
  </main>
</template>

<style scoped>
.admin-restock {
  width: min(1000px, calc(100% - 32px));
  margin: 0 auto;
  padding: 140px 0 100px;
}

.admin-eyebrow {
  margin: 0 0 10px;
  color: #75949a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-head h1 {
  margin: 0;
  color: #314e53;
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.admin-lead {
  max-width: 680px;
  margin: 14px 0 0;
  color: #4d666b;
  font-size: 15px;
  line-height: 1.6;
}

.admin-token {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
  margin-top: 24px;
}

.admin-token label {
  display: grid;
  gap: 6px;
  flex: 1 1 260px;
  font-size: 12.5px;
  font-weight: 700;
  color: #4d666b;
}

.admin-token input {
  min-height: 42px;
  padding: 0 13px;
  border: 1px solid rgba(49, 78, 83, 0.24);
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
}

.admin-token button,
.admin-refresh,
.admin-send {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
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
}

.admin-token button:disabled,
.admin-refresh:disabled,
.admin-send:disabled {
  opacity: 0.7;
  cursor: progress;
}

.admin-refresh {
  background: #fff;
  color: #314e53;
}

.admin-error {
  margin: 16px 0 0;
  color: #b4453c;
  font-weight: 700;
  font-size: 14px;
}

.admin-notice {
  margin: 16px 0 0;
  color: #2f6b4f;
  font-weight: 700;
  font-size: 14px;
}

.admin-body {
  margin-top: 34px;
}

.admin-summary {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 10px;
  background: #f7f4ef;
}

.admin-summary p {
  margin: 0;
  color: #3f5c62;
  font-size: 14px;
}

.admin-ok {
  color: #2f6b4f;
  font-weight: 800;
}

.admin-groups {
  display: grid;
  gap: 14px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.admin-group {
  border: 1px solid rgba(49, 78, 83, 0.12);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.admin-group-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(49, 78, 83, 0.08);
}

.admin-group-head h2 {
  margin: 0;
  color: #314e53;
  font-size: 16.5px;
  font-weight: 900;
}

.admin-variant {
  margin: 4px 0 0;
  color: #6c8a90;
  font-size: 12.5px;
  font-weight: 700;
}

.admin-badge {
  flex: 0 0 auto;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.admin-badge.is-ok {
  background: #e3f2e9;
  color: #2f6b4f;
}

.admin-badge.is-out {
  background: #fdecea;
  color: #b4453c;
}

.admin-badge.is-unknown {
  background: #f0efe9;
  color: #7d8a6b;
}

.admin-group-body {
  display: grid;
  gap: 10px;
  padding: 16px 18px 18px;
}

.admin-count {
  margin: 0;
  color: #4d666b;
  font-size: 13px;
  font-weight: 800;
}

.admin-emails {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.admin-emails li {
  padding: 4px 9px;
  border-radius: 6px;
  background: #f7f4ef;
  color: #3f5c62;
  font-size: 12.5px;
}

.admin-more {
  color: #7d959a;
  font-style: italic;
}

.admin-send {
  justify-self: start;
  margin-top: 4px;
}

.admin-empty {
  margin: 30px 0 0;
  color: #6c8a90;
  font-size: 14px;
}

.spin {
  animation: admin-spin 900ms linear infinite;
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
