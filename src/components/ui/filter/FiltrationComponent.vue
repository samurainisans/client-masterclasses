<!-- components/ui/filter/FiltrationComponent.vue -->
<template>
  <div class="filter_container">
    <div class="filter_section">
      <h3>Выберите категорию</h3>
      <CheckboxList :items="categoryItems" @update:selectedItems="updateCategories" />
    </div>
    <div class="filter_section">
      <h3>Выберите город</h3>
      <CheckboxList :items="cityItems" @update:selectedItems="updateCities" />
    </div>
    <div class="filter_section datepicker-section">
      <h3>Выберите дату</h3>
      <DatePicker @updateDateRange="updateDateRange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMasterClassesStore } from '@/stores/masterClasses';
import DatePicker from '@/components/ui/filter/DatePicker.vue';
import CheckboxList from '@/components/ui/filter/CheckboxList.vue';
import { fetchCategories, fetchCities } from '@/services/masterClassService';

const categoryItems = ref<{ value: number; label: string }[]>([]);
const cityItems = ref<{ value: string; label: string }[]>([]);

const store = useMasterClassesStore();

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
    console.error('Не удалось загрузить данные', error);
  }
};

const updateCategories = (selectedCategories: number[]) => {
  store.setSelectedCategories(selectedCategories);
  store.fetchMasterClasses();
};

const updateCities = (selectedCities: string[]) => {
  store.setSelectedCities(selectedCities);
  store.fetchMasterClasses();
};

const updateDateRange = (dateRange: { startDate: Date | null, endDate: Date | null }) => {
  store.setStartDate(dateRange.startDate);
  store.setEndDate(dateRange.endDate);
  store.fetchMasterClasses();
};

onMounted(() => {
  loadItems();
});
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
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.datepicker-section {
}

.navbar__select {
  padding: 10px 20px;
  border: 1px solid $green;
  border-radius: 5px;
  background-color: $white;
  font-size: 14px;
  color: $green;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

h3 {
  margin-bottom: 10px;
  color: $color-text;
  text-align: center;
}
</style>
