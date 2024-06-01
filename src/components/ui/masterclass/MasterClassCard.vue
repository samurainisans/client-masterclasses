<template>
  <div class="card" @click="handleCardClick">
    <div class="image-container">
      <img :src="masterClass.image_url || '/default-image.jpg'" alt="image" class="card-image">
      <button class="favorite-btn"><img src="/src/assets/imgs/favorite.svg" alt="favorite"></button>
    </div>
    <div class="card-content">
      <div class="categories">
        <span class="category-chip">{{ mainCategory }}</span>
        <span v-if="extraCategoriesCount > 0" class="extra-categories" @click.stop="showAllCategories">{{ extraCategoriesCount }}+</span>
      </div>
      <h3>{{ masterClass.title }}</h3>
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
            <span class="category-chip" v-for="category in masterClass.categories" :key="category.id">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  masterClass: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const isModalOpen = ref(false);

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

const handleCardClick = () => {
  // Логика для обработки клика на карточке
  console.log(`Clicked on master class: ${props.masterClass.title}`);
};

const showAllCategories = () => {
  isModalOpen.value = true;
};
</script>

<style scoped lang="scss">
@import "@/assets/variables";

.card {
  background-color: $white;
  border: 1.5px solid $green;
  border-radius: 8px;
  overflow: hidden;
  margin: 15px;
  width: 400px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; /* Добавляем относительное позиционирование для карточки */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    position: relative;
    overflow: hidden;

    .card-image {
      height: 256px;
      width: 100%;
    }

    .favorite-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;

      img {
        width: 30px;
        margin: 5px 0;
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
        transition: background-color 0.3s ease, color 0.3s ease;
        &:hover {
          background-color: $green;
          color: $white;
        }
      }
    }

    h3 {
      margin-bottom: 10px;
    }

    .description {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* Limit the number of lines for description */
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
    position: absolute; /* Позиционируем модальное окно относительно карточки */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10; /* Задаем z-index для модального окна */

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
