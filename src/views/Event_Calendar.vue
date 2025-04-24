<script setup>
import { ref, onMounted } from 'vue'
import EventServices from '../services/eventServices'

// Today’s date focus
const focus = ref([new Date()])

// Raw events + transformed for the calendar
const events         = ref([])
const calendarEvents = ref([])

// Dialog state & selected event
const selectedEvent = ref(null)
const dialog        = ref(false)

// Track which event IDs this user has signed up for
const signedUp      = ref(new Set())
const loading       = ref(false)

function normalizeEventType(raw = '') {
  const lc = raw.toLowerCase()
  if (lc.includes('conference')) return 'Conference'
  if (lc.includes('meeting'))    return 'Meeting'
  if (lc.includes('lunch'))      return 'Lunch'
  return 'Other'
}

function getColor(type) {
  return {
    Conference: 'blue-darken-1',
    Meeting:    'teal-lighten-1',
    Lunch:      'orange-lighten-1'
  }[type] || 'grey'
}

// Load both events and the user's existing signups
async function init() {
  loading.value = true
  try {
    // 1) Fetch events (array or Axios response)
    const evResOrData = await EventServices.getAllEvents()
    const eventArray = Array.isArray(evResOrData)
      ? evResOrData
      : Array.isArray(evResOrData.data)
        ? evResOrData.data
        : []
    events.value = eventArray

    // Build calendarEvents
    calendarEvents.value = eventArray.map(e => ({
      name:    e.name,
      start:   new Date(e.date),
      end:     new Date(e.date),
      details: e,
      color:   getColor(normalizeEventType(e.event_type)),
    }))

    // 2) Fetch the current user’s signups
    const suResOrData = await EventServices.getMySignups()
    const signupIds = Array.isArray(suResOrData.data)
      ? suResOrData.data
      : Array.isArray(suResOrData)
        ? suResOrData
        : []
    signupIds.forEach(id => signedUp.value.add(id))

  } catch (err) {
    console.error("Error initializing calendar:", err)
    events.value = []
    calendarEvents.value = []
    signedUp.value.clear()
  } finally {
    loading.value = false
  }
}

// Toggle between sign-up and un-register
async function toggleSignup(eventId) {
  loading.value = true
  try {
    if (signedUp.value.has(eventId)) {
      await EventServices.unSignupForEvent(eventId)
      signedUp.value.delete(eventId)
    } else {
      await EventServices.signupForEvent(eventId)
      signedUp.value.add(eventId)
    }
  } catch (err) {
    console.error("Error toggling signup:", err)
    alert(err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

// When a chip is clicked
function showEventDetails({ event }) {
  selectedEvent.value = event.details
  dialog.value = true
}

onMounted(init)
</script>

<template>
  <v-container>
    <v-sheet height="650">
      <v-calendar
        v-model="focus"
        :events="calendarEvents"
        type="month"
        color="primary"
        hide-week-number
        :first-day-of-week="0"
        @click:event="showEventDetails"
      >
        <template v-slot:event="{ event }">
          <div
            class="d-flex justify-center align-center"
            style="width: 100%; cursor: pointer;"
            @click.stop="showEventDetails({ event })"
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

    <!-- Details / Signup Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card v-if="selectedEvent">
        <v-card-title>{{ selectedEvent.name }}</v-card-title>
        <v-card-subtitle>
          {{ selectedEvent.date }} — {{ normalizeEventType(selectedEvent.event_type) }}
        </v-card-subtitle>
        <v-card-text>
          <strong>Description:</strong> {{ selectedEvent.description }}<br/>
          <strong>Location:</strong> {{ selectedEvent.location }}<br/>
          <strong>Time:</strong>
          {{ selectedEvent.start_time }} - {{ selectedEvent.end_time }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :loading="loading"
            @click="toggleSignup(selectedEvent.event_id)"
          >
            {{ signedUp.has(selectedEvent.event_id) ? 'Unregister' : 'Sign Up' }}
          </v-btn>
          <v-spacer/>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
