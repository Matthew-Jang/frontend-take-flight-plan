<template>
    <v-container>
      <h2>Pending Student Submissions</h2>
      <v-data-table
        :headers="adminHeaders"
        :items="pendingItems"
        class="mt-4"
      >
        <template #item.checklist="{ item }">
          {{ item.checklist.name }}
        </template>
        <template #item.student="{ item }">
          {{ item.student.user_id }}
        </template>
        <template #item.action="{ item }">
          <v-btn small color="green" @click="review(item, 1)">
            Approve
          </v-btn>
          <v-btn small color="red" @click="review(item, 0)">
            Deny
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import FlightPlanServices from '../services/studentFlightPlanServices.js'
  
  const pendingItems = ref([])
  
  const adminHeaders = [
    { text: 'Student User ID',   value: 'student' },
    { text: 'Checklist Item',    value: 'checklist' },
    { text: 'Semester',          value: 'semester_number' },
    { text: 'File Upload',       value: 'file_path' },
    { text: 'Submitted At',      value: 'updatedAt' },
    { text: 'Action',            value: 'action', sortable: false },
  ]
  
  async function fetchPending() {
    const res = await FlightPlanServices.fetchPending()
    pendingItems.value = res.data
  }
  
  async function review(item, approval) {
    await FlightPlanServices.review(item.id, approval)
    await fetchPending()
  }
  
  onMounted(fetchPending)
  </script>
  