import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

type IAllocationType =
  | 'proportional' 
  | 'winner-take-all'
  | 'winner-take-most'

type IElectionType =
  | 'closed caucus'
  | 'closed primary'
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
  // State (data)

  let usStates = ref<IState[]>([
    {
      id: 0,
      allocation: 'proportional',
      color: '',
      electionDate: '2020-03-03',
      electionType: 'open primary',
      initials: 'AL',
      name: 'alabama',
      results: [
        {
          id: 0,
          delegates: 10
        },
        {
          id: 1,
          delegates: 2
        },
        {
          id: 2,
          delegates: 6
        }
      ],
      totalDelegates: 52,
      unallocatedDelegates: 36
    }
  ]);

  // Getters (computed values)


  // Actions (methods)

  function addDelegates(stateId: number, candidateId: number, delegates: number) {

  }

  function removeDelegates(stateId: number, candidateId: number, delegates: number) {

  }

  function countAllocatedDelegates() {

  }

  function updateCandidateTotal(candidateId: number) {
    // increment over all states' results for candidate x
    // This could be a watcher in candidates store
  }

  function updateCandidateDelegates(candidateId: number, stateId: number, delegates: number) {
    console.log(delegates);
    // const diff = this.usStates[stateId].results[candidateId].delegate - delegates;
    // this.usStates[stateId]

    this.usStates[stateId].results[candidateId].delegates = delegates;

  }

  /**
   * Get a candidate's number of delegates for a state
   * 
   * @param candidateId 
   * @param stateId 
   */
  function getCandidateDelegates(candidateId: number, stateId: number) {
    return this.usStates?.[stateId]?.results?.[candidateId]?.delegates || 0;
  }

  /**
   * Get number of delegates allocated to a candidate in a state
   * 
   * @param stateId 
   */
  function getStateAllocatedDelegates(stateId: number) {
    let sum = 0;
    const stateResults = this.usStates[stateId].results;

    for (let candidates of stateResults) {
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
   * 
   */
  async function fetchStatesData() {
    // usStates = [];
    try {
      this.usStates = await fetch('/data/gop-states.json').then((response) => response.json());
    } catch (error) {
      console.log(error);
    }
  }



  // Update results for state

  // When creating 
  // We should update candidates store everytime we update a states results

  return { 
    usStates,
    fetchStatesData,
    getCandidateDelegates,
    getStateAllocatedDelegates,
    getStateTotalDelegates,
    getStateUnallocatedDelegates,
    updateCandidateDelegates
  }
});