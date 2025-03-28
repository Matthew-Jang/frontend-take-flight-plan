<script setup>
import { ref, computed, onMounted } from 'vue';
import EventServices from '../services/eventServices';

const events = ref([]);
const search = ref('');
const filterType = ref('');
const filterDate = ref('');

const fetchEvents = async () => {
  try {
    const res = await EventServices.getAllEvents();
    console.log("Fetched events:", res.data);
    events.value = res.data; // Ensure this is an array
  } catch (err) {
    console.error("Error fetching events:", err);
  }
};

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    // Use fallback values if any field is missing
    const name = (event.name || '').toLowerCase();
    const description = (event.description || '').toLowerCase();
    const eventType = (event.event_type || '').toLowerCase();
    const location = (event.location || '').toLowerCase();
    const date = (event.date || '');

    const searchLower = search.value.toLowerCase();

    const textMatch =
      name.includes(searchLower) ||
      description.includes(searchLower) ||
      eventType.includes(searchLower) ||
      location.includes(searchLower);

    const typeMatch = filterType.value
      ? eventType === filterType.value.toLowerCase()
      : true;

    // If the date is stored as a string in the format "YYYY-MM-DD..." then startsWith works.
    const dateMatch = filterDate.value ? date.startsWith(filterDate.value) : true;

    return textMatch && typeMatch && dateMatch;
  });
});

onMounted(fetchEvents);
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>All Events</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search events..."
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filterType"
              label="Filter by Type"
              prepend-inner-icon="mdi-filter"
              clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filterDate"
              label="Filter by Date (YYYY-MM-DD)"
              prepend-inner-icon="mdi-calendar"
              clearable
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="[
            { text: 'Name', value: 'name' },
            { text: 'Type', value: 'event_type' },
            { text: 'Date', value: 'date' },
            { text: 'Start Time', value: 'start_time' },
            { text: 'End Time', value: 'end_time' },
            { text: 'Location', value: 'location' }
          ]"
          :items="filteredEvents"
          class="elevation-1"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>
