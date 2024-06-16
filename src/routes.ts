// src/routes.ts
import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "@/components/ui/IndexPage.vue";
import Maps from "@/components/map/Maps.vue";
import CreateMasterClassForm from "@/components/ui/masterclass/CreateMasterClassForm.vue";
import RegisterPage from "@/components/ui/auth/RegisterPage.vue";
import MasterClassDetail from "@/components/ui/masterclass/MasterClassDetail.vue";
import UserProfile from "@/components/ui/user/UserProfile.vue";
import Logout from "@/components/ui/auth/Logout.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: IndexPage, name: "Home" },
  { path: "/map", component: Maps, name: "Map" },
  { path: "/add-masterclass", component: CreateMasterClassForm, name: "AddMasterClass" },
  { path: "/register", component: RegisterPage, name: "Register" },
  { path: "/masterclass/:id", component: MasterClassDetail, name: "MasterClassDetail" },
  { path: "/profile", component: UserProfile, name: "Profile" },
  { path: "/logout", component: Logout, name: "Logout" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
