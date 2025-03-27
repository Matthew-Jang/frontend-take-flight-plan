<template>
  <div class="profile-card">
    <!-- Avatar Image -->
    <img :src="user.avatar" alt="User Avatar" class="avatar" />

    <!-- Upload Profile Picture -->
    <input type="file" @change="handleFileUpload" accept="image/*" />

    <!-- Editable Username -->
    <input v-model="user.name" @input="saveUsername" class="username-input" />
   
    <!-- User Details -->
    <p>Worms: {{ user.points }}</p>

    <!-- Display Badges as Images with Text Underneath -->
    <div class="badges">
      <div v-for="badge in user.badges" :key="badge.name" class="badge">
        <img :src="badge.imageUrl" alt="badge image" class="badge-img" />
        <p>{{ badge.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: localStorage.getItem("username") || "Michael", // Load saved name
        points: 1500,
        avatar: "",
        badges: [
          { name: "Early Bird", imageUrl: require('@/assets/images/badges/0.png') },
          { name: "The Worm", imageUrl: require('@/assets/images/badges/1.png') },
          { name: "10", imageUrl: require('@/assets/images/badges/0.png') },
          
          { name: "iEagle", imageUrl: require('@/assets/images/badges/ieagle.png') },
          { name: "Preened", imageUrl: require('@/assets/images/badges/0.png') },
          { name: " Bird", imageUrl: require('@/assets/images/badges/0.png') },

          { name: "Eager Eagle", imageUrl: require('@/assets/images/badges/eagereagle.png') },
          { name: "Skill with the Quill", imageUrl: require('@/assets/images/badges/0.png') },
          { name: "7", imageUrl: require('@/assets/images/badges/0.png') },

          { name: "Either Eagle", imageUrl: require('@/assets/images/badges/eithereagle.png') },
          { name: "Fluffy Down", imageUrl: require('@/assets/images/badges/0.png') },
          { name: "Eagle Plume", imageUrl: require('@/assets/images/badges/0.png') },

          { name: "Eagle Eye", imageUrl: require('@/assets/images/badges/eagleeye.png') },
          { name: "Talons Up", imageUrl: require('@/assets/images/badges/talonsup.png') },
          { name: "Soar On", imageUrl: require('@/assets/images/badges/soaron.png') }
        ]
      }
    };
  },
  mounted() {
    // Load saved badges from localStorage if they exist
    const savedBadges = JSON.parse(localStorage.getItem('badges'));
    if (savedBadges) {
      this.user.badges = savedBadges;
    }
  },
  watch: {
    'user.badges': {
      handler(newBadges) {
        // Save the updated badges array to localStorage
        localStorage.setItem('badges', JSON.stringify(newBadges));
      },
      deep: true // Ensure deep watch to track changes inside the array
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.user.avatar = URL.createObjectURL(file);
      }
    }
  }
};
</script>

<style scoped>
/* Profile Card Styling */
.profile-card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 300px;
  height: 600px; /* Fixed height to simulate a phone app screen */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow-y: auto; /* Enables vertical scrolling */
}
.username-input {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  font-size: 18px;
}
.username-input:focus {
  outline: none;
  background-color: #444;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

input[type="file"] {
  margin-bottom: 20px;
  padding: 5px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
}

input[type="file"]:hover {
  background-color: #555;
}

/* Badge Styling - Using Grid for 3 Badges per Row */
.badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 20px; /* Space between badges */
  margin-top: 20px;
  overflow-y: auto; /* Enables vertical scrolling */
  max-height: 200px; /* Set a max height to make it scrollable */
}

.badge {
  text-align: center;
}

.badge-img {
  width: 50px; /* Image size */
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.badge p {
  margin: 0;
  font-size: 14px;
  
  color: #fff;
}
</style>
