<!-- components/ui/filter/DatePicker.vue -->
<template>
  <div class="datepicker-container">
    <VueDatePicker
      v-model="dateRange"
      @update:model-value="onUpdateDateRange"
      cancel-text="Отмена"
      select-text="Выбрать диапазон"
      locale="ru"
      :range="true"
      now-button-label="Сейчас"
      placeholder="Выберите диапазон даты"
      :min-date="new Date()"
      :inline="{ input: true }"
      auto-apply
      text-input
      model-auto
      @clear="onClearDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const dateRange = ref<Date | Date[] | null>(null);

const emit = defineEmits(['updateDateRange']);

watch(dateRange, (newValue) => {
  if (newValue === null) {
    emit('updateDateRange', { startDate: null, endDate: null });
  } else if (Array.isArray(newValue)) {
    const [startDate, endDate] = newValue;
    emit('updateDateRange', { startDate, endDate });
  }
});

const onUpdateDateRange = (newValue: Date | Date[]) => {
  dateRange.value = newValue;
};

const onClearDate = () => {
  dateRange.value = null;
  emit('updateDateRange', { startDate: null, endDate: null });
};
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.datepicker-container {
  width: 370px;
  --dp-menu-min-width: 340px;
  --dp-calendar-header-cell-padding: 1rem;
  margin: 0 auto;
}

.dp__outer_menu_wrap {
  margin-top: 10px;
}

.dp__flex_display_with_input {
  align-items: normal;
}

:root {
  --dp-font-family: $font-family;
  --dp-cell-border-radius: 4px;
  --dp-common-transition: all 0.1s ease-in;

  --dp-button-height: 35px;
  --dp-month-year-row-height: 35px;
  --dp-month-year-row-button-size: 35px;
  --dp-button-icon-height: 20px;
  --dp-cell-size: 35px;
  --dp-cell-padding: 5px;
  --dp-common-padding: 10px;
  --dp-input-icon-padding: 35px;
  --dp-input-padding: 6px 30px 6px 12px;
  --dp-menu-min-width: 260px;
  --dp-action-buttons-padding: 2px 5px;
  --dp-row-margin: 5px 0;
  --dp-calendar-header-cell-padding: 0.5rem;
  --dp-two-calendars-spacing: 10px;
  --dp-overlay-col-padding: 3px;
  --dp-time-inc-dec-button-size: 32px;
  --dp-menu-padding: 6px 8px;

  --dp-font-size: 1rem;
  --dp-preview-font-size: 0.8rem;
  --dp-time-font-size: 0.8rem;

  --dp-animation-duration: 0.1s;
  --dp-menu-appear-transition-timing: cubic-bezier(0.4, 0, 1, 1);
  --dp-transition-timing: ease-out;
}
</style>
