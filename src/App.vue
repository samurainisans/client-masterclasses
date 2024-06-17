<!-- src/App.vue -->
<template>
  <div id="app">
    <div class="wrapper">
      <main class="main-content">
        <Nav />
        <router-view />
      </main>
    </div>
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

<style>
.wrapper {
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 20px;
}

.main-content {
  margin-top: 60px;
}
</style>