<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <UploadArea @file-uploaded="handleFileUploaded" />
    
    <!-- Files List -->
    <FilesList 
      :key="`files-${uploadedFiles.length}-${Date.now()}`"
      :selectedReportId="selectedReportId"
      @report-selected="handleReportSelected"
      @file-deleted="handleFileDeleted"
    />
  </div>
</template>

<script setup>
import UploadArea from './UploadArea.vue'
import FilesList from './FilesList.vue'
import { onMounted, watch } from 'vue'

// Props
const props = defineProps({
  selectedReportId: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['report-selected', 'file-deleted', 'file-uploaded'])

// Composables
const { uploadedFiles, fetchUserFiles, forceRefreshFiles } = useFileUpload()

// Methods
const handleReportSelected = (reportId) => {
  emit('report-selected', reportId)
}

const handleFileDeleted = (fileName) => {
  emit('file-deleted', fileName)
}

const handleFileUploaded = async () => {
  console.log('File uploaded, refreshing list...') // Debug log
  
  // Force refresh the file list
  await forceRefreshFiles()
  console.log('Files after upload:', uploadedFiles.value.length) // Debug log
  
  emit('file-uploaded')
  
  // Auto-select the newest file immediately
  if (uploadedFiles.value.length > 0) {
    const newestFile = uploadedFiles.value[0] // Should be first due to desc sort
    console.log('Auto-selecting newest file:', newestFile.name, 'with ID:', newestFile.id) // Debug log
    emit('report-selected', newestFile.id)
  }
}

// Auto-select first report on initial load if none is selected
onMounted(async () => {
  // Make sure we have the latest files
  await fetchUserFiles()
  
  // If there are files but no selection, auto-select the first file
  if (uploadedFiles.value.length > 0 && !props.selectedReportId) {
    console.log('Initial load: Auto-selecting first file:', uploadedFiles.value[0].id)
    emit('report-selected', uploadedFiles.value[0].id)
  }
})

// Watch for changes in uploaded files list
watch(uploadedFiles, (newFiles) => {
  // If we now have files but nothing is selected, select the first one
  if (newFiles.length > 0 && !props.selectedReportId) {
    console.log('Files loaded: Auto-selecting first file:', newFiles[0].id)
    emit('report-selected', newFiles[0].id)
  }
  
  // If selected file was deleted, clear selection
  if (props.selectedReportId && newFiles.length > 0 && 
      !newFiles.some(file => file.id === props.selectedReportId)) {
    console.log('Selected file no longer exists, selecting first available file')
    emit('report-selected', newFiles[0].id)
  }
}, { deep: true })
</script>
