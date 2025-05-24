import { computed, ref, ComputedRef, Ref } from 'vue';
import { defineStore } from 'pinia';

type IPartyNameType =
| 'democratic'
| 'republican'

export interface IParties {
  id: number,
  color: string,
  defaultCandidates: string[],
  excludedStateIds: number[],
  name: IPartyNameType,
  totalDelegates: number
}

export const useStore = defineStore(`store`, () => {
  // State (data)

  const selectedCandidateId: Ref<Map<number, number>> = ref(new Map([
    [0, -1],
    [1, -1]
  ]));
  const selectedPartyId: Ref<number> = ref(0);
  const selectedStateId: Ref<Map<number, number>> = ref(new Map([
    [0, 0],
    [1, 0]
  ]));
  const parties: Map<number, IParties> = new Map([
    [ 
      0,
      {
        id: 0,
        name: 'democratic',
        color: '#0a3161',
        defaultCandidates: [
          'Kamala Harris',
          'Gavin Newsom',
          'Pete Buttigieg',
          'Josh Shapiro',
          'Gretchen Whitmer',
          'Andy Beshear',
          'JB Pritzker',
          'Wes Moore'
        ],
        excludedStateIds: [],
        totalDelegates: 4541
      }
    ],
    [ 
      1,
      {
        id: 1,
        name: 'republican',
        color: '#b31942',
        defaultCandidates: [
          'JD Vance',
          'Ron DeSantis',
          'Nikki Haley' ,
          'Vivek Ramaswamy',
          'Marco Rubio',
          'Brian Kemp',
          'Ted Cruz',
          'Katie Britt'
        ],
        excludedStateIds: [ 56 ],
        totalDelegates: 2470
      }
    ]
  ]);

  // Getter (computed values)

  /**
   * Get the currently selected party id
   */
  const getPartyId: Ref<number> = computed(() => {
    return selectedPartyId.value;
  });

  /**
   * Get the currently selected party's color
   */
  const getPartyColor: ComputedRef<string|undefined> = computed(() => {
    return parties.get(getPartyId.value)?.color;
  });

  /**
   * Get the currently selected party name
   */
  const getPartyName: ComputedRef<IPartyNameType|undefined> = computed(() => {
    return parties.get(getPartyId.value)?.name;
  });

  /**
   * Get the state ids of states excluded from a party's primary
   */
  const getPartyExcludedStateIds: ComputedRef<number[]|undefined> = computed(() => {
    return parties.get(getPartyId.value)?.excludedStateIds; 
  })

  /**
   * Get the currently selected party's total delegate count
   */
  const getPartyTotalDelegates: ComputedRef<number> = computed(() => {
    return parties.get(getPartyId.value)?.totalDelegates ?? 0;
  });

  /**
   * Get the currently selected candidate's id
   */
  const getSelectedCandidateId: ComputedRef<number> = computed(() => {
    return selectedCandidateId.value.get(getPartyId.value) ?? -1;
  });

  /**
   * Get the currently selected state's id
   */
  const getSelectedStateId: ComputedRef<number> = computed(() => {
    return selectedStateId.value.get(getPartyId.value) ?? 0;
  });

  // Actions (methods)

  /**
   * Get the currently selected party's default candidates
   * 
   * @param partyId 
   */
  function getPartyDefaultCandidates(partyId: number): string[] {
    return parties.get(partyId)?.defaultCandidates || [];
  }

  /**
   * Update the value used to keep track of the selected candidate
   * 
   * @param candidateId 
   */
  function setSelectedCandidateId(candidateId: number): void {
    selectedCandidateId.value.set(getPartyId.value, candidateId);
  }

  /**
   * Set the selected party by id
   * 
   * @param partyId 
   */
  function setSelectedParty(partyId: number): void {
    selectedPartyId.value = partyId;
  }

  /**
   * Update the value used to keep track of the selected state
   * 
   * @param stateId 
   */
  function setSelectedStateId(stateId: number): void {
    selectedStateId.value.set(getPartyId.value, stateId);
  }

  return {
    selectedCandidateId,
    selectedPartyId,
    selectedStateId,
    getPartyDefaultCandidates,
    getPartyId,
    getPartyColor,
    getPartyExcludedStateIds,
    getPartyName,
    getPartyTotalDelegates,
    getSelectedCandidateId,
    setSelectedParty,
    getSelectedStateId,
    setSelectedCandidateId,
    setSelectedStateId
  }
});