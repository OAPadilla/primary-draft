<template>
	<div class="c-rebalancerToolItem">
		<div class="c-rebalancerToolItem_name">
      {{ label }}
    </div>

    <div class="c-rebalancerToolItem_sliderWrap">
      <RebalancerToolSlider 
        :candidate-id="candidateId"
        :initial-value="percentOfStateDel"
        :is-unallocated-item="isUnallocatedItem"
        :min-threshold="minThreshold"
        :state-id="stateId"
        :wta-threshold="wtaThreshold"
      />
      <div class="c-rebalancerToolItem_delegates">
        {{ $t('numDelegatesAbbr', { num: allocatedDelegates }) }}
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import RebalancerToolSlider from "./RebalancerToolSlider.vue";

defineProps({ 
  allocatedDelegates: { type: Number, default: 0 },
  candidateId: { type: Number, default: null },
  isUnallocatedItem: { type: Boolean, default: false },
  label: { type: String, default: '' },
  minThreshold: { type: Number, default: null },
  percentOfStateDel: { type: Number, default: 0 },
  stateId: { type: Number, required: true },
  wtaThreshold: { type: Number, default: null }
});
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-rebalancerToolItem {
  display: flex;
	padding-top: 10px;

  &_name {
    width: 15rem;
  }

  &_sliderWrap {
    display: flex;
    width: 100%;
  }

  &_delegates {
    width: 6rem;
    right: auto;
    text-align: right;
  }

  @media (max-width: $screen-breakpoint-sm) {
    flex-direction: column;

    &_name {
      padding-bottom: 5px;
    }
  }
}
</style>