<script setup>
import { computed, ref } from 'vue';

/**
 * Noise-level slider for the buying guide.
 *
 * The MW200 band (36–50 dB(A)) comes from the product page; the everyday
 * references are deliberately approximate so the slider reads as a comparison
 * rather than a measurement.
 */
const MW200_MIN = 36;
const MW200_MAX = 50;

const level = ref(45);

const references = [
  { db: 30, label: 'Whisper' },
  { db: 40, label: 'Quiet library' },
  { db: 50, label: 'Quiet office' },
  { db: 60, label: 'Conversation' },
  { db: 70, label: 'Vacuum cleaner' },
];

const nearest = computed(() =>
  references.reduce((best, item) =>
    Math.abs(item.db - level.value) < Math.abs(best.db - level.value) ? item : best,
  ),
);

const inRange = computed(() => level.value >= MW200_MIN && level.value <= MW200_MAX);
const bedroomFriendly = computed(() => level.value < 40);
const markerLeft = computed(() => `${((level.value - 20) / 60) * 100}%`);
const bandLeft = computed(() => `${((MW200_MIN - 20) / 60) * 100}%`);
const bandWidth = computed(() => `${((MW200_MAX - MW200_MIN) / 60) * 100}%`);

const summary = computed(() => {
  if (bedroomFriendly.value) {
    return 'Quieter than a library — the kind of level a purifier can run at overnight in a bedroom.';
  }
  if (inRange.value) {
    return 'Inside the MW200’s range: fine for living areas, and still quiet enough to hold a conversation.';
  }
  return 'Loud enough to notice. A pet sharing that room will notice it too — this is above what the MW200 produces.';
});
</script>

<template>
  <section class="tool-card" aria-labelledby="guide-noise-title">
    <header class="tool-head">
      <p class="tool-eyebrow">Try it — noise</p>
      <h2 id="guide-noise-title">How loud is that, really?</h2>
      <p class="tool-lead">Drag to a level and compare it with everyday sounds.</p>
    </header>

    <label class="noise-slider">
      <span class="noise-slider-label">
        Noise level
        <strong>{{ level }} dB(A)</strong>
      </span>
      <input v-model.number="level" type="range" min="20" max="80" step="1" />
    </label>

    <div class="noise-scale" aria-hidden="true">
      <span class="noise-band" :style="{ left: bandLeft, width: bandWidth }" />
      <span class="noise-marker" :style="{ left: markerLeft }" />
      <span
        v-for="item in references"
        :key="item.db"
        class="noise-tick"
        :class="`noise-tick--${item.db}`"
        :style="{ left: `${((item.db - 20) / 60) * 100}%` }"
      >
        <span class="noise-tick-dot" />
        <span class="noise-tick-label">{{ item.label }}<em>{{ item.db }}</em></span>
      </span>
    </div>

    <div class="noise-summary" aria-live="polite">
      <p class="noise-summary-main">
        {{ level }} dB(A) sits closest to: <strong>{{ nearest.label.toLowerCase() }}</strong>
        <span class="noise-band-note" :class="{ 'is-inside': inRange }">
          {{ inRange ? 'Inside the MW200 range (36–50 dB(A))' : 'Outside the MW200 range (36–50 dB(A))' }}
        </span>
      </p>
      <p class="noise-summary-text">{{ summary }}</p>
    </div>

    <p class="tool-note">
      MW200 figures: 36–50 dB(A) across four fan speeds. References are approximate.
    </p>
  </section>
</template>

<style scoped>
.tool-card {
  margin: 40px 0;
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid rgba(51, 76, 81, 0.16);
  border-radius: 14px;
  background: rgba(212, 235, 229, 0.34);
}

.tool-head h2 {
  margin: 8px 0 0;
  color: #2c464c;
  font-size: clamp(20px, 2.1vw, 27px);
  font-weight: 900;
  line-height: 1.15;
}

.tool-eyebrow {
  margin: 0;
  color: #5a7c85;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tool-lead {
  margin: 10px 0 0 !important;
  color: #40595e !important;
  font-size: 15px !important;
  line-height: 1.55 !important;
}

.tool-note {
  margin: 18px 0 0 !important;
  color: #6c8a90 !important;
  font-size: 12.5px !important;
  line-height: 1.5 !important;
}

.noise-slider {
  display: block;
  margin-top: 20px;
}

.noise-slider-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: #334c51;
  font-size: 14px;
  font-weight: 700;
}

.noise-slider-label strong {
  color: #2c464c;
  font-size: 22px;
  font-weight: 900;
}

.noise-slider input {
  width: 100%;
  margin: 10px 0 0;
  accent-color: #334c51;
}

.noise-scale {
  position: relative;
  height: 74px;
  margin: 18px 0 0;
}

.noise-scale::before {
  position: absolute;
  top: 12px;
  right: 0;
  left: 0;
  height: 6px;
  border-radius: 999px;
  background: rgba(51, 76, 81, 0.14);
  content: '';
}

.noise-band {
  position: absolute;
  top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(95, 156, 134, 0.55);
}

.noise-marker {
  position: absolute;
  top: 4px;
  width: 3px;
  height: 22px;
  border-radius: 2px;
  background: #334c51;
  transform: translateX(-50%);
  transition: left 200ms ease;
}

.noise-tick {
  position: absolute;
  top: 6px;
  transform: translateX(-50%);
}

.noise-tick-dot {
  display: block;
  width: 7px;
  height: 7px;
  margin: 0 auto;
  border-radius: 50%;
  background: #7d9a9f;
}

.noise-tick-label {
  display: block;
  margin-top: 26px;
  color: #55737a;
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
}

.noise-tick-label em {
  display: block;
  color: #8aa3a8;
  font-style: normal;
  font-weight: 800;
}

.noise-summary {
  margin-top: 6px;
  padding: 14px 16px;
  border-radius: 10px;
  background: #fff;
}

.noise-summary-main {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 0 !important;
  color: #40595e !important;
  font-size: 14.5px !important;
  line-height: 1.5 !important;
}

.noise-summary-main strong {
  color: #2c464c;
}

.noise-band-note {
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(179, 55, 47, 0.12);
  color: #a03a33;
  font-size: 11.5px;
  font-weight: 800;
}

.noise-band-note.is-inside {
  background: rgba(95, 156, 134, 0.16);
  color: #3f7d68;
}

.noise-summary-text {
  margin: 8px 0 0 !important;
  color: #334c51 !important;
  font-size: 14px !important;
  line-height: 1.55 !important;
}

@media (max-width: 640px) {
  /* Five labels do not fit across a phone: keep the outer three. */
  .noise-tick--40,
  .noise-tick--60 {
    display: none;
  }

  .noise-tick-label {
    font-size: 10px;
  }

  .noise-scale {
    height: 82px;
  }
}
</style>
