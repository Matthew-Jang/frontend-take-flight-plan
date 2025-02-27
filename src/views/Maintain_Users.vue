<script setup>
import { ref, onMounted } from 'vue'
import userServices from '../services/userServices.js'

const dialog = ref(false)
const users = ref([])
const showModal = ref(false)

const headers = [
  { text: 'First Name', value: 'fName' },
  { text: 'Last Name', value: 'lName' },
  { text: 'Email', value: 'email' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const editUser = (item) => {
  toggleModal();
  selectedUser.value = item;
};

const editedIndex = ref(-1)
const editedItem = ref({ fName: '', lName: '', email: '' })

const fetchUsers = async () => {
  console.log("vue - fetch users")
  try {
    const response = await userServices.fetchUsers()
    users.value = response.data.map((item) => ({
      ...item,
      isEditing: false,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        Users
        <v-btn color="primary" @click="fetchUsers()">Add User</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="users" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="editUser(item)">mdi-pencil</v-icon>
            <v-icon @click="deleteUser(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Edit User!</v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent="">

          <!-- First Name -->
          <v-text-field v-model="users.fName" id="first_name" label="First Name" required @keyup.enter=""></v-text-field>
          <v-text-field v-model="users.lName" id="last_name" label="Last Name" required @keyup.enter=""></v-text-field>

          <v-card-actions>
            <v-btn v-if="isAdd" color="green" @click="addEducation">Save</v-btn>
            <v-btn v-else color="green" @click="saveEducationModal">Save</v-btn>
            <v-btn color="red" @click="toggleEducationModal">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>