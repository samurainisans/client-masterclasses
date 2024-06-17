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
import { useFavoritesStore } from '@/stores/favoritesStore';
import Nav from '@/components/ui/navigation/Nav.vue';

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkUser();
  }
  await favoritesStore.fetchFavorites();
});
</script>

<style scoped>
.main-content {
  margin-top: 60px;
}
</style>
