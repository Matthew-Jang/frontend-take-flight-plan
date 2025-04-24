<template>
  <v-container>
    <!-- Main Card -->
    <BrandedCard class="mb-6">
      <v-card-title class="d-flex align-center w-100">
        <span class="text-h5">Major Management</span>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="ml-2"
          style="max-width: 300px"
        />
        <BrandedButton
          color="primary"
          class="ml-4"
          @click="openDialog()"
        >
          <v-icon left small>mdi-plus</v-icon>
          Add Major
        </BrandedButton>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="majors"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <template #item.department="{ item }">
          {{ getDepartmentName(item.departmentId) }}
        </template>
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

    <!-- Major Form Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <BrandedCard>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Major Name*"
                  required
                  :error-messages="nameError"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.department"
                  :items="departments"
                  item-title="name"
                  item-value="id"
                  label="Department*"
                  required
                  :error-messages="departmentError"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="closeDialog">
            Cancel
          </BrandedButton>
          <BrandedButton color="primary" @click="save">
            Save
          </BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <BrandedCard>
        <v-card-title class="text-h5">Delete Major</v-card-title>
        <v-card-text>
          Are you sure you want to delete the major "{{ editedItem.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="d-flex justify-end w-100">
          <BrandedButton variant="text" @click="closeDelete">
            Cancel
          </BrandedButton>
          <BrandedButton color="error" @click="deleteItemConfirm">
            Delete
          </BrandedButton>
        </v-card-actions>
      </BrandedCard>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
      <template #actions>
        <BrandedButton variant="text" @click="snackbar = false">
          Close
        </BrandedButton>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import MajorServices from '../services/MajorServices.js'
// import DepartmentService from '../services/departmentServices.js'

// Branded components
import BrandedButton from '@/components/BrandedButton.vue'
import BrandedCard   from '@/components/BrandedCard.vue'

const majors = ref([])
const departments = ref(['cs','eng','bible'])
const loading = ref(true)
const dialog = ref(false)
const deleteDialog = ref(false)
const search = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Form validation errors
const nameError = ref('')
const departmentError = ref('')

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Department', align: 'start', key: 'department' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const defaultItem = { name: '', department: '' }
const editedItem = reactive({ ...defaultItem })
const editedIndex = ref(-1)

const formTitle = computed(() => editedIndex.value === -1 ? 'New Major' : 'Edit Major')

// Fetch all majors
const fetchMajors = async () => {
  loading.value = true
  try {
    const response = await MajorServices.fetchAll()
    majors.value = response.data
  } catch (error) {
    console.error('Error fetching majors:', error)
    showSnackbar('Error loading majors', 'error')
  } finally {
    loading.value = false
  }
}

// Get department name based on department ID
const getDepartmentName = (departmentId) => {
  const dept = departments.value.find(d => d.id === departmentId)
  return dept ? dept.name : 'Unknown'
}

const openDialog = (item) => {
  if (item) {
    editedIndex.value = majors.value.findIndex(b => b.id === item.id)
    Object.assign(editedItem, majors.value[editedIndex.value])
  } else {
    editedIndex.value = -1
    Object.assign(editedItem, defaultItem)
  }
  resetValidation()
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetValidation()
  setTimeout(() => {
    Object.assign(editedItem, defaultItem)
    editedIndex.value = -1
  }, 300)
}

const validateForm = () => {
  let isValid = true
  resetValidation()
  if (!editedItem.name.trim()) {
    nameError.value = 'Major name is required'
    isValid = false
  }
  if (!editedItem.department) {
    departmentError.value = 'Department is required'
    isValid = false
  }
  return isValid
}

const resetValidation = () => {
  nameError.value = ''
  departmentError.value = ''
}

const save = async () => {
  if (!validateForm()) return
  try {
    if (editedIndex.value > -1) {
      await MajorServices.update(editedItem.id, editedItem)
      Object.assign(majors.value[editedIndex.value], editedItem)
      showSnackbar('Major updated successfully')
    } else {
      const response = await MajorServices.create(editedItem)
      majors.value.push(response.data)
      showSnackbar('Major created successfully')
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving major:', error)
    showSnackbar('Error saving major', 'error')
  }
}

const confirmDelete = (item) => {
  editedIndex.value = majors.value.findIndex(b => b.id === item.id)
  Object.assign(editedItem, majors.value[editedIndex.value])
  deleteDialog.value = true
}

const closeDelete = () => {
  deleteDialog.value = false
  setTimeout(() => {
    Object.assign(editedItem, defaultItem)
    editedIndex.value = -1
  }, 300)
}

const deleteItemConfirm = async () => {
  try {
    await MajorServices.delete(editedItem.id)
    majors.value.splice(editedIndex.value, 1)
    showSnackbar('Major deleted successfully')
  } catch (error) {
    console.error('Error deleting major:', error)
    showSnackbar('Error deleting major', 'error')
  }
  closeDelete()
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(fetchMajors)
</script>

<style lang="scss" scoped>
@use "@/styles/_variables.scss" as *;

/* No additional styles needed; spacing and colors via tokens */
</style>
