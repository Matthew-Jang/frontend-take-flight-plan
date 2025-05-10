<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header with avatar & basic info -->
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="user.profilePicture || placeholderImg" alt="Profile picture" />
        </div>
        <div class="profile-info">
          <h1>{{ fullName }}</h1>
          <p class="profile-title">{{ roleText }}</p>
          <p class="profile-location">
            <i class="fas fa-envelope"></i> {{ user.email }}
          </p>
        </div>
      </div>
      
      <!-- Points stat -->
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">{{ currentPoints }}</span>
          <span class="stat-label">Points</span>
        </div>
      </div>
      
      <!-- Details placeholder -->
      <div class="profile-details">
        <h3>Details</h3>
        <p><strong>Major:</strong> .</p>
        <p><strong>Clifton Strength:</strong> .</p>
      </div>
      
      <!-- Badges coming soon -->
      <div class="profile-bio">
        <h3>Badges</h3>
      </div>
      
      <!-- Action button -->
      <div class="profile-actions">
        <button class="btn-primary" @click="goToFlightPlan">
          My Flight Plan
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserServices from "../services/userServices";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: {
        fName: "",
        lName: "",
        email: "",
        role: 0,
        points_awarded: 0,
        points_used: 0,
        profilePicture: null,
      },
      placeholderImg: "https://via.placeholder.com/150",
    };
  },
  computed: {
    fullName() {
      return `${this.user.fName} ${this.user.lName}`;
    },
    roleText() {
      switch (this.user.role) {
        case 0: return "Student";
        case 1: return "Admin";
        case 2: return "Staff";
        default: return "Unknown";
      }
    },
    currentPoints() {
      return (this.user.points_awarded || 0) - (this.user.points_used || 0);
    },
  },
  methods: {
    async loadUser() {
      try {
        const { data } = await UserServices.getCurrentUser();
        this.user = data;
      } catch (err) {
        console.error("Unable to load profile:", err);
        this.$router.push({ name: "login" });
      }
    },
    goToFlightPlan() {
      this.$router.push({ name: "student_flight_plan" });
    },
  },
  mounted() {
    this.loadUser();
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
}

.profile-header {
  display: flex;
  padding: 2rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #eaeaea;
}

.profile-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-left: 1.5rem;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #2d3748;
}

.profile-title {
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0.3rem 0;
}

.profile-location {
  color: #718096;
  font-size: 0.9rem;
  margin: 0.3rem 0;
}

.profile-stats {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eaeaea;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2d3748;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.3rem;
}

/* New Details section */
.profile-details {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.profile-details h3 {
  margin-top: 0;
  color: #2d3748;
}

.profile-details p {
  color: #4a5568;
  margin: 0.5rem 0;
}

.profile-bio {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.profile-bio h3 {
  margin-top: 0;
  color: #2d3748;
}

.profile-actions {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
}

button {
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
}

.btn-primary:hover {
  background-color: #2c5282;
}
</style>
