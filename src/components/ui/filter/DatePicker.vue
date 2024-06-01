<template>
  <div class="datepicker-container">
    <VueDatePicker
      cancel-text="Отмена"
      select-text="Выбрать диапазон"
      locale="ru"
      v-model="date"
      :range="{ partialRange: true }"
      now-button-label="Сейчас"
      placeholder="Выберите диапазон даты"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref(null)
</script>

<style scoped lang="scss">
.datepicker-container {
  width: 400px;
  //--dp-menu-min-width: 600px;
  //--dp-calendar-header-cell-padding: 1rem;
  //--dp-cell-size: 35px;
}

.dp__menu_inner {
  width: var(--dp-menu-min-width) !important;
}

.dp__cell {
  width: var(--dp-cell-size) !important;
  height: var(--dp-cell-size) !important;
}

.dp__header {
  font-size: var(--dp-font-size) !important;
  padding: var(--dp-calendar-header-cell-padding) !important;
}
</style>
