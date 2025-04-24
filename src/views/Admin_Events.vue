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
        <v-btn icon @click="viewSignups(item)">
          <v-icon color="teal">mdi-account-multiple</v-icon>
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
            <v-text-field v-model="event.name" label="Event Name" required />
            <v-textarea v-model="event.description" label="Description" />
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
            <v-text-field v-model="event.location" label="Location" />
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

    <!-- Signups Dialog -->
    <v-dialog v-model="signupsDialog" max-width="600px">
      <v-card>
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
            <!-- Format the signupTime column -->
            <template v-slot:item.signupTime="{ item }">
              {{ formatTimestamp(item.signupTime) }}
            </template>
            <!-- Remove action per row -->
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="removeSignup(item)">
                <v-icon color="red">mdi-account-remove</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="signupsDialog = false">Close</v-btn>
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
        { text: "Name",       value: "name" },
        { text: "Type",       value: "event_type" },
        { text: "Date",       value: "date" },
        { text: "Start Time", value: "start_time" },
        { text: "End Time",   value: "end_time" },
        { text: "Location",   value: "location" },
        { text: "Actions",    value: "actions", sortable: false },
      ],
      // signups
      signupsDialog: false,
      signups: [],
      selectedEventName: "",
      currentEventId: null,
      signupHeaders: [
        { text: "First Name", value: "fName" },
        { text: "Last Name",  value: "lName" },
        { text: "Email",      value: "email" },
        { text: "Signed Up",  value: "signupTime" },
        { text: "Actions",    value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await eventServices.getAllEvents();
        let data = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
            ? response.data
            : [];
        this.events = data;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    openCreateDialog() {
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
    editEvent(item) {
      this.event = { ...item };
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

    // fetch and show signups with safe data normalization
    async viewSignups(item) {
      this.selectedEventName = item.name;
      this.currentEventId = item.event_id;
      try {
        const resOrData = await eventServices.getEventSignups(item.event_id);
        const raw = Array.isArray(resOrData)
          ? resOrData
          : Array.isArray(resOrData.data)
            ? resOrData.data
            : [];
        // Map each record: pull user fields + signup timestamp + studentId
        this.signups = raw.map(r => ({
          studentEventsId: r.id,       // the join record id
          userId:           r.user.id,
          fName:            r.user.fName,
          lName:            r.user.lName,
          email:            r.user.email,
          signupTime:       r.createdAt // or r.signupTime if your API returns it
        }));
        this.signupsDialog = true;
      } catch (err) {
        console.error("Error loading sign-ups:", err);
      }
    },

    // Format Date into MM/DD/YYYY hh:mm A
    formatTimestamp(ts) {
      const d = new Date(ts);
      return d.toLocaleString("en-US", {
        month: "2-digit",
        day:   "2-digit",
        year:  "numeric",
        hour:      "2-digit",
        minute:    "2-digit",
        hour12:    true
      });
    },

    // Remove a signup
    async removeSignup(row) {
    if (!confirm(`Remove ${row.fName} ${row.lName}?`)) return;
    try {
      // call the new endpoint
      await eventServices.removeSignup(this.currentEventId, row.userId);
      // reload the list
      this.viewSignups({ 
        event_id: this.currentEventId,
        name: this.selectedEventName
      });
    } catch (err) {
      console.error("Error removing signup:", err);
      this.$toast?.error("Failed to remove signup");
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
