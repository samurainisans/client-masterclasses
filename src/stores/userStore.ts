// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { userService, parseJwt } from '@/services/usersService';
import { ref } from 'vue';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const accessToken = ref(Cookies.get('access_token') || null);
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
        Cookies.set('access_token', response.access, { secure: true });
        Cookies.set('refresh_token', response.refresh, { secure: true });
        accessToken.value = response.access;
        isAuthenticated.value = true;

        const decodedToken = parseJwt(response.access);
        const userId = decodedToken.user_id;
        await fetchUser(userId);
      } else {
        throw new Error('Ошибка авторизации: токены не получены');
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchUser = async (userId: number) => {
    try {
      const response = await userService.getUserInfo(userId);
      user.value = response.data;  // Сохраняем данные пользователя
    } catch (error) {
      throw error;
    }
  };

  const checkUser = async () => {
    if (!user.value && accessToken.value) {
      const decodedToken = parseJwt(accessToken.value);
      await fetchUser(decodedToken.user_id);
    }
  };

  const logout = () => {
    userService.logout();
    user.value = null;
    accessToken.value = null;
    isAuthenticated.value = false;
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    register,
    login,
    fetchUser,
    checkUser,
    logout,
  };
});
