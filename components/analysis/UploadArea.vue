<template>
  <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
    <CardHeader class="pb-3">
      <CardTitle class="text-gray-100 text-base">Upload Report</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
      <!-- Drag and Drop Area -->
      <div 
        class="drag-drop-area-sidebar"
        :class="{ 'drag-over': isDragOver }"
        @drop="handleDropWithUpload"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="triggerFileInput"
      >
        <input 
          ref="fileInput"
          id="pdfFile" 
          type="file" 
          accept=".pdf" 
          class="hidden" 
          @change="handleFileChange" 
        />
        
        <div v-if="!isUploading" class="text-center">
          <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-sm text-gray-300 mb-1">Drop PDF or click to browse</p>
          <p class="text-xs text-gray-500">Max 10MB</p>
        </div>
        
        <div v-else class="text-center">
          <svg class="mx-auto h-8 w-8 text-blue-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-gray-300">Uploading...</p>
        </div>
      </div>
      
      <div v-if="uploadMessage" class="mt-3">
        <div :class="['p-2 rounded text-sm', uploadSuccess ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-red-900/30 border border-red-700 text-red-400']">
          {{ uploadMessage }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

// Composables
const {
  isUploading,
  uploadMessage,
  uploadSuccess,
  isDragOver,
  uploadPdf,
  handleFileSelect,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop
} = useFileUpload()

// Local refs
const fileInput = ref(null)

// Emits
const emit = defineEmits(['file-uploaded'])

// Methods
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (handleFileSelect(file)) {
    const success = await uploadPdf()
    if (success) {
      emit('file-uploaded')
      // Clear file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleDropWithUpload = async (event) => {
  const success = await handleDrop(event)
  if (success) {
    emit('file-uploaded')
  }
}
</script>

<style scoped>
/* Sidebar-optimized Drag and Drop Area Styles */
.drag-drop-area-sidebar {
  border: 2px dashed #374151;
  border-radius: 0.75rem;
  padding: 1.5rem 1rem;
  background: rgba(31, 41, 55, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-drop-area-sidebar:hover {
  border-color: #4ade80;
  background: rgba(31, 41, 55, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.drag-drop-area-sidebar.drag-over {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.hidden {
  display: none;
}

/* Spinning animation for upload indicator */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
