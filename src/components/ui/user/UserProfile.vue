<template>
  <div v-if="user" class="user-profile">
    <div class="user-profile__header">
      <img :src="fullImageUrl" alt="User Image" class="user-profile__image" />
      <div v-if="editMode" class="user-profile__image-upload">
        <input type="file" @change="onImageChange" class="user-profile__file-input" />
      </div>
    </div>
    <form @submit.prevent="saveChanges">
      <div class="user-profile__info">
        <h2>{{ user.username }}</h2>
        <div class="user-info">
          <div class="user-info__field">
            <label>Имя:</label>
            <span v-if="!editMode">{{ user.first_name || 'не указано' }}</span>
            <input v-else v-model="editableUser.first_name" />
          </div>
          <div class="user-info__field">
            <label>Фамилия:</label>
            <span v-if="!editMode">{{ user.last_name || 'не указано' }}</span>
            <input v-else v-model="editableUser.last_name" />
          </div>
          <div class="user-info__field">
            <label>Электронная почта:</label>
            <span v-if="!editMode">{{ user.email }}</span>
            <input v-else v-model="editableUser.email" type="email" />
          </div>
          <div class="user-info__field">
            <label>Роль:</label>
            <span>{{ translatedRole }}</span>
          </div>
          <div class="user-info__field">
            <label>Дата регистрации:</label>
            <span>{{ formatDate(user.date_joined ?? '') }}</span>
          </div>
          <div class="user-info__field">
            <label>Био:</label>
            <span v-if="!editMode">{{ user.bio || 'не указано' }}</span>
            <textarea v-else v-model="editableUser.bio"></textarea>
          </div>
          <div class="user-info__field">
            <label>Возраст:</label>
            <span v-if="!editMode">{{ user.age !== null ? user.age : 'не указано' }}</span>
            <input v-else v-model="editableUser.age" type="number" />
          </div>
          <div class="user-info__field">
            <label>Пол:</label>
            <span v-if="!editMode">{{ user.gender || 'не указано' }}</span>
            <select v-else v-model="editableUser.gender">
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>
        <div class="user-profile__actions">
          <button v-if="!editMode" @click="enableEditMode">Редактировать</button>
          <button v-else type="submit">Сохранить</button>
          <button v-if="editMode" @click="cancelEdit">Отмена</button>
        </div>
      </div>
    </form>
    <a class="logout-link" @click="confirmLogout">Выйти</a>
  </div>
  <div v-else>
    <p>Загрузка данных пользователя...</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { formatDate } from '@/utils/formatDate'
import { rolesDictionary } from '@/utils/rolesDictionary'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { userService } from '@/services/usersService'

interface User {
  id: number
  username: string
  role: string
  first_name?: string
  last_name?: string
  email?: string
  date_joined?: string
  bio?: string
  age?: number
  gender?: string
  image?: string
}

const userStore = useUserStore()
const user = computed<User | null>(() => userStore.user)
const translatedRole = computed(
  () => rolesDictionary[user.value?.role as string] || user.value?.role
)
const router = useRouter()
const { showToast } = useToast()

const editMode = ref(false)
const editableUser = ref<Partial<User>>({ ...user.value })
const newAvatar = ref<File | null>(null)

const fullImageUrl = computed(() => {
  if (user.value?.image) {
    return user.value.image.startsWith('http')
      ? user.value.image
      : `http://localhost:8000${user.value.image}`
  }
  return ''
})

const enableEditMode = () => {
  editableUser.value = { ...user.value }
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
}

const saveChanges = async () => {
  try {
    const formData = new FormData()
    formData.append('username', editableUser.value.username as string)
    formData.append('email', editableUser.value.email as string)
    formData.append('first_name', editableUser.value.first_name || '')
    formData.append('last_name', editableUser.value.last_name || '')
    formData.append('bio', editableUser.value.bio || '')
    formData.append('age', editableUser.value.age?.toString() || '')
    formData.append('gender', editableUser.value.gender || '')
    if (newAvatar.value) {
      formData.append('image', newAvatar.value)
    }

    const response = await userService.updateUser(user.value!.id, formData)
    console.log(JSON.stringify(response.data, null, 2))
    if (response.status === 200) {
      await userStore.fetchUser(user.value!.id)
      showToast(response.data.message, 'success')
      editMode.value = false
      router.go(0)
    }
  } catch (error) {
    const err = error as { message: string }
    console.error('Error during saveChanges:', error)
    showToast(`Ошибка при сохранении изменений: ${err.message}`, 'error')
  }
}

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newAvatar.value = target.files[0]
  }
}

const confirmLogout = () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    logout()
  }
}

const logout = () => {
  userStore.logout()
  showToast('Вы успешно вышли из системы', 'success')
  router.push({ name: 'Home' })
}
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.user-profile__image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  border: solid 3px $green;
}

.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  &__header {
    text-align: center;
    margin-bottom: 20px;
    position: relative;

    &__image-upload {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__upload-button {
      padding: 5px 10px;
      background-color: $green;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: darken($green, 10%);
      }
    }

    &__file-input {
      display: none;
    }
  }

  &__info {
    text-align: center;

    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;

      &__field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #ddd;

        label {
          font-weight: bold;
        }

        span,
        input,
        textarea,
        select {
          color: #3f3f55;
        }

        input,
        textarea,
        select {
          flex-grow: 1;
          margin-left: 10px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      }
    }
  }

  &__actions {
    text-align: center;
    margin-top: 20px;

    button {
      margin: 0 10px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: $green;
      color: #fff;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background-color: darken($green, 10%);
      }
    }
  }

  .logout-link {
    display: inline-block;
    margin-top: 20px;
    color: red;
    cursor: pointer;
    text-decoration: underline;
    font-size: 20px;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
