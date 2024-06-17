<template>
  <transition name="fade" mode="out-in">
    <div class="masterclass-page" key="masterclass-page">
      <div class="masterclass-container" v-if="masterClass">
        <div class="masterclass-header">
          <div class="masterclass-wrapper">
            <div class="masterclass-header__info">
              <h1>{{ masterClass.title }}</h1>
              <div v-if="masterClass.categories.length" class="categories">
                <button
                  v-for="category in masterClass.categories"
                  :key="category.id"
                  class="category-button"
                >
                  {{ category.name }}
                </button>
              </div>
              <p v-if="masterClass.start_date && masterClass.end_date" class="date-time">
                {{ formattedDateTime }}
              </p>
              <p v-if="masterClass.locality" class="location">{{ masterClass.locality }}</p>
              <button class="register-button" @click="registerForClass">Записаться</button>
            </div>
            <div v-if="masterClass.image_url" class="masterclass-image">
              <img :src="masterClass.image_url" alt="Master Class Image" />
            </div>
          </div>
        </div>
        <div v-if="masterClass.description" class="masterclass-desc">
          <h2>Описание</h2>
          <p>{{ masterClass.description }}</p>
        </div>
        <div v-if="masterClass.organizer" class="masterclass-organizer">
          <h2>Организатор</h2>
          <p>{{ masterClass.organizer.first_name }} {{ masterClass.organizer.last_name }}</p>
        </div>
        <div v-if="masterClass.speakers && masterClass.speakers.length" class="masterclass-participants">
          <h2>Участники</h2>
          <ul>
            <li v-for="speaker in masterClass.speakers" :key="speaker.id">
              {{ speaker.first_name }} {{ speaker.last_name }}
            </li>
          </ul>
        </div>
        <div class="masterclass-address">
          <h2>Адрес</h2>
          <div class="address-info">
            <p v-if="masterClass.street && masterClass.house">
              <span class="address-label">Улица:</span> {{ masterClass.street }}, {{ masterClass.house }}
            </p>
            <p v-if="masterClass.locality && masterClass.province && masterClass.country">
              <span class="address-label">Город:</span> {{ masterClass.locality }}, {{ masterClass.province }}, {{ masterClass.country }}
            </p>
            <p v-if="masterClass.postal_code">
              <span class="address-label">Почтовый индекс:</span> {{ masterClass.postal_code }}
            </p>
          </div>
          <div class="form-group">
            <div id="mapContainer" class="map-container"></div>
          </div>
        </div>

        <div class="related-events" v-if="relatedEvents.length">
          <h2>Другие мероприятия в этом городе</h2>
          <div class="events-grid">
            <MasterClassCard v-for="event in relatedEvents" :key="event.id" :masterClass="event" />
          </div>
        </div>
      </div>

      <div v-else>
        <p>Загрузка...</p>
      </div>

    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMasterClassesStore } from '@/stores/masterClasses'
import { useRegistrationStore } from '@/stores/registrationStore'
import MasterClassCard from '@/components/ui/masterclass/MasterClassCard.vue'
import { fetchMasterClassesByCity } from '@/services/masterClassService'
import { useToast } from '@/composables/useToast'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const masterClassId = ref(route.params.id)
const masterClassesStore = useMasterClassesStore()
const registrationStore = useRegistrationStore()
const masterClass = computed(() => masterClassesStore.selectedMasterClass)
const relatedEvents = ref([])
const { showToast } = useToast()

let map
let marker

const fetchMasterClass = async (id) => {
  try {
    await masterClassesStore.fetchMasterClassById(id)
    if (masterClass.value && masterClass.value.coordinates) {
      await nextTick(() => {
        initializeMap(masterClass.value.coordinates)
      })
      await loadRelatedEvents(masterClass.value.locality)
    }
  } catch (error) {
    console.error('Ошибка загрузки мастер-класса:', error)
  }
}

