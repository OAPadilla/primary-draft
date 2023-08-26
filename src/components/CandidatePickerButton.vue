
<template>
	<div
        class="c-candidatePickerButton"
        :class="{ isEditMode, 'selected': isSelected }"
    >
        <input
            type="text" 
            v-model.trim="candidates[candidateId].name" 
            :placeholder="placeholder"
            :readonly="!isEditMode"
            :style="{ 'background-color': candidateColor }" 
            maxlength="20"
        >

        <div
            v-show="isEditMode"
            class="c-candidatePickerButton_delete"
            @click="deleteCandidate"
        >
            <XCircleIcon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue';

import XCircleIcon from '../assets/icons/x-circle.svg?component';

import { useCandidatesStore, ICandidate } from '../stores/candidates';

const candidatesStore = useCandidatesStore();

const emit = defineEmits<{
  (e: 'deleteCandidate', candidateId: number): void
}>();

const props = defineProps({ 
    candidateId: { type: Number, default: -1 },
    isEditMode: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false }
});

const candidates: Ref<ICandidate[]> = computed(() => {
    return candidatesStore.getCandidates;
});

const candidateColor: Ref<string> = computed(() => {
    return candidatesStore.getCandidateColor(props.candidateId);
});

const placeholder: Ref<string> = computed(() => {
    return props.isEditMode ? '_____' : 'Available Slot';
});

function deleteCandidate(): void {
    emit('deleteCandidate', props.candidateId);
}
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-candidatePickerButton {
    position: relative;
	width: 100%;
	border: 2px solid $background-color-base;
	border-radius: 25px;

    &_delete {
        cursor: pointer;
        position: absolute;
        right: -5px;
        top: -5px;

        svg {
            width: 23px;
            height: 23px;
            fill: $background-color-base;
        }
    }

    input {
        cursor: pointer;
        width: 180px;
        padding: 10px;
        color: $color-black;
        font-family: $standard-font-family;
        font-size: 16px;
        text-align: center;
        border: 0;
        border-radius: 20px;
        outline: none;
        text-overflow: ellipsis;

        @media (max-width: $screen-breakpoint-xs) {
            width: 154px;
        }
    }

    input::placeholder {
        font-weight: lighter;
    }

    &.isEditMode input {
        color: $color-dark-grey;
    }

    &.selected input {
        @media (min-width: $screen-breakpoint-xs) {
            font-weight: bold;
        }
    }
}
</style>