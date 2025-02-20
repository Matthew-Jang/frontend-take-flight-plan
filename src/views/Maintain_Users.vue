<template>
    <v-container>
      <v-card>
        <v-card-title>
          Users
          <v-btn color="primary" @click="dialog = true">Add User</v-btn>
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
  
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ editedIndex === -1 ? 'Add' : 'Edit' }} User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field v-model="editedItem.fName" label="First Name" required></v-text-field>
              <v-text-field v-model="editedItem.lName" label="Last Name" required></v-text-field>
              <v-text-field v-model="editedItem.email" label="Email" required></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveUser">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import userServices from '@/services/userServices'
  
  const dialog = ref(false)
  const users = ref([])
  
  const headers = [
    { text: 'First Name', value: 'fName' },
    { text: 'Last Name', value: 'lName' },
    { text: 'Email', value: 'email' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]
  
  const editedIndex = ref(-1)
  const editedItem = ref({ fName: '', lName: '', email: '' })
  
  const fetchUsers = async () => {
    users.value = await userServices.getUsers()
  }
  
  const editUser = (user) => {
    editedIndex.value = users.value.indexOf(user)
    editedItem.value = { ...user }
    dialog.value = true
  }
  
  const saveUser = async () => {
    if (editedIndex.value > -1) {
      await userServices.updateUser(editedItem.value.id, editedItem.value)
    } else {
      await userServices.addUser(editedItem.value)
    }
    fetchUsers()
    closeDialog()
  }
  
  const deleteUser = async (id) => {
    await userServices.deleteUser(id)
    fetchUsers()
  }
  
  const closeDialog = () => {
    dialog.value = false
    editedIndex.value = -1
    editedItem.value = { fName: '', lName: '', email: '' }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>
  