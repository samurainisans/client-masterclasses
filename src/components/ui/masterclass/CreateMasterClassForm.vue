<template>
  <div class="form-container">
    <h2>Заполните основную информацию</h2>
    <form @submit.prevent="submitForm">
      <!-- название мероприятия -->
      <div class="form-group">
        <label>Укажите название мероприятия</label>
        <input type="text" v-model="form.title" required />
      </div>

      <!-- категории мероприятия -->
      <div class="form-group categories-group">
        <label>Выберите тип мероприятия (можно выбрать несколько категорий)</label>
        <CheckboxList
          inline
          :items="categories"
          buttonText="Выбрать категории"
          @update:selectedItems="updateCategories"
        />
        <div class="selected-categories">
          <span
            v-for="category in selectedCategoryLabels"
            :key="category.value"
            class="category-chip"
          >
            {{ category.label }}
            <button @click="removeCategory(category.value)">×</button>
          </span>
        </div>
      </div>

      <!-- Превью -->
      <div class="form-group">
        <label>Превью</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>

      <!-- описание мероприятия -->
      <div class="form-group">
        <label>Описание мероприятия</label>
        <textarea v-model="form.description" required></textarea>
      </div>

      <!-- организатор мероприятия -->
      <div class="form-group">
        <label>Выберите организатора</label>
        <select v-model="form.organizer" required>
          <option v-for="organizer in organizers" :key="organizer.id" :value="organizer.id">
            {{ organizer.first_name }} {{ organizer.last_name }}
          </option>
        </select>
      </div>

      <!-- спикер мероприятия -->
      <div class="form-group">
        <label>Выберите спикера</label>
        <select v-model="form.speaker" required>
          <option v-for="speaker in speakers" :key="speaker.id" :value="speaker.id">
            {{ speaker.first_name }} {{ speaker.last_name }}
          </option>
        </select>
      </div>

      <!-- Длительность -->
      <div class="form-group">
        <label>Длительность (в минутах)</label>
        <input type="number" v-model="form.duration" required />
      </div>

      <!-- Дата окончания регистрации -->
      <div class="form-group">
        <label>Окончательная дата регистрации</label>
        <input type="datetime-local" v-model="form.end_register_date" required />
      </div>

      <!-- Время и дата -->
      <div class="form-group">
        <label>Укажите время и дату</label>
        <input type="datetime-local" v-model="form.start_date" required />
        <input type="datetime-local" v-model="form.end_date" required />
      </div>

      <!-- Цена -->
      <div class="form-group">
        <label>Цена</label>
        <input type="number" v-model="form.price" required />
      </div>

      <!-- Требуется подтверждение -->
      <div class="form-group chekbx">
        <label>
          <input type="checkbox" v-model="form.requires_approval" /> Требуется подтверждение
        </label>
      </div>

      <!-- Адрес мероприятия -->
      <div class="form-group address-group">
        <label>Укажите адрес мероприятия</label>
        <input type="text" v-model="form.location_name" required />
        <button type="button" @click="checkAddress">Проверить адрес</button>
      </div>

      <!-- Карта для выбора местоположения -->
      <div class="form-group">
        <div id="mapContainer" class="map-container"></div>
      </div>

      <!-- Улица -->
      <div class="form-group">
        <label>Улица</label>
        <input readonly type="text" v-model="form.street" required />
      </div>

      <!-- Дом -->
      <div class="form-group">
        <label>Дом</label>
        <input readonly type="text" v-model="form.house" required />
      </div>

      <!-- Почтовый индекс -->
      <div class="form-group">
        <label>Почтовый индекс</label>
        <input readonly type="text" v-model="form.postal_code" required />
      </div>

      <div class="form-group">
        <label>Область</label>
        <input readonly type="text" v-model="form.province" />
      </div>
      <div class="form-group">
        <label>Район</label>
        <input readonly type="text" v-model="form.area" />
      </div>
      <div class="form-group">
        <label>Город</label>
        <input readonly type="text" v-model="form.locality" />
      </div>
      <button type="submit">Создать мероприятие</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useMasterClassesStore } from '@/stores/masterClasses'
import CheckboxList from '@/components/ui/filter/CheckboxList.vue'

const masterClassesStore = useMasterClassesStore()
const form = ref({
  title: '',
  categories: [],
  description: '',
  location_name: '',
  start_date: '',
  end_date: '',
  end_register_date: '',
  image_url: null,
  organizer: null,
  speaker: null,
  longitude: '',
  latitude: '',
  country: '',
  province: '',
  area: '',
  locality: '',
  street: '',
  house: '',
  postal_code: '',
  duration: 0,
  price: 0,
  requires_approval: false
})

const categories = ref([])
const organizers = ref([])
const speakers = ref([])

