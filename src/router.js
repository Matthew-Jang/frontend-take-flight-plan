import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";

import BadgeList from '@/components/BadgeList.vue';

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
      path: '/admin/badges',
      name: 'AdminBadges',
      component: BadgeList, 
      meta: { requiresAdmin: true}
    }
  ],
});

export default router;
