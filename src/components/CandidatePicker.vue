<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useCandidatesStore } from '../stores/candidates';

const candidatesStore = useCandidatesStore();

const { candidates } = storeToRefs(candidatesStore);

// Reactive object to keep track of the selected candidate's index
const state = reactive({
	selectedCand: -1
});
</script>

<template>
	<div class="c-candidatePicker">
		<!-- Custom candidate choices -->
		<div v-for="candidate, idx in candidates" class="c-candidatePicker_choiceWrapper" :class="{ selected: state.selectedCand === idx }" @click="state.selectedCand = idx">
			<div :class="`c-candidatePicker_choice item${idx}`">
				<input type="text" v-model="candidate.name" placeholder="Available Slot" :style="{'background-color': candidate.color}">
			</div>
		</div>

		<!-- "None" choice: To interact with visualizations without candidate selected -->
		<div class="c-candidatePicker_choiceWrapper none" :class="{ selected: state.selectedCand === -1 }" @click="state.selectedCand = -1">
			<div class="c-candidatePicker_choice itemNone">None</div>
		</div>
	</div>
</template>

<style>
.c-candidatePicker {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 20px;
}

.c-candidatePicker_choiceWrapper {
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

input {
	width: 180px;
	padding: 10px;
	color: black;
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
</style>