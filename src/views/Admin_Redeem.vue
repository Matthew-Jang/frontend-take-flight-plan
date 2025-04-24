<script setup>
import { ref, computed, onMounted } from 'vue'
import UserServices from '../services/userServices.js'

const users           = ref([])
const search          = ref("")
const pointsToChange  = ref(0)

// load users
const fetchUsers = async () => {
  try {
    const { data } = await UserServices.fetchUsers()
    users.value = data.map(u => ({
      ...u,
      // ensure defaults
      points_awarded: u.points_awarded || 0,
      points_used:    u.points_used    || 0
    }))
  } catch (e) {
    console.error("fetchUsers:", e)
  }
}

// computed display name filter
const filteredUsers = computed(() =>
  users.value.filter(u =>
    `${u.fName} ${u.lName} ${u.email}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
)

// helper to compute balance
const totalPoints = u =>
  (u.points_awarded || 0) - (u.points_used || 0)

// calls your PATCH endpoint
const changePoints = async (userId, action) => {
  try {
    await UserServices.modifyPoints(userId, {
      amount: pointsToChange.value,
      action
    })
    await fetchUsers()           // refresh the table
    pointsToChange.value = 0     // clear the input
  } catch (err) {
    console.error("modifyPoints:", err)
    alert(err.response?.data?.message || err.message)
  }
}

onMounted(fetchUsers)
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Manage User Points</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Search Users"
          prepend-inner-icon="mdi-magnify"
        />

        <!-- NOTE: use `text` not `title` in Vuetify headers -->
        <v-data-table
          :headers="[
            { text: 'First Name', value: 'fName' },
            { text: 'Last Name',  value: 'lName' },
            { text: 'Email',      value: 'email' },
            { text: 'Balance',    value: 'points' },
            { text: 'Adjust',     value: 'actions', sortable: false }
          ]"
          :items="filteredUsers"
        >
          <!-- render the computed balance -->
          <template #item.points="{ item }">
            {{ totalPoints(item) }}
          </template>

          <!-- per-row controls -->
          <template #item.actions="{ item }">
            <v-text-field
              v-model.number="pointsToChange"
              type="number"
              label="Amt"
              hide-details
              style="max-width: 80px"
            />
            <v-btn icon color="green"  @click="changePoints(item.id, 'add')">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon color="red"  @click="changePoints(item.id, 'subtract')">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
