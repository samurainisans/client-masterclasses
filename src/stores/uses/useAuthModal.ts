// src/stores/useAuthModal.ts
import { ref } from 'vue';

const showAuthModal = ref(false);

export function useAuthModal() {
  const openAuthModal = () => {
    showAuthModal.value = true;
  };

  const closeAuthModal = () => {
    showAuthModal.value = false;
  };

  return {
    showAuthModal,
    openAuthModal,
    closeAuthModal
  };
}
