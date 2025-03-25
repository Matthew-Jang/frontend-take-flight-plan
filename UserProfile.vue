<template>
  <div class="profile-card">
    <!-- Avatar Image -->
    <img :src="user.avatar" alt="User Avatar" class="avatar" />

    <!-- Upload Profile Picture -->
    <input type="file" @change="handleFileUpload" accept="image/*" />

    <!-- User Details -->
    <h1>{{ user.name }}</h1>
    <p>Worm Points: {{ user.points }}</p>
    
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
        name: "Michael",
        points: 1500,
        avatar: "",
        badges: [
          { name: "Early Bird", imageUrl: require('@/assets/images/badge0.png') },
          { name: "The Worm", imageUrl: require('@/assets/images/badge1.png') },
          { name: "OC Eagle", imageUrl: require('@/assets/images/badge2.png') }
        ]
      }
    };
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
.profile-card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

/* Badge Styling */
.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
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
  text-transform: capitalize;
  color: #fff;
}
</style>
