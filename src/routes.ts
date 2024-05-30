// src/router.ts
import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/components/ui/IndexPage.vue';
import Maps from '@/components/map/Maps.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: IndexPage, name: 'Home' },
  { path: '/map', component: Maps, name: 'Map' },
  // добавляйте другие маршруты здесь
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
