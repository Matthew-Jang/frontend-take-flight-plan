<script setup>
import { ref, onMounted } from 'vue';
import ChecklistItemServices from '../services/ChecklistItemServices'; // Ensure this is the correct path

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
    checklist_items: [],
  });
}

const fetchChecklistItems = async () => {
  console.log('Vue - fetching checklist items');
  try {
    const response = await ChecklistItemServices.fetchChecklistItems();

    const items = response.data;

    items.forEach((item) => {
      const semesterIndex = item.semesters_til_graduation - 1; // Adjust for zero-based index
      if (semesterIndex >= 0 && semesterIndex < semesters.value.length) {
        semesters.value[semesterIndex].checklist_items.push(item.name); // Assuming item.name is the checklist item
      }
    });
  } catch (error) {
    console.error('Error fetching checklist items:', error);
  }
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
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="semester in semesters" :key="semester.id" cols="12" md="6">
            <v-card>
              <v-card-title>{{ semester.title }}</v-card-title>
              <v-card-text>
                <ul>
                  <li v-for="item in semester.checklist_items" :key="item">{{ item }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>