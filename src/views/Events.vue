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
    events.value = res.data;
  } catch (err) {
    console.error("Error fetching events:", err);
  }
};

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const textMatch = (
      event.name.toLowerCase().includes(search.value.toLowerCase()) ||
      event.description?.toLowerCase().includes(search.value.toLowerCase()) ||
      event.event_type?.toLowerCase().includes(search.value.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.value.toLowerCase())
    );

    const typeMatch = filterType.value
      ? event.event_type?.toLowerCase() === filterType.value.toLowerCase()
      : true;

    const dateMatch = filterDate.value
      ? event.date?.startsWith(filterDate.value)
      : true;

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
            { title: 'Name', value: 'name' },
            { title: 'Type', value: 'event_type' },
            { title: 'Date', value: 'date' },
            { title: 'Start Time', value: 'start_time' },
            { title: 'End Time', value: 'end_time' },
            { title: 'Location', value: 'location' }
          ]"
          :items="filteredEvents"
          class="elevation-1"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>
