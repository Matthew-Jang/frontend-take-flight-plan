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

    <v-card v-if="flight_plan_exists">
      <v-card-title>
        Flight Plan
        <v-spacer />
        <v-btn color="green" @click="saveFlightPlan">Save</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="sem in semesters"
            :key="sem.id"
            cols="12" md="6"
          >
            <v-card class="mb-4">
              <v-card-title>{{ sem.title }}</v-card-title>
              <v-card-text
                class="min-h-100"
                @drop="dropHandler(sem, $event)"
                @dragover="dragoverHandler"
              >
                <v-card
                  v-for="fpi in sem.flight_plan_items"
                  :key="fpi.id"
                  class="mb-2 pa-2"
                  :id="`fpi-${fpi.id}`"
                  draggable="true"
                  @dragstart="dragstartHandler(fpi, $event)"
                >
                  <!-- lookup name/points from checklistMap -->
                  {{ fpi.name }}
                  ({{ fpi.points }} pts)
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  import Utils from "../config/utils";
  import StudentServices from "../services/studentServices.js";
  import FlightPlanServices from "../services/studentFlightPlanServices.js";
  // import FlightPlanItemServices from '../services/flightPlanItemServices';
  
  const router  = useRouter();
  const user     = ref();
  const student  = ref();

  //flight plan stuff
  const flight_plan_exists = ref(false);
  const flight_plan_items = ref([]);
  const semesters = ref([]);
const semesterTitles = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

// Initialize eight cards
for (let i = 0; i < 8; i++) {
  semesters.value.push({
    id: i + 1,
    title: semesterTitles[i],
    flight_plan_items: [],
  });
}
  
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
    return StudentServices.findByUser(user.value.userId)
      .then(res => {
        student.value = res.data;
        console.log("Loaded student: \nID:", student.value.id, "\nuser_id: ", student.value.user_id);
      })
      .catch(err => {
        console.error("Error fetching student profile:", err);
        // If no record exists you may choose to redirect to a "create profile" page
      });
  };

  
const fetchFlightPlanItems = () => {
  // console.log("student : ", JSON.stringify(student.value))
  // const { data } =  
  console.log("fetching flight plan for student with ID: ", student.value.id);
  FlightPlanServices.fetchByStudent(student.value.id)
  .then((res) =>{
    // console.log("RESPONSE: " + JSON.stringify(res))
    console.log("RESPONSE DATA: ",res.data)
    flight_plan_items.value = res.data;

    if(flight_plan_items.value) {
    flight_plan_exists.value = true;
  }
  // clear old
  semesters.value.forEach(s => s.flight_plan_items = []);
  // distribute
  flight_plan_items.value.forEach(fpi => {
    const idx = fpi.semester_number - 1;
    if (semesters.value[idx]) {
      semesters.value[idx].flight_plan_items.push(fpi);
    }
  });
  })
  .catch((error) => {
    console.log(error);
  })
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
    await fetchFlightPlanItems();
  });
  </script>
  