const initializeMap = (coordinates) => {
  if (!coordinates) return
  if (map) {
    map.remove()
  }
  map = L.map('mapContainer', {
    center: [coordinates.latitude, coordinates.longitude],
    zoom: 17,
    scrollWheelZoom: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map)

  marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map)

  map.on('focus', () => {
    map.scrollWheelZoom.enable()
  })

  map.on('blur', () => {
    map.scrollWheelZoom.disable()
  })
}

const loadRelatedEvents = async (locality) => {
  if (!locality) return
  try {
    relatedEvents.value = await fetchMasterClassesByCity(locality)
  } catch (error) {
    console.error('Ошибка загрузки связанных мероприятий:', error)
  }
}

const formattedDateTime = computed(() => {
  if (!masterClass.value || !masterClass.value.start_date || !masterClass.value.end_date) return ''

  const startDate = new Date(masterClass.value.start_date)
  const endDate = new Date(masterClass.value.end_date)
  const options = { month: 'long', day: 'numeric' }
  const startTime = startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const endTime = endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const startDateStr = `${startDate.getDate()} ${startDate.toLocaleDateString('ru-RU', { month: 'long' })}`
  const endDateStr = `${endDate.getDate()} ${endDate.toLocaleDateString('ru-RU', { month: 'long' })}`

  if (startDateStr === endDateStr) {
    return `${startDateStr}, с ${startTime} до ${endTime} по местному времени`
  } else {
    return `${startDateStr}, с ${startTime} по ${endDateStr}, до ${endTime} по местному времени`
  }
})

const registerForClass = async () => {
  try {
    const response = await registrationStore.registerForMasterClass(masterClassId.value)
    showToast("Успешная регистрация", 'success')
  } catch (error) {
    showToast("Вы уже зарегистрированы на это мероприятие", 'error')
  }
}

watch(
  () => route.params.id,
  (newId) => {
    fetchMasterClass(newId)
  }
)

onMounted(() => {
  fetchMasterClass(masterClassId.value)
})
</script>


<style lang="scss" scoped>
@import '@/assets/variables';

body,
html {
  background-color: #f0f5fa;
  margin: 0;
  padding: 0;
}

.masterclass-page {
  background-color: #f0f5fa;
}

.masterclass-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 16px;
}

.masterclass-header {
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 80px;
}

.masterclass-wrapper {
  display: flex;
  justify-content: space-between;
}

.masterclass-header__info {
  flex: 1;
}

.categories {
  margin: 24px 0;
}

.category-button {
  margin-right: 8px;
  padding: 8px 16px;
  border: 1px solid $green;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button:hover {
  background-color: $green;
  color: #fff;
}

.date-time {
  margin: 12px 0;
  color: #666;
  font-size: 20px;
}

.location {
  margin: 12px 0;
  font-weight: bold;
  font-size: 20px;
}

.register-button {
  display: inline-block;
  padding: 16px 32px;
  background-color: $green;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 24px;
  font-size: 20px;
  transition: background-color 0.3s ease;
  width: 260px;
  height: 60px;

  &:hover {
    background-color: darken($green, 10%);
  }
}

.masterclass-image img {
  max-width: 100%;
  height: 100%;
  border-radius: 8px;
}

.address-info {
  .address-label {
    font-weight: bold;
  }

  p {
    margin: 8px 0;
  }
}

.masterclass-desc,
.masterclass-organizer,
.masterclass-participants,
.masterclass-address,
.related-events {
  background-color: #f0f5fa;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 80px;
}

.masterclass-desc h2,
.masterclass-organizer h2,
.masterclass-participants h2,
.masterclass-address h2,
.related-events h2 {
  margin-top: 0;
  color: #000;
  font-size: 32px;
  margin-bottom: 32px;
}

.map-container {
  width: 100%;
  height: 450px;
  border-radius: 8px;
  margin-top: 24px;
}

.events-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
