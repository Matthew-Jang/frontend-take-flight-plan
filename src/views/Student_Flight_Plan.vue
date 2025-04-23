// StudentFlightPlan.vue
<template>
  <v-container>
    <v-row class="mb-4" align="center" justify="space-between">
      <!-- Generate button -->
      <v-btn
        :disabled="!student"
        color="primary"
        @click="generatePlan"
      >
        Generate Flight Plan
      </v-btn>

      <!-- View mode toggle -->
      <v-btn-toggle v-model="viewMode" class="ml-4">
        <v-btn value="all">All</v-btn>
        <v-btn value="four">4-at-a-time</v-btn>
        <v-btn value="single">Single</v-btn>
      </v-btn-toggle>

      <!-- Semester selector in single‑mode -->
      <v-select
        v-if="viewMode === 'single'"
        v-model="selectedSemester"
        :items="semesterTitles.map((t,i) => ({ text: t, value: i }))"
        item-text="text"
        item-value="value"
        label="Semester"
        dense
        class="ml-4"
      />
    </v-row>

    <!-- ALL Semesters -->
    <div v-if="viewMode === 'all'">
      <v-row>
        <v-col
          v-for="sem in semesters"
          :key="sem.id"
          cols="12" md="6" lg="3"
        >
          <SemesterCard
            :sem="sem"
            @complete="openDialog"
          />
        </v-col>
      </v-row>
    </div>

    <!-- FOUR‑at‑a‑time -->
    <div v-if="viewMode === 'four'">
      <v-row align="center" justify="space-between" class="mb-2">
        <v-btn @click="page = Math.max(0, page-1)" :disabled="page===0">
          Prev
        </v-btn>
        <span>Page {{ page+1 }} / {{ totalPages }}</span>
        <v-btn @click="page = Math.min(totalPages-1, page+1)" :disabled="page===totalPages-1">
          Next
        </v-btn>
      </v-row>
      <v-slide-group show-arrows>
        <v-slide-item
          v-for="sem in pageSemesters"
          :key="sem.id"
        >
          <SemesterCard
            :sem="sem"
            @complete="openDialog"
            class="mx-2"
          />
        </v-slide-item>
      </v-slide-group>
    </div>

    <!-- SINGLE Semester -->
    <div v-if="viewMode === 'single'">
      <SemesterCard
        :sem="semesters[selectedSemester]"
        @complete="openDialog"
      />
    </div>

    <!-- Dialog for file submission -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Submit Your Work</v-card-title>
        <v-card-text>
          <p>
            You’re about to mark
            <strong>{{ selectedItem?.name }}</strong>
            as “Pending Approval.”<br/>
            Please upload your supporting file below:
          </p>
          <!-- <v-file-input
            v-model="uploadFile"
            label="Choose file"
            accept="*/*"
            outlined
            dense
            required
          /> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <!-- <v-btn
            :disabled="!uploadFile"
            color="primary"
            rounded
            elevation="2"
            @click="confirmComplete"
          > -->
          <v-btn
            color="primary"
            rounded
            elevation="2"
            @click="confirmComplete"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Utils from '../config/utils'
import StudentServices from '../services/studentServices.js'
import FlightPlanServices from '../services/studentFlightPlanServices.js'
import SemesterCard from '../components/SemesterCard.vue'

//testing
const fileRequired = ref(false)

// state & UI
const router = useRouter()
const user = ref(null)
const student = ref(null)
const semesters = ref([])
const flightPlanItems = ref([])
const semesterTitles = [
  'Semester 1','Semester 2','Semester 3','Semester 4',
  'Semester 5','Semester 6','Semester 7','Semester 8',
]

// view modes
const viewMode = ref('all')        // 'all' | 'four' | 'single'
const selectedSemester = ref(0)    // index 0–7
const page = ref(0)                // for 'four' mode
const itemsPerPage = 4

const totalPages = computed(() =>
  Math.ceil(semesters.value.length / itemsPerPage)
)
const pageSemesters = computed(() =>
  semesters.value.slice(
    page.value * itemsPerPage,
    page.value * itemsPerPage + itemsPerPage
  )
)

// dialog
const dialog = ref(false)
const selectedItem = ref(null)
const uploadFile = ref(null)

// fetch / generate logic
async function getUser() {
  user.value = Utils.getStore('user')
  if (!user.value?.userId) {
    await router.push({ name:'login' })
  }
}
async function getStudent() {
  try {
    const res = await StudentServices.findByUser(user.value.userId)
    student.value = res.data
  } catch {}
}
async function fetchItems() {
  if (!student.value) return
  const res = await FlightPlanServices.fetchByStudent(student.value.id)
  flightPlanItems.value = res.data

  // reset semesters
  semesters.value = semesterTitles.map((t,i) => ({
    id: i+1, title: t, flight_plan_items: []
  }))
  // distribute
  for (const fpi of flightPlanItems.value) {
    const idx = fpi.semester_number - 1
    semesters.value[idx].flight_plan_items.push(fpi)
  }
}
async function generatePlan() {
  if (!student.value) return
  await FlightPlanServices.generate(student.value.id)
  await fetchItems()
}

// dialog handlers
function openDialog(item) {
  if (item.state !== 'Not Started') return
  selectedItem.value = item
  uploadFile.value  = null
  dialog.value      = true
}
async function confirmComplete() {
  dialog.value = false
  await FlightPlanServices.complete(
    selectedItem.value.id,
    uploadFile.value
  )
  await fetchItems()
}

onMounted(async () => {
  await getUser()
  await getStudent()
  await fetchItems()
})
</script>

<style scoped>
/* add any page‑specific styles here */
</style>