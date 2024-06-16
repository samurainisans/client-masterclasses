<!-- src/App.vue -->
<template>
  <div id="app">
    <Nav />
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import Nav from '@/components/ui/navigation/Nav.vue';

const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkUser();
  }
});
</script>

<style scoped>
.main-content {
  margin-top: 60px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
