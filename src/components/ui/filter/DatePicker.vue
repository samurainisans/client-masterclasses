<!-- components/ui/filter/DatePicker.vue -->
<template>
  <div class="datepicker-container">
    <VueDatePicker
      v-model="dateRange"
      @update:model-value="onUpdateDateRange"
      cancel-text="отмена"
      select-text="выбрать диапазон"
      locale="ru"
      :range="true"
      now-button-label="сейчас"
      placeholder="в любое время"
      :min-date="new Date()"
      auto-apply
      @clear="onClearDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const dateRange = ref<Date | Date[] | null>(null)

const emit = defineEmits(['updateDateRange'])

watch(dateRange, (newValue) => {
  if (newValue === null) {
    emit('updateDateRange', { startDate: null, endDate: null })
  } else if (Array.isArray(newValue)) {
    const [startDate, endDate] = newValue
    emit('updateDateRange', { startDate, endDate })
  }
})

const onUpdateDateRange = (newValue: Date | Date[]) => {
  dateRange.value = newValue
}

const onClearDate = () => {
  dateRange.value = null
  emit('updateDateRange', { startDate: null, endDate: null })
}
</script>

<style lang="scss">
@import '@/assets/variables';

.datepicker-container {
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  width: 200px;
  --dp-menu-min-width: 280px;
  --dp-calendar-header-cell-padding: 1rem;
  margin: 0 auto;
  font-size: 13px;
}

.dp__outer_menu_wrap {
  margin-top: 10px;
}

.dp__flex_display_with_input {
  align-items: normal;
}

.dp__input {
  font-size: 13px;
  border: 1px solid $green;
}
</style>
