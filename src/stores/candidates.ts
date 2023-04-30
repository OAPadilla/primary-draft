import { computed, ref, ComputedRef, Ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { useStore } from '../stores/store';

export interface ICandidate {
  id: number,
  color: string,
  delegates: number,
  name: string
}

export const useCandidatesStore = defineStore('candidates', () => {
  const mainStore = useStore();
  const { totalDelegates } = storeToRefs(mainStore);

  // State (data)

  const candidates = ref<ICandidate[]>([
    { id: 0, color: '#FFC8B4', delegates: 0, name: 'Donald J. Trump' }, // light peach
    { id: 1, color: '#B5EAD7', delegates: 0, name: 'Ron DeSantis' },    // pastel teal
    { id: 2, color: '#E8D6CB', delegates: 0, name: 'Nikki Haley' },     // pale pink
    { id: 3, color: '#C9E4CA', delegates: 0, name: '' },                // pale green
    { id: 4, color: '#FFE0C2', delegates: 0, name: '' },                // light orange
    { id: 5, color: '#C7CEEA', delegates: 0, name: '' },                // pale lavender
    { id: 6, color: '#D4E6F1', delegates: 0, name: '' },                // light blue
    { id: 7, color: '#E9D1D1', delegates: 0, name: '' }                 // light rose
  ]);

  // Getters (computed values)

  /**
   * Get the currently leading candidate based on total delegates allocated
   */
  const getLeadingCandidate: Ref<ICandidate> = computed(() => {
    const leader = candidates.value.reduce((acc, curr) => {
      return acc.delegates > curr.delegates ? acc : curr;
    })
    return leader;
  });

  /**
   * Get the candidate, if they exist, who has reached the required threshold to win the nomination
   */
  const getWinnerCandidate: ComputedRef<Ref<ICandidate> | null> = computed(() => {
    if (getLeadingCandidate.value.delegates / totalDelegates.value >= 0.5) {
      return getLeadingCandidate;
    }
    return null;
  });

  // Actions (methods)

  /**
   * Get a candidate's identifying color based on their id
   * 
   * @param candidateId 
   */
  function getCandidateColor(candidateId: number): string {
    return candidates.value[candidateId]?.color;
  }

  /**
   * Get a candidate's name based on their id
   * 
   * @param candidateId 
   */
  function getCandidateName(candidateId: number): string {
    return candidates.value[candidateId]?.name;
  }

  return { 
    candidates,
    getCandidateColor,
    getCandidateName,
    getLeadingCandidate,
    getWinnerCandidate
  }
});