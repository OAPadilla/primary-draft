<template>
	<div class="c-rebalancerToolItem">
		<div class="c-rebalancerToolItem_name">
      {{ candidateName }}
    </div>

    <div class="c-rebalancerToolItem_sliderWrap">
      <RebalancerToolSlider 
        :candidateId="candidateId"
        :stateId="stateId"
      />
      <div class="c-rebalancerToolItem_percent">
        {{ percentageOfDelegates }}
      </div>
      <div class="c-rebalancerToolItem_delegates">
        {{ allocatedDelegates }} del.
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue';

import RebalancerToolSlider from "./RebalancerToolSlider.vue";

const props = defineProps({ 
  allocatedDelegates: { type: Number, default: 0 },
  candidateId: { type: Number, required: true },
  candidateName: { type: String, required: true },
  percentOfStateDel: { type: Number, default: 0 },
  stateId: { type: Number, required: true }
});

const percentageOfDelegates: Ref<string> = computed(() => {
  return `${(Number(props.percentOfStateDel * 100).toFixed(1)).toString()}%`;
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

.c-rebalancerToolItem_delegates, .c-rebalancerToolItem_percent {
	width: 5rem;
	right: auto;
	text-align: right;
}

@media (max-width: 512px) {
	.c-rebalancerToolItem {
		flex-direction: column;
	}

	.c-rebalancerToolItem_name {
		padding-bottom: 5px;
	}
}
</style>