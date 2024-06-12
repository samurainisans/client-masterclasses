<!-- src/components/ui/auth/LoginPage.vue-->
<template>
  <div class="auth-page-wrapper">
    <div class="auth-page">
      <h3 class="page-title">Вход</h3>
      <form @submit.prevent="handleLogin" ref="loginFormRef">
        <div class="form-item">
          <input id="username" v-model="loginForm.username" type="text" placeholder="Логин" required />
        </div>
        <div class="form-item">
          <input id="password" v-model="loginForm.password" type="password" placeholder="Пароль" required />
        </div>
        <div class="form-item">
          <button type="submit" class="primary-btn">Войти</button>
        </div>
      </form>
      <div class="page-footer">
        <span>Нет аккаунта? <router-link to="/register" class="text-btn">Зарегистрироваться</router-link></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';

interface LoginForm {
  username: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
});

const loginFormRef = ref<HTMLFormElement | null>(null);
const userStore = useUserStore();

const handleLogin = async () => {
  try {
    await userStore.login(loginForm);
    alert('Успешный вход');
    resetForm();
  } catch (error) {
    alert('Ошибка входа');
  }
};

const resetForm = () => {
  loginForm.username = '';
  loginForm.password = '';
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables";

.auth-page-wrapper {
  background-color: #f0f5fa;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-page {
  width: 400px;
  padding: 40px;
  background-color: $white;
  border: 1px solid $color-border;
  border-radius: 10px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.page-footer {
  margin-top: 20px;
  text-align: center;

  .text-btn {
    color: $color-primary;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  input[type="text"],
  input[type="password"] {
    background-color: $color-background;
    border: 1px solid $color-border;
    border-radius: 4px;
    color: $color-text;
    font-size: 16px;
    padding: 12px;
    width: 100%;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: $color-primary;
    }
  }
}

.primary-btn {
  font-family: inherit;
  background-color: $color-primary;
  color: $white;
  padding: 12px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 48px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: $color-primary-hover;
  }
}

.text-btn {
  background: none;
  border: none;
  color: $color-primary;
  padding: 0;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: $color-primary-hover;
  }
}
</style>
