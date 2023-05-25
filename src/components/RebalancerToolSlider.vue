<template>
	<div
    class="c-rebalancerToolSlider" 
    :class="{ 'c-rebalancerToolSlider_unallocated': isUnallocatedItem }"
    :style="cssVars"
  >
    <div class="c-rebalancerToolSlider_lines">
      <div
        v-if="minThreshold" 
        class="c-rebalancerToolSlider_minLine"
      >
        {{ isUnallocatedItem ? '&le;' : '' }}
      </div>
      <div
        v-if="wtaThreshold"
        class="c-rebalancerToolSlider_wtaLine"
      >
        <RibbonIcon v-if="isUnallocatedItem" />
      </div>
    </div>
    <input 
      type="range"
      v-model="sliderValue"
      :class="{ 'isZero': isUnallocatedItem && sliderValue <= 0 }"
      :disabled="isUnallocatedItem || candidateId === null"
      min="0" 
      max="100"
      step="0.1"
      :style="candidateColor ? { 'background-color': candidateColor } : {}"
      @input="onInput"
    >
    <div class="c-rebalancerToolSlider_percent">
      {{ formattedPercentage }}%
    </div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, ComputedRef, Ref } from 'vue';

import RibbonIcon from '../assets/icons/ribbon-star.svg?component';
import { useCandidatesStore } from '../stores/candidates';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const usStatesStore = useUsStatesStore();

const props = defineProps({
  candidateId: { type: Number, default: null },
  initialValue: { type: Number, default: 0 },
  isUnallocatedItem: { type: Boolean, default: false },
  minThreshold: { type: Number, default: null },
  stateId: { type: Number, required: true },
  wtaThreshold: { type: Number, default: null }
});

const sliderValue: Ref<number> = ref(props.initialValue);

watchEffect(() => {
  // Update slider to value based on selected us state reactively
  if (props.isUnallocatedItem) {
    sliderValue.value = usStatesStore.getStateUnallocatedPercentage(props.stateId);
  } else if (props.candidateId !== null) {
    sliderValue.value = usStatesStore.getCandidatePercentage(props.candidateId, props.stateId);
  }
})

const candidateColor: Ref<string|null> = computed(() => {
  if (props.candidateId == null) {
    return null;
  }

  return candidatesStore.getCandidateColor(props.candidateId);
});

const cssVars = computed(() => {
  return { 
    '--min-threshold': props.minThreshold ? props.minThreshold + '%' : '',
    '--wta-trigger': props.wtaThreshold ? props.wtaThreshold + '%' : ''
  };
});

const formattedPercentage: ComputedRef<string> = computed(() => {
  return Number(sliderValue.value).toFixed(1);
});

const maxSliderValue: ComputedRef<number> = computed(() => {
  return props.initialValue + usStatesStore.getStateUnallocatedPercentage(props.stateId);
});

function onInput(): void {
  if (props.candidateId !== null) {
    // Limit slider to max what is available to allocate
    if (sliderValue.value > maxSliderValue.value) {
      sliderValue.value = maxSliderValue.value;
    }

    usStatesStore.updateCandidatePercentage(props.candidateId, props.stateId, sliderValue.value);
  }
};
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-rebalancerToolSlider {
  $percent-width: 5rem;

  position: relative;
	display: flex;
	width: 100%;
	min-height: 25px;
	align-items: center;

  &_percent {
    width: $percent-width;
    text-align: right;
  }

  input {
    -webkit-appearance: none;
    width: 100%;
    height: 5px;
    background-color: $color-light-grey;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
    padding: 0;
    transition: opacity 200ms ease-in-out;

    &:hover {
      opacity: 1;
    }

    &::-webkit-slider-thumb {
      z-index: 99;
      -webkit-appearance: none;
      position: relative;
      appearance: none;
      width: 5px;
      height: 14px;
      background-color: $color-black;
      cursor: pointer;
    }

    &::-moz-range-thumb { 
      width: 6px;
      height: 16px;
      background-color: $color-black;
      cursor: pointer;
    }

    &.isZero {
      @include vertical-shake(1px);
      animation: verticalShake 200ms ease-in-out;
      transition: opacity 200ms ease-in-out;
      opacity: 1;
    }
  }

  &_unallocated {
    pointer-events: none;

    input {
      &:hover {
        opacity: initial;
      }

      &::-webkit-slider-thumb {
        height: 5px;
        cursor: default;
      }
    }
  }

  &_unallocated &_minLine {
    border: none;
		left: -4px;
    top: 12px;
    color: $color-light-grey;
  }

  &_unallocated &_wtaLine {
    border: none;
    left: -8px;
    top: 16px;

    svg {
      fill: $color-dark-grey;
    }
  }

  &_lines {
    z-index: 9;
    position: absolute;
    display: flex;
    width: calc(100% - $percent-width);
    top: 0;
    margin-left: 5px;
    pointer-events: none;
  }

  &_minLine {
    position: absolute;
    height: 25px;
    margin-left: var(--min-threshold);
    border-left: 2px dashed $color-light-grey;
  }

  &_wtaLine {
    position: absolute;
    height: 25px;
    margin-left: var(--wta-trigger);
    border-left: 2px dashed $color-dark-grey;
  }
}
</style>