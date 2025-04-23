// SemesterCard.vue
<template>
  <v-card outlined class="mb-4 pa-4" style="min-width: 300px;">
    <v-card-title>{{ sem.title }}</v-card-title>
    <v-divider />

    <v-card-text>
      <v-row>
        <v-col
          v-for="item in sem.flight_plan_items"
          :key="item.id"
          cols="12"
          sm="6"
        >
          <v-card class="pa-3">
            <!-- Description -->
            <div class="item-desc">
              <strong>{{ item.name }}</strong><br />
              {{ item.points }} pts
            </div>

            <!-- Status on its own line -->
            <div class="item-status mt-2">
              <v-chip
                :color="chipColor(item.state)"
                small
                dark
              >
                {{ item.state }}
              </v-chip>
            </div>

            <!-- Complete button -->
            <v-card-actions class="justify-end">
              <v-btn
                v-if="item.state === 'Not Started'"
                color="primary"
                rounded
                elevation="2"
                @click="$emit('complete', item)"
              >
                Complete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col
          v-if="sem.flight_plan_items.length === 0"
          cols="12"
          class="text-center grey--text"
        >
          No items
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  sem: { type: Object, required: true }
})

function chipColor(state) {
  switch (state) {
    case 'Not Started': return 'grey lighten-1'
    case 'Pending':     return 'blue lighten-3'
    case 'Completed':   return 'green lighten-3'
    default:            return 'grey'
  }
}
</script>

<style scoped>
.item-desc { width: 100%; }
.item-status { }
</style>
