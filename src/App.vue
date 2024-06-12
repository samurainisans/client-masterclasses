<template>
  <div id="app">
    <Nav />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Nav from '@/components/ui/navigation/Nav.vue';
</script>

<style scoped>
.main-content {
  margin-top: 60px;
}
</style>
