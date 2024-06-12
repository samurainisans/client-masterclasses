// src\stores\userStore.ts
import { defineStore } from 'pinia';
import { userService } from '@/services/usersService';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async register(user: any) {
      try {
        const response = await userService.register(user);
        this.user = response.data.user;
        this.token = response.data.token;
      } catch (error) {
        console.error('Ошибка регистрации:', error);
      }
    },
    async login(credentials: any) {
      try {
        const response = await userService.login(credentials);
        this.user = response.data.user;
        this.token = response.data.token;
      } catch (error) {
        console.error('Ошибка входа:', error);
      }
    },
    logout() {
      this.user = null;
      this.token = null;
    }
  }
});
