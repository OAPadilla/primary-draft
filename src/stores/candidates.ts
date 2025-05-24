import { computed, ref, ComputedRef, Ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useStorage } from '@vueuse/core'

import { useStore } from './store';

export interface ICandidate {
  id: number,
  color: string,
  delegates: number,
  name: string
}

export const useCandidatesStore = defineStore('candidates', () => {
  const mainStore = useStore();

  const { selectedPartyId } = storeToRefs(mainStore);

  // State (data)

  const candidates: Ref<Map<number, ICandidate[]>> = ref(createInitialCandidates());

  useStorage(
    'candidates',
    candidates,
    localStorage,
    { mergeDefaults: true }
  );

  // Getters (computed values)

  /**
   * Get candidates for selected party
   */
  const getCandidates: Ref<ICandidate[]> = computed(() => {
    return candidates.value.get(selectedPartyId.value) || [];
  });

  /**
   * Get the currently leading candidate based on total delegates allocated
   */
  const _getLeadingCandidate: ComputedRef<ICandidate> = computed(() => {
    const leader = getCandidates.value.reduce((acc, curr) => {
      return acc.delegates > curr.delegates ? acc : curr;
    })
    return leader;
  });

  /**
   * Get the candidate, if they exist, who has reached the required threshold to win the nomination
   */
  const getWinnerCandidate: ComputedRef<Ref<ICandidate> | null> = computed(() => {
    if (_getLeadingCandidate.value.delegates / mainStore.getPartyTotalDelegates >= 0.5) {
      return _getLeadingCandidate;
    }
    return null;
  });

  // Actions (methods)

  function createInitialCandidates(): Map<number, ICandidate[]> {
    const result = new Map<number, ICandidate[]>();
  
    for (const partyId of [0, 1]) {
      const defaultNames = mainStore.getPartyDefaultCandidates(partyId) ?? [];
  
      const partyCandidates: ICandidate[] = [
        { id: 0, color: '#FFC8B4', delegates: 0, name: defaultNames[0] ?? '' },
        { id: 1, color: '#B5EAD7', delegates: 0, name: defaultNames[1] ?? '' },
        { id: 2, color: '#E8D6CB', delegates: 0, name: defaultNames[2] ?? '' },
        { id: 3, color: '#D4E6F1', delegates: 0, name: defaultNames[3] ?? '' },
        { id: 4, color: '#FFE0C2', delegates: 0, name: defaultNames[4] ?? '' },
        { id: 5, color: '#C7CEEA', delegates: 0, name: defaultNames[5] ?? '' },
        { id: 6, color: '#C9E4CA', delegates: 0, name: defaultNames[6] ?? '' },
        { id: 7, color: '#E9D1D1', delegates: 0, name: '' }
      ];
  
      result.set(partyId, partyCandidates);
    }
  
    return result;
  }

  /**
   * Get a candidate by their id
   * 
   * @param candidateId 
   */
  function getCandidateById(candidateId: number): ICandidate {
    return getCandidates.value?.[candidateId];
  }

  /**
   * Get a candidate's identifying color based on their id
   * 
   * @param candidateId 
   */
  function getCandidateColor(candidateId: number): string {
    return getCandidateById(candidateId)?.color;
  }

  /**
   * Get a candidate's name based on their id
   * 
   * @param candidateId 
   */
  function getCandidateName(candidateId: number): string {
    return getCandidateById(candidateId)?.name;
  }

  /**
   * Reset candidates to default initial state
   */
  function resetCandidatesToDefault(): void {
    const initialCandidateForSelectedParty: ICandidate[]|undefined = createInitialCandidates().get(selectedPartyId.value);
    if (initialCandidateForSelectedParty) {
      candidates.value.set(selectedPartyId.value, initialCandidateForSelectedParty);
    }
  }

  /**
   * Set a candidate's name based on their id
   * 
   * @param candidateId 
   */
  function setCandidateName(candidateId: number, name: string): void {
    getCandidateById(candidateId).name = name;
  }

  return { 
    getCandidates,
    getCandidateById,
    getCandidateColor,
    getCandidateName,
    getWinnerCandidate,
    resetCandidatesToDefault,
    setCandidateName
  }
});