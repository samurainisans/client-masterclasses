// src\routes.ts
import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/components/ui/IndexPage.vue'
import Maps from '@/components/map/Maps.vue'
import CreateMasterClassForm from '@/components/ui/masterclass/CreateMasterClassForm.vue'
import RegisterPage from "@/components/ui/auth/RegisterPage.vue";

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: IndexPage, name: 'Home' },
  { path: '/map', component: Maps, name: 'Map' },
  { path: '/add-masterclass', component: CreateMasterClassForm, name: 'AddMasterClass' },
  { path: '/register', component: RegisterPage, name: 'Register' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
