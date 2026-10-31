<script setup>
import { computed, ref } from 'vue';

/**
 * Filter-grade comparison for the buying guide.
 *
 * Figures follow EN 1822 filter classification: E10–E12 are "EPA" grades,
 * H13/H14 are the grades that may be called HEPA. Efficiency is the minimum
 * capture at the most penetrating particle size (roughly 0.1–0.3 µm).
 */
const grades = [
  {
    id: 'e11',
    label: 'E11',
    capture: 95,
    captureLabel: '≥ 95%',
    hepa: false,
    note: 'Sold as "H11" by some brands. Fine for coarse dust, but too open for pet dander.',
  },
  {
    id: 'e12',
    label: 'E12',
    capture: 99.5,
    captureLabel: '≥ 99.5%',
    hepa: false,
    note: 'Also an EPA grade rather than true HEPA. Better, still not the standard to buy for.',
  },
  {
    id: 'h13',
    label: 'H13',
    capture: 99.95,
    captureLabel: '≥ 99.95%',
    hepa: true,
    note: 'The grade worth insisting on in a pet home — and the grade the MW200 uses.',
  },
  {
    id: 'h14',
    label: 'H14',
    capture: 99.995,
    captureLabel: '≥ 99.995%',
    hepa: true,
    note: 'Cleanroom grade. Excellent, but the extra cost rarely earns anything at home.',
  },
];

const activeId = ref('h13');
const active = computed(() => grades.find((grade) => grade.id === activeId.value) ?? grades[2]);

/** Bar width: 90% → 100% mapped across the bar so the differences stay visible. */
const barWidth = computed(() => `${((active.value.capture - 90) / 10) * 100}%`);
</script>

<template>
  <section class="tool-card" aria-labelledby="guide-grade-title">
    <header class="tool-head">
      <p class="tool-eyebrow">Try it — filter grades</p>
      <h2 id="guide-grade-title">What the grade on the box actually means</h2>
      <p class="tool-lead">Pick a grade to see how much of the fine particles it captures.</p>
    </header>

    <div class="grade-tabs" role="group" aria-label="Filter grade">
      <button
        v-for="grade in grades"
        :key="grade.id"
        type="button"
        class="grade-tab"
        :class="{ 'is-active': grade.id === activeId, 'is-hepa': grade.hepa }"
        :aria-pressed="grade.id === activeId"
        @click="activeId = grade.id"
      >
        {{ grade.label }}
        <span v-if="grade.hepa" class="grade-badge">HEPA</span>
      </button>
    </div>

    <div class="grade-panel" aria-live="polite">
      <p class="grade-capture">
        Captures <strong>{{ active.captureLabel }}</strong> of particles at the most penetrating
        size (≈0.1–0.3 µm)
      </p>

      <div class="grade-bar" aria-hidden="true">
        <span class="grade-bar-fill" :style="{ width: barWidth }" />
      </div>

      <p class="grade-note">{{ active.note }}</p>
    </div>

    <p class="tool-note">
      EN 1822 classification: E10–E12 are EPA grades; only H13 and H14 may be called HEPA.
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
  margin: 16px 0 0 !important;
  color: #6c8a90 !important;
  font-size: 12.5px !important;
  line-height: 1.5 !important;
}

.grade-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.grade-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(51, 76, 81, 0.24);
  border-radius: 999px;
  background: #fff;
  color: #334c51;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.grade-tab.is-active {
  border-color: #334c51;
  background: #334c51;
  color: #fef5ed;
}

.grade-badge {
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(95, 156, 134, 0.18);
  color: #3f7d68;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.grade-tab.is-active .grade-badge {
  background: rgba(254, 245, 237, 0.22);
  color: #fef5ed;
}

.grade-panel {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 10px;
  background: #fff;
}

.grade-capture {
  margin: 0 !important;
  color: #40595e !important;
  font-size: 14.5px !important;
  line-height: 1.55 !important;
}

.grade-capture strong {
  color: #2c464c;
  font-size: 16px;
}

.grade-bar {
  height: 10px;
  margin: 12px 0 0;
  border-radius: 999px;
  background: rgba(51, 76, 81, 0.12);
  overflow: hidden;
}

.grade-bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #8ba9a4, #334c51);
  transition: width 220ms ease;
}

.grade-note {
  margin: 12px 0 0 !important;
  color: #334c51 !important;
  font-size: 14px !important;
  line-height: 1.55 !important;
}
</style>
