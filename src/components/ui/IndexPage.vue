<template>
  <div class="main-container">
    <Nav />
    <FiltrationComponent />
    <div class="content">
      <div class="cards-container">
        <transition-group name="list" tag="div" class="cards-grid">
          <MasterClassCard
            v-for="masterClass in paginatedMasterClasses"
            :key="masterClass.id"
            :masterClass="masterClass"
            class="list-item"
          />
        </transition-group>
      </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage">Предыдущая</button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Следующая</button>
        <button @click="goToLastPage">Последняя</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMasterClassesStore } from '@/stores/masterClasses'
import MasterClassCard from '@/components/ui/masterclass/MasterClassCard.vue'
import Nav from '@/components/ui/navigation/Nav.vue'
import FiltrationComponent from '@/components/ui/filter/FiltrationComponent.vue'

const masterClassesStore = useMasterClassesStore()
const currentPage = ref(1)
const itemsPerPage = 30

onMounted(() => {
  masterClassesStore.fetchMasterClasses()
})

const paginatedMasterClasses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = currentPage.value * itemsPerPage
  return masterClassesStore.getMasterClasses.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(masterClassesStore.getMasterClasses.length / itemsPerPage)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToLastPage = () => {
  currentPage.value = totalPages.value
}
</script>

<style scoped lang="scss">
@import '@/assets/variables.scss';

.main-container {
  width: 1520px;
  margin: 0 auto;
}

.content {
  padding: 20px;
}

.cards-container {
  display: flex;
  justify-content: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: $green;
  color: $white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: lighten($green, 20%);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: darken($green, 10%);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
