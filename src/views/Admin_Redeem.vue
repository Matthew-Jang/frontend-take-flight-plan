<script setup>
import { ref, computed, onMounted } from 'vue'
import UserServices from '../services/userServices.js'

const users = ref([])
const search = ref("")
const selectedUser = ref(null)
const pointsToChange = ref(0)

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    `${user.fName} ${user.lName} ${user.email}`.toLowerCase().includes(search.value.toLowerCase())
  )
})

const fetchUsers = async () => {
  try {
    const response = await UserServices.fetchUsers()
    users.value = response.data.map(user => ({
      ...user,
      points_awarded: user.points_awarded ?? 0,
      points_used: user.points_used ?? 0
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

const totalPoints = (user) => {
  return (user.points_awarded ?? 0) - (user.points_used ?? 0)
}

const addPoints = async (userId) => {
  try {
    await UserServices.modifyPoints(userId, { amount: pointsToChange.value, action: "add" })
    fetchUsers()
    pointsToChange.value = 0
  } catch (err) {
    console.error("Failed to add points:", err)
  }
}

const subtractPoints = async (userId) => {
  try {
    await UserServices.modifyPoints(userId, { amount: pointsToChange.value, action: "subtract" })
    fetchUsers()
    pointsToChange.value = 0
  } catch (err) {
    console.error("Failed to subtract points:", err)
  }
}

onMounted(fetchUsers)
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        Manage User Points
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="search" label="Search Users" prepend-inner-icon="mdi-magnify" />

        <v-data-table
          :headers="[
            { title: 'First Name', value: 'fName' },
            { title: 'Last Name', value: 'lName' },
            { title: 'Email', value: 'email' },
            { title: 'Total Points', value: 'points' },
            { title: 'Change Points', value: 'actions', sortable: false }
          ]"
          :items="filteredUsers"
          item-value="id"
        >
          <template v-slot:item.points="{ item }">
            {{ totalPoints(item) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-text-field
              v-model.number="pointsToChange"
              label="Amount"
              hide-details
              style="max-width: 100px;"
              type="number"
            />
            <v-btn color="green" icon @click="addPoints(item.id)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn color="red" icon @click="subtractPoints(item.id)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
