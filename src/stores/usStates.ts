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

    // Watch state results and update state color based on leading candidate
    for (const usState of usStates.value) {
      let leadingCandidateId = getStateLeadingCandidate(usState.id);
      usState.color = candidatesStore.getCandidateColor(leadingCandidateId) || '';
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

  function getStateByInitial(stateInitial: string) {
    for (const usState of this.usStates) {
      if (usState.initials === stateInitial) {
        return usState;
      }
    };

    return {};
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
   * Get leading candidate by percentage of vote in a state
   * 
   * @param stateId 
   */
  function getStateLeadingCandidate(stateId: number): number {
    let leadingCandidateId: number = -1;
    let leadingCandidatePercent = 0;

    for (const candidate of getStateById(stateId).results) {
      if (candidate.percent > leadingCandidatePercent) {
        leadingCandidateId = candidate.id
        leadingCandidatePercent = candidate.percent;
      }
    }

    return leadingCandidateId;
  }

  /**
   * Get candidate with lowest percentage results above 0%.
   * 
   * @param stateId
   * @param excludeId Id of candidate to exclude from check
   */
  function _getStateLosingCandidate(stateId: number, excludeId: number): any {
    const stateResults = usStates.value[stateId].results;
    let leadingCandidate = { id: -1, percent: 100 };

    for (const candidate of stateResults) {
      if (candidate.percent <= leadingCandidate.percent && candidate.id !== excludeId && candidate.percent > 0) {
        leadingCandidate = candidate;
      }
    }

    return leadingCandidate;
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
    if (candidateId === null || candidateId < 0) {
      return;
    }

    // Get amount of percentage we are removing/adding to candidate
    let changeInPercent = percent - getCandidatePercentage(candidateId, stateId);
    let unallocatedPerc = getStateUnallocatedPercentage(stateId);

    // Update candidate percentage
    getStateById(stateId).results[candidateId].percent = Math.max(0, Number(percent));

    // Remove percentages from unallocation pool and other candidates as needed
    _unallocatePercentages(stateId, changeInPercent, candidateId);

    // Allocate delegates based on percentage
    // allocateStateDelegates(candidateId, stateId, percent);

    // const del = Math.round((getCandidatePercentage(candidateId, stateId) / 100) * getStateTotalDelegates(stateId));
    // updateCandidateDelegates(candidateId, stateId, del);
  }

  function allocateStateDelegates(candidateId: number, stateId: number, percent: number) {
    const allocationType = getStateById(stateId).allocation;

    switch(allocationType) {
      case 'delegate selection':
        break;
      case 'proportional':
        // Allocate proportionally to candidates who meet minimum threshold (varies by state). Add to data.
        break;
      case 'winner-take-all':
        break;
      case 'winner-take-most':
        break;
      default:
        // last
    }

    // Proportional. Move into switch statement
    const del = Math.round((percent / 100) * getStateTotalDelegates(stateId));
    console.log(del);
    updateCandidateDelegates(candidateId, stateId, del);
  }

  /**
   * Handles unallocation of percentage points in cases where a candidate in a state was assigned a specific amount of percentage points
   * 
   * @param stateId 
   * @param unallocateTarget 
   * @param candidateId 
   */
  function _unallocatePercentages(stateId: number, unallocateTarget: number, candidateId: number) {
    const unallocatedPool = getStateUnallocatedPercentage(stateId);

    // If unallocated pool large enough, take from there
    if (unallocateTarget <= unallocatedPool) {
      setStateUnallocatedPercentage(stateId, unallocatedPool - unallocateTarget);
    // Otherwise, take what you can and move on to taking candidate percentages
    } else {
      // Remove all of the unallocated pool from the leftover target
      let leftoverTarget = unallocateTarget - unallocatedPool;
      setStateUnallocatedPercentage(stateId, 0);

      // Get candidate with lowest percent and remove from leftover target
      const lowestCandidate = _getStateLosingCandidate(stateId, candidateId);

      // If last place candidate can't cover leftover target, we remove all of their percentage
      if (leftoverTarget > lowestCandidate.percent) {
        leftoverTarget = leftoverTarget - lowestCandidate.percent;
        getStateById(stateId).results[lowestCandidate.id].percent = 0;

        // Then with a new, reduced target we can run this function recursively for the next lowest candidate
        _unallocatePercentages(stateId, leftoverTarget, candidateId);
      // Else we can assign whats left back to the last place candidate
      } else {
        leftoverTarget = lowestCandidate.percent - leftoverTarget;
        getStateById(stateId).results[lowestCandidate.id].percent = leftoverTarget;
      }
    }
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
    getStateByInitial,
    getStateTotalDelegates,
    getStateUnallocatedDelegates,
    getStateUnallocatedPercentage,
    updateCandidateDelegates,
    updateCandidatePercentage
  }
});