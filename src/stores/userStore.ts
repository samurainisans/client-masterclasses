// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { userService, parseJwt } from '@/services/usersService';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const accessToken = ref(localStorage.getItem('access_token'));
  const refreshToken = ref(localStorage.getItem('refresh_token'));
  const isAuthenticated = ref(!!accessToken.value);

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
      if (response && response.access && response.refresh) {
        accessToken.value = response.access;
        refreshToken.value = response.refresh;
        isAuthenticated.value = true;

        const decodedToken = parseJwt(response.access);
        const userId = decodedToken.user_id;
        await fetchUserInfo(userId);
      } else {
        throw new Error('Ошибка авторизации: токены не получены');
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchUserInfo = async (userId: number) => {
    try {
      const data = await userService.getUserInfo(userId);
      user.value = data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    userService.logout();
    user.value = null;
    isAuthenticated.value = false;
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    register,
    login,
    fetchUserInfo,
    logout,
  };
});
