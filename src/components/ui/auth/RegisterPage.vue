<!-- src/components/ui/auth/RegisterPage.vue -->
<template>
  <div class="auth-page-wrapper">
    <div class="auth-page">
      <h3 class="page-title">Регистрация</h3>
      <form @submit.prevent="handleRegister" ref="registerFormRef">
        <div class="form-item">
          <input id="username" v-model="registerForm.username" type="text" placeholder="Логин" required />
        </div>
        <div class="form-item">
          <input id="email" v-model="registerForm.email" type="email" placeholder="Email" required />
        </div>
        <div class="form-item">
          <input id="password" v-model="registerForm.password" type="password" placeholder="Пароль" required />
        </div>
        <div class="form-item">
          <input id="firstName" v-model="registerForm.first_name" type="text" placeholder="Имя" required />
        </div>
        <div class="form-item">
          <input id="lastName" v-model="registerForm.last_name" type="text" placeholder="Фамилия" required />
        </div>
        <div class="form-item radio-group">
          <label>
            <input type="radio" v-model="registerForm.role" value="4" /> Участник
          </label>
          <label>
            <input type="radio" v-model="registerForm.role" value="2" /> Организатор
          </label>
        </div>
        <div class="form-item">
          <button type="submit" class="primary-btn" :disabled="loading">Зарегистрироваться</button>
        </div>
      </form>
      <div v-if="loading" class="loading-spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from "@/composables/useToast";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: '4'
});

const registerFormRef = ref<HTMLFormElement | null>(null);
const userStore = useUserStore();
const router = useRouter();
const { showToast } = useToast();
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    await userStore.register(registerForm);
    showToast('Успешная регистрация! Пожалуйста, подтвердите свой аккаунт на почте.', 'success');
    resetForm();
    setTimeout(() => {
      router.push('/login');
    }, 2000); // Задержка в 2 секунды перед переадресацией
  } catch (error: any) {
    if (error.response) {
      console.error('Ошибка регистрации:', error.response.data);
      showToast(`Ошибка регистрации: ${error.response.data.message}`, 'error');
    } else {
      console.error('Ошибка регистрации:', error.message);
      showToast(`Ошибка регистрации: ${error.message}`, 'error');
    }
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const resetForm = () => {
  registerForm.username = '';
  registerForm.email = '';
  registerForm.password = '';
  registerForm.first_name = '';
  registerForm.last_name = '';
  registerForm.role = '4';
};
</script>

<style scoped lang="scss">
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
  input[type="email"],
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

.radio-group {
  display: flex;
  justify-content: space-between;

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid $color-primary;
    border-radius: 50%;
    outline: none;
    cursor: pointer;

    &:checked {
      background-color: $color-primary;
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
