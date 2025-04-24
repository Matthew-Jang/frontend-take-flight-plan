<template>
    <v-container>
      <v-card>
        <v-card-title>Pending Flight Plan Submissions</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="pendingItems"
            :loading="loading"
            class="elevation-1"
          >
            <template #item.student="{ item }">
              {{ item.student?.fName }} {{ item.student?.lName }}
            </template>
            <template #item.checklist="{ item }">
              {{ item.checklist?.name }}
            </template>
            <template #item.semester_number="{ item }">
              {{ item.semester_number }}
            </template>
            <template #item.file_path="{ item }">
              <a v-if="item.file_path" :href="item.file_path" target="_blank">Download</a>
              <span v-else>&mdash;</span>
            </template>
            <template #item.actions="{ item }">
              <v-btn color="green" small @click="approve(item.id)">Approve</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import FlightPlanServices from '../services/studentFlightPlanServices.js'
  
  const pendingItems = ref([])
  const loading = ref(false)
  
  const headers = [
    { text: 'Student', value: 'student' },
    { text: 'Item', value: 'checklist' },
    { text: 'Semester', value: 'semester_number' },
    { text: 'File', value: 'file_path', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false }
  ]
  
  async function loadPending() {
    loading.value = true
    try {
      const res = await FlightPlanServices.fetchPending()
      pendingItems.value = res.data
    } catch (err) {
      console.error('Failed to load pending items', err)
    } finally {
      loading.value = false
    }
  }
  
  async function approve(id) {
    // await FlightPlanServices.review(id, 1)
    await FlightPlanServices.complete(id)
    await loadPending()
  }
  
  onMounted(loadPending)
  </script>
  
  <style scoped>
  /* Add any admin‑page specific styles here */
  </style>
  