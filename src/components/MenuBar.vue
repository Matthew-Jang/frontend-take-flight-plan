<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Define the menu items
const menuItems = [
  { name: "Templates", path: "/templates" },
  { name: "Profile", path: "/profile" },
  { name: "Experience", path: "/experiences" },
  { name: "Skills", path: "/skills" },
  { name: "Education", path: "/educations" },
  { name: "Contact", path: "/contacts" },
  { name: "References", path: "/references" },
  { name: "Chat", path: "/chatbox" },
  { name: "Resumes", path: "/resumes" },
  { name: "Confirm", path: "/confirm" },
];

// Check if the current route matches the item path
const isActive = (path) => route.path === path;

const navigate = (path) => {
  router.push(path);
};
</script>

<template>
  <v-app-bar app color="white" dense class="navbar">
    <div class="nav-menu">
      <v-btn
        v-for="item in menuItems"
        :key="item.name"
        :class="['nav-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
        text
      >
        {{ item.name }}
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
/* Ensure the navbar centers all content */
.navbar {
  display: flex;
  justify-content: center; /* Center the content horizontally */
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
}

/* Center the nav items container */
.nav-menu {
  display: flex;
  gap: 1rem;
  margin: 0 auto;
}

/* Style for nav items with active state */
.nav-item {
  color: #9d6cff;
  font-weight: bold;
  border: 2px solid #e3d3ff;
  border-radius: 8px;
  padding: 5px 10px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-item.active {
  background-color: #e1c8ff;
  border-color: #9d6cff;
  color: #ffffff;
}
</style>