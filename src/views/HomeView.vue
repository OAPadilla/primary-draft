<template>
	<div class="c-homeView">
		<h2>{{ mainStore.getPartyName }} Party Presidential Primary</h2>
		<CandidatePicker />
		<NationalMap />
		<DelegateBar />
		<RebalancerTool />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';

import CandidatePicker from "../components/CandidatePicker.vue";
import DelegateBar from "../components/DelegateBar.vue";
import NationalMap from "../components/NationalMap.vue";
import RebalancerTool from "../components/RebalancerTool.vue";

import { useStore } from '../stores/store';

const mainStore = useStore();

const props = defineProps({
  	partyId: { type: Number, required: true }
});

onUpdated(() => {
	mainStore.setSelectedParty(props.partyId);
});

onMounted(() => {
	mainStore.setSelectedParty(props.partyId);
});
</script>

<style scoped lang="scss">
.c-homeView {
	h2 {
		text-transform: capitalize;
		font-weight: normal;
		text-align: center;
		margin-top: 0;
	}
}
</style>
