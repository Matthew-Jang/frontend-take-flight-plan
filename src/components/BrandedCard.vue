<template>
    <v-card class="branded-card">
      <slot/>
    </v-card>
  </template>
  
  <script setup>
  // no props needed for basic card
  </script>
  
  <style lang="scss" scoped>
  @use "@/styles/_variables.scss" as *;
  
  .branded-card {
    border-radius: $radius-base;
    box-shadow: $shadow-base;
    transition: box-shadow 0.2s ease;
    &:hover {
      box-shadow: $shadow-hover;
    }
  }
  </style>
  