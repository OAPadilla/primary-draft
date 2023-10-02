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
				{{ $t('numDelegates', { num: selectedState.totalDelegates }) }} • {{ selectedState.allocation }} • {{ selectedState.electionType }}
			</div>

			<div class="c-rebalancerTool_stateDetails" v-if="stateElectionRules">
				{{ stateElectionRules }}
			</div>

			<ResetIcon 
				class="c-rebalancerTool_resetBtn"
				:class="{ '-rotate': resetActivated }"
				@click="onResetClick"
			/>
		</div>

		<RebalancerToolItem
			class="c-rebalancerTool_unallocated"
			:allocated-delegates="stateUnallocatedDelegates"
			:label="$t('unallocated')"
			:min-threshold="stateRuleMinThreshold"
			:percent-of-state-del="stateUnallocatedPercentage"
			:is-unallocated-item="true"
			:state-id="selectedStateId"
			:wta-threshold="stateRuleWtaTrigger"
		/>

		<div class="c-rebalancerTool_list">
			<template v-for="candidate in candidatesStore.getCandidates" :key="candidate.id">
				<RebalancerToolItem
					v-if="candidate.name"
					class="c-rebalancerTool_candidate"
					:allocated-delegates="getCandidateDelegates(candidate.id)"
					:candidate-id="candidate.id"
					:label="candidate.name"
					:min-threshold="stateRuleMinThreshold"
					:percent-of-state-del="getCandidatePercentage(candidate.id)"
					:state-id="selectedStateId"
					:wta-threshold="stateRuleWtaTrigger"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ResetIcon from '../assets/icons/reset.svg?component';
import RebalancerToolItem from "./RebalancerToolItem.vue";

import { useCandidatesStore } from '../stores/candidates';
import { useStore } from '../stores/store';
import { useUsStatesStore, IState } from '../stores/usStates';

const { t } = useI18n();
const candidatesStore = useCandidatesStore();
const mainStore = useStore();
const usStatesStore = useUsStatesStore();

const resetActivated: Ref<boolean> = ref(false);

const selectedStateId: Ref<number> = computed(() => {
	return mainStore.getSelectedStateId;
});

const selectedState: Ref<IState> = computed(() => {
	return usStatesStore.getStateById(selectedStateId.value);
});

const stateElectionRules: Ref<string> = computed(() => {
	const electionRules: string[] = [];

	function addRule(value: number|undefined, label: string): void {
		if (value != null) {
			electionRules.push(`${label}: ${value.toString()}%`);
		}
	}

	addRule(stateRuleMinThreshold.value, t('minThreshold'));
	addRule(stateRuleWtaTrigger.value, t('wtaTrigger'));
	
	if (electionRules.length > 1) {
		return electionRules.join(' • ');
	} else if (electionRules.length == 1) {
		return electionRules[0];
	}

	return '';
})

const stateRuleMinThreshold: Ref<number|undefined> = computed(() => {
	return usStatesStore.getStateMinThreshold(selectedStateId.value);
});

const stateRuleWtaTrigger: Ref<number|undefined> = computed(() => {
	return usStatesStore.getStateWtaTrigger(selectedStateId.value);
});

const stateUnallocatedDelegates: Ref<number> = computed(() => {
	return usStatesStore.getStateUnallocatedDelegates(selectedStateId.value);
});

const stateUnallocatedPercentage: Ref<number> = computed(() => {
	return usStatesStore.getStateUnallocatedPercentage(selectedStateId.value);
});

function getCandidateDelegates(candidateId: number): number {
	return usStatesStore.getCandidateDelegates(candidateId, selectedStateId.value);
};

function getCandidatePercentage(candidateId: number): number {
	return usStatesStore.getCandidatePercentage(candidateId, selectedStateId.value);
};

function onResetClick(): void {
	usStatesStore.resetStateResults(selectedStateId.value);

	// Animate reset icon
	resetActivated.value = true;
	setTimeout(() => {
		resetActivated.value = false;
	}, 500);
};
</script>
  
<style scoped lang="scss">
@import '@/styles/main.scss';

.c-rebalancerTool {
	margin-bottom: $spacing-standard;

	&_header {
		position: relative;
		display: flex;
		flex-direction: column;
		font-family: $font-family-standard;
		font-size: 16px;
		font-weight: bold;
		border-bottom: $border-standard;
		padding-bottom: 5px;

		div {
			margin: auto;
			text-transform: capitalize;
		}
	}

	&_stateDelegates, 
	&_stateDetails {
		font-weight: normal;
		font-size: 12px;
		color: $color-dark-grey;
	}

	&_unallocated {
		font-weight: bold;
	}

	&_resetBtn {
		position: absolute;
		width: 20px;
		height: 20px;
		right: 0;
		bottom: 0;
		padding: 5px;

		&:hover {
			opacity: 0.7;
			cursor: pointer;
		}

		&.-rotate {
			transition: transform 0.5s ease;
			transform: rotate(-360deg);
		}
	}
}
</style>