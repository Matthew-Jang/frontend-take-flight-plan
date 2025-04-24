<template>
  <v-container>
    <!-- Events Table Card -->
    <BrandedCard class="mb-6">
      <v-data-table
        :headers="headers"
        :items="events"
        :search="search"
        item-value="event_id"
        class="elevation-1"
      >
        <!-- Table Top: Title + Search + Add Button -->
        <template #top>
          <div class="d-flex justify-space-between align-center w-100 pa-4">
            <span class="text-h6">Events</span>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              density="compact"
              class="mx-4"
              style="max-width: 300px"
            />
            <BrandedButton color="primary" @click="openCreateDialog">
              <v-icon left small>mdi-plus</v-icon>
              Create Event
            </BrandedButton>
          </div>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <v-btn icon @click="editEvent(item)">
          <!-- OC Dark Maroon -->
          <v-icon color="oc-storm">mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon @click="deleteEvent(item.event_id)">
          <!-- OC Salmon -->
          <v-icon color="oc-salmon">mdi-delete</v-icon>
        </v-btn>

        <v-btn icon @click="viewSignups(item)">
          <!-- OC Ethos -->
          <v-icon color="oc-ethos">mdi-account-multiple</v-icon>
        </v-btn>

        </template>
      </v-data-table>
    </BrandedCard>

    <!-- Create/Edit Event Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <BrandedCard>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'Edit Event' : 'Create Event' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="eventForm">
            <v-text-field
              v-model="event.name"
              label="Event Name"
              required
            />
            <v-textarea
              v-model="event.description"
              label="Description"
            />
            <v-select
              v-model="event.event_type"
              :items="['Conference','Meeting','Lunch','Other']"
              label="Event Type"
              required
            />
            <v-text-field
              v-model="event.date"
              label="Date (YYYY-MM-DD)"
              required
            />
            <v-text-field
              v-model="event.start_time"
              label="Start Time (HH:MM:SS)"
              required
            />
            <v-text-field
              v-model="event.end_time"
              label="End Time (HH:MM:SS)"
              required
            />
            <v-text-field
              v-model="event.location"
              label="Location"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="dialog = false">Cancel</BrandedButton>
          <BrandedButton color="primary" @click="saveEvent">
            {{ editMode ? 'Update' : 'Create' }}
          </BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Sign-ups Dialog -->
    <v-dialog v-model="signupsDialog" max-width="600px">
      <BrandedCard>
        <v-card-title>
          Sign-ups for “{{ selectedEventName }}”
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="signupHeaders"
            :items="signups"
            class="elevation-1"
            hide-default-footer
          >
            <template #item.signupTime="{ item }">
              {{ formatTimestamp(item.signupTime) }}
            </template>
            <template #item.actions="{ item }">
              <v-btn icon @click="removeSignup(item)">
                <v-icon color="error">mdi-account-remove</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="signupsDialog = false">Close</BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import eventServices from '../services/eventServices'

// Branded components
import BrandedButton from '@/components/BrandedButton.vue'
import BrandedCard   from '@/components/BrandedCard.vue'

// State
const events = ref([])
const dialog = ref(false)
const editMode = ref(false)
const signupsDialog = ref(false)
const selectedEventName = ref('')
const event = ref({
  event_id: null,
  name: '',
  description: '',
  event_type: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
})
const signups = ref([])
const search = ref('')

// Table headers
const headers = [
  { title: 'Name',       value: 'name' },
  { title: 'Type',       value: 'event_type' },
  { title: 'Date',       value: 'date' },
  { title: 'Start Time', value: 'start_time' },
  { title: 'End Time',   value: 'end_time' },
  { title: 'Location',   value: 'location' },
  { title: 'Actions',    value: 'actions', sortable: false },
]
const signupHeaders = [
  { title: 'First Name', value: 'fName' },
  { title: 'Last Name',  value: 'lName' },
  { title: 'Email',      value: 'email' },
  { title: 'Signed Up',  value: 'signupTime' },
  { title: 'Actions',    value: 'actions', sortable: false },
]

// Fetch all events
const fetchEvents = async () => {
  try {
    const res = await eventServices.getAllEvents()
    events.value = Array.isArray(res.data) ? res.data : res
  } catch (err) {
    console.error('Error fetching events:', err)
  }
}

const openCreateDialog = () => {
  event.value = {
    event_id: null,
    name: '',
    description: '',
    event_type: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
  }
  editMode.value = false
  dialog.value = true
}

const editEvent = (item) => {
  event.value = { ...item }
  editMode.value = true
  dialog.value = true
}

const saveEvent = async () => {
  try {
    if (editMode.value) {
      await eventServices.updateEvent(event.value.event_id, event.value)
    } else {
      await eventServices.createEvent(event.value)
    }
    dialog.value = false
    fetchEvents()
  } catch (err) {
    console.error('Error saving event:', err)
  }
}

const deleteEvent = async (id) => {
  if (!confirm('Are you sure you want to delete this event?')) return
  try {
    await eventServices.deleteEvent(id)
    fetchEvents()
  } catch (err) {
    console.error('Error deleting event:', err)
  }
}

const viewSignups = async (item) => {
  selectedEventName.value = item.name
  try {
    const res = await eventServices.getEventSignups(item.event_id)
    const raw = Array.isArray(res.data) ? res.data : res
    signups.value = raw.map(r => ({
      ...r.user,
      signupTime: r.createdAt || r.signupTime
    }))
    signupsDialog.value = true
  } catch (err) {
    console.error('Error loading sign-ups:', err)
  }
}

const removeSignup = async (row) => {
  if (!confirm(`Remove ${row.fName} ${row.lName}?`)) return
  try {
    await eventServices.removeSignup(row.event_id, row.userId)
    viewSignups({ event_id: row.event_id, name: selectedEventName.value })
  } catch (err) {
    console.error('Error removing signup:', err)
  }
}

const formatTimestamp = (ts) => {
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

onMounted(fetchEvents)
</script>

<style lang="scss" scoped>
@use "@/styles/_variables.scss" as *;
/* Additional page-specific custom styles can go here */
</style>
