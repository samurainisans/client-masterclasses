<script setup lang="ts">

import DatePicker from "@/components/ui/filter/DatePicker.vue";
</script>

<template>
  <div class="filter_container">
    <select class="navbar__select">
      <option>все города</option>
      <!-- дополнительные опции -->
    </select>
    <select class="navbar__select">
      <option>в любое время</option>
      <!-- дополнительные опции -->
    </select>
    <select class="navbar__select">
      <option value="">категории</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
    </select>
    <DatePicker />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";

.navbar__select {
  padding: 8px 16px;
  border: 1px solid $green;
  border-radius: 5px;
  background-color: $white;
  font-size: 14px;
  color: $green;
  cursor: pointer;
}
</style>