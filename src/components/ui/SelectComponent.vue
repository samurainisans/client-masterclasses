<!-- SelectComponent.vue -->
<script setup lang="ts">
import { ref} from 'vue';

const props = defineProps<{
  options: string[],
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const selectedValue = ref(props.modelValue);

function handleChange(event: Event) {
  const newValue = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', newValue);
}
</script>

<template>
  <div class="custom-select">
    <select v-model="selectedValue" @change="handleChange" class="select-component">
      <option v-for="option in props.options" :key="option">{{ option }}</option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/select-styles";

</style>
