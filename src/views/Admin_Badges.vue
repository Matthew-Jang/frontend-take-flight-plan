<template>
    <v-container>
      <v-card class="mb-6">
        <v-card-title class="d-flex align-center">
          <span class="text-h5">Badge Management</span>
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
            Add Badge
          </v-btn>
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="badges"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.type="{ item }">
            {{ getBadgeTypeName(item.type) }}
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
  
      <!-- Badge Form Dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
  
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.type"
                    :items="badgeTypes"
                    item-title="name"
                    item-value="id"
                    label="Badge Type*"
                    required
                    :error-messages="typeError"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.title"
                    label="Title*"
                    required
                    :error-messages="titleError"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    label="Description*"
                    required
                    :error-messages="descriptionError"
                  ></v-textarea>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="editedItem.points"
                    label="Points"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="editedItem.exp"
                    label="Experience (XP)"
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
          <v-card-title class="text-h5">Delete Badge</v-card-title>
          <v-card-text>
            Are you sure you want to delete the badge "{{ editedItem.title }}"? This action cannot be undone.
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
  import BadgeService from '../services/badgeServices';
  
  export default {
    name: 'BadgeList',
    
    setup() {
      const badges = ref([]);
      const loading = ref(true);
      const dialog = ref(false);
      const deleteDialog = ref(false);
      const search = ref('');
      const snackbar = ref(false);
      const snackbarText = ref('');
      const snackbarColor = ref('success');
      
      // Form validation errors
      const typeError = ref('');
      const titleError = ref('');
      const descriptionError = ref('');
  
      const headers = [
        { title: 'ID', align: 'start', key: 'id' },
        { title: 'Type', align: 'start', key: 'type' },
        { title: 'Title', align: 'start', key: 'title' },
        { title: 'Description', align: 'start', key: 'description' },
        { title: 'Points', align: 'start', key: 'points' },
        { title: 'XP', align: 'start', key: 'exp' },
        { title: 'Actions', key: 'actions', sortable: false }
      ];
  
      const defaultItem = {
        id: null,
        type: 1,
        title: '',
        description: '',
        points: 0,
        exp: 0
      };
  
      const editedItem = reactive({ ...defaultItem });
      const editedIndex = ref(-1);
  
      const badgeTypes = [
        { id: 1, name: 'Achievement' },
        { id: 2, name: 'Participation' },
        { id: 3, name: 'Special' },
        { id: 4, name: 'Milestone' }
      ];
  
      const formTitle = computed(() => {
        return editedIndex.value === -1 ? 'New Badge' : 'Edit Badge';
      });
  
      // Fetch all badges
      const fetchBadges = async () => {
        loading.value = true;
        try {
          const response = await BadgeService.getAll();
          badges.value = response.data;
        } catch (error) {
          console.error('Error fetching badges:', error);
          showSnackbar('Error loading badges', 'error');
        } finally {
          loading.value = false;
        }
      };
  
      // Get badge type name based on type ID
      const getBadgeTypeName = (typeId) => {
        const type = badgeTypes.find(t => t.id === typeId);
        return type ? type.name : 'Unknown';
      };
  
      // Open dialog for create/edit
      const openDialog = (item) => {
        if (item) {
          editedIndex.value = badges.value.findIndex(b => b.id === item.id);
          Object.assign(editedItem, badges.value[editedIndex.value]);
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
        
        if (!editedItem.type) {
          typeError.value = 'Badge type is required';
          isValid = false;
        }
        
        if (!editedItem.title || editedItem.title.trim() === '') {
          titleError.value = 'Title is required';
          isValid = false;
        }
        
        if (!editedItem.description || editedItem.description.trim() === '') {
          descriptionError.value = 'Description is required';
          isValid = false;
        }
        
        return isValid;
      };
  
      // Reset validation errors
      const resetValidation = () => {
        typeError.value = '';
        titleError.value = '';
        descriptionError.value = '';
      };
  
      // Save badge (create or update)
      const save = async () => {
        if (!validateForm()) {
          return;
        }
        
        try {
          if (editedIndex.value > -1) {
            // Update existing badge
            await BadgeService.update(editedItem.id, editedItem);
            Object.assign(badges.value[editedIndex.value], editedItem);
            showSnackbar('Badge updated successfully');
          } else {
            // Create new badge
            const response = await BadgeService.create(editedItem);
            badges.value.push(response.data);
            showSnackbar('Badge created successfully');
          }
          closeDialog();
        } catch (error) {
          console.error('Error saving badge:', error);
          showSnackbar('Error saving badge', 'error');
        }
      };
  
      // Show delete confirmation
      const confirmDelete = (item) => {
        editedIndex.value = badges.value.findIndex(b => b.id === item.id);
        Object.assign(editedItem, badges.value[editedIndex.value]);
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
  
      // Delete badge
      const deleteItemConfirm = async () => {
        try {
          await BadgeService.delete(editedItem.id);
          badges.value.splice(editedIndex.value, 1);
          showSnackbar('Badge deleted successfully');
        } catch (error) {
          console.error('Error deleting badge:', error);
          showSnackbar('Error deleting badge', 'error');
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
        fetchBadges();
      });
  
      return {
        badges,
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
        badgeTypes,
        typeError,
        titleError,
        descriptionError,
        fetchBadges,
        getBadgeTypeName,
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