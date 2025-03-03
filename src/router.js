import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import AdminEvents from "./views/AdminEvents.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    },
    {
      path: '/admin/events',
      alias: '/admin/events',
      name: 'events', 
      component: AdminEvents, 
    },
  ],
});

export default router;
