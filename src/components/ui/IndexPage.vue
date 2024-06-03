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
        <div v-if="!loading && masterClassesStore.getMasterClasses.length === 0" class="no-results">
          Не найдено мастер-классов с таким названием :(
        </div>
      </div>
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="prevPage">предыдущая</button>
        <span>страница {{ currentPage }} из {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">следующая</button>
        <button @click="goToLastPage">последняя</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMasterClassesStore } from '@/stores/masterClasses'
import MasterClassCard from '@/components/ui/masterclass/MasterClassCard.vue'
import Nav from '@/components/ui/navigation/Nav.vue'
import FiltrationComponent from '@/components/ui/filter/FiltrationComponent.vue'

const masterClassesStore = useMasterClassesStore()
const currentPage = ref(1)
const itemsPerPage = 30
const loading = computed(() => masterClassesStore.loading)

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

watch(() => masterClassesStore.getMasterClasses, () => {
  currentPage.value = 1
})
</script>

<style scoped lang="scss">
@import '@/assets/variables.scss';

.main-container {
  width: 1520px;
  margin: 0 auto;
}

.content {
  padding: 10px 20px 20px;
}

.cards-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.no-results {
  margin-top: 20px;
  font-size: 18px;
  color: $gray;
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
