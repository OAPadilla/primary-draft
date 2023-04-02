<template>
	<div class="c-rebalancerToolSlider">
		<input 
      type="range"
      v-model="sliderValue"
      min="1" 
      max="100"
    >
	</div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useCandidatesStore } from '../stores/candidates';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const usStatesStore = useUsStatesStore();
const { candidates } = storeToRefs(candidatesStore);
const { usStates } = storeToRefs(usStatesStore);

const allocatedPercentage = ref(0);

const props = defineProps({
  candidateId: { type: Number, default: null },
  defaultValue: { type: String, default: '0' },
  stateId: { type: Number, required: true }
});

const initialValue = computed(() => {
  return (Number(delegates) / usStates.value[props.stateId].totalDelegates * 100).toFixed(1);
});

const delegates: Ref<number> = computed(() => {
  return usStates.value[props.stateId].results[props.candidateId].delegates;
});

const sliderValue = computed(() => {
  return initialValue;
});

// Default value set to that of whats in store. Use state id to get state. Use candidate id to get value from results in state store.
// When slider moves, update the candidate delegate count in usState store. Formula is % of total delegates.
// Add limitations on slider based on whats available for a state.
// usStore should handle updating candidate store with new total delegate count.


</script>
  
<style scoped>
.c-rebalancerToolSlider {
	display: flex;
	width: 100%;
	min-height: 25px;
	align-items: center;
}

.c-rebalancerToolSlider input {
	-webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
	padding: 0;
}

.c-rebalancerToolSlider input:hover {
  opacity: 1;
}

.c-rebalancerToolSlider input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 6px;
  height: 16px;
  background: black;
  cursor: pointer;
}

/* TODO: Test this in ff */
.c-rebalancerToolSlider input::-moz-range-thumb { 
  width: 6px;
  height: 16px;
  background: black;
  cursor: pointer;
}
</style>