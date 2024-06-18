<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  duration: number
}

const props = defineProps<ToastProps>()

const visible = ref(false)
const progressWidth = ref(100)
const isMobile = ref(window.innerWidth <= 480)

onMounted(() => {
  visible.value = true

  const intervalDuration = isMobile.value ? props.duration / 2 : props.duration
  const interval = setInterval(() => {
    progressWidth.value -= 100 / (intervalDuration / 100)
  }, 100)

  setTimeout(() => {
    clearInterval(interval)
    visible.value = false
  }, intervalDuration)

  window.addEventListener('resize', checkIfMobile)
})

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 480
}

watchEffect(() => {
  if (isMobile.value) {
    visible.value = false
    setTimeout(() => {
      visible.value = true
      progressWidth.value = 100
    }, 0)
  }
})
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

.toast.warning {
  background-color: #ffc107;
  color: black;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  transition: width 0.1s linear;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .toast {
    font-size: 14px;
    padding: 8px 16px;
  }
}

@media (max-width: 768px) {
  .toast {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .toast {
    top: 20px;
    bottom: auto;
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
