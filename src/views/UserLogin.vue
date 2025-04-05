<script setup>
import SocialLogin from "../components/SocialLogin.vue";
</script>

<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center">
    <v-card elevation="10" class="pa-6" max-width="500" rounded="2xl">
      <v-card-title class="text-h5 text-center">Welcome to T-4 Flight-Plan!</v-card-title>
      <v-card-subtitle class="text-center mb-4">
        Sign in or sign up using your school Google account.
      </v-card-subtitle>

      <!-- Social Login component -->
      <SocialLogin />

      <v-alert
        type="info"
        class="mt-4"
        border="start"
        prominent
        v-if="!isSchoolEmail"
      >
        Only school Google accounts are allowed.
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      isSchoolEmail: true, // This will be updated by your auth logic
    };
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>

