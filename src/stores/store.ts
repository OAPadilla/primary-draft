import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // State (data)

  // const totalDelegatesDEM = ref<number>(4518);
  const totalDelegates = ref<number>(2467); // GOP

  return { totalDelegates }
});