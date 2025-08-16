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
</script>
