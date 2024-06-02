<!-- src\components\map\LayerToggleButton.vue -->
<script setup lang="ts">
import { useLayersStore } from '@/stores/layersStore';

const layers = [
  { name: 'Кластеризация', inactiveSrc: '/src/assets/imgs/layers/inactive/clasterisation.png', activeSrc: '/src/assets/imgs/layers/active/clasterisation.png' },
  { name: 'Теплокарты', inactiveSrc: '/src/assets/imgs/layers/inactive/heatmap.png', activeSrc: '/src/assets/imgs/layers/active/heatmap.png' },
  { name: 'Хороплет', inactiveSrc: '/src/assets/imgs/layers/inactive/horoplet.png', activeSrc: '/src/assets/imgs/layers/active/horoplet.png' }
];

const props = defineProps({
  displayedMasterClasses: {
    type: Array,
    required: true,
  },
  myIcon: {
    type: Object,
    required: true,
  },
});

const layersStore = useLayersStore();

const selectLayer = (index: number) => {
  layersStore.activeLayer = index;
  layersStore.toggleLayer(index, props.displayedMasterClasses, props.myIcon);
};
</script>

<template>
  <div class="modal-window">
    <span>Картографическая основа</span>
    <div class="wrapper-layers">
      <div
        v-for="(layer, index) in layers"
        :key="index"
        class="layer"
        @click="selectLayer(index)"
      >
        <img :src="layersStore.activeLayer === index ? layer.activeSrc : layer.inactiveSrc"
             :class="{ 'active-layer': layersStore.activeLayer === index }"
             @mouseenter="e => e.target.src = layer.activeSrc"
             @mouseleave="e => e.target.src = layersStore.activeLayer === index ? layer.activeSrc : layer.inactiveSrc"
             alt="">
        <div class="layer-name">{{ layer.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";

.modal-window {
  padding: 6px 10px 5px 10px;
  background-color: $white;
  width: fit-content;
  border-radius: 4px;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

span {
  font-family: $font-family;
  font-weight: 500;
  font-size: 18px;
  color: #000;
}

.wrapper-layers {
  display: flex;
  gap: 5px;

  .layer {
    img {
      border-radius: 4px;
      border: 3px solid transparent;
      transition: 0.3s all;
      width: 100px;

      &:hover {
        cursor: pointer;
        border: 3px solid $green;
      }
    }

    .layer-name {
      font-family: $font-family;
      font-weight: 400;
      font-size: 12px;
      color: #000;
      text-align: center;
    }

    .active-layer {
      border: 3px solid $green;
    }
  }
}
</style>
