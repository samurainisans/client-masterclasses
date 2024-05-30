// src/components/ui/Nav.vue
<template>
  <nav class="navbar">
    <div class="navbar__container">
      <div class="navbar__logo" @click="goToHome">ЛОГО</div>
      <div class="navbar__search">
        <input type="text" placeholder="Найти мероприятие" />
      </div>
      <div class="navbar__filters">
        <select class="navbar__select">
          <option>все города</option>
          <!-- дополнительные опции -->
        </select>
        <select class="navbar__select">
          <option>в любое время</option>
          <!-- дополнительные опции -->
        </select>
        <select class="navbar__select">
          <option>на любую тему</option>
          <!-- дополнительные опции -->
        </select>
        <a class="navbar__link" @click="goToMap">На карту</a>
      </div>
      <div class="navbar__actions">
        <button class="navbar__button" @click="openAuthModal">Войти</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { inject } from 'vue';

const router = useRouter();
const openAuthModal = inject('openAuthModal') as () => void;

const goToHome = () => {
  router.push({ name: 'Home' });
};
const goToMap = () => {
  router.push({ name: 'Map' });
};
</script>

<style scoped lang="scss">
@import "@/assets/variables";

.navbar__link {
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
}

.navbar {
  width: 100%;
  background-color: $white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px;

  &__container {
    width: 100%;
    max-width: 1520px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }

  &__logo {
    font-size: 24px;
    font-weight: bold;
    color: $green;
    cursor: pointer;
  }

  &__search {
    flex: 1;
    margin: 0 50px;

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid $green;
      border-radius: 5px;
      font-size: 14px;
      gap: 20px;
    }
  }

  &__filters {
    display: flex;
    gap: 20px;

    .navbar__select {
      padding: 8px 16px;
      border: 1px solid $green;
      border-radius: 5px;
      background-color: $white;
      font-size: 14px;
      color: $green;
      cursor: pointer;
    }
  }

  &__actions {
    display: flex;
    align-items: center;

    .navbar__button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: $green;
      color: $white;
      cursor: pointer;
      font-size: 14px;
      margin-left: 200px;
      &:hover {
        background-color: darken($green, 10%);
      }
    }
  }
}
</style>
