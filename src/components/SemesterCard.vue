<template>
  <v-card outlined class="semester-card mb-4 pa-4 d-flex flex-column align-center">
    <v-card-title class="text-center w-100">
      {{ sem.title }}
    </v-card-title>
    <v-divider class="w-100" />

    <v-card-text class="text-center w-100">
      <v-row>
        <v-col
          v-for="item in sem.flight_plan_items"
          :key="item.id"
          cols="12"
          sm="6"
          class="d-flex justify-center"
        >
          <v-card class="item-card pa-3 d-flex flex-column align-center">
            <!-- Description -->
            <div class="item-desc text-center">
              <strong>{{ item.name }}</strong><br />
              {{ item.points }} pts
            </div>

            <!-- Status on its own line -->
            <div class="item-status d-flex justify-center">
              <v-chip
                :color="chipColor(item.state)"
                small
                dark
              >
                {{ item.state }}
              </v-chip>
            </div>

            <!-- Complete button, centered -->
            <v-card-actions class="d-flex justify-center w-100">
              <BrandedButton
                v-if="item.state === 'Not Started'"
                color="primary"
                @click="$emit('complete', item)"
              >
                Complete
              </BrandedButton>
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
import BrandedButton from '@/components/BrandedButton.vue'

const props = defineProps({
  sem: { type: Object, required: true }
})

function chipColor(state) {
  switch (state) {
    case 'Not Started': return 'grey lighten-1'
    case 'Pending':     return 'oc-salmon'
    case 'Completed':   return 'oc-ethos'
    default:            return 'grey'
  }
}
</script>

<style lang="scss" scoped>
@use "@/styles/_variables.scss" as *;

.semester-card {
  min-width: 300px;
}

.item-card {
  width: 100%;
}

.item-status {
  margin-top: $gutter-sm;
}
</style>
