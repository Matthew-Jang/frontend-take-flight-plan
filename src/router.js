import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/',
      alias: '/login',
      name: 'login', 
      component: Login, 
    },
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: Home,
    }
  ],
});

export default router;
