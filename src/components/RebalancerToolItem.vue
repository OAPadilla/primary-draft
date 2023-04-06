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
        :state-id="stateId"
      />
      <div class="c-rebalancerToolItem_delegates">
        {{ allocatedDelegates }} del.
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
  percentOfStateDel: { type: Number, default: 0 },
  stateId: { type: Number, required: true }
});
</script>
  
<style scoped>
.c-rebalancerToolItem {
  display: flex;
	padding-top: 10px;
}

.c-rebalancerToolItem_name {
	width: 15rem;
}

.c-rebalancerToolItem_sliderWrap {
  display: flex;
  width: 100%;
}

.c-rebalancerToolItem_delegates {
	width: 5rem;
	right: auto;
	text-align: right;
}

@media (max-width: 700px) {
	.c-rebalancerToolItem {
		flex-direction: column;
	}

	.c-rebalancerToolItem_name {
		padding-bottom: 5px;
	}
}
</style>