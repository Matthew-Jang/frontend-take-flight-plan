<script setup>
import { ref, onMounted } from 'vue'
import ChecklistItemServices from '../services/checklistItemServices.js'

const isAdd = ref(false)
const checklistItems = ref([])
const showItemModal = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref({})
const newItem = ref({
  item_type: "task",
  name: "name",
  description: "desc",
  points: "10",
  semesters_til_graduation: "1",
})

// Define table headers for checklist items
const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Item Type', value: 'item_type' },
  { title: 'Description', value: 'description' },
  { title: 'Points', value: 'points' },
  { title: 'Actions', value: 'actions', sortable: false },
]

// Toggle modal display
const toggleModal = () => {
  showItemModal.value = !showItemModal.value;
};

// Open modal for editing a checklist item
const editItem = (item) => {
  selectedItem.value = { ...item } // shallow copy to avoid direct mutation
  toggleModal();
  console.log("Selected Item: " + selectedItem.value.name)
};

const add = () => {
  isAdd.value = true;
  toggleModal();
  selectedItem.value = newItem.value;
}

const addItem = () => {
  console.log("Vue - creating checklist item with id: " + selectedItem.value.id);

  const data = {
    name: selectedItem.value.name,
    item_type: selectedItem.value.item_type,
    description: selectedItem.value.description,
    points: selectedItem.value.points,
    semester_number: selectedItem.value.semester_number,
  };

  ChecklistItemServices.create(data)
    .then((response) => {
      console.log("Vue - created checklist item", data)
      fetchChecklistItems();
    })
    .catch((error) => {
      console.error("Vue - error creating checklist item", error);
    });
  toggleModal();
}

const fetchChecklistItems = async () => {
  console.log("Vue - fetching checklist items")
  try {
    const response = await ChecklistItemServices.fetchAll()
    // Map each item to include an isEditing flag if needed
    checklistItems.value = response.data.map((item) => ({
      ...item,
      isEditing: false,
    }));
  } catch (error) {
    console.error("Error fetching checklist items:", error);
  }
};

const saveItem = () => {
  console.log("Vue - updating checklist item with id: " + selectedItem.value.id);

  // Construct data based on the model
  const data = {
    name: selectedItem.value.name,
    item_type: selectedItem.value.item_type,
    description: selectedItem.value.description,
    points: selectedItem.value.points,
    semester_number: selectedItem.value.semester_number,
  };

  ChecklistItemServices.update(selectedItem.value.id, data)
    .then((response) => {
      console.log("Vue - updated checklist item", data)
      fetchChecklistItems();
    })
    .catch((error) => {
      console.error("Vue - error updating checklist item", error);
    });
  toggleModal();
};

const deleteItem = (itemId) => {
  console.log("Vue - deleting checklist item with id: " + itemId)

  ChecklistItemServices.delete(itemId)
    .then((response) => {
      console.log("Vue - deleted checklist item", response.data)
      fetchChecklistItems();
    })
    .catch((error) => {
      console.error("Vue - error deleting checklist item", error);
    });
};

onMounted(() => {
  fetchChecklistItems()
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        Checklist Items
      </v-card-title>
      <v-card-text>

        <v-btn color="green" class="mr-4" @click="add"> Add </v-btn>

        <v-data-table :headers="headers" :items="checklistItems" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon @click="deleteItem(item.id)" color="red">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal for editing checklist item -->
    <v-dialog v-model="showItemModal" max-width="400">
      <v-card>
        <v-card-title v-if="isAdd" class="headline">Add Checklist Item</v-card-title>
        <v-card-title v-else class="headline">Edit Checklist Item</v-card-title>
        <v-form ref="form" @submit.prevent="">

          <!-- Name -->
          <v-text-field v-model="selectedItem.name" label="Name" required></v-text-field>

          <!-- Type -->
          <v-select v-model="selectedItem.item_type" :items="['task', 'experience']" label="Item Type" required></v-select>
          
          <v-textarea v-model="selectedItem.description" label="Description" required></v-textarea>

          <v-text-field v-model="selectedItem.points" label="Points" type="number" required></v-text-field>

          <v-text-field v-model="selectedItem.semester_number" label="Semester Number" type="number"
            required></v-text-field>

          <v-card-actions>
            <v-btn v-if="isAdd" color="green" @click="addItem()">Save</v-btn>
            <v-btn v-else color="green" @click="saveItem()">Save</v-btn>
            <v-btn color="red" @click="toggleModal()">Cancel</v-btn>
          </v-card-actions>

        </v-form>
      </v-card>
    </v-dialog>
    <!-- End Modal -->

    <!-- Modal for Delete Button -->
    <v-dialog v-model="showDeleteModal" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this experience?
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="showModal = false">Cancel</v-btn>
          <v-btn color="red" @click="confirmDeleteExperience()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Modal -->

  </v-container>
</template>
