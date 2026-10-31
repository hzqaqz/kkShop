<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

/**
 * Room-size calculator for the buying guide.
 *
 * It only uses figures Meower already publishes for the MW200 — a 400 m³/h
 * particle CADR, specified for rooms of roughly 20–40 m² — so the verdict can
 * never contradict the product page. The air-change figure is simply derived:
 * CADR ÷ (floor area × ceiling height).
 */
const CADR = 400;
const FIT_MIN = 20;
const FIT_MAX = 40;

const area = ref(25);
const height = ref(2.4);
const heights = [2.4, 2.7, 3.0];

const volume = computed(() => Math.round(area.value * height.value));
const airChanges = computed(() => (CADR / volume.value).toFixed(1));
const minutesPerAirChange = computed(() => Math.max(1, Math.round((volume.value / CADR) * 60)));

const verdict = computed(() => {
  const value = area.value;

  if (value <= FIT_MIN) {
    return {
      tone: 'good',
      label: 'Clears this room quickly',
      text: 'Smaller than the range the MW200 is specified for, so it will turn the air over fast. A lower fan speed is usually enough.',
    };
  }

  if (value <= FIT_MAX) {
    return {
      tone: 'good',
      label: 'Right in the MW200 range',
      text: 'This is the room size the MW200 is designed for — roughly 20–40 m².',
    };
  }

  if (value <= 55) {
    return {
      tone: 'warn',
      label: 'At the top edge',
      text: 'Workable, but the unit will be working hard. A second unit would keep the air cleaner at a lower, quieter speed.',
    };
  }

  return {
    tone: 'over',
    label: 'Beyond one unit',
    text: 'For a room this size we would suggest two units, or tell us the layout and we will suggest a setup.',
  };
});
</script>

<template>
  <section class="tool-card" aria-labelledby="guide-calculator-title">
    <header class="tool-head">
      <p class="tool-eyebrow">Try it — sizing calculator</p>
      <h2 id="guide-calculator-title">How big is the room it will live in?</h2>
      <p class="tool-lead">
        Move the slider to your room's floor area. We will show what a 400 m³/h purifier does in
        that space.
      </p>
    </header>

    <div class="calc-controls">
      <label class="calc-slider">
        <span class="calc-slider-label">
          Floor area
          <strong>{{ area }} m²</strong>
        </span>
        <input v-model.number="area" type="range" min="5" max="80" step="1" />
        <span class="calc-scale" aria-hidden="true"><span>5 m²</span><span>80 m²</span></span>
      </label>

      <div class="calc-heights" role="group" aria-label="Ceiling height">
        <span class="calc-heights-label">Ceiling height</span>
        <button
          v-for="option in heights"
          :key="option"
          type="button"
          class="calc-height-button"
          :class="{ 'is-active': height === option }"
          :aria-pressed="height === option"
          @click="height = option"
        >
          {{ option.toFixed(1) }} m
        </button>
      </div>
    </div>

    <dl class="calc-results" aria-live="polite">
      <div>
        <dt>Room volume</dt>
        <dd>{{ volume }} m³</dd>
      </div>
      <div>
        <dt>Air changes per hour</dt>
        <dd>{{ airChanges }}×</dd>
      </div>
      <div>
        <dt>A room's worth of filtered air</dt>
        <dd>every {{ minutesPerAirChange }} min</dd>
      </div>
    </dl>

    <p class="calc-verdict" :class="`calc-verdict--${verdict.tone}`">
      <strong>{{ verdict.label }}</strong>
      {{ verdict.text }}
    </p>

    <div class="tool-foot">
      <p class="tool-note">
        Calculated as 400 m³/h ÷ (floor area × ceiling height). The MW200 is specified for rooms
        of roughly 20–40 m².
      </p>
      <RouterLink class="tool-cta" :to="{ name: 'product-detail', params: { productId: 'mw200' } }">
        See the MW200
      </RouterLink>
    </div>
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

.calc-controls {
  margin-top: 22px;
}

.calc-slider {
  display: block;
}

.calc-slider-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: #334c51;
  font-size: 14px;
  font-weight: 700;
}

.calc-slider-label strong {
  color: #2c464c;
  font-size: 22px;
  font-weight: 900;
}

.calc-slider input {
  width: 100%;
  margin: 10px 0 2px;
  accent-color: #334c51;
}

.calc-scale {
  display: flex;
  justify-content: space-between;
  color: #6c8a90;
  font-size: 11.5px;
  font-weight: 700;
}

.calc-heights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 16px;
}

.calc-heights-label {
  margin-right: 4px;
  color: #334c51;
  font-size: 13px;
  font-weight: 700;
}

.calc-height-button {
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(51, 76, 81, 0.24);
  border-radius: 999px;
  background: #fff;
  color: #334c51;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.calc-height-button.is-active {
  border-color: #334c51;
  background: #334c51;
  color: #fef5ed;
}

.calc-results {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 22px 0 0;
}

.calc-results div {
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff;
}

.calc-results dt {
  color: #6c8a90;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.calc-results dd {
  margin: 4px 0 0;
  color: #2c464c;
  font-size: clamp(17px, 1.9vw, 22px);
  font-weight: 900;
  line-height: 1.15;
}

.calc-verdict {
  margin: 16px 0 0 !important;
  padding: 13px 16px;
  border-radius: 10px;
  background: #fff;
  color: #40595e !important;
  font-size: 14.5px !important;
  line-height: 1.55 !important;
}

.calc-verdict strong {
  display: block;
  margin-bottom: 3px;
  color: #2c464c;
  font-size: 15px;
}

.calc-verdict--good {
  border-left: 4px solid #5f9c86;
}

.calc-verdict--warn {
  border-left: 4px solid #c99a4a;
}

.calc-verdict--over {
  border-left: 4px solid #b3372f;
}

.tool-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
}

.tool-note {
  flex: 1 1 260px;
  margin: 0 !important;
  color: #6c8a90 !important;
  font-size: 12.5px !important;
  line-height: 1.5 !important;
}

.tool-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 20px;
  border-radius: 8px;
  background: #334c51;
  color: #fef5ed !important;
  font-size: 13.5px;
  font-weight: 800;
  text-decoration: none;
}

.tool-cta:hover {
  background: #5a7c85;
}

@media (max-width: 640px) {
  .calc-results {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
