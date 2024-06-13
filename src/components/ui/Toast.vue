<!-- src/components/ui/Toast.vue -->
<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration: number;
}

const props = defineProps<ToastProps>();

const visible = ref(false);
const progressWidth = ref(100);

onMounted(() => {
  visible.value = true;

  const interval = setInterval(() => {
    progressWidth.value -= 100 / (props.duration / 100);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    visible.value = false;
  }, props.duration);
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  z-index: 1000;
  transition: opacity 0.5s;
}

.toast.success {
  background-color: #28a745;
}

.toast.error {
  background-color: #dc3545;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  transition: width 0.1s linear;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
