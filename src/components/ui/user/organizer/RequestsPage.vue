<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const masterClassId = ref(route.params.id);
const registrations = ref([]);
const { showToast } = useToast();

const fetchRegistrations = async () => {
  try {
    const response = await axios.get(`/api/masterclasses/${masterClassId.value}/registrations/`);
    registrations.value = response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Ошибка загрузки заявок';
    showToast(errorMessage, 'error');
    console.error('Ошибка загрузки заявок:', error.response?.data || error);
  }
};

onMounted(() => {
  fetchRegistrations();
});
</script>

<template>
  <div class="my-requests">
    <h1>Заявки на мастер-класс</h1>
    <ul>
      <li v-for="registration in registrations" :key="registration.user.id">
        <p><strong>Пользователь:</strong> {{ registration.user.username }}</p>
        <p><strong>Имя:</strong> {{ registration.user.first_name }}</p>
        <p><strong>Фамилия:</strong> {{ registration.user.last_name }}</p>
        <p><strong>Email:</strong> {{ registration.user.email }}</p>
        <p><strong>Статус:</strong> {{ registration.register_state }}</p>
        <p><strong>Дата регистрации:</strong> {{ new Date(registration.date_register).toLocaleString() }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.my-requests {
  background-color: #f0f5fa;
  padding: 16px;
  border-radius: 8px;

  h1 {
    color: #333;
    margin-bottom: 16px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;

      p {
        margin: 4px 0;
      }

      strong {
        color: #333;
      }
    }
  }
}
</style>
