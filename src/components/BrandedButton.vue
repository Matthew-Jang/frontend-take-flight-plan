<template>
    <v-btn
      :color="color"
      :variant="variant"
      class="branded-btn"
      @click="$emit('click', $event)"
    >
      <slot/>
    </v-btn>
  </template>
  
  <script setup>
  const props = defineProps({
    color:   { type: String, default: 'primary' },
    variant: { type: String, default: 'elevated' }
  })
  </script>
  
  <style lang="scss" scoped>
  @use "@/styles/_variables.scss" as *;
  
  .branded-btn {
    transition: box-shadow 0.2s ease, transform 0.1s ease;
    &:hover {
      box-shadow: $shadow-hover;
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }
  }
  </style>
  