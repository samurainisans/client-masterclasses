// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { userService } from '@/services/usersService';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);

  const register = async (userData: any) => {
    try {
      const response = await userService.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await userService.login(credentials);
      accessToken.value = response.data.access;
      refreshToken.value = response.data.refresh;
      user.value = { username: credentials.username }; // сохраняем информацию о пользователе
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    register,
    login,
  };
});
