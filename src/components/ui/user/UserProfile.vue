<template>
  <div v-if="user" class="user-profile">
    <h2>Информация о пользователе</h2>
    <div class="user-info">
      <div class="user-info__field">
        <label>Имя пользователя:</label>
        <span>{{ user.username }}</span>
      </div>
      <div class="user-info__field">
        <label>Электронная почта:</label>
        <span>{{ user.email }}</span>
      </div>
      <div class="user-info__field">
        <label>Имя:</label>
        <span>{{ user.first_name }}</span>
      </div>
      <div class="user-info__field">
        <label>Фамилия:</label>
        <span>{{ user.last_name }}</span>
      </div>
      <div class="user-info__field">
        <label>Роль:</label>
        <span>{{ translatedRole }}</span>
      </div>
      <div class="user-info__field">
        <label>Дата регистрации:</label>
        <span>{{ formatDate(user.date_joined) }}</span>
      </div>
      <div class="user-info__field" v-if="user.bio">
        <label>Био:</label>
        <span>{{ user.bio }}</span>
      </div>
      <div class="user-info__field" v-if="user.age">
        <label>Возраст:</label>
        <span>{{ user.age }}</span>
      </div>
      <div class="user-info__field" v-if="user.gender">
        <label>Пол:</label>
        <span>{{ user.gender }}</span>
      </div>
      <div class="user-info__image" v-if="user.image">
        <img :src="user.image" alt="User Image" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>Загрузка данных пользователя...</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils/formatDate';
import { rolesDictionary } from '@/utils/rolesDictionary';
import { parseJwt } from '@/services/usersService';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const translatedRole = computed(() => rolesDictionary[user.value?.role] || user.value?.role);
</script>

<style scoped lang="scss">
.user-profile {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 15px;

    &__field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ddd;

      label {
        font-weight: bold;
      }

      span {
        color: #3f3f55;
      }
    }

    &__image {
      display: flex;
      justify-content: center;
      margin-top: 20px;

      img {
        max-width: 150px;
        border-radius: 50%;
      }
    }
  }
}
</style>
