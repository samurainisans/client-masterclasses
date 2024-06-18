<!-- src\components\SidebarToggleButton.vue-->
<template>
  <div class="sidebar-toggle-container">
    <button @click="toggleSidebar" aria-label="Toggle sidebar" class="sidebar-toggle">
      <span :class="{ closed: !isOpen }">
        <div class="icon-container">
          <div class="line line1"></div>
          <div class="line line2"></div>
        </div>
        <span class="sr-only">{{ isOpen ? 'Close sidebar' : 'Open sidebar' }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebarStore'

const sidebarStore = useSidebarStore()
const { isOpen, toggle } = sidebarStore

const toggleSidebar = () => {
  toggle()
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

button {
  border: none;
  background: none;
  cursor: pointer;
  width: 25px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  border: 1px solid $green;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 8px;
  background: $green;
}

.line {
  width: 1px;
  height: 18px;
  border-radius: 2px;
  transition: transform 0.3s ease-in-out;
}

.line1 {
  transform: translateY(0.15rem) rotate(0deg);
}

.line2 {
  transform: translateY(-0.15rem) rotate(0deg);
}

.closed .line1 {
  transform: translateY(0.15rem) rotate(45deg);
}

.closed .line2 {
  transform: translateY(-0.15rem) rotate(-45deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  white-space: nowrap;
}
</style>
