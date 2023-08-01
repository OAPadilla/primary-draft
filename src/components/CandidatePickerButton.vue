
<template>
	<div :class="`c-candidatePickerButton item ${candidateId}`">
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
            <TrashIcon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import TrashIcon from '../assets/icons/x-circle.svg?component';

import { useCandidatesStore } from '../stores/candidates';

const candidatesStore = useCandidatesStore();
const { candidates } = storeToRefs(candidatesStore);

const emit = defineEmits(['delete-candidate'])

const props = defineProps({ 
    candidateId: { type: Number, default: -1 },
    isEditMode: { type: Boolean, default: false }
});

const candidateColor: Ref<string> = computed(() => {
    return candidatesStore.getCandidateColor(props.candidateId);
});

const placeholder: Ref<string> = computed(() => {
    return props.isEditMode ? '_ _ _ _ _' : 'Available Slot';
});

function deleteCandidate(): void {
    emit('delete-candidate', props.candidateId);
}
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-candidatePickerButton {
    position: relative;
	width: 100%;
	border: 2px solid $base-background-color;
	border-radius: 25px;

    &_delete {
        cursor: pointer;
        position: absolute;
        right: -5px;
        top: -5px;

        svg {
            width: 23px;
            height: 23px;
            fill: $base-background-color;
        }
    }
}

.c-candidatePickerButton.itemNone {
	padding: 8px 0;
	text-align: center;
	color: $base-background-color;
	background-color: $color-light-grey;
	font-weight: bold;
	cursor: pointer;
}

.selected .c-candidatePickerButton {
	border-color: $color-black;
}

.c-candidatePicker_tools {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.c-candidatePickerButton.editBtn {
	height: 24px;
}

.c-candidatePicker_edit {
	width: 40px;
}

.isEditMode .c-candidatePickerButton.item, 
.isEditMode .c-candidatePickerButton.editBtn 
{
	border-color: $color-dark-grey;
}

.isEditMode .c-candidatePickerButton.noneBtn {
	border-color: $base-background-color;
}

input {
	width: 180px;
	padding: 10px;
	color: $color-black;
	font-family: $standard-font-family;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	border: 0;
	border-radius: 20px;
	outline: none;
	cursor: pointer;
}

input::placeholder {
	font-weight: lighter;
}

.isEditMode input {
	color: $color-dark-grey;
}


</style>