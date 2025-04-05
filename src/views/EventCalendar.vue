<script setup>
import { ref, onMounted } from 'vue';
import EventServices from '../services/eventServices';

const events = ref([]);
const calendarEvents = ref([]);
const selectedEvent = ref(null);
const dialog = ref(false);

// Normalize type
function normalizeEventType(rawType = "") {
  const lower = rawType.toLowerCase();
  if (lower.includes("conference")) return "Conference";
  if (lower.includes("meeting")) return "Meeting";
  if (lower.includes("lunch")) return "Lunch";
  return "Other";
}

const fetchEvents = async () => {
  try {
    const res = await EventServices.getAllEvents();
    events.value = res.data;

    calendarEvents.value = events.value.map((event) => ({
      name: event.name,
      start: event.date,
      end: event.date,
      details: event,
      color: getColor(normalizeEventType(event.event_type)),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

function getColor(type) {
  switch (type) {
    case "Conference": return "blue";
    case "Meeting": return "green";
    case "Lunch": return "orange";
    default: return "grey";
  }
}

function showEventDetails(event) {
  selectedEvent.value = event;
  dialog.value = true;
}

onMounted(fetchEvents);
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Event Calendar</v-card-title>
      <v-card-text>
        <v-calendar
          ref="calendar"
          color="primary"
          type="month"
          :events="calendarEvents"
          @click:event="showEventDetails"
        />
      </v-card-text>
    </v-card>

    <!-- Event Details Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card v-if="selectedEvent">
        <v-card-title>{{ selectedEvent.name }}</v-card-title>
        <v-card-subtitle>{{ selectedEvent.details.date }} — {{ normalizeEventType(selectedEvent.details.event_type) }}</v-card-subtitle>
        <v-card-text>
          <strong>Description:</strong> {{ selectedEvent.details.description }}<br />
          <strong>Location:</strong> {{ selectedEvent.details.location }}<br />
          <strong>Time:</strong> {{ selectedEvent.details.start_time }} - {{ selectedEvent.details.end_time }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
