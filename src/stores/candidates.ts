import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface ICandidate {
  id: number,
  color: string,
  delegates: number,
  name: string
}

export const useCandidatesStore = defineStore('candidates', () => {
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


  // Actions (methods)

  function getCandidateColor(candidateId: number): string {
    return candidates.value[candidateId].color;
  }

  function getCandidateName(candidateId: number): string {
    return candidates.value[candidateId].name;
  }

  return { 
    candidates,
    getCandidateColor,
    getCandidateName
  }
});