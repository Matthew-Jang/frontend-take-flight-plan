<template>
    <v-container>
      <v-card class="mx-auto" max-width="800">
        <v-card-title>My Flight Plan</v-card-title>
        <v-card-text>
          <v-row justify="center" class="mb-4">
            <v-btn
              v-if="!loaded && !loading"
              color="primary"
              @click="onLoad"
            >
              Load Flight Plan
            </v-btn>
            <v-progress-circular
              v-else-if="loading"
              indeterminate
              color="primary"
            />
          </v-row>
  
          <v-alert
            v-if="error"
            type="error"
            dense
            text
            class="mb-4"
          >
            {{ error }}
          </v-alert>
  
          <v-list two-line v-if="loaded">
            <v-list-item
              v-for="item in items"
              :key="item.id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
  
          <div v-if="loaded && items.length === 0" class="text-center grey--text">
            No flight‑plan items found.
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import studentFlightPlanServices from "../services/studentFlightPlanServices.js";
  
  export default {
    name: "StudentFlightPlan",
    data: () => ({
      items: [],
      loading: false,
      error: null,
      loaded: false,
    }),
    methods: {
      async fetch() {
        this.loading = true;
        this.error = null;
        try {
          const res = await studentFlightPlanServices.fetchMyFlightPlan();
          this.items  = res.data;
          this.loaded = true;
        } catch (e) {
          this.error = e.response?.data?.message || e.message;
        } finally {
          this.loading = false;
        }
      },
      async onLoad() {
        this.loading = true;
        this.error   = null;
        try {
          await studentFlightPlanServices.loadFlightPlan();
          await this.fetch();
        } catch (e) {
          this.error = e.response?.data?.message || e.message;
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.fetch();
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin-top: 2rem;
  }
  </style>
  