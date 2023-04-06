<template>
	<div class="c-rebalancerTool">
		<div class="c-rebalancerTool_header">
				<div class="c-rebalancerTool_stateName">
					{{ selectedState.name }}
				</div>

				<div class="c-rebalancerTool_stateAllocationType">
					{{ stateTotalDelegates }} delegates, {{ selectedState.allocation }}, {{ selectedState.electionType }}
				</div>
		</div>

		<RebalancerToolItem
			class="c-rebalancerTool_unallocated"
			:allocatedDelegates="stateUnallocatedDelegates"
			candidateName="Unallocated"
			:percentOfStateDel="(stateUnallocatedDelegates / stateTotalDelegates) * 100" 
			:stateId="selectedStateId"
		/>

		<div class="c-rebalancerTool_list">
			<template v-for="candidate in candidates" :key="candidate.id">
				<RebalancerToolItem
					v-if="candidate.name"
					class="c-rebalancerTool_candidate"
					:allocatedDelegates="getCandidateDelegates(candidate.id, selectedStateId)"
					:candidateId="candidate.id"
					:candidateName="candidate.name"
					:percentOfStateDel="(getCandidateDelegates(candidate.id, selectedStateId) / stateTotalDelegates) * 100"
					:stateId="selectedStateId"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import RebalancerToolItem from "./RebalancerToolItem.vue";

import { useCandidatesStore } from '../stores/candidates';
import { useUsStatesStore } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const usStatesStore = useUsStatesStore();
const { candidates } = storeToRefs(candidatesStore);
const { usStates } = storeToRefs(usStatesStore);

const allUsStates = ref(usStates);
const selectedStateId: Ref<number> = ref(0);

const selectedState = computed(() => {
	return allUsStates.value[selectedStateId.value]; // TODO: Use Pinia action
});

const stateTotalDelegates: Ref<number> = computed(() => {
	return selectedState.value.totalDelegates;
});

const stateUnallocatedDelegates = computed(() => {
	return usStatesStore.getStateUnallocatedDelegates(selectedState.value.id);
});

function getCandidateDelegates(candidateId: number, stateId: number) {
	return this.usStatesStore.getCandidateDelegates(candidateId, stateId);
};

// Name sourced from candidates store, other state info from usStates store
// Slider updates:
// (1) state delegates allocated shown in 3rd column
// (2) candidates store delegate count
// (3) us state store delegate count for state
// Unallocated slider logic

// On hover or slider move, highlight row with candidate color
</script>
  
<style scoped>
.c-rebalancerTool {
	margin: 0 20px 20px;
}

.c-rebalancerTool_header {
 	display: flex;
	flex-direction: column;
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid black;
	padding-bottom: 5px;
}

.c-rebalancerTool_stateDelegates, .c-rebalancerTool_stateAllocationType {
	font-weight: normal;
	font-size: 12px;
	color: grey;
}

.c-rebalancerTool_header div {
	margin: auto;
	text-transform: capitalize;
}

.c-rebalancerTool_unallocated {
	font-weight: bold;
}
</style>