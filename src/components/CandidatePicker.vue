
<template>
	<div 
		class="c-candidatePicker" 
		:class="{ isEditMode }"
	>
		<!-- Custom candidate choices -->
		<div
			v-for="candidate in candidatePickerButtons"
			class="c-candidatePickerButtonWrapper"
			:class="{ selected: selectedCandidateId === candidate.id }"
			:key="candidate.id" 
			@click="onChoiceClick(candidate.id)"
		>
			<CandidatePickerButton
				:candidateId="candidate.id"
				:isEditMode="isEditMode"
				@delete-candidate="deletePickerButton"
			/>
		</div>

		<div
			v-show="!isMaxCandidateButtonsMet && isEditMode"
			class="c-candidatePickerButtonWrapper"
			@click="addPickerButton"
		>
			<div class="c-candidatePickerButton itemNone itemAdd">
				+
			</div>
		</div>

		<div class="c-candidatePicker_tools">
			<div class="c-candidatePicker_edit"></div>
			<!-- "None" choice: To interact with visualizations without candidate selected -->
			<div
				class="c-candidatePickerButtonWrapper"
				:class="{ selected: selectedCandidateId === noneChoiceId }"
				@click="onChoiceClick(noneChoiceId)"
			>
				<div class="c-candidatePickerButton itemNone noneBtn">None</div>
			</div>

			<!-- Edit button: To change candidate names -->
			<div 
				class="c-candidatePicker_edit" 
				@click="isEditMode = !isEditMode"
			>
				<div class="c-candidatePickerButton itemNone editBtn"><EditIcon /></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import EditIcon from '../assets/icons/edit.svg?component';
import CandidatePickerButton from './CandidatePickerButton.vue';

import { useCandidatesStore, ICandidate } from '../stores/candidates';
import { useStore } from '../stores/store';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const usStatesStore = useUsStatesStore();
const { candidates } = storeToRefs(candidatesStore);

const candidatePickerButtons: Ref<ICandidate[]> = ref([
	{ ...candidates.value[0] },
	{ ...candidates.value[1] },
	{ ...candidates.value[2] }
]);
const isEditMode: Ref<boolean> = ref(false);
const noneChoiceId: number = -1;

const isMaxCandidateButtonsMet: Ref<boolean> = computed(() => {
	return candidatePickerButtons.value.length === candidates.value.length;
});

const selectedCandidateId: Ref<number> = computed(() => {
	return mainStore.getSelectedCandidateId;
});

function addPickerButton(): void {
	if (candidatePickerButtons.value.length < candidates.value.length) {
		// Get array of candidate ids that aren't currently assigned to a button
		const unassignedCandidateIds = [...Array(candidates.value.length).keys()]
			.filter( i => !candidatePickerButtons.value.find( c => c.id == i));

		// Create a new candidate picker button with the first available unassigned candidate id
		const candidate: ICandidate = candidates.value[unassignedCandidateIds[0]];
		candidatePickerButtons.value.push({ ...candidate });
	}
}

function deletePickerButton(candidateId: number): void {
	console.log(candidateId);

	// Unassign candidate id by clearing its results and name 
	usStatesStore.resetAllResultsForCandidate(candidateId);
	candidatesStore.setCandidateName(candidateId, '');

	// Remove from component array
	const componentIdx = candidatePickerButtons.value.findIndex((c: ICandidate)  => c.id === candidateId);
	candidatePickerButtons.value.splice(componentIdx, 1);
}

function setSelectedCandidateId(id: number): void {
	mainStore.setSelectedCandidateId(id);
}

function onChoiceClick(candidateId: number): void {
	const newId: number = isEditMode.value ? selectedCandidateId.value : candidateId;
	setSelectedCandidateId(newId);
}
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-candidatePicker {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: $standard-spacing;
}

.c-candidatePickerButtonWrapper,
.c-candidatePicker_edit {
	width: 200px;
	height: 40px;
	margin: 5px;
	border-radius: 20px;
	opacity: 0.8;
}

.c-candidatePickerButtonWrapper:hover,
.c-candidatePicker_edit:hover,
.isEditMode .c-candidatePicker_edit {
	opacity: 1;
}

.c-candidatePickerButton {
	width: 100%;
	border: 2px solid $base-background-color;
	border-radius: 25px;
}

.c-candidatePickerButton.itemNone,
.c-candidatePickerButton.itemAdd {
	padding: 8px 0;
	text-align: center;
	color: $base-background-color;
	background-color: $color-light-grey;
	font-weight: bold;
	cursor: pointer;
}

.c-candidatePickerButton.itemAdd {
	color: $color-light-grey;
	background-color: $base-background-color;
	border: 2px dashed $color-light-grey;

	&:hover {
		background-color: #f5f5f5;
	}
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

.isEditMode input {
	color: $color-dark-grey;
}
</style>