<script setup>
import { computed } from 'vue';
import { getProductOverview } from '../data/productOverview';

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const overview = computed(() => getProductOverview(props.productId));
</script>

<template>
  <section v-if="overview" class="product-overview" aria-labelledby="product-overview-title">
    <h2 id="product-overview-title">{{ overview.heading }}</h2>

    <div class="product-overview-copy">
      <p v-for="paragraph in overview.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </div>

    <div class="product-overview-columns">
      <div class="product-overview-block">
        <h3>Best suited to</h3>
        <ul>
          <li v-for="item in overview.bestFor" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="product-overview-block">
        <h3>Key specifications</h3>
        <dl class="product-spec-list">
          <div v-for="[label, value] in overview.specs" :key="label" class="product-spec-row">
            <dt>{{ label }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
