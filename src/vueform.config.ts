// src/vueform.config.ts
import ru from '@vueform/vueform/locales/ru'
import vueform from '@vueform/vueform/dist/vueform'
import { defineConfig } from '@vueform/vueform'

import '@vueform/vueform/dist/vueform.css';

export default defineConfig({
  theme: vueform,
  locales: { ru },
  locale: 'ru',
})
