<template>
  <div class="card">
    <div class="image-container">
      <img :src="fullImageUrl" alt="image" class="card-image" />
      <button
        class="favorite-btn"
        @click.stop="toggleFavorite"
        :class="{ 'is-favorite': isFavorite }"
      >
        <img
          :src="isFavorite ? '/src/assets/imgs/favorited.svg' : '/src/assets/imgs/favorite.svg'"
          alt="favorite"
          class="favorite-icon"
        />
      </button>
    </div>
    <div class="card-content">
      <div class="categories">
        <span class="category-chip">{{ mainCategory }}</span>
        <span
          v-if="extraCategoriesCount > 0"
          class="extra-categories"
          @click.stop="showAllCategories"
        >{{ extraCategoriesCount }}+</span>
      </div>
      <h3>
        <router-link :to="{ name: 'MasterClassDetail', params: { id: masterClass.id } }">
          {{ masterClass.title }}
        </router-link>
      </h3>
      <p class="description">{{ masterClass.description }}</p>
      <div class="date-time">
        {{ formattedDateTime }}
      </div>
      <div class="location">{{ masterClass.locality }}</div>
    </div>

    <div v-if="isModalOpen" class="modal-categories" @click.self="isModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Все категории</h3>
          <button class="close-button" @click="isModalOpen = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="all-categories">
            <span
              class="category-chip"
              v-for="category in masterClass.categories"
              :key="category.id"
            >{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useToast } from '@/composables/useToast';
import Cookies from 'js-cookie';

const props = defineProps({
  masterClass: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const isModalOpen = ref(false);
const favoritesStore = useFavoritesStore();
const { showToast } = useToast();

const formattedDateTime = computed(() => {
  if (!props.masterClass.start_date || !props.masterClass.end_date) return '';

  const startDate = new Date(props.masterClass.start_date);
  const endDate = new Date(props.masterClass.end_date);
  const options = { month: 'long', day: 'numeric' };
  const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${startDate.toLocaleDateString('ru-RU', options)}, с ${startTime} до ${endTime} по местному времени`;
});

const mainCategory = computed(() => {
  return props.masterClass.categories[0]?.name || '';
});

const extraCategoriesCount = computed(() => {
  return props.masterClass.categories.length - 1;
});

const showAllCategories = () => {
  isModalOpen.value = true;
};

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.masterClass.id);
});

const BASE_URL = 'http://localhost:8000'; // Замените на ваш реальный базовый URL

const fullImageUrl = computed(() => {
  if (!props.masterClass.image_url) {
    return '/default-image.jpg'; // Замените на ваш реальный URL по умолчанию
  }
  if (props.masterClass.image_url.startsWith('/')) {
    return `${BASE_URL}${props.masterClass.image_url}`;
  }
  return props.masterClass.image_url;
});

const toggleFavorite = () => {
  const accessToken = Cookies.get('access_token');
  if (!accessToken) {
    showToast('Вы не авторизованы', 'warning');
    return;
  }

  if (isFavorite.value) {
    favoritesStore.removeFavorite(props.masterClass.id);
    showToast('Удалено из избранного', 'error');
  } else {
    favoritesStore.addFavorite(props.masterClass.id);
    showToast('Добавлено в избранное', 'success');
  }
};

</script>

<style scoped lang="scss">
@import '@/assets/variables';

.card {
  background-color: $white;
  border: 1.5px solid $green;
  border-radius: 8px;
  overflow: hidden;
  //margin: 0px 0 0 0;
  width: auto;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    position: relative;
    overflow: hidden;

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .favorite-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }

      .favorite-icon {
        width: 30px;
        transition: filter 0.3s ease;
      }
    }
  }

  .card-content {
    padding: 5px 15px 15px 15px;
    position: relative;

    .categories {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 10px;

      .category-chip {
        background-color: $white;
        border-radius: 15px;
        padding: 5px 10px;
        border: 1px solid $green;
        font-size: 12px;
      }

      .extra-categories {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        width: 24px;
        height: 24px;
        color: $green;
        border: 1px solid #366159;
        border-radius: 50%;
        transition:
          background-color 0.3s ease,
          color 0.3s ease;

        &:hover {
          background-color: $green;
          color: $white;
        }
      }
    }

    h3 {
      margin-bottom: 10px;
      transition: color 0.3s ease;

      &:hover {
        color: $green;
      }
    }

    a {
      text-decoration: none;
    }

    .description {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .date-time {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }

    .location {
      font-size: 14px;
      color: #666;
    }
  }

  .modal-categories {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .modal-content {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      width: 90%;
      max-width: 400px;
      max-height: 90%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .modal-header {
        padding: 10px 15px;
        background: $green;
        color: $white;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .close-button {
          background: none;
          border: none;
          color: $white;
          font-size: 24px;
          cursor: pointer;
        }
      }

      .modal-body {
        padding: 15px;
        overflow-y: auto;

        .all-categories {
          display: flex;
          flex-direction: column;
          gap: 5px;

          .category-chip {
            background-color: $white;
            border-radius: 15px;
            padding: 5px 10px;
            border: 1px solid $green;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
