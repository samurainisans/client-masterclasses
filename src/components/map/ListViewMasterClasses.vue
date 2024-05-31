<!-- src/components/ListViewMasterClasses.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMasterClassesStore } from '@/stores/masterClasses';
import { useSidebarStore } from '@/stores/sidebarStore';
import SidebarToggleButton from "@/components/map/SidebarToggleButton.vue";

const masterClassesStore = useMasterClassesStore();
const sidebarStore = useSidebarStore();
const listContainerRef = ref<HTMLDivElement | null>(null);

const masterClasses = ref<any[]>([]);
const perPage = 10;
let currentPage = 1;

const loadMoreClasses = () => {
  const start = (currentPage - 1) * perPage;
  const end = currentPage * perPage;
  const newClasses = masterClassesStore.masterClasses.slice(start, end);

  masterClasses.value = [...masterClasses.value, ...newClasses];
  currentPage++;
};

const handleScroll = () => {
  const container = listContainerRef.value as HTMLDivElement;
  if (container) {
    const bottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    if (bottom) {
      loadMoreClasses();
    }
  }
};

onMounted(() => {
  masterClassesStore.fetchMasterClasses().then(() => {
    loadMoreClasses();
    listContainerRef.value?.addEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <div class="sidebar-container__wrapper">
    <div :class="['sidebar-container', { 'closed': !sidebarStore.isOpen }]">
      <div :class="['list-container', { 'closed': !sidebarStore.isOpen }]" ref="listContainerRef">
        <ul class="mk-list">
          <li v-for="mc in masterClasses" :key="mc.id" class="card-item">
            <div class="image-container">
              <img :src="mc.image || '/default-image.jpg'" alt="image" class="card-image">
              <button class="favorite-btn"><img src="/src/assets/imgs/favorite.svg" alt="favorite"></button>
            </div>
            <div class="card-content">
              <div class="categories">
                <span class="category-chip" v-for="category in mc.categories" :key="category">{{ category }}</span>
              </div>
              <h3>{{ mc.title }}</h3>
              <div class="mc-footer">
                <span class="location">{{ mc.location_name }}</span>
                <span class="date">{{ new Date(mc.start_date).toLocaleDateString() }}</span>
              </div>
              <button class="button button--large">
                Подробнее
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar-toggle-wrapper">
      <SidebarToggleButton />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/variables";

.sidebar-container__wrapper {
  display: flex;
  align-items: center;

  .sidebar-container {
    display: flex;
    height: 100vh;
    transition: width 0.3s ease-in-out;
    width: 400px;

    &.closed {
      width: 0;
    }

    .list-container {
      overflow-y: scroll;
      transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
      transform: translateX(0);
      background-color: $green;
      width: 100%;
      padding: 0;
      margin: 0;

      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }

      &.closed {
        transform: translateX(-100%);
        width: 0;
      }

      .mk-list {
        padding: 0;
        margin: 0;
        list-style: none;


        .card-item {
          min-width: 320px;
          border-radius: 8px;
          overflow: hidden;
          margin: 15px;
          background-color: $white;

          .image-container {
            position: relative;
            overflow: hidden;
            padding: 10px 10px 0;

            .card-image {
              width: 100%;
              border-radius: 5px;
            }

            .favorite-btn {
              position: absolute;
              top: 10px;
              right: 10px;
              background: none;
              border: none;
              color: gold;
              font-size: 24px;
              cursor: pointer;

              img {
                width: 30px;
                margin: 5px 0;
              }
            }
          }

          .card-content {
            padding: 10px;
            position: relative;

            h3 {
              margin: 20px 0px;
            }

            button {
              margin-top: 30px;
            }

            .categories {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;

              .category-chip {
                background-color: $white;
                border-radius: 15px;
                padding: 5px 10px;
                border: 1px solid $green;
                font-size: 12px;
              }
            }

            .mc-footer {
              display: flex;
              justify-content: space-between;
              margin-top: 5px;

              .location,
              .date {
                font-size: 0.9rem;
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  .sidebar-toggle-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
