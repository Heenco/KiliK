<template>
  <div class="text-center py-20">
    <svg class="mx-auto h-24 w-24 text-muted-foreground mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <h3 class="text-lg font-medium text-foreground mb-2">{{ title }}</h3>
    <p class="text-sm text-muted-foreground mb-6">{{ description }}</p>
    <button 
      v-if="showUploadButton"
      @click="handleUploadClick" 
      class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold shadow-sm hover:bg-primary/90 transition"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    default: 'No Report Selected'
  },
  description: {
    type: String,
    default: 'Upload a PDF report or select one from your list to begin analysis'
  },
  buttonText: {
    type: String,
    default: 'Upload Your First Report'
  },
  showUploadButton: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['upload-click'])

// Methods
const handleUploadClick = () => {
  emit('upload-click')
}
</script>
