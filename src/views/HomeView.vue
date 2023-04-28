<template>
	<div class="c-homeView">
		<h2>{{ partyName }} Party Presidential Primary</h2>
		<CandidatePicker />
		<NationalMap />
		<DelegateBar />
		<RebalancerTool />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import CandidatePicker from "../components/CandidatePicker.vue";
import DelegateBar from "../components/DelegateBar.vue";
import NationalMap from "../components/NationalMap.vue";
import RebalancerTool from "../components/RebalancerTool.vue";

const props = defineProps({
  party: { type: String, default: 'republican' }
});

const partyName = computed(() => {
	return props.party;
});
</script>

<style>
h2 {
	text-transform: capitalize;
	font-weight: normal;
	text-align: center;
	margin-top: 0;
}
</style>
