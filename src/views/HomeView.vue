<template>
	<div class="c-homeView">
		<div class="c-homeView_title">
			<DemIcon v-if="partyId == 0" />
			<RepIcon v-else-if="partyId == 1" />
			<h2 :style="cssVars">{{ mainStore.getPartyName }} Party Presidential Primary</h2>
			<DemIcon v-if="partyId == 0" />
			<RepIcon v-else-if="partyId == 1" />
		</div>
		<CandidatePicker />
		<NationalMap />
		<DelegateBar />
		<RebalancerTool />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated } from 'vue';

import DemIcon from '../assets/icons/party-logo-dem.svg?component';
import RepIcon from '../assets/icons/party-logo-rep.svg?component';
import CandidatePicker from "../components/CandidatePicker.vue";
import DelegateBar from "../components/DelegateBar.vue";
import NationalMap from "../components/NationalMap.vue";
import RebalancerTool from "../components/RebalancerTool.vue";

import { useStore } from '../stores/store';

const mainStore = useStore();

const props = defineProps({
  	partyId: { type: Number, required: true }
});

const cssVars = computed(() => {
  return { 
    '--party-color': mainStore.getPartyColor
  };
});

onUpdated(() => {
	mainStore.setSelectedParty(props.partyId);
});

onMounted(() => {
	mainStore.setSelectedParty(props.partyId);
});
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-homeView {
	&_title {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $large-spacing;

		h2 {
			text-transform: capitalize;
			font-weight: normal;
			text-align: center;
			margin: 0 $standard-spacing;
			color: var(--party-color);
		}

		svg {
			width: 45px;
		}
	}
}
</style>
