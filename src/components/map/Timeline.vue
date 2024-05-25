<!-- Timeline.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';

const props = defineProps<{
  startDate?: Date,
  endDate?: Date
}>();

const emit = defineEmits<{
  (e: 'changeData', data: { startDate: Date, interval: string, mode: string }): void
}>();

const intervals = ['день', 'неделя', 'месяц'];
const modes = ['точный период', 'накопительно'];
const selectedInterval = ref(intervals[1]);
const selectedMode = ref(modes[0]);
const value = ref(0);
const maxRange = ref(0);

function adjustSliderRange() {
  if (!props.startDate || !props.endDate) return;

  const diffTime = props.endDate.getTime() - props.startDate.getTime();
  switch (selectedInterval.value) {
    case 'день':
      maxRange.value = Math.ceil(diffTime / (1000 * 3600 * 24));
      break;
    case 'неделя':
      maxRange.value = Math.ceil(diffTime / (1000 * 3600 * 24 * 7));
      break;
    default:
      maxRange.value = Math.ceil(diffTime / (1000 * 3600 * 24 * 30));
  }
  value.value = 0;
}

watch([() => props.startDate, () => props.endDate, selectedInterval], adjustSliderRange, { immediate: true });

function handleChange(event: Event) {
  const newValue = parseInt((event.target as HTMLInputElement).value, 10);
  if (!props.startDate) return;

  const newStartDate = new Date(props.startDate.getTime() + newValue * getCurrentIntervalMilliseconds());
  emit('changeData', { startDate: newStartDate, interval: selectedInterval.value, mode: selectedMode.value });
  updateSliderBackground(newValue);
}

function getCurrentIntervalMilliseconds() {
  switch (selectedInterval.value) {
    case 'день':
      return 1000 * 3600 * 24;
    case 'неделя':
      return 1000 * 3600 * 24 * 7;
    default:
      return 1000 * 3600 * 24 * 30;
  }
}

function updateSliderBackground(value: number) {
  const inputRange = document.querySelector('.timeline__input-range') as HTMLInputElement;
  const percentage = (value / maxRange.value) * 100;
  inputRange.style.setProperty('--value', `${percentage}`);
}
</script>

<template>
  <div class="timeline">
    <div class="timeline__controls">
      <SelectComponent :options="intervals" v-model="selectedInterval" />
      <SelectComponent :options="modes" v-model="selectedMode" />
    </div>
    <div class="timeline__slider">
      <input type="range" :min="0" :max="maxRange" v-model="value" @input="handleChange" class="timeline__input-range"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
@import "@/assets/select-styles";

.timeline {
  display: flex;
  gap: 20px;

  &__controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  &__slider {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__input-range {
    -webkit-appearance: none;
    appearance: none;
    width: 650px;
    height: 10px;
    border-radius: 7.5px;
    background: $white;
    outline: none;
    opacity: 1;
    transition: 0.2s;
    position: relative;
    vertical-align: middle;
    --value: 0;

    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 10px;
      border-radius: 7.5px;
      background: linear-gradient(to right, $green var(--value, 0%), $white var(--value, 0%));
      border: 1px solid $green;
    }

    &::-moz-range-track {
      width: 100%;
      height: 10px;
      border-radius: 7.5px;
      background: linear-gradient(to right, $green var(--value, 0%), $white var(--value, 0%));
      border: 1px solid $green;
    }

    &::-ms-track {
      width: 100%;
      height: 10px;
      border-radius: 7.5px;
    }

    &::-ms-fill-lower {
      background: $green;
      border-radius: 7.5px;
    }

    &::-ms-fill-upper {
      background: $white;
      border-radius: 7.5px;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 23px;
      height: 23px;
      border-radius: 50%;
      background: $green;
      cursor: pointer;
      position: relative;
      z-index: 2;
      margin-top: -6.5px;
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: $green;
      cursor: pointer;
      border: none;
      position: relative;
      z-index: 2;
      margin-top: -5px;
    }

    &::-ms-thumb {
      width: 23px;
      height: 23px;
      border-radius: 50%;
      background: $green;
      cursor: pointer;
      position: relative;
      z-index: 2;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      height: 100%;
      border-radius: 7.5px;
      z-index: 1;
    }

    &::before {
      width: calc(var(--value, 0) * 1%);
      background: $green;
      left: 0;
    }

    &::after {
      width: calc(100% - var(--value, 0) * 1%);
      background: $white;
      right: 0;
    }
  }
}
</style>
