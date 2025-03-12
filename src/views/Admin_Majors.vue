<template>
  <v-container>
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <span class="text-h5">Major Management</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="ml-2"
          style="max-width: 300px"
        ></v-text-field>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="ml-4"
          @click="openDialog()"
        >
          Add Major
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="majors"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.department="{ item }">
          {{ getDepartmentName(item.departmentId) }}
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            class="mr-2"
            @click="openDialog(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            color="error"
            @click="confirmDelete(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Major Form Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
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
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.code"
                  label="Major Code*"
                  required
                  :error-messages="codeError"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.departmentId"
                  :items="departments"
                  item-title="name"
                  item-value="id"
                  label="Department*"
                  required
                  :error-messages="departmentError"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Description"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="editedItem.isActive"
                  label="Active"
                  color="success"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="editedItem.requiredCredits"
                  label="Required Credits"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small class="text-red">* indicates required field</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Delete Major</v-card-title>
        <v-card-text>
          Are you sure you want to delete the major "{{ editedItem.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteItemConfirm">Delete</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import MajorService from '../services/majorServices.js';
import DepartmentService from '../services/departmentServices.js';

export default {
  name: 'MajorList',
  
  setup() {
    const majors = ref([]);
    const departments = ref([]);
    const loading = ref(true);
    const dialog = ref(false);
    const deleteDialog = ref(false);
    const search = ref('');
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    
    // Form validation errors
    const nameError = ref('');
    const codeError = ref('');
    const departmentError = ref('');

    const headers = [
      { title: 'ID', align: 'start', key: 'id' },
      { title: 'Name', align: 'start', key: 'name' },
      { title: 'Code', align: 'start', key: 'code' },
      { title: 'Department', align: 'start', key: 'department' },
      { title: 'Required Credits', align: 'start', key: 'requiredCredits' },
      { title: 'Status', align: 'start', key: 'isActive', 
        renderCell: value => value ? 'Active' : 'Inactive' },
      { title: 'Actions', key: 'actions', sortable: false }
    ];

    const defaultItem = {
      id: null,
      name: '',
      code: '',
      departmentId: null,
      description: '',
      requiredCredits: 120,
      isActive: true
    };

    const editedItem = reactive({ ...defaultItem });
    const editedIndex = ref(-1);

    const formTitle = computed(() => {
      return editedIndex.value === -1 ? 'New Major' : 'Edit Major';
    });

    // Fetch all majors
    const fetchMajors = async () => {
      loading.value = true;
      try {
        const response = await MajorService.getAll();
        majors.value = response.data;
      } catch (error) {
        console.error('Error fetching majors:', error);
        showSnackbar('Error loading majors', 'error');
      } finally {
        loading.value = false;
      }
    };

    // Fetch all departments for dropdown
    const fetchDepartments = async () => {
      try {
        const response = await DepartmentService.getAll();
        departments.value = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
        showSnackbar('Error loading departments', 'error');
      }
    };

    // Get department name based on department ID
    const getDepartmentName = (departmentId) => {
      const dept = departments.value.find(d => d.id === departmentId);
      return dept ? dept.name : 'Unknown';
    };

    // Open dialog for create/edit
    const openDialog = (item) => {
      if (item) {
        editedIndex.value = majors.value.findIndex(b => b.id === item.id);
        Object.assign(editedItem, majors.value[editedIndex.value]);
      } else {
        editedIndex.value = -1;
        Object.assign(editedItem, defaultItem);
      }
      resetValidation();
      dialog.value = true;
    };

    // Close dialog
    const closeDialog = () => {
      dialog.value = false;
      resetValidation();
      setTimeout(() => {
        Object.assign(editedItem, defaultItem);
        editedIndex.value = -1;
      }, 300);
    };

    // Validate form
    const validateForm = () => {
      let isValid = true;
      
      // Reset errors
      resetValidation();
      
      if (!editedItem.name || editedItem.name.trim() === '') {
        nameError.value = 'Major name is required';
        isValid = false;
      }
      
      if (!editedItem.code || editedItem.code.trim() === '') {
        codeError.value = 'Major code is required';
        isValid = false;
      }
      
      if (!editedItem.departmentId) {
        departmentError.value = 'Department is required';
        isValid = false;
      }
      
      return isValid;
    };

    // Reset validation errors
    const resetValidation = () => {
      nameError.value = '';
      codeError.value = '';
      departmentError.value = '';
    };

    // Save major (create or update)
    const save = async () => {
      if (!validateForm()) {
        return;
      }
      
      try {
        if (editedIndex.value > -1) {
          // Update existing major
          await MajorService.update(editedItem.id, editedItem);
          Object.assign(majors.value[editedIndex.value], editedItem);
          showSnackbar('Major updated successfully');
        } else {
          // Create new major
          const response = await MajorService.create(editedItem);
          majors.value.push(response.data);
          showSnackbar('Major created successfully');
        }
        closeDialog();
      } catch (error) {
        console.error('Error saving major:', error);
        showSnackbar('Error saving major', 'error');
      }
    };

    // Show delete confirmation
    const confirmDelete = (item) => {
      editedIndex.value = majors.value.findIndex(b => b.id === item.id);
      Object.assign(editedItem, majors.value[editedIndex.value]);
      deleteDialog.value = true;
    };

    // Close delete dialog
    const closeDelete = () => {
      deleteDialog.value = false;
      setTimeout(() => {
        Object.assign(editedItem, defaultItem);
        editedIndex.value = -1;
      }, 300);
    };

    // Delete major
    const deleteItemConfirm = async () => {
      try {
        await MajorService.delete(editedItem.id);
        majors.value.splice(editedIndex.value, 1);
        showSnackbar('Major deleted successfully');
      } catch (error) {
        console.error('Error deleting major:', error);
        showSnackbar('Error deleting major', 'error');
      }
      closeDelete();
    };

    // Show snackbar notification
    const showSnackbar = (text, color = 'success') => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    onMounted(() => {
      fetchDepartments();
      fetchMajors();
    });

    return {
      majors,
      departments,
      loading,
      dialog,
      deleteDialog,
      search,
      snackbar,
      snackbarText,
      snackbarColor,
      headers,
      editedItem,
      editedIndex,
      defaultItem,
      formTitle,
      nameError,
      codeError,
      departmentError,
      fetchMajors,
      fetchDepartments,
      getDepartmentName,
      openDialog,
      closeDialog,
      save,
      confirmDelete,
      closeDelete,
      deleteItemConfirm,
      showSnackbar
    };
  }
};
</script>
