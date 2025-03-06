<script setup>
import { ref, onMounted } from 'vue'
import eventServices from '../services/eventServices'

// Reactive variables
const events = ref([])
const dialog = ref(false)
const editMode = ref(false)
const eventData = ref({
  event_id: null,
  name: "",
  description: "",
  event_type: "",
  date: "",
  start_time: "",
  end_time: "",
  location: ""
})

// Define table headers for events
const headers = [
  { title: "Name", value: "name" },
  { title: "Type", value: "event_type" },
  { title: "Date", value: "date" },
  { title: "Start Time", value: "start_time" },
  { title: "End Time", value: "end_time" },
  { title: "Location", value: "location" },
  { title: "Actions", value: "actions", sortable: false }
]

// Open dialog for creating a new event
const openCreateDialog = () => {
  eventData.value = {
    event_id: null,
    name: "",
    description: "",
    event_type: "",
    date: "",
    start_time: "",
    end_time: "",
    location: ""
  }
  editMode.value = false
  dialog.value = true
}

// Open dialog for editing an existing event
const editEvent = (item) => {
  eventData.value = { ...item }
  editMode.value = true
  dialog.value = true
}

// Fetch events from the server
const fetchEvents = async () => {
  try {
    const response = await eventServices.getAllEvents()
    events.value = response.data
    console.log("response ", response.data);
  } catch (error) {
    console.error("Error fetching events:", error)
  }
}

// Save event (create or update)
const saveEvent = async () => {
  try {
    if (editMode.value) {
      await eventServices.updateEvent(eventData.value.event_id, eventData.value)
    } else {
      await eventServices.createEvent(eventData.value)
    }
    dialog.value = false
    fetchEvents()
  } catch (error) {
    console.error("Error saving event:", error)
  }
}

// Delete an event by ID
const deleteEvent = async (id) => {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      await eventServices.deleteEvent(id)
      fetchEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        Admin Events
      </v-card-title>
      <v-card-text>
        <v-btn color="primary" class="mb-4" @click="openCreateDialog">
          Create Event
        </v-btn>
        <v-data-table :headers="headers" :items="events" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editEvent(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteEvent(item.event_id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? "Edit Event" : "Create Event" }}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="eventData.name" label="Event Name" required></v-text-field>
            <v-textarea v-model="eventData.description" label="Description"></v-textarea>
            <v-text-field v-model="eventData.event_type" label="Event Type" required></v-text-field>
            <v-text-field v-model="eventData.date" label="Date (YYYY-MM-DD)" required></v-text-field>
            <v-text-field v-model="eventData.start_time" label="Start Time (HH:MM:SS)" required></v-text-field>
            <v-text-field v-model="eventData.end_time" label="End Time (HH:MM:SS)" required></v-text-field>
            <v-text-field v-model="eventData.location" label="Location"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="saveEvent">{{ editMode ? "Update" : "Create" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
