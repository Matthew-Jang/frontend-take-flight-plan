<script setup>
import { ref, onMounted } from 'vue';
import ChecklistItemServices from '../services/ChecklistItemServices'; // Ensure this is the correct path

let currentDraggedItem = null;
const semesters = ref([]);
const items = ref([]);
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
    checklist_items: [],
  });
}

const fetchChecklistItems = async () => {
  console.log('Vue - fetching checklist items');
  try {
    const response = await ChecklistItemServices.fetchChecklistItems();

    items.value = response.data;

    items.value.forEach((item) => {
      const semesterIndex = item.semester_number - 1; // Adjust for zero-based index
      if (semesterIndex >= 0 && semesterIndex < semesters.value.length) {
        semesters.value[semesterIndex].checklist_items.push(item); // Assuming item.name is the checklist item
      }
    });
  } catch (error) {
    console.error('Error fetching checklist items:', error);
  }
};

const saveFlightPlan = async () => {
  console.log('Vue - saving flight plan');

  // Use semesters.value since semesters is a ref
  for (const semester of semesters.value) {
    for (const item of semester.checklist_items) {
      item.semester_number = semester.id;
      try {
        console.log("Updating checklist item", item);
        await ChecklistItemServices.updateChecklistItem(item.id, item);
        console.log(`Checklist item ${item.id} updated successfully`);
      } catch (error) {
        console.error(`Error updating checklist item ${item.id}:`, error);
      }
    }
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

const dropHandler = (semester, event) => {
  console.log('Vue - dropHandler');
  event.preventDefault();

  for (const semester of semesters.value) {
    const index = semester.checklist_items.indexOf(currentDraggedItem);
    if (index > -1) {
      semester.checklist_items.splice(index, 1);
      break;
    }
  }

  currentDraggedItem.semester_number = semester.id;
  semester.checklist_items.push(currentDraggedItem);
  currentDraggedItem = null;
};

onMounted(() => {
  fetchChecklistItems();
});
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Flight Plan</span>
        <v-btn color="green" @click="saveFlightPlan()">Save</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="semester in semesters" :key="semester.id" cols="12" md="6">
            <v-card>
              <v-card-title>{{ semester.title }}</v-card-title>
              <v-card-text @drop="dropHandler(semester, $event)" @dragover="dragoverHandler">
                <v-card v-for="item in semester.checklist_items" :key="item"><a :id="`item-${item.id}`" draggable="true" @dragstart="dragstartHandler(item,$event)">{{ item.name }} {{ item.points }}</a>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>