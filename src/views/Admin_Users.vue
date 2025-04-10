<script setup>
import { ref, onMounted } from 'vue'
import Utils from "../config/utils.js";
import UserServices from '../services/userServices.js'
import StudentServices from '../services/studentServices.js'

const user = ref(null);
const student = ref(null);

const users = ref([])
const students = ref([])
const student_headers = [
  { title: 'id', value: 'id' },
  { title: 'user_id', value: 'user_id' },
]
const showModal = ref(false)
const selectedUser = ref({})
const headers = [
  { title: 'First Name', value: 'fName' },
  { title: 'Last Name', value: 'lName' },
  { title: 'Email', value: 'email' },
  { title: 'Actions', value: 'actions', sortable: false },
]

const toggleModal = () => {
  showModal.value = !showModal.value;
};
const editUser = (item) => {
  selectedUser.value = item;
  toggleModal();
  console.log("Selected User " + selectedUser.value.fName)
};
const editedIndex = ref(-1)
const editedItem = ref({ fName: '', lName: '', email: '' })
const fetchUsers = async () => {
  console.log("vue - fetch users")
  try {
    const response = await UserServices.fetchUsers()
    users.value = response.data.map((item) => ({
      ...item,
      isEditing: false,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
const fetchStudents = async () => {
  console.log("vue - fetch users")
  try {
    const response = await StudentServices.fetchAll()
    students.value = response.data.map((item) => ({
      ...item,
      isEditing: false,
    }));
  } catch (error) {
    console.error("Error fetching student:", error);
  }
};
const saveUser = () => {
  console.log("vue - updating user with: " + selectedUser.value.id);
  const data = {
    fName: selectedUser.value.fName,
    lName: selectedUser.value.lName,
    email: selectedUser.value.email
  };
  UserServices.updateUser(selectedUser.value.id, data)
    .then((response) => {
      console.log("vue - updated user with: " + data)
      fetchUsers();
    })
    .catch((error) => {
      console.error("Vue - error updating user ", error);
    });
  toggleModal();
};
const deleteUser = (userId) => {
  console.log("vue - deleting user with id: " +  userId)
  UserServices.deleteUser(userId)
    .then((response) => {
      console.log("vue - deleted user: " + response.data)
      fetchUsers();
    })
    .catch((error) => {
      console.error("Vue - error updating user ", error);
    });
};
onMounted(() => {
  fetchUsers()
  fetchStudents()
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        Users
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="users" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="studentView()">mdi-eye</v-icon>
            <v-icon @click="editUser(item)">mdi-pencil</v-icon>
            <v-icon @click="deleteUser(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Edit User!</v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent="">

          <v-text-field v-model="selectedUser.fName" id="first_name" label="First Name" required></v-text-field>
          <v-text-field v-model="selectedUser.lName" id="last_name" label="Last Name" required></v-text-field>
          <v-text-field v-model="selectedUser.email" id="email" label="Email" required></v-text-field>

          <v-card-actions>
            <v-btn color="green" @click="saveUser()">Save</v-btn>
            <v-btn color="red" @click="toggleModal">Cancel</v-btn>
          </v-card-actions> </v-form>
      </v-card>
    </v-dialog>
    <!-- End Modal -->

    <!-- student stuff -->
    <!-- <v-card>
      <v-card-title>
        Students
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="student_headers" :items="students" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="editUser(item)">mdi-pencil</v-icon>
            <v-icon @click="deleteUser(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card> -->

    <!-- Modal -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Edit User!</v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent="">

          <v-text-field v-model="selectedUser.fName" id="first_name" label="First Name" required></v-text-field>
          <v-text-field v-model="selectedUser.lName" id="last_name" label="Last Name" required></v-text-field>
          <v-text-field v-model="selectedUser.email" id="email" label="Email" required></v-text-field>

          <v-card-actions>
            <v-btn color="green" @click="saveUser()">Save</v-btn>
            <v-btn color="red" @click="toggleModal">Cancel</v-btn>
          </v-card-actions> </v-form>
      </v-card>
    </v-dialog>
    <!-- End Modal -->
  </v-container>
</template>
