<template>
	<div class="c-homeView">
		<h2>{{ partyName }} Presidential Primary</h2>
		<CandidatePicker />
		<NationalMap />
		<DelegateBar />
		<RebalancerTool />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import CandidatePicker from "../components/CandidatePicker.vue";
import DelegateBar from "../components/DelegateBar.vue";
import NationalMap from "../components/NationalMap.vue";
import RebalancerTool from "../components/RebalancerTool.vue";

const partyName = ref('Republican Party');
</script>

<style>
h2 {
	font-weight: normal;
	text-align: center;
	margin-top: 0;
}
</style>
