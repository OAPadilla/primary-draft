import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  // state / data
  const totalDelegates = ref<number>(500);

  return { totalDelegates }
});