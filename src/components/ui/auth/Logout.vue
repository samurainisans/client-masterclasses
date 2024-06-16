<!-- src/components/ui/auth/Logout.vue -->
<template>
  <div>Выход...</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.logout();
  router.push({ name: 'Home' });
});
</script>
