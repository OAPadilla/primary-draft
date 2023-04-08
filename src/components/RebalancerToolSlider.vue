<template>
	<div class="c-rebalancerToolSlider" :class="{ 'is-unallocated': isUnallocatedItem }">
		<input 
      type="range"
      v-model="sliderValue"
      :disabled="isUnallocatedItem || candidateId === null"
      min="0" 
      max="100"
      step="0.1"
      :style="{ 'background-color': candidateColor }"
      @input="onInput"
    >
    <div class="c-rebalancerToolSlider_percent">
      {{ formattedPercentage }}%
    </div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, Ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';

import { useCandidatesStore } from '../stores/candidates';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const usStatesStore = useUsStatesStore();
const { usStates } = storeToRefs(usStatesStore);

const props = defineProps({
  candidateId: { type: Number, default: null },
  initialValue: { type: Number, default: 0 },
  isUnallocatedItem: { type: Boolean, default: false },
  stateId: { type: Number, required: true }
});

const sliderValue = ref(props.initialValue);

watchEffect(() => {
  if (props.isUnallocatedItem) {
    // make this logic in a separate function?
    const unallocatedDel = usStatesStore.getStateUnallocatedDelegates(props.stateId);
    const totalDel = usStatesStore.getStateTotalDelegates(props.stateId);
    sliderValue.value = (unallocatedDel / totalDel) * 100;
  }
})

const delegates: Ref<number> = computed(() => {
  return Math.floor((sliderValue.value / 100) * usStatesStore.getStateTotalDelegates(props.stateId));
});

const formattedPercentage = computed(() => {
  return Number(sliderValue.value).toFixed(1);
});

const candidateColor = computed(() => {
  if (props.candidateId == null) {
    return null;
  }

  return candidatesStore.getCandidateColor(props.candidateId);
});

const unallocatedPercentage = computed(() => {
  const unallocatedDel = usStatesStore.getStateUnallocatedDelegates(props.stateId);
  const totalDel = usStatesStore.getStateTotalDelegates(props.stateId);
  return (unallocatedDel / totalDel) * 100;
});

const maxSliderValue = computed(() => {
  return props.initialValue + unallocatedPercentage.value;
});

function onInput(event: any) {
  if (props.candidateId !== null) {
    // TODO: have to use allocation type rules

    // Limit slider to max what is available to allocate
    const value = parseInt(event.target.value);
    if (value > maxSliderValue.value) {
      sliderValue.value = maxSliderValue.value;
    }

    usStatesStore.updateCandidateDelegates(props.candidateId, props.stateId, delegates.value);
  }
};
</script>
  
<style scoped>
.c-rebalancerToolSlider {
	display: flex;
	width: 100%;
	min-height: 25px;
	align-items: center;
}

.c-rebalancerToolSlider_percent {
	width: 5rem;
	text-align: right;
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
  width: 5px;
  height: 14px;
  background: #000000;
  cursor: pointer;
}

/* TODO: Test this in ff */
.c-rebalancerToolSlider input::-moz-range-thumb { 
  width: 6px;
  height: 16px;
  background: #000000;
  cursor: pointer;
}

.c-rebalancerToolSlider.is-unallocated input:hover {
  opacity: initial;
}

.c-rebalancerToolSlider.is-unallocated {
  pointer-events: none;
}

.c-rebalancerToolSlider.is-unallocated input::-webkit-slider-thumb {
  height: 5px;
  cursor: default
}

</style>