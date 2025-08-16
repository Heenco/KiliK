<template>
  <div class="text-center py-20">
    <svg class="mx-auto h-24 w-24 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
    <h3 class="text-lg font-medium text-gray-300 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 mb-6">{{ description }}</p>
    <button 
      v-if="showUploadButton"
      @click="handleUploadClick" 
      class="btn-auth"
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

<style scoped>
/* Button styles */
.btn-auth {
  background: #22c55e;
  color: #000;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-auth:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
