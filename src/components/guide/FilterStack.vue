<script setup>
import { computed, ref } from 'vue';
import { Droplets, Filter, Layers, Wind } from 'lucide-vue-next';

/**
 * Three-stage filter stack for the buying guide.
 *
 * The layers, their order and their jobs match the WM200/MW200 filter stack
 * described on the product page: pre-filter → H13 HEPA → activated carbon.
 */
const stages = [
  {
    id: 'pre',
    name: 'Pre-filter',
    role: 'Hair and larger dust',
    icon: Filter,
    catches: ['Pet hair', 'Fur and fluff', 'Lint', 'Larger dust'],
    passes: 'Everything finer moves on to the H13 layer.',
    detail:
      'A coarse mesh that takes the visible material out before it reaches the fine media. In a pet home this is the layer that fills up first — which is the point: it is the cheapest part to clean, and it keeps the expensive media working.',
  },
  {
    id: 'h13',
    name: 'H13 HEPA',
    role: 'Fine particles',
    icon: Layers,
    catches: ['Pet dander', 'Pollen', 'Mould spores', 'Dust mite debris', 'Smoke particles'],
    passes: 'Gases and odours pass straight through — HEPA media cannot hold them.',
    detail:
      'Dense glass-fibre media that traps particles down to the most penetrating size, roughly 0.1–0.3 µm, at ≥99.95%. This is the layer that does the particle work, and the one where the grade actually matters.',
  },
  {
    id: 'carbon',
    name: 'Activated carbon',
    role: 'Odours and gases',
    icon: Wind,
    catches: ['Litter-box ammonia', 'Pet odours', 'Cooking smells', 'Cleaning fumes', 'VOCs'],
    passes: 'Nothing further to remove — the air returns to the room.',
    detail:
      'Porous carbon holds gas molecules on the surface of its pores instead of trapping particles. It is the only stage that removes smell, which is why a HEPA-only purifier can clean the air and still leave the room smelling of the cat.',
  },
];

const activeId = ref('h13');
const active = computed(() => stages.find((stage) => stage.id === activeId.value) ?? stages[1]);
</script>

<template>
  <section class="tool-card" aria-labelledby="guide-stack-title">
    <header class="tool-head">
      <p class="tool-eyebrow">Try it — the filter stack</p>
      <h2 id="guide-stack-title">What each layer catches</h2>
      <p class="tool-lead">
        Air passes through three layers in order. Pick one to see what it takes out — and what it
        lets through.
      </p>
    </header>

    <div class="stack-layout">
      <div class="stack">
        <p class="stack-flow stack-flow--in">
          <Droplets :size="14" aria-hidden="true" />
          Air in
        </p>

        <template v-for="(stage, index) in stages" :key="stage.id">
          <button
            type="button"
            class="stack-layer"
            :class="[`stack-layer--${stage.id}`, { 'is-active': stage.id === activeId }]"
            :aria-pressed="stage.id === activeId"
            aria-controls="guide-stack-detail"
            @click="activeId = stage.id"
          >
            <span class="stack-layer-icon" aria-hidden="true">
              <component :is="stage.icon" :size="18" />
            </span>
            <span class="stack-layer-copy">
              <span class="stack-layer-step">Layer {{ index + 1 }}</span>
              <span class="stack-layer-name">{{ stage.name }}</span>
              <span class="stack-layer-role">{{ stage.role }}</span>
            </span>
          </button>

          <p v-if="index < stages.length - 1" class="stack-arrow" aria-hidden="true">↓</p>
        </template>

        <p class="stack-flow stack-flow--out">
          <Wind :size="14" aria-hidden="true" />
          Clean air out
        </p>
      </div>

      <div id="guide-stack-detail" class="stack-detail" aria-live="polite">
        <p class="stack-detail-title">
          {{ active.name }}
          <span>{{ active.role }}</span>
        </p>

        <ul class="stack-chips" aria-label="What this layer removes">
          <li v-for="item in active.catches" :key="item">{{ item }}</li>
        </ul>

        <p class="stack-detail-passes">{{ active.passes }}</p>
        <p class="stack-detail-text">{{ active.detail }}</p>
      </div>
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

.stack-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(16px, 2.4vw, 28px);
  align-items: start;
  margin-top: 22px;
}

.stack {
  display: grid;
  gap: 6px;
}

.stack-flow {
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 0 !important;
  color: #6c8a90 !important;
  font-size: 11.5px !important;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stack-flow--out {
  margin-top: 2px !important;
}

.stack-arrow {
  margin: -2px 0 -2px !important;
  color: #9db4b8 !important;
  font-size: 14px !important;
  line-height: 1 !important;
  text-align: center;
}

.stack-layer {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 13px 16px;
  border: 1px solid rgba(51, 76, 81, 0.14);
  border-radius: 10px;
  background: #fff;
  color: #334c51;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.stack-layer:hover {
  transform: translateY(-1px);
}

.stack-layer.is-active {
  border-color: #334c51;
  box-shadow: 0 0 0 2px rgba(51, 76, 81, 0.14);
}

.stack-layer--pre {
  background: linear-gradient(180deg, #f6f2ea, #efe8dc);
}

.stack-layer--h13 {
  background: linear-gradient(180deg, #eef6f3, #e0efea);
}

.stack-layer--carbon {
  background: linear-gradient(180deg, #eef1f1, #e0e6e6);
}

.stack-layer-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.75);
  color: #3f5c62;
}

.stack-layer.is-active .stack-layer-icon {
  background: #334c51;
  color: #fef5ed;
}

.stack-layer-copy {
  display: grid;
  gap: 1px;
}

.stack-layer-step {
  color: #7d969b;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stack-layer-name {
  color: #2c464c;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.2;
}

.stack-layer-role {
  color: #5a7c85;
  font-size: 12px;
  font-weight: 700;
}

.stack-detail {
  padding: 18px 20px;
  border-radius: 12px;
  background: #fff;
}

.stack-detail-title {
  margin: 0 !important;
  color: #2c464c !important;
  font-size: 17px !important;
  font-weight: 900;
  line-height: 1.25;
}

.stack-detail-title span {
  display: block;
  margin-top: 2px;
  color: #6c8a90;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stack-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 14px 0 0 !important;
  padding: 0 !important;
  list-style: none;
}

.stack-chips li {
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(212, 235, 229, 0.8);
  color: #33555b;
  font-size: 12.5px;
  font-weight: 800;
}

.stack-detail-passes {
  margin: 14px 0 0 !important;
  padding: 9px 12px;
  border-left: 3px solid #b3a17a;
  border-radius: 6px;
  background: rgba(246, 242, 234, 0.85);
  color: #5c5340 !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
}

.stack-detail-text {
  margin: 12px 0 0 !important;
  color: #40595e !important;
  font-size: 13.5px !important;
  line-height: 1.6 !important;
}

@media (max-width: 760px) {
  .stack-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
