<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MenuBar from "./components/MenuBar.vue";
import MenuBarOC from "./components/MenuBarOC.vue";

</script>

<template>
  <v-app>
    <MenuBarOC :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>