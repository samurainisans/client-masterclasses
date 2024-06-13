<!-- src/components/ui/auth/LoginModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <h3 class="modal-title">Вход</h3>
      <form @submit.prevent="handleLogin" ref="loginFormRef">
        <div class="form-item">
          <input id="username" v-model="loginForm.username" type="text" placeholder="Логин" required />
        </div>
        <div class="form-item password-item">
          <input
            id="password"
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Пароль"
            required
          />
          <span class="toggle-password" @click="togglePasswordVisibility">
            {{ showPassword ? 'Скрыть' : 'Показать' }}
          </span>
        </div>
        <div class="form-item">
          <button type="submit" class="primary-btn" :disabled="loading">Войти</button>
        </div>
      </form>
      <div v-if="loading" class="loading-spinner"></div>
      <div class="modal-footer">
        <span>Нет аккаунта? <a @click="goToRegister" class="text-btn">Зарегистрироваться</a></span>
        <br />
        <span><a @click="recoverPassword" class="text-btn">Забыли пароль?</a></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from "@/composables/useToast";

interface LoginForm {
  username: string;
  password: string;
}

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['close']);

const loginForm = ref<LoginForm>({
  username: '',
  password: ''
});

const loginFormRef = ref<HTMLFormElement | null>(null);
const userStore = useUserStore();
const router = useRouter();
const { showToast } = useToast();
const loading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login(loginForm.value);
    showToast('Успешный вход!', 'success');
    closeModal();
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 403) {
        showToast('Аккаунт не активирован. Проверьте почту для подтверждения.', 'error');
      } else if (error.response.status === 401) {
        showToast('Неверные учетные данные.', 'error');
      } else {
        showToast(`Ошибка входа: ${error.response.data.error}`, 'error');
      }
    } else {
      console.error('Ошибка входа:', error.message);
      showToast(`Ошибка входа: ${error.message}`, 'error');
    }
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const goToRegister = () => {
  closeModal();
  router.push({ name: 'Register' });
};

const recoverPassword = () => {
  closeModal();
  router.push({ name: 'RecoverPassword' }); // Предполагается, что у вас есть маршрут для восстановления пароля
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background-color: $white;
  padding: 40px;
  border-radius: 10px;
  width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
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

.password-item {
  position: relative;

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: $color-primary;
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
  font-size: 16px;
  height: 48px;
  transition: background-color 0.3s;

  &:hover {
    background-color: $color-primary-hover;
  }

  &:disabled {
    background-color: lighten($color-primary, 20%);
    cursor: not-allowed;
  }
}

.modal-footer {
  text-align: center;
  margin-top: 20px;

  .text-btn {
    color: $color-primary;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: $color-primary;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
