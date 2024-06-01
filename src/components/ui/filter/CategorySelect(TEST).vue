<!--<template>-->
<!--  <div class="category-select">-->
<!--    <Multiselect-->
<!--      v-model="selectedCategories"-->
<!--      mode="tags"-->
<!--      :close-on-select="false"-->
<!--      :searchable="true"-->
<!--      :create-option="true"-->
<!--      label="label"-->
<!--      placeholder="Выберите категории"-->
<!--      track-by="value"-->
<!--      :options="categories"-->
<!--      class="multiselect-styled"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, onMounted } from 'vue'-->
<!--import Multiselect from '@vueform/multiselect'-->
<!--import { fetchCategories } from '@/services/masterClassService'-->
<!--import '@vueform/multiselect/themes/default.css'-->

<!--const categories = ref([])-->
<!--const selectedCategories = ref([])-->

<!--const loadCategories = async () => {-->
<!--  try {-->
<!--    const fetchedCategories = await fetchCategories()-->
<!--    categories.value = fetchedCategories.map((cat) => ({-->
<!--      value: cat.id,-->
<!--      label: cat.name-->
<!--    }))-->
<!--  } catch (error) {-->
<!--    console.error('Failed to load categories', error)-->
<!--  }-->
<!--}-->
<!--onMounted(() => {-->
<!--  loadCategories()-->
<!--})-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--@import '@/assets/variables';-->

<!--.category-select {-->
<!--  width: 450px;-->
<!--}-->

<!--button {-->
<!--  margin-top: 10px;-->
<!--  padding: 8px 16px;-->
<!--  border: 1px solid $green;-->
<!--  border-radius: 5px;-->
<!--  background-color: $white;-->
<!--  color: $green;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.multiselect-styled {-->
<!--  &#45;&#45;ms-tag-bg: #366159FF;-->
<!--}-->
<!--</style>-->
