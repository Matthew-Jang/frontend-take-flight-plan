<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter, useRoute } from "vue-router";

const user = ref(null);
const title = ref("Resume Builder");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const router = useRouter();

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
}

// Check if the current route matches the item path
const isActive = (path) => route.path === path;

const navigate = (path) => {
  router.push(path);
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      console.log(response);
      Utils.removeItem("user");
      $router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });

    router.push({ name: "login" });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});

</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'home' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        <!-- <v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn> -->
        <v-btn class="mx-2" :to="{ name: 'profile' }"> Summary </v-btn>
        <v-btn class="mx-2" :to="{ name: 'contactInfos' }"> contact </v-btn>
        <v-btn class="mx-2" :to="{ name: 'professionalInfos' }"> links </v-btn>
        <v-btn class="mx-2" :to="{ name: 'skills' }"> skills </v-btn>
        <v-btn class="mx-2" :to="{ name: 'experiences' }"> Experiences </v-btn>
        <v-btn class="mx-2" :to="{ name: 'educations' }"> educations </v-btn>
        <v-btn class="mx-2" :to="{ name: 'certifications' }"> certifications </v-btn>
        <v-btn class="mx-2" :to="{ name: 'chatbox' }"> ai </v-btn>
        <v-btn class="mx-2" :to="{ name: 'resumes' }"> resumes </v-btn>
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>