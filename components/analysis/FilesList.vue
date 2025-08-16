<template>
  <!-- Always show the card, but with different content based on file count -->
  <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
    <CardHeader class="pb-3">
      <CardTitle class="text-gray-100 text-base">Your Reports</CardTitle>
    </CardHeader>
    <CardContent class="pt-0">
      <!-- Show files if they exist -->
      <div v-if="filesList.length > 0" class="max-h-80 overflow-y-auto -mx-6 px-6">
        <div 
          v-for="file in filesList" 
          :key="file.id" 
          class="p-3 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors cursor-pointer rounded-lg mb-1 last:mb-0"
          :class="{ 'bg-gray-800/50 ring-1 ring-green-500/30': selectedReportId === file.id }"
          @click="handleSelectReport(file.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-200 truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(file.created_at) }}</p>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <button 
                @click.stop="handleDeleteFile(file.name)"
                class="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Show empty state when no files -->
      <div v-else class="py-8 text-center text-gray-500">
        <svg class="mx-auto h-8 w-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-sm">No reports uploaded yet</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

// Props
const props = defineProps({
  selectedReportId: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['report-selected', 'file-deleted'])

// Composables
const {
  uploadedFiles,
  deletePdf,
  formatDate
} = useFileUpload()

// Computed - ensure reactivity
const filesList = computed(() => uploadedFiles.value)

// Methods
const handleSelectReport = (reportId) => {
  console.log('FilesList: Selecting report', reportId) // Debug log
  emit('report-selected', reportId)
}

const handleDeleteFile = async (fileName) => {
  if (!confirm('Are you sure you want to delete this file?')) return

  try {
    await deletePdf(fileName)
    console.log('File deleted from FilesList') // Debug log
    emit('file-deleted', fileName)
  } catch (error) {
    console.error('Failed to delete file:', error)
    alert('Failed to delete file: ' + (error.message || 'Unknown error'))
  }
}
</script>

<style scoped>
/* Better scrollbars for content areas */
.max-h-80 {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.max-h-80::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-80::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
</style>
