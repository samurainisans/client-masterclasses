<!-- src\components\ui\masterclass\CreateMasterClassForm.vue-->
<template>
  <div class="form-container">
    <h2>Заполните основную информацию</h2>
    <form @submit.prevent="submitForm">
      <!-- название мероприятия -->
      <label>
        Укажите название мероприятия
        <input type="text" v-model="form.title" required />
      </label>

      <!-- тип мероприятия (категорию) -->
      <label>
        Выберите тип мероприятия
        <select v-model="form.category_id" required>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <!-- Превью -->
      <label>
        Превью
        <input type="file" @change="handleFileUpload" />
      </label>

      <!-- описание мероприятия -->
      <label>
        Описание мероприятия
        <textarea v-model="form.description" required></textarea>
      </label>

      <!-- Адрес мероприятия -->
      <label>
        Укажите адрес мероприятия
        <input type="text" v-model="form.address" required />
      </label>

      <!-- Время и дата -->
      <label>
        Укажите время и дату
        <input type="datetime-local" v-model="form.start_date" required />
        <input type="datetime-local" v-model="form.end_date" required />
      </label>

      <button type="submit">Создать мероприятие</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMasterClassesStore } from '@/stores/masterClasses';

const masterClassesStore = useMasterClassesStore();
const form = ref({
  title: '',
  category_id: '',
  description: '',
  access_level: 'public',
  format: 'online',
  address: '',
  start_date: '',
  end_date: '',
});

const categories = ref([]);

const fetchCategories = async () => {
  try {
    categories.value = await masterClassesStore.fetchCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

onMounted(() => {
  fetchCategories();
});

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files[0];
  form.value.image = file;
};

const submitForm = async () => {
  try {
    await masterClassesStore.createMasterClass(form.value);
    alert('Мероприятие успешно создано');
  } catch (error) {
    console.error('Error creating master class:', error);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
}
</style>
