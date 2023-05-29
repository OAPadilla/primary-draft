import { computed, ref, Ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // State (data)

  let selectedCandidateId: Ref<number> = ref(-1);
  let selectedStateId: Ref<number> = ref(0);
  // const totalDelegatesDEM = ref<number>(4518);
  const totalDelegates: Ref<number> = ref(2467); // GOP

  // Getter (computed values)

  /**
   * Get the currently selected candidate's id
   */
  const getSelectedCandidateId: Ref<number> = computed(() => {
    return selectedCandidateId.value;
  });

  /**
   * Get the currently selected state's id
   */
  const getSelectedStateId: Ref<number> = computed(() => {
    return selectedStateId.value;
  });

  // Actions (methods)

  /**
   * Update the value used to keep track of the selected candidate
   * 
   * @param candidateId 
   */
  function setSelectedCandidateId(candidateId: number): void {
    selectedCandidateId.value = candidateId;
  }

  /**
   * Update the value used to keep track of the selected state
   * 
   * @param stateId 
   */
  function setSelectedStateId(stateId: number): void {
    selectedStateId.value = stateId;
  }

  return {
    selectedCandidateId,
    selectedStateId,
    totalDelegates,
    getSelectedCandidateId,
    getSelectedStateId,
    setSelectedCandidateId,
    setSelectedStateId
  }
});