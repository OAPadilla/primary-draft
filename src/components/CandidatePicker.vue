
<template>
	<div 
		class="c-candidatePicker" 
		:class="{ isEditMode }"
	>
		<!-- Custom candidate choices -->
		<div
			v-for="candidate in candidates"
			class="c-candidatePicker_choiceWrapper"
			:class="{ selected: state.selectedCand === candidate.id }"
			:key="candidate.id" 
			@click="state.selectedCand = isEditMode ? state.selectedCand : candidate.id"
		>
			<div :class="`c-candidatePicker_choice item ${candidate.id}`">
				<input
					type="text" 
					v-model="candidate.name" 
					:placeholder="isEditMode ? '________' : 'Available Slot'" 
					:style="{'background-color': candidate.color}" :readonly="!isEditMode"
				>
			</div>
		</div>

		<div class="c-candidatePicker_tools">
			<div class="c-candidatePicker_edit"></div>
			<!-- TODO: Make button components -->
			<!-- "None" choice: To interact with visualizations without candidate selected -->
			<div
				class="c-candidatePicker_choiceWrapper"
				:class="{ selected: state.selectedCand === -1 }"
				@click="state.selectedCand = isEditMode ? state.selectedCand : -1"
			>
				<div class="c-candidatePicker_choice itemNone noneBtn">None</div>
			</div>

			<!-- Edit button: To change candidate names -->
			<div 
				class="c-candidatePicker_edit" 
				@click="isEditMode = !isEditMode"
			>
				<div class="c-candidatePicker_choice itemNone editBtn">Edit</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useCandidatesStore } from '../stores/candidates';

const candidatesStore = useCandidatesStore();
const { candidates } = storeToRefs(candidatesStore);

const isEditMode: Ref<boolean> = ref(false);

// Reactive object to keep track of the selected candidate's id
const state = reactive({
	selectedCand: -1
});
</script>

<style scoped>
.c-candidatePicker {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 20px;
}

.c-candidatePicker_choiceWrapper, .c-candidatePicker_edit {
	width: 200px;
	height: 40px;
	margin: 6px;
	border-radius: 20px;
}

.c-candidatePicker_choice {
	width: 100%;
	border: 3px solid #FFFFFF;
	border-radius: 25px;
}

.c-candidatePicker_choice.itemNone {
	padding: 8px 0;
	text-align: center;
	color: #FFFFFF;
	background-color: #808080;
	font-weight: bold;
	cursor: pointer;
}

.selected .c-candidatePicker_choice {
	border-color: #000000;
}

.c-candidatePicker_tools {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.c-candidatePicker_edit {
	width: 50px;
}

.isEditMode .c-candidatePicker_choice.item, 
.isEditMode .c-candidatePicker_choice.editBtn 
{
	border-color: #000000;
}

.isEditMode .c-candidatePicker_choice.noneBtn {
	border-color: #FFFFFF;
}

input {
	width: 180px;
	padding: 10px;
	color: #000000;
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
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
	color: #808080;
}
</style>