const fetchCategories = async () => {
  try {
    const data = await masterClassesStore.fetchCategories()
    categories.value = data.map((category) => ({ value: category.id, label: category.name }))
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchOrganizers = async () => {
  try {
    await masterClassesStore.fetchOrganizers()
    organizers.value = masterClassesStore.getOrganizers
  } catch (error) {
    console.error('Error fetching organizers:', error)
  }
}

const fetchSpeakers = async () => {
  try {
    await masterClassesStore.fetchSpeakers()
    speakers.value = masterClassesStore.getSpeakers
  } catch (error) {
    console.error('Error fetching speakers:', error)
  }
}

const updateCategories = (selectedItems) => {
  form.value.categories = selectedItems
}

const selectedCategoryLabels = computed(() => {
  return categories.value.filter((category) => form.value.categories.includes(category.value))
})

const removeCategory = (categoryId) => {
  form.value.categories = form.value.categories.filter((id) => id !== categoryId)
}

let map
let marker

onMounted(async () => {
  await fetchCategories()
  await fetchOrganizers()
  await fetchSpeakers()

  await nextTick(() => {
    map = L.map('mapContainer', {
      center: [55.7558, 37.6173],
      zoom: 10
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map)

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng
      form.value.latitude = lat
      form.value.longitude = lng

      if (marker) {
        marker.setLatLng([lat, lng])
      } else {
        marker = L.marker([lat, lng]).addTo(map).bindPopup('Вы выбрали это место').openPopup()
      }

      try {
        await masterClassesStore.reverseGeocodeCoordinates(lng, lat)
        form.value.latitude = masterClassesStore.addressData.latitude
        form.value.longitude = masterClassesStore.addressData.longitude
        form.value.country = masterClassesStore.addressData.country
        form.value.province = masterClassesStore.addressData.province
        form.value.area = masterClassesStore.addressData.area
        form.value.locality = masterClassesStore.addressData.locality
        form.value.street = masterClassesStore.addressData.street
        form.value.house = masterClassesStore.addressData.house
        form.value.postal_code = masterClassesStore.addressData.postal_code
      } catch (error) {
        console.error('Error reverse geocoding coordinates:', error)
      }
    })
  })
})

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files[0]
  if (file) {
    form.value.image_url = file
  }
}

const checkAddress = async () => {
  try {
    await masterClassesStore.geocodeAddress(form.value.location_name)
    form.value.latitude = masterClassesStore.addressData.latitude
    form.value.longitude = masterClassesStore.addressData.longitude
    form.value.country = masterClassesStore.addressData.country
    form.value.province = masterClassesStore.addressData.province
    form.value.area = masterClassesStore.addressData.area
    form.value.locality = masterClassesStore.addressData.locality
    form.value.street = masterClassesStore.addressData.street
    form.value.house = masterClassesStore.addressData.house
    form.value.postal_code = masterClassesStore.addressData.postal_code

    const { latitude, longitude } = masterClassesStore.addressData
    map.setView([latitude, longitude], 13)
    if (marker) {
      marker.setLatLng([latitude, longitude])
    } else {
      marker = L.marker([latitude, longitude]).addTo(map).bindPopup('Ваш адрес').openPopup()
    }
  } catch (error) {
    console.error('Error checking address:', error)
  }
}

const submitForm = async () => {
  try {
    await masterClassesStore.createMasterClass(form.value)
    alert('Мероприятие успешно создано')
  } catch (error) {
    console.error('Error creating master class:', error)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables';

.chekbx {
  input {
    height: 20px;
  }
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 15px;
  }
}

.form-group {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 15px;
  }
}

.categories-group {
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
    label {
      font-size: smaller;
    }
  }
}

.selected-categories {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.category-chip {
  background-color: $color-primary;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 20px;
  display: flex;
  align-items: center;

  button {
    background: none;
    border: none;
    color: white;
    margin-left: 10px;
    cursor: pointer;
    font-size: 16px;
  }
}

label {
  display: flex;
  margin-bottom: 5px;
  align-items: center;

  input {
    margin-right: 10px;
  }
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 8px;
  }
}

.address-group {
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    width: calc(100% - 160px);
    margin-right: 10px;

    @media (max-width: 768px) {
      width: calc(100% - 120px);
      margin-right: 5px;
      flex-direction: column;
    }
  }

  button {
    width: 150px;
    padding: 10px;
    background-color: $green;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: darken($green, 10%);
    }

    @media (max-width: 768px) {
      width: 120px;
      padding: 8px;
    }
  }
}

.map-container {
  width: 100%;
  height: 400px;

  @media (max-width: 768px) {
    height: 300px;
  }
}

button[type='submit'] {
  background-color: $green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 8px 15px;
  }
}

button[type='submit']:hover {
  background-color: darken($green, 10%);
}
</style>