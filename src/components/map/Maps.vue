<template>
  <div class="main-container">
    <Nav />
    <!-- <LayerToggleButton :displayed-master-classes="displayedMasterClasses" :my-icon="myIcon" /> -->
    <ListViewMasterClasses class="list-view" />
    <div id="map" class="maps-container"></div>
    <div class="controls-container">
      <Timeline :start-date="earliestDate" :end-date="latestDate" @changeData="handleDataChange" class="timeline" />
      <button class="button button--small show-all-btn" @click="showAll">показать всё</button>
    </div>
    <div class="zoom-controls">
      <button class="zoom-in" @click="zoomIn">+</button>
      <button class="zoom-out" @click="zoomOut">-</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import icon from '@/assets/imgs/map-marker-svgrepo-com.svg';
import { useMasterClassesStore } from "@/stores/masterClasses";
import { computed, onMounted, ref } from "vue";
import { useLayersStore } from "@/stores/layersStore";
import ListViewMasterClasses from "@/components/map/ListViewMasterClasses.vue";
import Timeline from "@/components/map/Timeline.vue";
import Nav from "@/components/ui/Nav.vue";

const store = useMasterClassesStore();
const layersStore = useLayersStore();
const displayedMasterClasses = ref<any[]>([]);
const isModalOpen = ref(false);
const perPage = 10;
let currentPage = 1;

const myIcon = L.icon({
  iconUrl: icon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
  shadowSize: [60, 30],
  shadowAnchor: [15, 30]
});

const earliestDate = computed(() => {
  return store.masterClasses.reduce((min, mc) => new Date(mc.start_time) < min ? new Date(mc.start_time) : min, new Date());
});

const latestDate = computed(() => {
  return store.masterClasses.reduce((max, mc) => new Date(mc.start_time) > max ? new Date(mc.start_time) : max, new Date());
});

let mapInstance: any;

function handleDataChange({ startDate, interval, mode }: { startDate: Date, interval: string, mode: string }) {
  const intervalMilliseconds = interval === 'день' ? 86400000 : interval === 'неделя' ? 604800000 : 2592000000;
  const endDate = new Date(startDate.getTime() + intervalMilliseconds);

  displayedMasterClasses.value = store.masterClasses.filter(mc => {
    const mcDate = new Date(mc.start_time);
    return mode === 'накопительно' ? mcDate <= endDate : mcDate >= startDate && mcDate <= endDate;
  });
  currentPage = 1;
  loadMoreClasses();
  layersStore.toggleLayer(layersStore.activeLayerIndex, displayedMasterClasses.value, myIcon);
}

function showAll() {
  displayedMasterClasses.value = store.masterClasses;
  currentPage = 1;
  loadMoreClasses();
  layersStore.toggleLayer(layersStore.activeLayerIndex, displayedMasterClasses.value, myIcon);
}

function loadMoreClasses() {
  const start = (currentPage - 1) * perPage;
  const end = currentPage * perPage;
  const newClasses = displayedMasterClasses.value.slice(start, end);

  displayedMasterClasses.value = [...displayedMasterClasses.value, ...newClasses];
  currentPage++;
}

onMounted(() => {
  mapInstance = L.map('map', { zoomControl: false, zoom: 3, center: [55.755819, 80.617644] });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '...',
    maxZoom: 20,
    minZoom: 3
  }).addTo(mapInstance);

  layersStore.initializeMap(mapInstance);
  layersStore.updateMarkers(displayedMasterClasses.value, myIcon);
  showAll();
  layersStore.toggleLayer(0, displayedMasterClasses.value, myIcon);
});

function zoomIn() {
  mapInstance.zoomIn();
}

function zoomOut() {
  mapInstance.zoomOut();
}

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables";
@import "@/assets/button-styles";
@import "@/assets/map-styles";

.show-all-btn {
  background-color: $green;
  color: $white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darken($green, 10%);
  }
}

.zoom-controls {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 5px;

  button {
    width: 35px;
    height: 35px;
    background-color: $green;
    color: $white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    font-size: 18px;
    line-height: 18px;
    transition: background-color 0.3s;

    &:hover {
      background-color: darken($green, 10%);
    }
  }
}
</style>
