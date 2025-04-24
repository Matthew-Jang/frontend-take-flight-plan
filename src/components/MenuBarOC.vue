<template>
  <v-app-bar app prominent height="120">
    <!-- Logo + Title -->
    <router-link :to="{ name: 'home' }">
      <v-img class="mx-2" :src="logoURL" height="50" width="50" contain />
    </router-link>
    <v-toolbar-title class="title">{{ title }}</v-toolbar-title>

    <v-spacer />

    <!-- Nav buttons -->
    <div v-if="user">
      <!-- Student links -->
      <v-btn class="mx-2" :to="{ name: 'home' }">Home</v-btn>
      <v-btn class="mx-2" v-if="isStudent" :to="{ name: 'student_flight_plan' }">
        My Flight Plan
      </v-btn>
      <v-btn class="mx-2" :to="{ name: 'admin_events_view' }">Events</v-btn>
      <v-btn class="mx-2" :to="{ name: 'events_calendar' }">Calendar</v-btn>

      <!-- Admin-only links -->
      <template v-if="isAdmin">
        <v-btn class="mx-2" :to="{ name: 'admin_users' }">Users</v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_events' }">Manage Events</v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_badges' }">Badges</v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_majors' }">Majors</v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_redeem' }">Redeem</v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_checklist_items' }">
          Checklist Items
        </v-btn>
        <v-btn class="mx-2" :to="{ name: 'admin_flight_plan' }">
          Flight Plans
        </v-btn>
      </template>
    </div>

    <!-- User avatar menu -->
    <v-menu bottom min-width="200px" rounded offset-y v-if="user">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon x-large>
          <v-avatar color="secondary">
            <span class="accent--text font-weight-bold">{{ initials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="text-center">
          <v-avatar color="secondary" class="mx-auto mb-2">
            <span class="accent--text font-weight-bold">{{ initials }}</span>
          </v-avatar>
          <h3>{{ name }}</h3>
          <p class="text-caption">{{ user.email }}</p>
          <v-divider class="my-3" />
          <p class="text-caption">{{ roleText }}</p>
          <p class="text-caption">Points: {{ currentPoints }}</p>
          <v-btn
            class="mb-2"
            depressed
            rounded
            text
            @click="goToProfile"
          >
            My Profile
          </v-btn>
          <v-divider class="my-3" />
          <v-btn depressed rounded text @click="logout">
            Logout
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/userServices";
import ocLogo from "/oc-logo-white.png";

const router = useRouter();
const title = ref("Flight Plan");
const user = ref(null);
const initials = ref("");
const name = ref("");
const logoURL = ref(ocLogo);

// derive flags
const isAdmin   = computed(() => user.value?.role === 1);
const isStudent = computed(() => user.value?.role === 0);

// human-readable role text
const roleText = computed(() => {
  if (!user.value) return "";
  switch (user.value.role) {
    case 0: return "Student";
    case 1: return "Admin";
    case 2: return "Staff";
    default: return "Unknown";
  }
});

// calculate available points (awarded - used)
const currentPoints = computed(() => {
  if (!user.value) return 0;
  return (user.value.points_awarded || 0) - (user.value.points_used || 0);
});

// fetch the authenticated user
const resetMenu = async () => {
  try {
    const { data } = await UserServices.getCurrentUser();
    user.value     = data;
    initials.value = data.fName[0] + data.lName[0];
    name.value     = `${data.fName} ${data.lName}`;
  } catch (err) {
    console.error("Failed to load user:", err);
    user.value = null;
    router.push({ name: "login" });
  }
};

// logout and redirect
const logout = async () => {
  try {
    await UserServices.logoutUser();
  } finally {
    user.value = null;
    router.push({ name: "login" });
  }
};

// navigate to Profile page
const goToProfile = () => {
  router.push({ name: "profile" });
};

onMounted(resetMenu);
</script>
