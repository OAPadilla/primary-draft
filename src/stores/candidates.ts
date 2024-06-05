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

  const candidates: Ref<Map<number, ICandidate[]>> = ref(new Map([
    [ 
      0,
      [
        { id: 0, color: '#FFC8B4', delegates: 0, name: mainStore.getPartyDefaultCandidates(0)?.[0] ?? '' }, // light peach
        { id: 1, color: '#B5EAD7', delegates: 0, name: mainStore.getPartyDefaultCandidates(0)?.[1] ?? '' }, // pastel teal
        { id: 2, color: '#E8D6CB', delegates: 0, name: mainStore.getPartyDefaultCandidates(0)?.[2] ?? '' }, // pale pink
        { id: 3, color: '#D4E6F1', delegates: 0, name: '' },                        // light blue
        { id: 4, color: '#FFE0C2', delegates: 0, name: '' },                        // light orange
        { id: 5, color: '#C7CEEA', delegates: 0, name: '' },                        // pale lavender
        { id: 6, color: '#C9E4CA', delegates: 0, name: '' },                        // pale green
        { id: 7, color: '#E9D1D1', delegates: 0, name: '' }                         // light rose
      ]
    ],
    [ 
      1,
      [
        { id: 0, color: '#FFC8B4', delegates: 0, name: mainStore.getPartyDefaultCandidates(1)?.[0] ?? '' }, // light peach
        { id: 1, color: '#B5EAD7', delegates: 0, name: mainStore.getPartyDefaultCandidates(1)?.[1] ?? '' }, // pastel teal
        { id: 2, color: '#E8D6CB', delegates: 0, name: mainStore.getPartyDefaultCandidates(1)?.[2] ?? '' }, // pale pink
        { id: 3, color: '#D4E6F1', delegates: 0, name: mainStore.getPartyDefaultCandidates(1)?.[3] ?? '' }, // light blue
        { id: 4, color: '#FFE0C2', delegates: 0, name: '' },                        // light orange
        { id: 5, color: '#C7CEEA', delegates: 0, name: '' },                        // pale lavender
        { id: 6, color: '#C9E4CA', delegates: 0, name: '' },                        // pale green
        { id: 7, color: '#E9D1D1', delegates: 0, name: '' }                         // light rose
      ]
    ]
  ]));

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
    setCandidateName
  }
});