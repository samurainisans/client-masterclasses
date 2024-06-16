<!-- src/components/ui/navigation/Nav.vue -->
<template>
  <nav class="navbar">
    <div class="navbar__container">
      <div class="navbar__logo" @click="goToHome">Главная</div>
      <div class="navbar__search">
        <input
          type="text"
          placeholder="Найти мероприятие"
          v-model="searchQuery"
          @keyup.enter="searchMasterClasses"
        />
      </div>
      <AuthGuard :roles="['Organizer', 'Admin']">
        <div class="navbar__filters">
          <a class="navbar__link" @click="goToMap">На карту</a>
        </div>
      </AuthGuard>
      <div class="navbar__actions">
        <img
          v-if="!isAuthenticated"
          class="navbar__icon"
          src="@/assets/imgs/LogOutIcon.svg"
          @click="openAuthModal"
          alt="Login"
          title="Войти"
        />
        <AuthGuard :roles="['Organizer', 'Admin']">
          <button class="navbar__button" @click="goToAddMasterClass" title="Добавить мастер-класс">
            Добавить мастер-класс
          </button>
        </AuthGuard>
        <div class="navbar__profile-wrapper">
          <img
            v-if="isAuthenticated"
            class="navbar__profile-icon"
            src="@/assets/imgs/ProfileIcon.svg"
            @click="toggleProfileModal"
            alt="Profile"
            title="Профиль"
          />
          <ProfileModal v-if="isProfileModalVisible && isAuthenticated" @close="toggleProfileModal" />
        </div>
      </div>
    </div>
    <LoginModal :visible="isLoginModalVisible" @close="closeLoginModal" />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMasterClassesStore } from '@/stores/masterClasses';
import { useUserStore } from '@/stores/userStore';
import LoginModal from '@/components/ui/auth/LoginModal.vue';
import AuthGuard from "@/components/ui/permission/AuthGuard.vue";
import ProfileModal from "@/components/ui/user/ProfileModal.vue";

const router = useRouter();
const searchQuery = ref('');
const masterClassesStore = useMasterClassesStore();
const userStore = useUserStore();
const isLoginModalVisible = ref(false);
const isProfileModalVisible = ref(false);

const user = computed(() => userStore.user);
const isAuthenticated = computed(() => userStore.isAuthenticated);

const openAuthModal = () => {
  isLoginModalVisible.value = true;
};

const closeLoginModal = () => {
  isLoginModalVisible.value = false;
};

const toggleProfileModal = () => {
  isProfileModalVisible.value = !isProfileModalVisible.value;
};

// наблюдение за состоянием аутентификации, чтобы закрыть модальное окно профиля при выходе
watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    isProfileModalVisible.value = false;
  }
});

const goToHome = () => {
  router.push({ name: 'Home' });
};

const goToMap = () => {
  router.push({ name: 'Map' });
};

const goToAddMasterClass = () => {
  router.push({ name: 'AddMasterClass' });
};

const searchMasterClasses = async () => {
  try {
    await masterClassesStore.searchMasterClassesByTitle(searchQuery.value);
  } catch (error) {
    console.error('Error searching master classes:', error);
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/variables';

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

  &__actions {
    display: flex;
    align-items: center;

    .navbar__icon {
      height: 40px;
      cursor: pointer;
      margin-left: 10px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    .navbar__button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: $green;
      color: $white;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;

      &:hover {
        background-color: darken($green, 10%);
      }
    }

    .navbar__profile-wrapper {
      position: relative;
      display: inline-block;
    }

    .navbar__profile-icon {
      height: 40px;
      margin-left: 10px;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
