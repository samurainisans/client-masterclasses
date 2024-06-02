<template>
  <div class="checkbox-container">
    <input type="text" v-model="searchQuery" placeholder="Поиск" />
    <div class="checkbox-list">
      <div v-for="item in filteredItems" :key="item.value">
        <label>
          <input type="checkbox" v-model="selectedItems" :value="item.value">
          {{ item.label }}
        </label>
      </div>
    </div>
    <button @click="resetSelection">Сбросить</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const selectedItems = ref<(number | string)[]>([]);
const searchQuery = ref('');

const emit = defineEmits(['update:selectedItems']);

watch(selectedItems, (newValue) => {
  emit('update:selectedItems', newValue);
});

const resetSelection = () => {
  selectedItems.value = [];
};

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return props.items;
  }
  return props.items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.checkbox-container {
  width: 370px;
  height: 370px;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
}

input[type="text"] {
  width: 94.5%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #dfe8f2;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }
}

.checkbox-list {
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 250px;
}

.checkbox-list div {
  margin: 5px 0;
}

label {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: $color-primary;
  color: $white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
    transition: background-color 0.3s ease, color 0.3s ease;
  font-family: $font-family;
}

button:hover {
  background-color: $color-primary-hover;
}
</style>
