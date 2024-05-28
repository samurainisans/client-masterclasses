<template>
  <transition name="modal">
    <div class="modal" v-if="visible" @click.self="handleClose">
      <div class="modal-content">
        <span class="close" @click="handleClose">&times;</span>
        <h3 class="modal-title">Вход</h3>
        <p class="modal-subtitle">Войдите с помощью логина</p>
        <form @submit.prevent="handleLogin" ref="loginFormRef">
          <div class="form-item">
            <input id="username" v-model="loginForm.username" type="text" placeholder="Логин" required />
          </div>
          <div class="form-item">
            <input id="usePhone" v-model="loginForm.usePhone" type="checkbox" />
            <label for="usePhone">Использовать номер телефона для входа</label>
          </div>
          <div class="form-item">
            <input id="password" v-model="loginForm.password" type="password" placeholder="Пароль" required />
          </div>
          <div class="form-item inline">
            <div class="checkbox-wrapper">
              <div class="form-item">
                <label class="custom-checkbox">
                  <input id="rememberMe" v-model="loginForm.rememberMe" type="checkbox" />
                  <span class="checkmark"></span>
                  Запомнить меня
                </label>
              </div>
            </div>
            <button type="button" class="text-btn" @click="forgotPassword">Забыли пароль?</button>
          </div>
          <div class="form-item">
            <button type="submit" class="primary-btn">Войти</button>
          </div>
        </form>
        <div class="modal-footer">
          <span>Нет аккаунта? <button type="button" class="text-btn" @click="register">Зарегистрироваться</button></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

interface LoginForm {
  username: string;
  password: string;
  usePhone: boolean;
  rememberMe: boolean;
}

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['close']);

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  usePhone: false,
  rememberMe: true
});

const loginFormRef = ref<HTMLFormElement | null>(null);

const handleLogin = () => {
  if (loginForm.username && loginForm.password) {
    alert('Успешный вход');
    // логика авторизации
  } else {
    alert('Пожалуйста, заполните форму корректно');
  }
};

const handleClose = () => {
  emit('close');
};

const register = () => {
  // логика регистрации
  alert('Переход на страницу регистрации');
};

const forgotPassword = () => {
  // логика восстановления пароля
  alert('Восстановление пароля');
};
</script>

<style lang="scss" scoped>
@import "@/assets/auth-modal";
</style>
