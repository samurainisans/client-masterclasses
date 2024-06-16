<!-- src/components/ui/filter/FiltrationComponent.vue -->
<template>
  <div class="filter_container">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useMasterClassesStore } from '@/stores/masterClasses';
import DatePicker from '@/components/ui/filter/DatePicker.vue';
import CheckboxList from '@/components/ui/filter/CheckboxList.vue';
import { fetchCategories, fetchCities } from '@/services/masterClassService';

const categoryItems = ref<{ value: number; label: string }[]>([]);
const cityItems = ref<{ value: string; label: string }[]>([]);

const store = useMasterClassesStore();

const selectedCategories = ref<number[]>([]);
const selectedCities = ref<string[]>([]);

const loadItems = async () => {
  try {
    const [categories, cities] = await Promise.all([fetchCategories(), fetchCities()]);

    categoryItems.value = categories.map((cat: { id: number; name: string }) => ({
      value: cat.id,
      label: cat.name,
    }));

    cityItems.value = cities.map((city: { locality: string }) => ({
      value: city.locality,
      label: city.locality,
    }));
  } catch (error) {
    console.error('не удалось загрузить данные', error);
  }
};

const updateCategories = (selectedCategoriesArray: number[]) => {
  selectedCategories.value = selectedCategoriesArray;
  store.setSelectedCategories(selectedCategoriesArray);
  store.fetchMasterClasses();
  saveFilters();
};

const updateCities = (selectedCitiesArray: string[]) => {
  selectedCities.value = selectedCitiesArray;
  store.setSelectedCities(selectedCitiesArray);
  store.fetchMasterClasses();
  saveFilters();
};

const updateDateRange = (dateRange: { startDate: Date | null, endDate: Date | null }) => {
  store.setStartDate(dateRange.startDate);
  store.setEndDate(dateRange.endDate);
  store.fetchMasterClasses();
  saveFilters();
};

const saveFilters = () => {
  localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories.value));
  localStorage.setItem('selectedCities', JSON.stringify(selectedCities.value));
  localStorage.setItem('startDate', store.startDate ? store.startDate.toISOString() : '');
  localStorage.setItem('endDate', store.endDate ? store.endDate.toISOString() : '');
};

const loadFilters = () => {
  const savedCategories = localStorage.getItem('selectedCategories');
  const savedCities = localStorage.getItem('selectedCities');
  const savedStartDate = localStorage.getItem('startDate');
  const savedEndDate = localStorage.getItem('endDate');

  if (savedCategories) {
    selectedCategories.value = JSON.parse(savedCategories);
    store.setSelectedCategories(selectedCategories.value);
  }

  if (savedCities) {
    selectedCities.value = JSON.parse(savedCities);
    store.setSelectedCities(selectedCities.value);
  }

  if (savedStartDate) {
    store.setStartDate(savedStartDate ? new Date(savedStartDate) : null);
  }

  if (savedEndDate) {
    store.setEndDate(savedEndDate ? new Date(savedEndDate) : null);
  }
};

const selectedCategoriesLabels = computed(() => {
  return selectedCategories.value.map(id => categoryItems.value.find(cat => cat.value === id)?.label).filter(Boolean);
});

const removeCategory = (index: number) => {
  selectedCategories.value.splice(index, 1);
  updateCategories([...selectedCategories.value]);
};

const removeCity = (index: number) => {
  selectedCities.value.splice(index, 1);
  updateCities([...selectedCities.value]);
};

onMounted(() => {
  loadItems();
  loadFilters();
});

watch([selectedCategories, selectedCities, store.startDate, store.endDate], saveFilters);
</script>
<style scoped lang="scss">
@import '@/assets/variables';

.filter_container {
  display: flex;
  gap: 50px;
  padding: 20px;
  justify-content: center;
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
  margin-left: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
