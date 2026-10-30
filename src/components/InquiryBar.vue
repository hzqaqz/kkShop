<script setup>
import { computed } from 'vue';
import { Mail } from 'lucide-vue-next';
import { quoteHref } from '../data/siteInfo';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
});

// The address lives in `siteInfo.js` (QUOTE_EMAIL) so every quote link on the
// site points at the same inbox.
const mailtoHref = computed(() => quoteHref(props.label));
</script>

<template>
  <div class="inquiry-bar" role="region" aria-label="Business inquiry">
    <div class="inquiry-bar-inner">
      <div class="inquiry-bar-copy">
        <strong>{{ label || 'Meower' }}</strong>
        <span>Wholesale &amp; project pricing available</span>
      </div>
      <a class="inquiry-bar-cta" :href="mailtoHref">
        <Mail aria-hidden="true" />
        Request a quote
      </a>
    </div>
  </div>
</template>

<style scoped>
.inquiry-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 253, 250, 0.92);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(51, 76, 81, 0.12);
  box-shadow: 0 -12px 30px rgba(20, 28, 30, 0.08);
}

.inquiry-bar-inner {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, 100%);
  margin: 0 auto;
}

.inquiry-bar-copy {
  min-width: 0;
}

.inquiry-bar-copy strong {
  display: block;
  margin-bottom: 2px;
  color: #21150f;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inquiry-bar-copy span {
  color: #5a7c85;
  font-size: 13px;
}

.inquiry-bar-cta {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 46px;
  padding: 0 22px;
  border-radius: 14px;
  background: #1e2e32;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.12s ease, background 0.12s ease;
}

.inquiry-bar-cta:hover {
  background: #162529;
  transform: translateY(-1px);
}

.inquiry-bar-cta svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .inquiry-bar-inner {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .inquiry-bar-copy strong {
    white-space: normal;
  }

  .inquiry-bar-cta {
    width: 100%;
  }
}
</style>
