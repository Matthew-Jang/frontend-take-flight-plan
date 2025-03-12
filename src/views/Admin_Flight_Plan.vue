<template>
    <div class="admin-flight-plan">
      <v-card class="main-card">
        <div class="scrollable-section">
          <v-row no-gutters>
            <v-col
              v-for="card in cards"
              :key="card.id"
              class="scrollable-card"
            >
              <v-card class="card-container">
                <v-card-title>{{ card.title }}</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item
                      v-for="(item, index) in card.checklist"
                      :key="index"
                    >
                      <v-list-item-content>{{ item }}</v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon small @click="removeItem(card.id, index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-text-field
                    v-model="card.newItem"
                    label="New checklist item"
                    dense
                    outlined
                  ></v-text-field>
                  <v-btn small color="primary" @click="addItem(card.id)">
                    Add Item
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Additional column for a + button at the far right if desired -->
            <v-col class="add-button-container" cols="auto">
              <v-btn icon large>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  
  let nextCardId = 1;
  const cards = reactive([
    { id: nextCardId++, title: 'Card 1', checklist: ['Item 1', 'Item 2'], newItem: '' },
    { id: nextCardId++, title: 'Card 2', checklist: ['Task 1'], newItem: '' },
    { id: nextCardId++, title: 'Card 3', checklist: [], newItem: '' },
    // You can add more cards here if needed.
  ]);
  
  function addItem(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (card && card.newItem.trim() !== '') {
      card.checklist.push(card.newItem.trim());
      card.newItem = '';
    }
  }
  
  function removeItem(cardId, index) {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      card.checklist.splice(index, 1);
    }
  }
  </script>
  
  <style scoped>
  .admin-flight-plan {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .main-card {
    width: 70%;
    padding: 20px;
  }
  
  .scrollable-section {
    display: flex;
    flex-wrap: nowrap; /* ensure a single row */
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px;
  }
  
  .scrollable-card {
    position: relative;
    display: inline-block;
    width: 300px;
    margin-right: 10px;
  }
  
  /* Optional styling for the + button container */
  .add-button-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  