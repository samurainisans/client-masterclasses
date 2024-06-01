<template>
  <div class="filter_container">
    <select class="navbar__select">
      <option>все города</option>
    </select>
    <select class="navbar__select">
      <option>в любое время</option>
    </select>
    <CategorySelect />
    <DatePicker />
  </div>
</template>

<script setup lang="ts">
import DatePicker from '@/components/ui/filter/DatePicker.vue';
import CategorySelect from "@/components/ui/filter/CategorySelect.vue";
</script>

<style scoped lang="scss">
@import '@/assets/variables';



.filter_container {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px 20px;
  background-color: $white;
}

.navbar__select {
  padding: 10px 20px;
  border: 1px solid $green;
  border-radius: 5px;
  background-color: $white;
  font-size: 14px;
  color: $green;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}
</style>
