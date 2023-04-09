import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // State (data)

  let selectedCandidateId = ref<number>(-1);
  let selectedStateId = ref<number>(0);
  // const totalDelegatesDEM = ref<number>(4518);
  const totalDelegates = ref<number>(2467); // GOP

  // Getter (computed values)

  const getSelectedCandidateId = computed(() => {
    return selectedCandidateId;
  });

  const getSelectedStateId = computed(() => {
    return selectedStateId;
  });

  // Actions (methods)

  function setSelectedCandidateId(candidateId: number) {
    selectedCandidateId.value = candidateId;
  };

  function setSelectedStateId(stateId: number) {
    selectedStateId.value = stateId;
  };

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