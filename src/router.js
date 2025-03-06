import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import AdminUsers from "./views/AdminUsers.vue";
import AdminEvents from "./views/AdminEvents.vue";

import AdminBadges from './views/BadgeList.vue';
import AdminMajors from './views/MajorList.vue';
import admin_checklist_items from './views/Admin_Checklist_Items.vue';

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
      path: '/admin/users',
      name: 'admin_users', 
      component: AdminUsers, 
    },
    {
      path: '/admin/events',
      name: 'admin_events', 
      component: AdminEvents, 
    },
    {
      path: '/admin/badges',
      name: 'admin_badges',
      component: AdminBadges, 
    },
    {
      path: '/admin/majors',
      name: 'admin_majors',
      component: AdminMajors,
    },
    {
      path: '/admin/checklist_items',
      name: 'admin_checklist_items',
      component: admin_checklist_items,
    }
  ],
});

export default router;
