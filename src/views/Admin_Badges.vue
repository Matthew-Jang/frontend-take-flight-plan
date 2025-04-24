<template>
  <v-container>
    <!-- Badge Management Table -->
    <BrandedCard class="mb-6">
      <v-data-table
        :headers="headers"
        :items="badges"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <!-- Top slot: Title, Search, Add -->
        <template #top>
          <div class="d-flex justify-space-between align-center w-100 pa-4">
            <span class="text-h6">Badge Management</span>
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
            <BrandedButton color="primary" @click="openDialog()">
              <v-icon left small>mdi-plus</v-icon>
              Add Badge
            </BrandedButton>
          </div>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <v-btn icon @click="openDialog(item)">
            <v-icon color="oc-storm">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="confirmDelete(item)">
            <v-icon color="oc-salmon">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </BrandedCard>

    <!-- Badge Form Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <BrandedCard>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="badgeForm">
            <v-text-field
              v-model="editedItem.title"
              label="Title*"
              required
              :error-messages="titleError"
            />
            <v-textarea
              v-model="editedItem.description"
              label="Description*"
              required
              :error-messages="descriptionError"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.points"
                  label="Points"
                  type="number"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.exp"
                  label="Experience (XP)"
                  type="number"
                />
              </v-col>
            </v-row>
          </v-form>
          <small class="text-red">* indicates required field</small>
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="closeDialog">Cancel</BrandedButton>
          <BrandedButton color="primary" @click="save">Save</BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <BrandedCard>
        <v-card-title class="text-h5">Delete Badge</v-card-title>
        <v-card-text>
          Are you sure you want to delete the badge "{{ editedItem.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="closeDelete">Cancel</BrandedButton>
          <BrandedButton color="oc-salmon" @click="deleteItemConfirm">Delete</BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
      <template #actions>
        <BrandedButton variant="text" @click="snackbar = false">Close</BrandedButton>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import BadgeService from '@/services/badgeServices.js'

// Branded components
import BrandedButton from '@/components/BrandedButton.vue'
import BrandedCard   from '@/components/BrandedCard.vue'

// State
const badges = ref([])
const loading = ref(true)
const dialog = ref(false)
const deleteDialog = ref(false)
const search = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Validation errors
const titleError = ref('')
const descriptionError = ref('')

// Table headers
const headers = [
  { title: 'Title',       value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Points',      value: 'points' },
  { title: 'XP',          value: 'exp' },
  { title: 'Actions',     value: 'actions', sortable: false }
]

// Badge form data
const defaultItem = { title: '', description: '', points: 0, exp: 0 }
const editedItem = reactive({ ...defaultItem })
const editedIndex = ref(-1)

// Dialog title
const formTitle = computed(() => editedIndex.value === -1 ? 'New Badge' : 'Edit Badge')

// Fetch badges
async function fetchBadges() {
  loading.value = true
  try {
    const res = await BadgeService.fetchAll()
    badges.value = res.data
  } catch (err) {
    console.error('Error fetching badges:', err)
    showSnackbar('Error loading badges', 'error')
  } finally {
    loading.value = false
  }
}

// Open form dialog
function openDialog(item) {
  if (item) {
    editedIndex.value = badges.value.findIndex(b => b.id === item.id)
    Object.assign(editedItem, badges.value[editedIndex.value])
  } else {
    editedIndex.value = -1
    Object.assign(editedItem, defaultItem)
  }
  resetValidation()
  dialog.value = true
}

// Close form dialog
function closeDialog() {
  dialog.value = false
  resetValidation()
  setTimeout(() => {
    Object.assign(editedItem, defaultItem)
    editedIndex.value = -1
  }, 300)
}

// Validate form
function validateForm() {
  let valid = true
  resetValidation()
  if (!editedItem.title.trim()) {
    titleError.value = 'Title is required'
    valid = false
  }
  if (!editedItem.description.trim()) {
    descriptionError.value = 'Description is required'
    valid = false
  }
  return valid
}

// Reset errors
function resetValidation() {
  titleError.value = ''
  descriptionError.value = ''
}

// Save (create/update)
async function save() {
  if (!validateForm()) return
  try {
    if (editedIndex.value > -1) {
      await BadgeService.update(editedItem.id, editedItem)
      Object.assign(badges.value[editedIndex.value], editedItem)
      showSnackbar('Badge updated successfully')
    } else {
      const res = await BadgeService.create(editedItem)
      badges.value.push(res.data)
      showSnackbar('Badge created successfully')
    }
    closeDialog()
  } catch (err) {
    console.error('Error saving badge:', err)
    showSnackbar('Error saving badge', 'error')
  }
}

// Confirm delete
function confirmDelete(item) {
  editedIndex.value = badges.value.findIndex(b => b.id === item.id)
  Object.assign(editedItem, badges.value[editedIndex.value])
  deleteDialog.value = true
}

// Close delete dialog
function closeDelete() {
  deleteDialog.value = false
  setTimeout(() => {
    Object.assign(editedItem, defaultItem)
    editedIndex.value = -1
  }, 300)
}

// Delete badge
async function deleteItemConfirm() {
  try {
    await BadgeService.delete(editedItem.id)
    badges.value.splice(editedIndex.value, 1)
    showSnackbar('Badge deleted successfully')
  } catch (err) {
    console.error('Error deleting badge:', err)
    showSnackbar('Error deleting badge', 'error')
  }
  closeDelete()
}

// Snackbar helper
function showSnackbar(text, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(fetchBadges)
</script>

<style lang="scss" scoped>
@use "@/styles/_variables.scss" as *;
/* No additional styles; spacing & colors via tokens */
</style>
