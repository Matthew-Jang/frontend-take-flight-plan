<script setup>
import { ref, reactive, onMounted } from 'vue';
import ChecklistItemServices from '../services/ChecklistItemServices';
import FlightPlanItemServices from '../services/flightPlanItemServices';

let currentDraggedItem = null;

// lists
const items = ref([]);
const flight_plan_items = ref([]);

//lookup table
const checklistMap = reactive({});

//semester info
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

const fetchChecklistItems = async () => {
  const { data } = await ChecklistItemServices.fetchAll();
  items.value = data;
  data.forEach(item => {
    checklistMap[item.id] = item;
  });
};

const fetchFlightPlanItems = async () => {
  const { data } = await FlightPlanItemServices.fetchAll();
  flight_plan_items.value = data;
  // clear old
  semesters.value.forEach(s => s.flight_plan_items = []);
  // distribute
  data.forEach(fpi => {
    const idx = fpi.semester_number - 1;
    if (semesters.value[idx]) {
      semesters.value[idx].flight_plan_items.push(fpi);
    }
  });
};

// Save: update all flight plan items’ semester_numbers
const saveFlightPlan = async () => {
  for (const sem of semesters.value) {
    for (const fpi of sem.flight_plan_items) {
      if (fpi.semester_number !== sem.id) {
        fpi.semester_number = sem.id;
        await FlightPlanItemServices.update(fpi.id, fpi);
      }
    }
  }
};

const deleteFlightPlanItem = async (fpi) => {
  try {
    await FlightPlanItemServices.delete(fpi.id);

    const sem = semesters.value.find(s => s.id === fpi.semester_number);
    if (sem) {
      const idx = sem.flight_plan_items.findIndex(x => x.id === fpi.id);
      if (idx > -1) sem.flight_plan_items.splice(idx, 1);
    }
  } catch (err) {
    console.error(`Failed to delete flight plan item ${fpi.id}:`, err);
  }
};

const dragstartHandler = (item, event) => {
  console.log('Vue - dragstartHandler');
  currentDraggedItem = item;
  event.dataTransfer.setData('text/plain', event.target.id);
};

const dragoverHandler = (event) => {
  console.log('Vue - dragoverHandler');
  event.preventDefault();
};

const dropHandler = async (semester, ev) => {
  ev.preventDefault();
  // create on server
  const payload = {
    checklist_item_id: currentDraggedItem.id,
    semester_number: semester.id,
  };
  const { data: newFpi } = await FlightPlanItemServices.create(payload);
  // add locally
  semester.flight_plan_items.push(newFpi);
  currentDraggedItem = null;
};


onMounted(async () => {
 await fetchChecklistItems();
 await fetchFlightPlanItems();
});
</script>

<template>
  <v-container>

    <!-- 1) Tasks & Experiences -->
    <v-card class="mb-6">
      <v-card-title>Tasks & Experiences</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="ci in items"
            :key="ci.id"
            :id="`item-${ci.id}`"
            draggable="true"
            @dragstart="dragstartHandler(ci, $event)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ ci.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ ci.points }} pts</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- 2) Flight Plan -->
    <v-card>
      <v-card-title>
        Flight Plan
        <v-spacer />
        <!-- <v-btn color="green" @click="saveFlightPlan">Save</v-btn> -->
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
                  {{ checklistMap[fpi.checklist_item_id].name }}
                  ({{ checklistMap[fpi.checklist_item_id].points }} pts)

                  <!-- Trash icon -->
                    <v-btn icon small color="red" @click="deleteFlightPlanItem(fpi)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-container>
</template>