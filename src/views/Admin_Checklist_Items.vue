<template>
  <v-container>
    <!-- Checklist Items Table -->
    <BrandedCard class="mb-6">
      <v-data-table
        :headers="headers"
        :items="checklistItems"
        :search="search"
        class="elevation-1"
      >
        <!-- Top slot: Title + Search + Add Button -->
        <template #top>
          <div class="d-flex justify-space-between align-center w-100 pa-4">
            <span class="text-h6">Checklist Items</span>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              density="compact"
              class="mx-4"
              style="max-width: 300px"
            />
            <BrandedButton color="primary" @click="openItemModal(true)">
              <v-icon left small>mdi-plus</v-icon>
              Add Item
            </BrandedButton>
          </div>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <v-btn icon @click.prevent.stop="openItemModal(false, item)">
            <v-icon color="oc-storm">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click.prevent.stop="confirmDelete(item)">
            <v-icon color="oc-salmon">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </BrandedCard>

    <!-- Add/Edit Item Dialog -->
    <v-dialog v-model="showItemModal" max-width="500px">
      <BrandedCard>
        <v-card-title class="text-h5">
          {{ isAdd ? 'Add Checklist Item' : 'Edit Checklist Item' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent>
            <v-text-field
              v-model="selectedItem.name"
              label="Name*"
              required
              dense
            />
            <v-select
              v-model="selectedItem.item_type"
              :items="['task', 'experience']"
              label="Item Type*"
              required
              dense
            />
            <v-textarea
              v-model="selectedItem.description"
              label="Description*"
              required
              dense
            />
            <v-text-field
              v-model.number="selectedItem.points"
              label="Points*"
              type="number"
              required
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="closeItemModal">Cancel</BrandedButton>
          <BrandedButton color="primary" @click="saveItem">
            {{ isAdd ? 'Create' : 'Save' }}
          </BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteModal" max-width="400px">
      <BrandedCard>
        <v-card-title class="text-h5">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedItem.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="showDeleteModal = false">Cancel</BrandedButton>
          <BrandedButton color="oc-salmon" @click="deleteItemConfirm">Delete</BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChecklistItemServices from '@/services/checklistItemServices.js'

// Branded components
import BrandedButton from '@/components/BrandedButton.vue'
import BrandedCard   from '@/components/BrandedCard.vue'

// State
const search = ref('')
const isAdd = ref(false)
const checklistItems = ref([])
const showItemModal = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref({})

// Default new item template
const newItem = {
  item_type: 'task',
  name: '',
  description: '',
  points: 0,
}

// Table headers using title/value
const headers = [
  { title: 'Name',             value: 'name' },
  { title: 'Item Type',        value: 'item_type' },
  { title: 'Description',      value: 'description' },
  { title: 'Points',           value: 'points' },
  { title: 'Actions',          value: 'actions', sortable: false },
]

// Open add/edit modal
function openItemModal(addMode, item = null) {
  isAdd.value = addMode
  selectedItem.value = addMode ? { ...newItem } : { ...item }
  showItemModal.value = true
}

// Close add/edit modal
function closeItemModal() {
  showItemModal.value = false
}

// Save (create or update)
async function saveItem() {
  try {
    if (isAdd.value) {
      await ChecklistItemServices.create(selectedItem.value)
    } else {
      await ChecklistItemServices.update(selectedItem.value.id, selectedItem.value)
    }
    fetchChecklistItems()
  } catch (err) {
    console.error(err)
  }
  closeItemModal()
}

// Delete
function confirmDelete(item) {
  selectedItem.value = { ...item }
  showDeleteModal.value = true
}

async function deleteItemConfirm() {
  try {
    await ChecklistItemServices.delete(selectedItem.value.id)
    fetchChecklistItems()
  } catch (err) {
    console.error(err)
  }
  showDeleteModal.value = false
}

// Fetch all checklist items
async function fetchChecklistItems() {
  try {
    const res = await ChecklistItemServices.fetchAll()
    checklistItems.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchChecklistItems)
</script>

<style scoped lang="scss">
@use '@/styles/_variables.scss' as *;
/* All spacing & colors via tokens */
</style>
