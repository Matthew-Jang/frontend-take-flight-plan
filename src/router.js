import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import AdminUsers from "./views/Admin_Users.vue";
import AdminEvents from "./views/Admin_Events.vue";
import AdminRedeem from "./views/Admin_Redeem.vue";

import AdminBadges from './views/Admin_Badges.vue';
import AdminMajors from './views/Admin_Majors.vue';
import AdminChecklistItems from './views/Admin_Checklist_Items.vue';
import AdminFlightPlan from './views/Admin_Flight_Plan.vue';

import Events from './views/Events.vue';

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
    },
    {
      path: '/admin/users',
      alias: '/admin/users',
      name: 'admin_users', 
      component: AdminUsers, 
    },
    {
      path: '/admin/events',
      alias: '/admin/events',
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
      path: '/admin/redeem',
      name: 'admin_redeem',
      component: AdminRedeem,
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/admin/checklist_items',
      name: 'admin_checklist_items',
      component: AdminChecklistItems,
    },
    {
      path: '/admin/flight_plan',
      name: 'admin_flight_plan', 
      component: AdminFlightPlan,
    }
  ],
});

export default router;
