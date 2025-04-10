<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";

const router = useRouter();
const route  = useRoute();

const user     = ref(null);
const title    = ref("Flight Plan");
const initials = ref("");
const name     = ref("");
const logoURL  = ref("");

const resetMenu = () => {
  user.value = Utils.getStore("user") || null;
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value     = user.value.fName + " " + user.value.lName;
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then(() => {
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((e) => console.error(e));
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<template>
  <v-app-bar app prominent height="80">
    <router-link :to="{ name: 'home' }">
      <v-img
        class="mx-2"
        :src="logoURL"
        height="50"
        width="50"
        contain
      />
    </router-link>

    <v-toolbar-title class="title">{{ title }}</v-toolbar-title>

    <v-spacer />

    <!-- everything below only shows when `user` is truthy -->
    <template v-if="user">
      <!-- top‑level nav buttons -->
      <v-btn class="mx-2" :to="{ name: 'home' }">Home</v-btn>
      <v-btn class="mx-2" :to="{ name: 'student_profile' }">Profile</v-btn>
      <v-btn class="mx-2" :to="{ name: 'admin_users' }">Users</v-btn>
      <v-btn class="mx-2" :to="{ name: 'admin_badges' }">Badges</v-btn>
      <v-btn class="mx-2" :to="{ name: 'admin_majors' }">Majors</v-btn>
      <v-btn class="mx-2" :to="{ name: 'admin_redeem' }">Redeem</v-btn> 

      <!-- Flight Plan dropdown -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" text class="mx-2">
            Flight Plan
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link :to="{ name: 'admin_flight_plan' }">
            <v-list-item-title>Flight Plan</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{ name: 'admin_checklist_items' }">
            <v-list-item-title>Checklist</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Events dropdown -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" text class="mx-2">
            Events
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link :to="{ name: 'admin_events' }">
            <v-list-item-title>All Events</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{ name: 'admin_events_view' }">
            <v-list-item-title>Events View</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="{ name: 'events_calendar' }">
            <v-list-item-title>Calendar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- user avatar / logout menu -->
      <v-menu bottom min-width="200px" rounded offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text class="text-center">
            <v-avatar color="secondary" class="mt-2 mb-2">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
            <h3>{{ name }}</h3>
            <p class="text-caption">{{ user.email }}</p>
            <v-divider class="my-3" />
            <v-btn depressed rounded text @click="logout">
              Logout
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>
