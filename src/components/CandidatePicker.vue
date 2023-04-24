
<template>
	<div 
		class="c-candidatePicker" 
		:class="{ isEditMode }"
	>
		<!-- Custom candidate choices -->
		<div
			v-for="candidate in candidates"
			class="c-candidatePicker_choiceWrapper"
			:class="{ selected: selectedCandidateId === candidate.id }"
			:key="candidate.id" 
			@click="onChoiceClick(candidate.id)"
		>
			<div :class="`c-candidatePicker_choice item ${candidate.id}`">
				<input
					type="text" 
					v-model="candidate.name" 
					:placeholder="isEditMode ? '________' : 'Available Slot'" 
					:style="{ 'background-color': candidate.color }" :readonly="!isEditMode"
					maxlength="20"
				>
			</div>
		</div>

		<div class="c-candidatePicker_tools">
			<div class="c-candidatePicker_edit"></div>
			<!-- "None" choice: To interact with visualizations without candidate selected -->
			<div
				class="c-candidatePicker_choiceWrapper"
				:class="{ selected: selectedCandidateId === noneChoiceId }"
				@click="onChoiceClick(noneChoiceId)"
			>
				<div class="c-candidatePicker_choice itemNone noneBtn">None</div>
			</div>

			<!-- Edit button: To change candidate names -->
			<div 
				class="c-candidatePicker_edit" 
				@click="isEditMode = !isEditMode"
			>
				<div class="c-candidatePicker_choice itemNone editBtn"><EditIcon /></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import EditIcon from '../assets/icons/edit.svg?component';

import { useCandidatesStore } from '../stores/candidates';
import { useStore } from '../stores/store';

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const { candidates } = storeToRefs(candidatesStore);

const isEditMode: Ref<boolean> = ref(false);
const noneChoiceId: number = -1;

const selectedCandidateId: Ref<number> = computed(() => {
	return mainStore.getSelectedCandidateId.value;
});

function setSelectedCandidateId(id: number) {
	mainStore.setSelectedCandidateId(id);
}

function onChoiceClick(candidateId: number) {
	const newId = isEditMode.value ? selectedCandidateId.value : candidateId;
	setSelectedCandidateId(newId);
}
</script>

<style scoped>
.c-candidatePicker {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: var(--standard-spacing);
}

.c-candidatePicker_choiceWrapper,
.c-candidatePicker_edit {
	width: 200px;
	height: 40px;
	margin: 5px;
	border-radius: 20px;
	opacity: 0.8;
}

.c-candidatePicker_choiceWrapper:hover,
.c-candidatePicker_edit:hover,
.isEditMode .c-candidatePicker_edit {
	opacity: 1;
}

.c-candidatePicker_choice {
	width: 100%;
	border: 2px solid var(--base-background-color);
	border-radius: 25px;
}

.c-candidatePicker_choice.itemNone {
	padding: 8px 0;
	text-align: center;
	color: var(--base-background-color);
	background-color: var(--color-light-grey);
	font-weight: bold;
	cursor: pointer;
}

.selected .c-candidatePicker_choice {
	border-color: #333333;
}

.c-candidatePicker_tools {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.c-candidatePicker_choice.editBtn {
	height: 24px;
}

.c-candidatePicker_edit {
	width: 40px;
}

.isEditMode .c-candidatePicker_choice.item, 
.isEditMode .c-candidatePicker_choice.editBtn 
{
	border-color: var(--color-black);
}

.isEditMode .c-candidatePicker_choice.noneBtn {
	border-color: var(--base-background-color);
}

input {
	width: 180px;
	padding: 10px;
	color: var(--color-black);
	font-family: var(--standard-font-family);
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
	color: var(--color-dark-grey);
}
</style>