<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Admin Events</h1>
        <v-btn color="primary" @click="openCreateDialog">Create Event</v-btn>
      </v-col>
    </v-row>

    <!-- Events Table -->
    <v-data-table
      :headers="headers"
      :items="events"
      item-value="event_id"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editEvent(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteEvent(item.event_id)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">
            {{ editMode ? "Edit Event" : "Create Event" }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="eventForm">
            <v-text-field
              v-model="event.name"
              label="Event Name"
              required
            ></v-text-field>

            <v-textarea
              v-model="event.description"
              label="Description"
            ></v-textarea>

            <!-- v-select for event type -->
            <v-select
              v-model="event.event_type"
              :items="['Conference', 'Meeting', 'Lunch', 'Other']"
              label="Event Type"
              required
            ></v-select>

            <v-text-field
              v-model="event.date"
              label="Date (YYYY-MM-DD)"
              required
            ></v-text-field>

            <v-text-field
              v-model="event.start_time"
              label="Start Time (HH:MM:SS)"
              required
            ></v-text-field>

            <v-text-field
              v-model="event.end_time"
              label="End Time (HH:MM:SS)"
              required
            ></v-text-field>

            <v-text-field
              v-model="event.location"
              label="Location"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="saveEvent">
            {{ editMode ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import eventServices from "../services/eventServices";

export default {
  data() {
    return {
      events: [],
      dialog: false,
      editMode: false,
      event: {
        event_id: null,
        name: "",
        description: "",
        event_type: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
      },
      headers: [
        { text: "Name", value: "name" },
        { text: "Type", value: "event_type" },
        { text: "Date", value: "date" },
        { text: "Start Time", value: "start_time" },
        { text: "End Time", value: "end_time" },
        { text: "Location", value: "location" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await eventServices.getAllEvents();
        console.log("Fetched events:", response);
        // Use response.data if available, or fallback to response
        let fetchedData = response.data || response;
        if (!Array.isArray(fetchedData)) {
          console.warn("Fetched data is not an array. Using empty array instead.");
          fetchedData = [];
        }
        this.events = fetchedData;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    openCreateDialog() {
      // Reset the event form
      this.event = {
        event_id: null,
        name: "",
        description: "",
        event_type: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
      };
      this.editMode = false;
      this.dialog = true;
    },
    editEvent(eventData) {
      this.event = { ...eventData };
      this.editMode = true;
      this.dialog = true;
    },
    async saveEvent() {
      try {
        if (this.editMode) {
          await eventServices.updateEvent(this.event.event_id, this.event);
        } else {
          await eventServices.createEvent(this.event);
        }
        this.dialog = false;
        this.fetchEvents();
      } catch (error) {
        console.error("Error saving event:", error);
      }
    },
    async deleteEvent(eventId) {
      if (confirm("Are you sure you want to delete this event?")) {
        try {
          await eventServices.deleteEvent(eventId);
          this.fetchEvents();
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchEvents();
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
