import { ref, watchEffect } from 'vue';
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

export interface ICandidateResult {
  id: number,
  delegates: number,
  percent: number
}

export interface IState {
  id: number,
  allocation: IAllocationType,
  color: string,
  electionDate: string,
  electionType: IElectionType,
  initials: string,
  name: string,
  results: ICandidateResult[],
  totalDelegates: number,
  unallocatedDelegates: number,
  unallocatedPercentage: number
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
      unallocatedDelegates: 0,
      unallocatedPercentage: 0
    }
  ]);

  watchEffect(() => {
    // Update candidate total delegate count when a state's results changes
    for (const candidate of candidates.value) {
      candidate.delegates = getCandidateTotalDelegates(candidate.id);
    }
  })

  // Getters (computed values)


  // Actions (methods)

  /**
   * Return the default/reset results for a state. All assigned 0 delegates.
   */
  function defaultResults(): ICandidateResult[] {
    let defaultResults: ICandidateResult[] = [];
  
    for (let i = 0; i <= candidates.value.length; i++) {
      defaultResults.push({
        id: i,
        delegates: 0,
        percent: 0
      })
    };
  
    return defaultResults;
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
   * Get a candidate's percentage of the vote for a state
   * 
   * @param candidateId 
   * @param stateId 
   */
   function getCandidatePercentage(candidateId: number, stateId: number) {
    return getStateById(stateId).results[candidateId]?.percent || 0;
  }

  /**
   * Get a candidate's total number of delegates for all states
   * 
   * @param candidateId 
   */
  function getCandidateTotalDelegates(candidateId: number): number {
    let totalDelegates = 0;
  
    for (const state of usStates.value) { // TODO: Investigate reactivity here
      totalDelegates += getCandidateDelegates(candidateId, state.id);
    }
  
    return totalDelegates;
  }

  function getStateById(stateId: number) {
    return usStates.value[stateId];
  }

  /**
   * Get number of delegates allocated to a candidate in a state
   * 
   * @param stateId 
   */
  function getStateAllocatedDelegates(stateId: number): number {
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
  function getStateTotalDelegates(stateId: number): number {
    return this.usStates[stateId].totalDelegates;
  }

  /**
   * Get number of delegates not yet allocated in a state
   * 
   * @param stateId 
   */
  function getStateUnallocatedDelegates(stateId: number): number {
    return this.usStates[stateId].totalDelegates - this.getStateAllocatedDelegates(stateId);
  }

  /**
   * Get the percentage of the vote not yet allocated in a state
   * 
   * @param stateId 
   */
  function getStateUnallocatedPercentage(stateId: number): number {
    return getStateById(stateId).unallocatedPercentage;
  }

  /**
   * Update a candidate's number of delegates for a state
   * 
   * @param candidateId 
   * @param stateId 
   * @param delegates 
   */
  function updateCandidateDelegates(candidateId: number, stateId: number, delegates: number) {
    // Update unallocated delegate value to the diff between previous delegate count and new count
    const changeInDelegates = getCandidateDelegates(candidateId, stateId) - delegates;
    setStateUnallocatedDelegates(stateId, getStateById(stateId).unallocatedDelegates + changeInDelegates);

    // Update candidate delegates
    getStateById(stateId).results[candidateId].delegates = delegates;
  }

  /**
   * Update a candidate's percentage of the vote for a state
   * 
   * @param candidateId 
   * @param stateId 
   * @param percent 
   */
  function updateCandidatePercentage(candidateId: number, stateId: number, percent: number) {
    // Update unallocated percentage value to the diff between previous delegate count and new count
    const changeInPercent = getStateById(stateId).results[candidateId].percent - percent;
    setStateUnallocatedPercentage(stateId, Math.max(0,  getStateUnallocatedPercentage(stateId) + changeInPercent));

    // Update candidate percentage of vote
    getStateById(stateId).results[candidateId].percent = Math.max(0, Number(percent));
  }

  /**
   * Set number of delegates not yet allocated in a state
   * 
   * @param stateId
   * @param delegates 
   */
  function setStateUnallocatedDelegates(stateId: number, delegates: number) {
    getStateById(stateId).unallocatedDelegates = delegates;
  }

  /**
   * Set the percentage of the vote not yet allocated in a state
   * 
   * @param stateId 
   * @param percent 
   */
  function setStateUnallocatedPercentage(stateId: number, percent: number) {
    getStateById(stateId).unallocatedPercentage = Math.max(0, percent);
  }

  /**
   * Reset the results of all states
   */
  function resetAllResults() {
    for (const usState of this.usStates) {
      this.usStates[usState.id].results = defaultResults();
    };
  };

  /**
   * Reset the results of a state
   * 
   * @param stateId 
   */
  function resetStateResults(stateId: number) {
    this.usStates[stateId].results = defaultResults();
  }

  /**
   * Fetch US state data
   */
  async function fetchStatesData() {
    try {
      this.usStates = await fetch('/data/gop-states.json').then((response) => response.json());

      for (const usState of this.usStates) {
        this.usStates[usState.id].results = defaultResults();
        this.usStates[usState.id].unallocatedDelegates = this.usStates[usState.id].totalDelegates;
        this.usStates[usState.id].unallocatedPercentage = 100;
      };
    } catch (error) {
      console.log(error);
    }
  }

  return { 
    usStates,
    getStateById,
    fetchStatesData,
    getCandidateDelegates,
    getCandidatePercentage,
    getCandidateTotalDelegates,
    getStateAllocatedDelegates,
    getStateTotalDelegates,
    getStateUnallocatedDelegates,
    getStateUnallocatedPercentage,
    updateCandidateDelegates,
    updateCandidatePercentage
  }
});