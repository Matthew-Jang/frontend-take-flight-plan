<template>
    <v-container>
      <v-card>
        <v-card-title class="headline">Your Badges</v-card-title>
        <v-card-text>
          <v-list two-line>
            <template v-if="badges.length">
              <v-list-item v-for="badge in badges" :key="badge.id">
                <v-list-item-icon>
                  <v-icon color="success" large>mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="title">{{ badge.title }}</v-list-item-title>
                  <v-list-item-subtitle class="subtitle-1 text--secondary">{{ badge.description }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-alert type="info" elevation="2">You haven't earned any badges yet.</v-alert>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Utils from '../config/utils'
  import StudentServices from '../services/studentServices.js'
  import BadgeServices from '../services/studentBadgeServices.js'
  
  const router = useRouter()
  const user = ref(null)
  const student = ref(null)
  const badges = ref([])
  const loading = ref(false)
  
  async function getUser() {
    user.value = Utils.getStore('user')
    if (!user.value?.userId) await router.push({ name: 'login' })
  }
  
  async function getStudent() {
    try {
      const res = await StudentServices.findByUser(user.value.userId)
      student.value = res.data
    } catch (err) {
      console.error('No student profile', err)
    }
  }
  
  async function fetchBadges() {
    if (!student.value) return
    loading.value = true
    try {
      const res = await BadgeServices.list(student.value.id)
      badges.value = res.data
    } catch (err) {
      console.error('Failed to fetch badges', err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    await getUser()
    await getStudent()
    await fetchBadges()
  })
  </script>
  
  <style scoped>
  .v-list-item {
    border-bottom: 1px solid #e0e0e0;
  }
  .v-list-item:last-of-type {
    border-bottom: none;
  }
  </style>
  