<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="profile.avatar" alt="Profile picture" />
        </div>
        <div class="profile-info">
          <h1>{{ profile.name }}</h1>
          <p class="profile-title">{{ profile.title }}</p>
          <p class="profile-location">
            <i class="fas fa-map-marker-alt"></i> {{ profile.location }}
          </p>
        </div>
      </div>
      
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">{{ profile.followers }}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ profile.following }}</span>
          <span class="stat-label">Following</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ profile.posts }}</span>
          <span class="stat-label">Posts</span>
        </div>
      </div>
      
      <div class="profile-bio">
        <h3>About</h3>
        <p>{{ profile.bio }}</p>
      </div>
      
      <div class="profile-actions">
        <button class="btn-primary">Follow</button>
        <button class="btn-secondary">Message</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        name: 'Jane Doe',
        title: 'Software Developer',
        location: 'San Francisco, CA',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Passionate software developer with 5+ years of experience in building web applications. Lover of clean code, coffee, and hiking on weekends.',
        followers: 1245,
        following: 243,
        posts: 52
      }
    }
  }
}
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
  justify-content: space-around;
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

.profile-bio {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.profile-bio h3 {
  margin-top: 0;
  color: #2d3748;
}

.profile-bio p {
  color: #4a5568;
  line-height: 1.6;
}

.profile-actions {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
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

.btn-secondary {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #edf2f7;
}
</style>