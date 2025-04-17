<template>
    <v-container>
      <v-btn 
        :disabled="!student" 
        color="primary" 
        @click="generatePlan"
      >
        Generate Flight Plan
      </v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  import Utils from "../config/utils";
  import StudentServices from "../services/studentServices.js";
  import FlightPlanServices from "../services/studentFlightPlanServices.js";
  
  const router  = useRouter();
  const user     = ref(null);
  const student  = ref(null);
  
  // Load the currently‑logged‑in user from local storage
  const getUser = () => {
    user.value = Utils.getStore("user");
    if (!user.value || !user.value.userId) {
      // Not logged in → go to login
      return router.push({ name: "login" });
    }
    console.log("Logged in userId:", user.value.fName, user.value.lName, user.value.userId);
  };
  
  // Fetch the Student record for that user
  const getStudent = () => {
    console.log("get student vue - USER : " + JSON.stringify(user.value))
    if (!user.value) return;
    StudentServices.findByUser(user.value.userId)
      .then(res => {
        student.value = res.data;
        console.log("Loaded student:", student.value);
      })
      .catch(err => {
        console.error("Error fetching student profile:", err);
        // If no record exists you may choose to redirect to a "create profile" page
      });
  };
  
  // Call the backend to generate this student's flight plan
  const generatePlan = () => {
    if (!student.value) {
      console.warn("Cannot generate plan: no student record loaded");
      return;
    }

    console.log("generate plan vue - STUDENT ID: " + student.value.id)
    // console.log("generate plan vue - STUDENT ID: " + JSON.stringify(student))
  
    FlightPlanServices.generate(student.value.id)
      .then(() => {
        console.log("Flight plan generated for student");
        // Optionally navigate to the flight plan view
        router.push({ name: "student_flight_plan" });
      })
      .catch(err => {
        console.error("Error generating flight plan:", err);
      });
  };
  
  onMounted(async () => {
    await getUser();
    await getStudent();
  });
  </script>
  