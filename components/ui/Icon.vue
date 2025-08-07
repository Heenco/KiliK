<template>
  <span v-if="props.name === 'google'">
    <!-- Google SVG Icon -->
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" :class="customClass">
      <g>
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.97 32.252 29.418 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.507 0 4.81.857 6.646 2.278l6.364-6.364C33.527 6.163 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.818-8.955 19.818-20 0-1.341-.138-2.651-.407-3.917z"/>
        <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.104 19.002 13 24 13c2.507 0 4.81.857 6.646 2.278l6.364-6.364C33.527 6.163 28.973 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z"/>
        <path fill="#FBBC05" d="M24 44c5.318 0 10.13-1.824 13.857-4.963l-6.415-5.263C29.418 35 24 35 24 35c-5.418 0-9.97-2.748-11.303-6.917l-6.571 5.081C9.59 39.612 16.268 44 24 44z"/>
        <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.13 3.252-5.682 6-11.303 6-5.418 0-9.97-2.748-11.303-6.917l-6.571 5.081C9.59 39.612 16.268 44 24 44c7.732 0 14.41-4.388 17.694-10.691z"/>
      </g>
    </svg>
  </span>
  <span v-else>
    <!-- Fallback: slot or nothing -->
    <slot />
  </span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  name: { type: String, required: true },
  class: { type: String, default: '' }
})
const customClass = props.class
</script>
