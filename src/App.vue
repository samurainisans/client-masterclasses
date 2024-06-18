<template>
  <div id="app" :class="{ 'has-map': isMapPage }">
    <div class="wrapper">
      <main class="main-content">
        <Nav />
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Nav from '@/components/ui/navigation/Nav.vue'

const isMapPage = ref(false)

const route = useRoute()

const checkIfMapPage = () => {
  isMapPage.value = route.name?.includes('map') || route.path.includes('map')
}

onMounted(() => {
  checkIfMapPage()
})

watch(route, () => {
  checkIfMapPage()
})
</script>

<style>
.wrapper {
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 20px;
}

.wrapper:has(.main-container):has(.maps-container) {
  max-width: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.main-content {
  margin-top: 60px;
}

.has-map .main-content {
  margin-top: 0 !important;
}
</style>
