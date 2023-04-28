import { computed, ref, ComputedRef, Ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // State (data)

  let selectedCandidateId: Ref<number> = ref(-1);
  let selectedStateId: Ref<number> = ref(0);
  // const totalDelegatesDEM = ref<number>(4518);
  const totalDelegates: Ref<number> = ref(2467); // GOP

  // Getter (computed values)

  const getSelectedCandidateId: ComputedRef<Ref<number>> = computed(() => {
    return selectedCandidateId;
  });

  const getSelectedStateId: ComputedRef<Ref<number>> = computed(() => {
    return selectedStateId;
  });

  // Actions (methods)

  function setSelectedCandidateId(candidateId: number): void {
    selectedCandidateId.value = candidateId;
  };

  function setSelectedStateId(stateId: number): void {
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