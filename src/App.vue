// src/App.vue
<template>
  <div id="app">
    <Nav />
    <main class="main-content">
      <router-view />
    </main>
    <AuthModal v-if="showAuthModal" :visible="showAuthModal" @close="closeAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import Nav from '@/components/ui/Nav.vue';
import AuthModal from '@/components/ui/auth/AuthModal.vue';
import { useAuthModal } from '@/stores/uses/useAuthModal';

const { showAuthModal, openAuthModal, closeAuthModal } = useAuthModal();

provide('openAuthModal', openAuthModal);
provide('closeAuthModal', closeAuthModal);
provide('showAuthModal', showAuthModal);
</script>

<style scoped>
.main-content {
  margin-top: 60px; /* отступ сверху равный высоте nav */
}
</style>
