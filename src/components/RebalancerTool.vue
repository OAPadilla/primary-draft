<template>
	<div 
		class="c-rebalancerTool"
		v-show="selectedStateId !== null"
	>
		<div class="c-rebalancerTool_header">
				<div class="c-rebalancerTool_stateName">
					{{ selectedState.name }}
				</div>

				<div class="c-rebalancerTool_stateDetails">
					{{ selectedState.totalDelegates }} Delegates • {{ selectedState.allocation }} • {{ selectedState.electionType }}
				</div>

				<div class="c-rebalancerTool_stateDetails" v-if="stateElectionRules">
					{{ stateElectionRules }}
				</div>
		</div>

		<RebalancerToolItem
			class="c-rebalancerTool_unallocated"
			:allocated-delegates="stateUnallocatedDelegates"
			label="Unallocated"
			:percent-of-state-del="getUnallocatedPercentage()"
			:is-unallocated-item="true"
			:state-id="selectedStateId"
		/>

		<div class="c-rebalancerTool_list">
			<template v-for="candidate in candidates" :key="candidate.id">
				<RebalancerToolItem
					v-if="candidate.name"
					class="c-rebalancerTool_candidate"
					:allocated-delegates="getCandidateDelegates(candidate.id)"
					:candidate-id="candidate.id"
					:label="candidate.name"
					:percent-of-state-del="getCandidatePercentage(candidate.id)"
					:state-id="selectedStateId"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import RebalancerToolItem from "./RebalancerToolItem.vue";

import { useCandidatesStore } from '../stores/candidates';
import { useStore } from '../stores/store';
import { useUsStatesStore, IState } from '../stores/usStates';

const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const usStatesStore = useUsStatesStore();
const { candidates } = storeToRefs(candidatesStore);

const selectedStateId: Ref<number> = computed(() => {
	return mainStore.getSelectedStateId.value;
});

const selectedState: Ref<IState> = computed(() => {
	return usStatesStore.getStateById(selectedStateId.value);
});

const stateElectionRules: Ref<string> = computed(() => {
	const electionRules: string[] = [];

	function addRule(value: number|null, label: string) {
		if (value !== null) {
			electionRules.push(`${label}: ${value.toString()}%`);
		}
	}

	addRule(selectedState.value.electionRules?.minThreshold ?? null, 'Minimum Threshold');
	addRule(selectedState.value.electionRules?.wtaTrigger ?? null, 'Winner-Take-All Trigger');
	
	if (electionRules.length > 1) {
		return electionRules.join(' • ');
	}

	return '';
})

const stateTotalDelegates: Ref<number> = computed(() => {
	return usStatesStore.getStateTotalDelegates(selectedStateId.value);
});

const stateUnallocatedDelegates: Ref<number> = computed(() => {
	return usStatesStore.getStateUnallocatedDelegates(selectedStateId.value);
});

function getCandidateDelegates(candidateId: number): number {
	return usStatesStore.getCandidateDelegates(candidateId, selectedStateId.value);
};

function getCandidatePercentage(candidateId: number): number {
	return usStatesStore.getCandidatePercentage(candidateId, selectedStateId.value);
};

function getUnallocatedPercentage() {
	return usStatesStore.getStateUnallocatedPercentage(selectedStateId.value);
};
</script>
  
<style scoped>
.c-rebalancerTool {
	margin-bottom: var(--standard-spacing);
}

.c-rebalancerTool_header {
 	display: flex;
	flex-direction: column;
	font-family: var(--standard-font-family);
	font-size: 16px;
	font-weight: bold;
	border-bottom: var(--standard-border);
	padding-bottom: 5px;
}

.c-rebalancerTool_stateDelegates, .c-rebalancerTool_stateDetails {
	font-weight: normal;
	font-size: 12px;
	color: var(--color-dark-grey);
}

.c-rebalancerTool_header div {
	margin: auto;
	text-transform: capitalize;
}

.c-rebalancerTool_unallocated {
	font-weight: bold;
}
</style>