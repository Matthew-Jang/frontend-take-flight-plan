<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToUserProfile = () => {
  router.push('/user-profile'); // Ensure this route is defined in your router
};
</script>

<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Home Page</v-toolbar-title>
    </v-toolbar>

    <v-row justify="center" class="mt-5">
      <v-btn color="primary" @click="goToUserProfile">
        Go to User Profile
      </v-btn>
    </v-row>
  </v-container>
</template>
