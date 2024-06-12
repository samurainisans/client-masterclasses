
<!-- src\components\ui\filter\CheckboxList.vue-->
<template>
  <div class="filter-dropdown" @mouseleave="closeDropdown" :class="{ inline: inline }">
    <template v-if="inline">
      <div class="checkbox-container">
        <input type="text" v-model="searchQuery" placeholder="Поиск" />
        <div class="checkbox-list">
          <div v-for="item in filteredItems" :key="item.value">
            <label>
              <input type="checkbox" v-model="selectedItems" :value="item.value" />
              {{ item.label }}
            </label>
          </div>
        </div>
        <button @click="resetSelection">Сбросить</button>
      </div>
    </template>
    <template v-else>
      <button class="filter-button" @click="toggleDropdown">
        {{ buttonText }}
        <img
          :class="{ rotated: isDropdownOpen }"
          src="@/assets/imgs/dropdown.svg"
          alt="Dropdown Icon"
        />
      </button>
      <transition name="fade">
        <div v-if="isDropdownOpen" class="checkbox-container" @click.stop>
          <input type="text" v-model="searchQuery" placeholder="Поиск" />
          <div class="checkbox-list">
            <div v-for="item in filteredItems" :key="item.value">
              <label>
                <input type="checkbox" v-model="selectedItems" :value="item.value" />
                {{ item.label }}
              </label>
            </div>
          </div>
          <button @click="resetSelection">Сбросить</button>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Выбрать'
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const selectedItems = ref<(number | string)[]>([])
const searchQuery = ref('')
const isDropdownOpen = ref(false)

const emit = defineEmits(['update:selectedItems'])

watch(selectedItems, (newValue) => {
  emit('update:selectedItems', newValue)
})

const resetSelection = () => {
  selectedItems.value = []
}

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return props.items
  }
  return props.items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.filter-dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
@import '@/assets/variables';

.filter-dropdown {
  position: relative;
  display: inline-block;
  border: 1.4px solid $green;
  border-radius: 4px;
  width: 200px;
}

.filter-dropdown.inline {
  border: none;
  width: auto;
}

.filter-button {
  padding: 10px 20px;
  background-color: $white;
  color: $color-text;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: $color-primary;
    color: $white;

    img {
      filter: brightness(0) invert(1);
    }
  }

  img {
    transition: transform 0.3s ease;
  }

  .rotated {
    transform: rotate(180deg);
  }
}

.checkbox-container {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  background-color: $white;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.filter-dropdown.inline .checkbox-container {
  position: static;
  transform: none;
  width: 100%;
}

input[type='text'] {
  width: 94.5%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #dfe8f2;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }
}

.checkbox-list {
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 250px;
  margin-bottom: 10px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #d3d3d3;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $green;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $green;
  }
}

.checkbox-list div {
  margin: 5px 0;
}

label {
  display: flex;
  align-items: center;
}

input[type='checkbox'] {
  margin-right: 10px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: $color-primary;
  color: $white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  font-family: $font-family;
}

button:hover {
  background-color: $color-primary-hover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>