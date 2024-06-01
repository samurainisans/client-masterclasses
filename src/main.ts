// src\main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import L from '@/utils/leaflet'
import '@/assets/style.css'
import '@/assets/map-styles.scss'
import '@vueform/multiselect/themes/default.css'

import router from '@/routes';
const app = createApp(App)
app.use(createPinia())
app.use(router);
app.mount('#app')
