<script setup>
import { ref, computed, onMounted } from 'vue';
import EventServices from '../services/eventServices';

// 1) All possible event type categories
const eventTypeOptions = ["Conference", "Meeting", "Lunch", "Other"];

// 2) Reactive data
const events = ref([]);
const search = ref("");
// By default, all types are selected
const selectedTypes = ref([...eventTypeOptions]);
const filterDate = ref("");

// Helper function to normalize event_type to one of the 4 categories
function normalizeEventType(rawType = "") {
  const lower = rawType.toLowerCase();
  if (lower.includes("conference")) return "Conference";
  if (lower.includes("meeting")) return "Meeting";
  if (lower.includes("lunch")) return "Lunch";
  // Everything else is considered "Other"
  return "Other";
}

// Fetch events from the API
const fetchEvents = async () => {
  try {
    const res = await EventServices.getAllEvents();
    console.log("Full response from getAllEvents:", res);
    console.log("Fetched events (res.data):", res.data);

    let fetchedData = res.data || res; 
    if (!Array.isArray(fetchedData)) {
      console.warn("Fetched data is not an array. Using empty array instead.");
      fetchedData = [];
    }
    events.value = fetchedData;
  } catch (err) {
    console.error("Error fetching events:", err);
  }
};

// Computed list of events filtered by search, type, and date
const filteredEvents = computed(() => {
  const searchLower = search.value.toLowerCase();
  
  return events.value.filter((event) => {
    // Safely handle missing fields
    const name = (event.name || "").toLowerCase();
    const description = (event.description || "").toLowerCase();
    const location = (event.location || "").toLowerCase();
    const dateStr = (event.date || ""); // e.g. "2025-05-20" or "2025-05-20T00:00:00.000Z"
    
    // Normalize the event_type to one of our four categories
    const eventTypeCategory = normalizeEventType(event.event_type);

    // Text search across name, description, event_type, location
    const textMatch =
      name.includes(searchLower) ||
      description.includes(searchLower) ||
      eventTypeCategory.toLowerCase().includes(searchLower) ||
      location.includes(searchLower);

    // Type filter: pass if the normalized type is in the selectedTypes array
    const typeMatch = selectedTypes.value.includes(eventTypeCategory);

    // Date filter: if filterDate is "YYYY-MM-DD", check startsWith
    let dateMatch = true;
    if (filterDate.value) {
      dateMatch = dateStr.startsWith(filterDate.value);
    }

    return textMatch && typeMatch && dateMatch;
  });
});

onMounted(fetchEvents);
</script>

<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>All Events</v-card-title>
      <v-card-text>
        <!-- Filters Row -->
        <v-row>
          <!-- Search Field -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search events..."
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>

          <!-- Multi-Select Dropdown for Event Types -->
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedTypes"
              :items="eventTypeOptions"
              label="Filter by Type"
              multiple
              clearable
              chips
            />
          </v-col>

          <!-- Date Filter -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filterDate"
              label="Filter by Date (YYYY-MM-DD)"
              prepend-inner-icon="mdi-calendar"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Cards Display -->
    <v-row>
      <v-col
        v-for="(event, index) in filteredEvents"
        :key="index"
        cols="12"
        md="4"
      >
        <v-card class="mb-4">
          <v-card-title>{{ event.name }}</v-card-title>
          <v-card-subtitle>
            {{ normalizeEventType(event.event_type) }} - {{ event.date }}
          </v-card-subtitle>
          <v-card-text>
            <strong>Description:</strong> {{ event.description }}<br />
            <strong>Location:</strong> {{ event.location }}<br />
            <strong>Start Time:</strong> {{ event.start_time }}<br />
            <strong>End Time:</strong> {{ event.end_time }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
