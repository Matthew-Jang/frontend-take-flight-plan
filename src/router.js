// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import UserServices from "./services/userServices";

// public views
import Login               from "./views/Login.vue";
import Home                from "./views/Home.vue";
import EventsView          from "./views/Events.vue";
import EventsCalendar      from "./views/Event_Calendar.vue";
import StudentFlightPlan   from "./views/Student_Flight_Plan.vue";

// admin-only views
import AdminUsers          from "./views/Admin_Users.vue";
import AdminEvents         from "./views/Admin_Events.vue";
import AdminBadges         from "./views/Admin_Badges.vue";
import AdminMajors         from "./views/Admin_Majors.vue";
import AdminRedeem         from "./views/Admin_Redeem.vue";
import AdminChecklistItems from "./views/Admin_Checklist_Items.vue";
import AdminFlightPlan     from "./views/Admin_Flight_Plan.vue";

const routes = [
  // auth & home
  { path: "/",            alias: "/login",   name: "login",  component: Login },
  { path: "/home",        name: "home",                     component: Home },

  // student / public pages
  { path: "/events",      name: "events_view",              component: EventsView },
  { path: "/calendar",    name: "events_calendar",          component: EventsCalendar },
  {
    path: "/student/flight_plan",
    name: "student_flight_plan",
    component: StudentFlightPlan
  },

  // admin-only (guarded below)
  {
    path: "/admin/users",
    name: "admin_users",
    component: AdminUsers,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/events",
    name: "admin_events",
    component: AdminEvents,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/badges",
    name: "admin_badges",
    component: AdminBadges,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/majors",
    name: "admin_majors",
    component: AdminMajors,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/redeem",
    name: "admin_redeem",
    component: AdminRedeem,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/checklist_items",
    name: "admin_checklist_items",
    component: AdminChecklistItems,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/flight_plan",
    name: "admin_flight_plan",
    component: AdminFlightPlan,
    meta: { requiresAdmin: true },
  },

  // shared “view-only” under /admin for everyone
  {
    path: "/admin/events/view",
    name: "admin_events_view",
    component: EventsView,
  },

  // catch-all
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global guard: enforce admin-only routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    try {
      // fetch the current user (must include role)
      const { data: user } = await UserServices.getCurrentUser();
      // not an admin?
      if (user.role < 1) {
        return next({ name: "home" });
      }
      // ok to proceed
      return next();
    } catch (err) {
      // not logged in / token invalid
      return next({ name: "login" });
    }
  }
  // no admin guard required
  next();
});

export default router;
