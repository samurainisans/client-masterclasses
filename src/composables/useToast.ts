// src/composables/useToast.ts
import { ref } from 'vue';
import { createApp } from 'vue';
import Toast from "@/components/ui/Toast.vue";

const toasts = ref<any[]>([]);

const showToast = (message: string, type: 'success' | 'error' = 'success', duration: number = 2000) => {
  const id = Date.now();
  const app = createApp(Toast, { message, type, duration });
  const container = document.createElement('div');
  document.body.appendChild(container);
  app.mount(container);

  toasts.value.push({ id, app, container });

  setTimeout(() => {
    removeToast(id);
  }, duration);
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    const toast = toasts.value[index];
    toast.app.unmount();
    document.body.removeChild(toast.container);
    toasts.value.splice(index, 1);
  }
};

export function useToast() {
  return {
    showToast,
  };
}
