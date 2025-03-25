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
