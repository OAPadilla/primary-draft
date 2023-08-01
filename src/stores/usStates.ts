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

export interface IElectionRules {
  minThreshold?: number,
  wtaTrigger?: number
}

export interface IState {
  id: number,
  allocation: IAllocationType,
  color: string,
  electionDate: string,
  electionRules: IElectionRules,
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
      electionRules: {},
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
    for (const candidate of candidates.value) {
      // Watches changes in usStates store state delegates results. 
      // Update candidates total delegate count when state's allocated delegates changes.
      candidate.delegates = getCandidateTotalDelegates(candidate.id);
    }
  })

  watchEffect(() => {
    for (const usState of usStates.value) {
      // Watches changes in usStates store state percentage results. 
      // Update state color based on candidate with greatest percentage when state's allocated percentages changes.
      const leadingCandidate: ICandidateResult = _getStateLeadingCandidate(usState.id);
      usState.color = candidatesStore.getCandidateColor(leadingCandidate.id) || '';
    }
  })

  // Getters (computed values)


  // Actions (methods)

  /**
   * Return the default/reset results for a state. All assigned 0 delegates.
   */
  function _defaultResults(): ICandidateResult[] {
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
  function getCandidateDelegates(candidateId: number, stateId: number): number {
    return getStateById(stateId).results?.[candidateId]?.delegates || 0;
  }

  /**
   * Get a candidate's percentage of the vote for a state
   * 
   * @param candidateId 
   * @param stateId 
   */
  function getCandidatePercentage(candidateId: number, stateId: number): number {
    return getStateById(stateId).results[candidateId]?.percent || 0;
  }

  /**
   * Get a candidate's total number of delegates for all states
   * 
   * @param candidateId 
   */
  function getCandidateTotalDelegates(candidateId: number): number {
    let totalDelegates: number = 0;
  
    for (const state of usStates.value) {
      totalDelegates += getCandidateDelegates(candidateId, state.id);
    }
  
    return totalDelegates;
  }

  /**
   * Get state by id
   * 
   * @param stateId 
   */
  function getStateById(stateId: number): IState {
    return usStates.value[stateId];
  }

  /**
   * Get state by state initials
   * 
   * @param stateInitial 
   */
  function getStateByInitial(stateInitial: string): IState|null {
    for (const usState of usStates.value) {
      if (usState.initials === stateInitial) {
        return usState;
      }
    };

    return null;
  }

  /**
   * Get leading candidate by percentage of vote in a state
   * 
   * @param stateId 
   */
  function _getStateLeadingCandidate(stateId: number): ICandidateResult {
    let leadingCandidate: ICandidateResult = { id: -1, percent: 0, delegates: 0 }

    for (const candidate of getStateById(stateId).results) {
      if (candidate.percent > leadingCandidate.percent) {
        leadingCandidate = candidate;
      }
    }

    return leadingCandidate;
  }

  /**
   * Get candidate with lowest percentage results above 0%.
   * 
   * @param stateId
   * @param excludeId Id of candidate to exclude from check
   */
  function _getStateLosingCandidate(stateId: number, excludeId: number = -1): ICandidateResult {
    let losingCandidate: ICandidateResult = { id: -1, percent: 100, delegates: 0  };

    for (const candidate of getStateById(stateId).results) {
      if (candidate.percent <= losingCandidate.percent && candidate.id !== excludeId && candidate.percent > 0) {
        losingCandidate = candidate;
      }
    }

    return losingCandidate;
  }

  /**
   * Get state's minimum threshold. A candidate must meet this percent of the vote threshold to earn any delegates.
   * 
   * @param stateId 
   */
  function getStateMinThreshold(stateId: number): number|undefined {
    return getStateById(stateId).electionRules?.minThreshold;
  }

  /**
   * Get a state's total delegates
   * 
   * @param stateId 
   */
  function getStateTotalDelegates(stateId: number): number {
    return getStateById(stateId).totalDelegates;
  }

  /**
   * Get number of delegates not yet allocated in a state
   * 
   * @param stateId 
   */
  function getStateUnallocatedDelegates(stateId: number): number {
    return getStateById(stateId).unallocatedDelegates;
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
   * Get state's winner-take-all trigger threshold. If a candidate reaches this threshold they earn all delegates.
   * 
   * @param stateId 
   */
  function getStateWtaTrigger(stateId: number): number|undefined {
    return getStateById(stateId).electionRules?.wtaTrigger;
  }

  /**
   * Update a candidate's number of delegates for a state
   * 
   * @param candidateId 
   * @param stateId 
   * @param delegates 
   */
  function updateCandidateDelegates(candidateId: number, stateId: number, delegates: number): void {
    // Update unallocated delegate value to the diff between previous delegate count and new count
    const changeInDelegates: number = getCandidateDelegates(candidateId, stateId) - delegates;
    const unallocatedDelegates: number = getStateUnallocatedDelegates(stateId) + changeInDelegates;

    _setStateUnallocatedDelegates(stateId, unallocatedDelegates);

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
  function updateCandidatePercentage(candidateId: number, stateId: number, percent: number): void {
    if (candidateId === null || candidateId < 0) {
      return;
    }

    // Get amount of percentage we are removing/adding to candidate
    let changeInPercent: number = percent - getCandidatePercentage(candidateId, stateId);

    // Update candidate percentage
    getStateById(stateId).results[candidateId].percent = Math.max(0, Number(percent));

    // Remove percentages from unallocation pool and other candidates as needed
    _unallocatePercentages(stateId, changeInPercent, candidateId);

    // Allocate delegates based on percentage results
    _updateStateDelegates(getStateById(stateId));
  }

  /**
   * Handles unallocation of percentage points in cases where a candidate in a state was assigned a specific amount of percentage points
   * 
   * @param stateId 
   * @param unallocateTarget 
   * @param candidateId 
   */
  function _unallocatePercentages(stateId: number, unallocateTarget: number, candidateId: number): void {
    const unallocatedPool: number = getStateUnallocatedPercentage(stateId);

    // If unallocated pool large enough, take from there
    if (unallocateTarget <= unallocatedPool) {
      _setStateUnallocatedPercentage(stateId, unallocatedPool - unallocateTarget);
    // Otherwise, take what you can and move on to taking candidate percentages
    } else {
      // Remove all of the unallocated pool from the leftover target
      let leftoverTarget: number = unallocateTarget - unallocatedPool;
      _setStateUnallocatedPercentage(stateId, 0);

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
   * Allocate delegates to candidates in state based on percentage results and state rules
   * 
   * @param usState 
   */
  function _updateStateDelegates(usState: IState): void {
    switch(usState.allocation) {
      case 'winner-take-all':
      case 'winner-take-most':
        // Plurality winner wins all
        const winningCandidate: ICandidateResult = _getStateLeadingCandidate(usState.id);
        let hasMetThreshold = true;

        // If minimum threshold rule is set, check leading candidate is above before allocating
        if (usState.electionRules?.minThreshold && winningCandidate.percent <= usState.electionRules.minThreshold) {
          hasMetThreshold = false
        }

        for (const candidate of usState.results) {
          updateCandidateDelegates(candidate.id, usState.id, 0);

          if (candidate.id == winningCandidate.id && hasMetThreshold) {
            updateCandidateDelegates(winningCandidate.id, usState.id, usState.totalDelegates);
          }
        }
        break;
      case 'delegate selection':
      case 'proportional':
      default:
        // Allocate proportionally to candidates with additional election modifier rules
        let totalPercentage: number = 100;

        // If minimum threshold rule is set, total percentage should reflect only applicable candidates + unallocated
        if (usState.electionRules?.minThreshold) {
          totalPercentage = getStateUnallocatedPercentage(usState.id);
          totalPercentage += usState.results.filter(candidate => candidate.percent >= (usState.electionRules.minThreshold || 0))
            .reduce((sum, candidate) => sum + candidate.percent, 0);
          totalPercentage = totalPercentage == 0 ? 100 : Math.min(100, totalPercentage);
        }

        for (const candidate of usState.results) {
          // Handle winner-take-all trigger rule
          if (usState.electionRules?.wtaTrigger && candidate.percent >= usState.electionRules.wtaTrigger) {
            for (const cd of usState.results) {
              updateCandidateDelegates(cd.id, usState.id, 0);
            }
            updateCandidateDelegates(candidate.id, usState.id, usState.totalDelegates);
            break;
          }

          // Handle minimum threshold rule
          if (usState.electionRules?.minThreshold && candidate.percent < usState.electionRules.minThreshold) {
            updateCandidateDelegates(candidate.id, usState.id, 0);
            continue;
          }

          const delegates: number = Math.round((candidate.percent / totalPercentage) * usState.totalDelegates);
          updateCandidateDelegates(candidate.id, usState.id, delegates);
        }
        break;
    }
  }

  /**
   * Set number of delegates not yet allocated in a state
   * 
   * @param stateId
   * @param delegates 
   */
  function _setStateUnallocatedDelegates(stateId: number, delegates: number): void {
    getStateById(stateId).unallocatedDelegates = delegates;
  }

  /**
   * Set the percentage of the vote not yet allocated in a state
   * 
   * @param stateId 
   * @param percent 
   */
  function _setStateUnallocatedPercentage(stateId: number, percent: number): void  {
    getStateById(stateId).unallocatedPercentage = Math.max(0, percent);
  }

  /**
   * Reset the results of all states
   */
  function resetAllResults(): void  {
    for (const usState of usStates.value) {
      getStateById(usState.id).results = _defaultResults();
    };
  }

  /**
   * Reset the results of all states for a candidate
   * 
   * @param candidateId
   */
  function resetAllResultsForCandidate(candidateId: number): void {
    for (const usState of usStates.value) {
      _resetStateResultsForCandidate(usState.id, candidateId);
    }
  }

  /**
   * Reset the results of a state
   * 
   * @param stateId 
   */
  function resetStateResults(stateId: number): void  {
    const usState: IState = getStateById(stateId);

    usState.results = _defaultResults();
    _setStateUnallocatedPercentage(stateId, 100);
    _setStateUnallocatedDelegates(stateId, usState.totalDelegates);
  }

  /**
   * Reset the results of a state for a candidate
   * 
   * @param stateId
   * @param candidateId
   */
  function _resetStateResultsForCandidate(stateId: number, candidateId: number): void {
    updateCandidatePercentage(candidateId, stateId, 0);
  }

  /**
   * Fetch US state data
   */
  async function fetchStatesData() {
    try {
      const usStatesJSON = await fetch('/data/gop-states.json');
      usStates.value = await usStatesJSON.json();
      
      for (const usState of usStates.value) {
        usStates.value[usState.id].results = _defaultResults();
        usStates.value[usState.id].unallocatedDelegates = usStates.value[usState.id].totalDelegates;
        usStates.value[usState.id].unallocatedPercentage = 100;
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
    getStateByInitial,
    getStateMinThreshold,
    getStateTotalDelegates,
    getStateUnallocatedDelegates,
    getStateUnallocatedPercentage,
    getStateWtaTrigger,
    resetAllResultsForCandidate,
    resetStateResults,
    updateCandidateDelegates,
    updateCandidatePercentage
  }
});