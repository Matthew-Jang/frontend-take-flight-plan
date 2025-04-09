<script setup>
import { ref, onMounted } from 'vue'
import EventServices from '../services/eventServices'

// Initialize focus as an array containing a Date object (not a string)
const focus = ref([new Date()])  // Today as a Date object

const events = ref([])
const calendarEvents = ref([])
const selectedEvent = ref(null)
const dialog = ref(false)

function normalizeEventType(raw = '') {
  const lc = raw.toLowerCase()
  if (lc.includes('conference')) return 'Conference'
  if (lc.includes('meeting'))    return 'Meeting'
  if (lc.includes('lunch'))      return 'Lunch'
  return 'Other'
}

function getColor(type) {
  return { Conference: 'blue-darken-1', Meeting: 'teal-lighten-1', Lunch: 'orange-lighten-1' }[type] || 'grey'
}

async function fetchEvents() {
  try {
    const res = await EventServices.getAllEvents();

    console.log(res);
    console.log(res);

    events.value = res;
    console.log(typeof(events.value))
    calendarEvents.value = events.value.map((event) => ({
      name: event.name,
      start: new Date(event.date),
      end: new Date(event.date),
      details: {
        description: event.description,
        event_type: event.event_type,
        location: event.location,
        start_time: event.start_time,
        end_time: event.end_time
      },
      color: getColor(normalizeEventType(event.event_type)),
    }));
  } catch (error) {
    console.error("Error fetching events:", error)
  }
}

function showEventDetails({ event }) {
  selectedEvent.value = event
  dialog.value = true
}

function handleEventClick(event) {
  // This is called when the user clicks on an individual event.
  // You could use this function to set selectedEvent and open the details dialog.
  selectedEvent.value = event;
  dialog.value = true;
}

onMounted(fetchEvents)
</script>

<template>
  <v-container>
    <v-sheet height="650">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :events="calendarEvents"
        type="month"
        color="primary"
        hide-week-number
        :first-day-of-week="0"
        @click:event="showEventDetails"  
      >
        <!-- Use a custom slot for events -->
        <template v-slot:event="{ event }">
          <!-- The wrapping div makes the chip take full width and centers it.
               The @click.stop prevents the click from propagating to the calendar cell -->
          <div
            class="d-flex justify-center align-center"
            style="width: 100%; cursor: pointer;"
            @click.stop="handleEventClick(event)"
          >
            <v-chip
              small
              :color="event.color"
              class="ma-1"
              text-color="white"
            >
              {{ event.name }}
            </v-chip>
          </div>
        </template>
      </v-calendar>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card v-if="selectedEvent">
        <v-card-title>{{ selectedEvent.name }}</v-card-title>
        <v-card-subtitle>
          {{ selectedEvent.details.date }} —
          {{ normalizeEventType(selectedEvent.details.event_type) }}
        </v-card-subtitle>
        <v-card-text>
          <strong>Description:</strong> {{ selectedEvent.details.description }}<br/>
          <strong>Location:</strong> {{ selectedEvent.details.location }}<br/>
          <strong>Time:</strong>
          {{ selectedEvent.details.start_time }} - {{ selectedEvent.details.end_time }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>