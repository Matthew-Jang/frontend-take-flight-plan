<script setup>
import { ref, computed, onMounted } from 'vue';
import EventServices from '../services/eventServices';

// All event categories
const eventTypeOptions = ["Conference", "Meeting", "Lunch", "Other"];

const events        = ref([]);
const search        = ref("");
const selectedTypes = ref([...eventTypeOptions]);
const filterDate    = ref("");
const signedUp      = ref(new Set());
const loading       = ref(false);

// Normalize to our four types
function normalizeEventType(raw = "") {
  const l = raw.toLowerCase();
  if (l.includes("conference")) return "Conference";
  if (l.includes("meeting"))    return "Meeting";
  if (l.includes("lunch"))      return "Lunch";
  return "Other";
}

// Load events + the current user's signups
async function init() {
  loading.value = true;
  try {
    // 1) Fetch events (might be an array or an Axios response)
    const evResOrData = await EventServices.getAllEvents();
    const eventArray = Array.isArray(evResOrData)
      ? evResOrData
      : Array.isArray(evResOrData.data)
        ? evResOrData.data
        : [];
    events.value = eventArray;

    // 2) Fetch this user’s signups
    const suResOrData = await EventServices.getMySignups();
    const signupIds = Array.isArray(suResOrData.data)
      ? suResOrData.data
      : Array.isArray(suResOrData)
        ? suResOrData
        : [];
    signedUp.value = new Set(signupIds);

  } catch (err) {
    console.error("Init error:", err);
    events.value = [];
    signedUp.value.clear();
  } finally {
    loading.value = false;
  }
}


// Sign up / unregister toggler
// Sign up / unregister toggler
async function toggleSignup(eventId) {
  loading.value = true;
  try {
    if (signedUp.value.has(eventId)) {
      await EventServices.unSignupForEvent(eventId);
      signedUp.value.delete(eventId);
    } else {
      await EventServices.signupForEvent(eventId);
      signedUp.value.add(eventId);
    }
  } catch (err) {
    console.error("Toggle error:", err);
    alert(err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
}


// Computed, filtered events
const filteredEvents = computed(() => {
  const s = search.value.toLowerCase();
  return events.value.filter(evt => {
    const name = (evt.name || "").toLowerCase();
    const desc = (evt.description || "").toLowerCase();
    const loc  = (evt.location || "").toLowerCase();
    const date = evt.date || "";

    const cat = normalizeEventType(evt.event_type);

    const textMatch =
      name.includes(s) ||
      desc.includes(s) ||
      cat.toLowerCase().includes(s) ||
      loc.includes(s);

    const typeMatch = selectedTypes.value.includes(cat);
    const dateMatch = filterDate.value
      ? date.startsWith(filterDate.value)
      : true;

    return textMatch && typeMatch && dateMatch;
  });
});

onMounted(init);
</script>

<template>
  <v-container>
    <v-card class="mb-4">
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
            <v-select
              v-model="selectedTypes"
              :items="eventTypeOptions"
              label="Filter by Type"
              multiple
              clearable
              chips
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
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-row justify="center" v-if="loading">
      <v-progress-circular indeterminate />
    </v-row>

    <!-- No matches -->
    <v-row v-else-if="!loading && filteredEvents.length === 0">
      <v-col class="text-center">No events found.</v-col>
    </v-row>

    <!-- Event cards -->
    <v-row v-else>
      <v-col
        v-for="evt in filteredEvents"
        :key="evt.event_id"
        cols="12"
        md="4"
      >
        <v-card class="mb-4">
          <v-card-title>{{ evt.name }}</v-card-title>
          <v-card-subtitle>
            {{ normalizeEventType(evt.event_type) }} – {{ evt.date }}
          </v-card-subtitle>
          <v-card-text>
            <strong>Description:</strong> {{ evt.description }}<br/>
            <strong>Location:</strong> {{ evt.location }}<br/>
            <strong>Start Time:</strong> {{ evt.start_time }}<br/>
            <strong>End Time:</strong> {{ evt.end_time }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              :loading="loading"
              @click="toggleSignup(evt.event_id)"
            >
              {{ signedUp.has(evt.event_id) ? 'Unregister' : 'Sign Up' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
