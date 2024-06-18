<!--src/components/ui/filter/FiltrationComponent.vue-->
<template>
  <div class="search_container">
    <div class="search_section">
      <input
        type="text"
        placeholder="Найти мероприятие"
        v-model="searchQuery"
        @keyup.enter="searchMasterClasses"
        class="search_input"
      />
      <button class="search_button" @click="searchMasterClasses">Поиск</button>
    </div>
  </div>
  <div class="filter_container">
    <AuthGuard :roles="['Organizer', 'Admin']">
      <button class="add_ms_button" @click="goToAddMasterClass">Добавить мастер-класс</button>
    </AuthGuard>
    <div class="filter_section">
      <CheckboxList
        :items="categoryItems"
        buttonText="на любую тему"
        @update:selectedItems="updateCategories"
      />
      <div v-if="selectedCategoriesLabels.length" class="selected-filters">
        <span v-for="(label, index) in selectedCategoriesLabels" :key="index" class="filter-chip">
          {{ label }}
          <button @click="removeCategory(index)">✕</button>
        </span>
      </div>
    </div>
    <div class="filter_section">
      <CheckboxList
        :items="cityItems"
        buttonText="в любом городе"
        @update:selectedItems="updateCities"
      />
      <div v-if="selectedCities.length" class="selected-filters">
        <span v-for="(city, index) in selectedCities" :key="index" class="filter-chip">
          {{ city }}
          <button @click="removeCity(index)">✕</button>
        </span>
      </div>
    </div>
    <div class="filter_section datepicker-section">
      <DatePicker @updateDateRange="updateDateRange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useMasterClassesStore } from '@/stores/masterClasses'
import DatePicker from '@/components/ui/filter/DatePicker.vue'
import CheckboxList from '@/components/ui/filter/CheckboxList.vue'
import { fetchCategories, fetchCities } from '@/services/masterClassService'
import AuthGuard from '@/components/ui/permission/AuthGuard.vue'
import router from '@/routes'

const categoryItems = ref<{ value: number; label: string }[]>([])
const cityItems = ref<{ value: string; label: string }[]>([])

const store = useMasterClassesStore()

const selectedCategories = ref<number[]>([])
const selectedCities = ref<string[]>([])

const goToAddMasterClass = () => {
  router.push({ name: 'AddMasterClass' })
}

const loadItems = async () => {
  try {
    const [categories, cities] = await Promise.all([fetchCategories(), fetchCities()])

    categoryItems.value = categories.map((cat: { id: number; name: string }) => ({
      value: cat.id,
      label: cat.name
    }))

    cityItems.value = cities.map((city: { locality: string }) => ({
      value: city.locality,
      label: city.locality
    }))
  } catch (error) {
    console.error('не удалось загрузить данные', error)
  }
}

const updateCategories = (selectedCategoriesArray: number[]) => {
  selectedCategories.value = selectedCategoriesArray
  store.setSelectedCategories(selectedCategoriesArray)
  store.fetchMasterClasses()
  // saveFilters();
}

const updateCities = (selectedCitiesArray: string[]) => {
  selectedCities.value = selectedCitiesArray
  store.setSelectedCities(selectedCitiesArray)
  store.fetchMasterClasses()
}

const updateDateRange = (dateRange: { startDate: Date | null; endDate: Date | null }) => {
  store.setStartDate(dateRange.startDate)
  store.setEndDate(dateRange.endDate)
  store.fetchMasterClasses()
}

const selectedCategoriesLabels = computed(() => {
  return selectedCategories.value
    .map((id) => categoryItems.value.find((cat) => cat.value === id)?.label)
    .filter(Boolean)
})

const removeCategory = (index: number) => {
  selectedCategories.value.splice(index, 1)
  updateCategories([...selectedCategories.value])
}

const removeCity = (index: number) => {
  selectedCities.value.splice(index, 1)
  updateCities([...selectedCities.value])
}

onMounted(() => {
  loadItems()
})

watch([selectedCategories, selectedCities, store.startDate, store.endDate] as any, () => {
  store.fetchMasterClasses()
})
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.filter_container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  max-width: 1320px;
  margin-bottom: 60px;
}

.add_ms_button {
  max-height: 40px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: $green;
  color: $white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken($green, 10%);
  }
}

.filter_section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selected-filters {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  background-color: $green;
  color: $white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.filter-chip button {
  background: none;
  border: none;
  color: $white;
  cursor: pointer;
  font-size: 16px;
}

.datepicker-section {
  display: flex;
}

@media (max-width: 768px) {
  .filter_container {
    flex-direction: column;
    //padding: 0 10px;
  }

  .filter_section {
    width: 100%;
  }
}

.search_section {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 0px 0px 20px 0px;

  @media (max-width: 768px) {
    margin: 0px 0px 20px 0px;

  }
}

.search_input {
  width: 100%;
  padding: 10px;
  border: 1px solid $green;
  border-radius: 5px;
  font-size: 14px;
}

.search_button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: $green;
  color: $white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken($green, 10%);
  }
}
</style>