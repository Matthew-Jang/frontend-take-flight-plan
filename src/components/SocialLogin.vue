<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});
const showError = ref(false);
const erroMessage = ref("");

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};
  
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const handleCredentialResponse = async (response) => {
  const jwt = parseJwt(response.credential);
  const email = jwt.email;
  const allowedDomains = ["@oc.eagles.edu", "@oc.edu"]; //is oc.edu the staff one?

  const isValid = allowedDomains.some((domain) =>
    email.endsWith(domain)
  );

  if (!isValid) {
    //alert("Only OC school emails are allowed.");
    showError.value = true;
    errorMessage.value = "Only OC school emails are allowed.";
    return;
  }
  
  let token = {
    credential: response.credential,
  };
  
  await AuthServices.loginUser(token)
    .then((response) => {
      user.value = response.data;
      Utils.setStore("user", user.value);
      fName.value = user.value.fName;
      lName.value = user.value.lName;
      router.push({name: "home"});
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
    
    <v-row justify="center" class="mt-4" v-if="showError">
      <v-alert type="error" variant="tonal" border="start" color="red" class="w-75">
        {{ errorMessage }}
      </v-alert>
    </v-row>
  </div>
</template>
