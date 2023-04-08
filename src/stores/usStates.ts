import { computed, ref, watchEffect } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { useCandidatesStore } from './candidates';

type IAllocationType =
  | 'delegate selection'
  | 'proportional' 
  | 'winner-take-all'
  | 'winner-take-most'

type IElectionType =
  | 'closed caucus'
  | 'closed primary'
  | 'modified primary'
  | 'open caucus'
  | 'open primary'

interface ICandidateResult {
  id: number,
  delegates: number
}

interface IState {
  id: number,
  allocation: IAllocationType,
  color: string,
  electionDate: string,
  electionType: IElectionType,
  initials: string,
  name: string,
  results: ICandidateResult[],
  totalDelegates: number,
  unallocatedDelegates: number
}

export const useUsStatesStore = defineStore('usStates', () => {
  const candidatesStore = useCandidatesStore();
  const { candidates } = storeToRefs(candidatesStore);

  // State (data)

  let usStates = ref<IState[]>([
    {
      id: 0,
      allocation: 'proportional',
      color: '',
      electionDate: '',
      electionType: 'open primary',
      initials: '',
      name: '',
      results: [],
      totalDelegates: 1,
      unallocatedDelegates: 0
    }
  ]);

  watchEffect(() => {
    // Update candidate total delegate count when a state's results changes
    for (const candidate of candidates.value) {
      candidate.delegates = getCandidateTotalDelegates(candidate.id);
    }
  })

  // Getters (computed values)

  const defaultResults = computed(() => {
    let defaultResults = [];
  
    for (let i = 0; i <= candidates.value.length; i++) {
      defaultResults.push({
        id: i,
        delegates: 0
      })
    };
  
    return defaultResults;
  });

  // Actions (methods)

  /**
   * Update a candidate's number of delegates for a state
   * 
   * @param candidateId 
   * @param stateId 
   * @param delegates 
   */
  function updateCandidateDelegates(candidateId: number, stateId: number, delegates: number) {
    // Update unallocated delegate value to the diff between previous delegate count and new count
    const diff = this.usStates[stateId].results[candidateId].delegates - delegates;
    this.usStates[stateId].unallocatedDelegates = this.usStates[stateId].unallocatedDelegates + diff;

    // Update candidate delegates
    this.usStates[stateId].results[candidateId].delegates = delegates;
  }

  /**
   * Get a candidate's number of delegates for a state
   * 
   * @param candidateId 
   * @param stateId 
   */
  function getCandidateDelegates(candidateId: number, stateId: number) {
    return usStates.value?.[stateId]?.results?.[candidateId]?.delegates || 0;
  }

  /**
   * Get a candidate's total number of delegates for all states
   * 
   * @param candidateId 
   */
  function getCandidateTotalDelegates(candidateId: number) {
    let totalDelegates = 0;
  
    for (const state of usStates.value) { // TODO: Investigate reactivity here
      totalDelegates += getCandidateDelegates(candidateId, state.id);
    }
  
    return totalDelegates;
  }

  /**
   * Get number of delegates allocated to a candidate in a state
   * 
   * @param stateId 
   */
  function getStateAllocatedDelegates(stateId: number) {
    let sum = 0;
    const stateResults = this.usStates[stateId].results;

    for (const candidates of stateResults) {
      sum += candidates.delegates;
    }

    return sum;
  }

  /**
   * Get a state's total delegates
   * 
   * @param stateId 
   */
  function getStateTotalDelegates(stateId: number) {
    return this.usStates[stateId].totalDelegates;
  }

  /**
   * Get number of delegates not yet allocated to a candidate in a state
   * 
   * @param stateId 
   */
  function getStateUnallocatedDelegates(stateId: number) {
    return this.usStates[stateId].totalDelegates - this.getStateAllocatedDelegates(stateId);
  }

  /**
   * Reset the results of all states
   */
  function resetAllResults() {
    for (const usState of this.usStates) {
      this.usStates[usState.id].results = defaultResults.value;
    };
  };

  /**
   * Reset the results of a state
   * 
   * @param stateId 
   */
  function resetStateResults(stateId: number) {
    this.usStates[stateId].results = defaultResults;
  }

  /**
   * Fetch US state data
   */
  async function fetchStatesData() {
    try {
      this.usStates = await fetch('/data/gop-states.json').then((response) => response.json());

      for (const usState of this.usStates) {
        this.usStates[usState.id].results = defaultResults.value;
        this.usStates[usState.id].unallocatedDelegates = this.usStates[usState.id].totalDelegates;
      };
    } catch (error) {
      console.log(error);
    }
  }

  return { 
    usStates,
    fetchStatesData,
    getCandidateDelegates,
    getCandidateTotalDelegates,
    getStateAllocatedDelegates,
    getStateTotalDelegates,
    getStateUnallocatedDelegates,
    updateCandidateDelegates
  }
});