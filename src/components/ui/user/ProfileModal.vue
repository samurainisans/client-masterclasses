<template>
  <div class="profile-modal">
    <div class="popper__arrow"></div>
    <div class="profile-modal__header">
      <div class="profile-modal__info" v-if="user">
        <h3>{{ user.username }}</h3>
        <p>ID {{ user.id }}</p>
      </div>
    </div>
    <ul class="profile-modal__list">
      <li><a @click="goToProfile">Профиль</a></li>
      <li><a href="#">Мои мероприятия</a></li>
      <AuthGuard :roles="['Organizer', 'Admin']">
        <li><a href="#">Мои заявки</a></li>
      </AuthGuard>
      <li><a href="#">Избранные</a></li>
      <li><a href="#" @click="logout">Выход</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import AuthGuard from '@/components/ui/permission/AuthGuard.vue'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const router = useRouter()

const goToProfile = () => {
  router.push({ name: 'Profile' })
}

const logout = () => {
  userStore.logout()
  userStore.isAuthenticated = false
  router.push({ name: 'Home' })
}
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.profile-modal {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;

  .popper__arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }
}

.profile-modal__header {
  display: flex;
  align-items: center;
}

.profile-modal__info h3 {
  margin: 0;
}

.profile-modal__list {
  list-style: none;
  padding: 0;
}

.profile-modal__list li {
  margin-top: 10px;
}

.profile-modal__list a {
  color: $green;
  text-decoration: none;
  cursor: pointer;
}

.profile-modal__list a:hover {
  text-decoration: underline;
}
</style>
