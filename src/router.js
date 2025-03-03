import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";

import BadgeList from '@/components/BadgeList.vue';
import MajorList from '@/components/MajorList.vue';

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
    },
    {
      path: '/admin/majors',
      name: 'AdminMajors',
      component: MajorList,
      meta: { requiresAdmin: true } //Matt, Does this work?
    }
  ],
});

export default router;
