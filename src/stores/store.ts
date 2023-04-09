import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // State (data)

  let selectedStateId = ref<number>(0);
  // const totalDelegatesDEM = ref<number>(4518);
  const totalDelegates = ref<number>(2467); // GOP


  // Getter (computed values)

  const getSelectedStateId = computed(() => {
    return selectedStateId;
  });


  // Actions (methods)

  // function setSelectedStateId(stateId: number) {
  //   selectedStateId = ref(stateId);
  // };

  return { 
    selectedStateId, 
    totalDelegates,
    getSelectedStateId
  }
});