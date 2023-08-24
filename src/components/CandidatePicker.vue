
<template>
	<div 
		class="c-candidatePicker" 
		:class="{ isEditMode }"
	>
		<!-- Custom candidate choices -->
		<div
			v-for="candidate in candidatePickerButtons"
			class="c-candidatePicker_buttonWrapper"
			:class="{ selected: selectedCandidateId === candidate.id }"
			:key="candidate.id" 
			@click="onChoiceClick(candidate.id)"
		>
			<CandidatePickerButton
				class="c-candidatePicker_candidateBtn"
				:candidateId="candidate.id"
				:isEditMode="isEditMode"
				:isSelected="selectedCandidateId === candidate.id"
				@delete-candidate="deletePickerButton"
			/>
		</div>

		<div
			v-show="!isMaxCandidateButtonsMet && isEditMode"
			class="c-candidatePicker_buttonWrapper"
			@click="addPickerButton"
		>
			<div class="c-candidatePicker_addBtn c-candidatePickerButton">
				+
			</div>
		</div>

		<div class="c-candidatePicker_tools">
			<div class="c-candidatePicker_edit"></div>

			<!-- "None" choice: To interact with visualizations without candidate selected -->
			<div
				class="c-candidatePicker_buttonWrapper"
				:class="{ selected: selectedCandidateId === noneChoiceId }"
				@click="onChoiceClick(noneChoiceId)"
			>
				<div class="c-candidatePicker_noneBtn c-candidatePickerButton">{{ $t('none') }}</div>
			</div>

			<!-- Edit button: To change candidate names -->
			<div 
				class="c-candidatePicker_edit" 
				@click="isEditMode = !isEditMode"
			>
				<div class="c-candidatePicker_editBtn c-candidatePickerButton"><EditIcon /></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUpdate, ref, Ref } from 'vue';
import { onBeforeRouteLeave } from "vue-router";

import EditIcon from '../assets/icons/edit.svg?component';
import CandidatePickerButton from './CandidatePickerButton.vue';

import { useCandidatesStore, ICandidate } from '../stores/candidates';
import { useStore } from '../stores/store';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const usStatesStore = useUsStatesStore();

const candidatePickerButtons: Ref<ICandidate[]> = ref([
	{ ...candidatesStore.getCandidateById(0) },
	{ ...candidatesStore.getCandidateById(1) },
	{ ...candidatesStore.getCandidateById(2) }
]);
const isEditMode: Ref<boolean> = ref(false);
const isFirstUpdateOnRouteChange: Ref<boolean> = ref(true);
const noneChoiceId: number = -1;

const candidates: Ref<ICandidate[]> = computed(() => {
	return candidatesStore.getCandidates;
});

const defaultCandidatePickerButtons: Ref<ICandidate[]> = computed(() => {
	const buttonComponents: ICandidate[] = [];
	candidates.value.forEach((candidate) => {
		if (candidate?.name) {
			buttonComponents.push(candidate);
		}
	});

	return buttonComponents;
});

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

onBeforeRouteLeave(async (to, from) => {
	// Reset flag before navigating to new route to track first onUpdate
	isFirstUpdateOnRouteChange.value = true;
})

onBeforeUpdate(() => {
	// Reset candidate buttons to new default if first onUpdate
	if (isFirstUpdateOnRouteChange.value) {
		isEditMode.value = false;
		candidatePickerButtons.value = defaultCandidatePickerButtons.value;
		isFirstUpdateOnRouteChange.value = false;
	}
})
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-candidatePicker {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: $standard-spacing;

	&_tools {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	&_buttonWrapper,
	&_edit {
		width: 200px;
		height: 40px;
		margin: 5px;
		border-radius: 20px;
		opacity: 0.8;

		@media (max-width: $screen-breakpoint-xs) {
			width: 174px;
			margin: 3px;
		}

		&:hover {
			opacity: 1;
		}

		&.selected {
			.c-candidatePicker_candidateBtn,
			.c-candidatePicker_noneBtn {
				border-color: $color-dark-grey;
			}
		}
	}

	&_edit {
		width: 40px;
	}

	&_addBtn,
	&_noneBtn,
	&_editBtn {
		cursor: pointer;
		padding: 8px 0;
		text-align: center;
		color: $background-color-base;
		background-color: $color-light-grey;
		font-weight: bold;
		width: 100%;
		border-radius: 25px;
	}

	&_addBtn {
		color: $color-light-grey;
		background-color: $background-color-base;
		border: 2px dashed $color-light-grey;

		&:hover {
			background-color: #f5f5f5;
		}
	}

	&_noneBtn,
	&_editBtn {
		border: 2px solid $background-color-base;
	}

	&_editBtn {
		height: 24px;
	}

	&.isEditMode {
		.c-candidatePicker_candidateBtn {
			border-color: $color-light-grey;
		}

		.c-candidatePicker_edit {
			opacity: 1;
		}

		.c-candidatePicker_editBtn {
			border-color: $color-dark-grey;
			color: $color-dark-grey;
		}

		.c-candidatePicker_noneBtn {
			border-color: $background-color-base;

			&:hover {
				cursor: default;
				opacity: 0.8;
			}
		}
	}

	.c-candidatePickerButton {
		@include pop-in(0.5);
		animation: popIn 250ms ease-in-out;
		transition: width 200ms ease-in-out;
	}
}
</style>