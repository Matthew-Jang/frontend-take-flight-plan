<script setup>
import { useRoute } from "vue-router";
import MenuBarOC from "./components/MenuBarOC.vue";

const route = useRoute();
</script>

<template>
  <v-app>
    <MenuBarOC :key="route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
