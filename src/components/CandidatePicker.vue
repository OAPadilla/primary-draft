<script setup lang="ts">
import { reactive } from 'vue';

const numOfCandidates: number = 12;
const defaultCandidateNames: string[] = ['Donald J. Trump', 'Ron DeSantis', 'Nikki Haley'];
const defaultColors: string[] = [
	'#FF2400',
	'#FFD1DC', // light pink
	'#87CEEB', 
	'#D1B6E1', // light lavender
	'#FFB347', // orange
	'#00BFFF', // light blue
	'#FED8B1', // light peach
	'#5F4B8B', // dark lavender
	'#F0C8C9', // light pinkish-red
	'#FFDEAD', // light peachy-beige
	'#CDB38B', // light yellowish-tan
	'#FF6961'  // coral red
];

// Reactive object to keep track of the selected candidate's index
const state = reactive({
	selectedCand: -1
});
</script>

<template>
	<div class="c-candidatePicker">
		<!-- Custom candidate choices -->
		<div v-for="item, idx in numOfCandidates" class="c-candidatePicker_choiceWrapper" :class="{ selected: state.selectedCand === idx }" @click="state.selectedCand = idx">
			<div :class="`c-candidatePicker_choice item${idx}`">
				<input type="text" :value="defaultCandidateNames[idx]" placeholder="Available Slot">
			</div>
		</div>

		<!-- "Picker" choice: Interact with visualizations without candidate selected -->
		<div class="c-candidatePicker_choiceWrapper none" :class="{ selected: state.selectedCand === -1 }" @click="state.selectedCand = -1">
			<div class="c-candidatePicker_choice">None</div>
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
	margin: 5px;
	border-radius: 20px;
}

input {
	padding: 10px;
	border: 0;
	background-color: #000000;
	border-radius: 20px;
	width: 180px;
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
	font-size: 16px;
	text-align: center;
	outline: none;
}

.none .c-candidatePicker_choice {
	padding-top: 9px;
}

.none {
	color: #FFFFFF;
	background-color: #000000;
	border-radius: 20px;
	text-align: center;
}
</style>