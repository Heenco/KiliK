import { ref, watch } from 'vue'

export const useFileUpload = () => {
  // State
  const selectedFile = ref(null)
  const isUploading = ref(false)
  const uploadMessage = ref('')
  const uploadSuccess = ref(false)
  const uploadedFiles = ref([])
  const isDragOver = ref(false)

  // Supabase
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // File validation
  const validateFile = (file) => {
    if (!file) return { valid: false, message: 'No file selected' }
    if (file.type !== 'application/pdf') {
      return { valid: false, message: 'Please select a valid PDF file' }
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return { valid: false, message: 'File size must be less than 10MB' }
    }
    return { valid: true }
  }

  // File upload
  const uploadPdf = async () => {
    if (!selectedFile.value || !user.value) return false
    
    isUploading.value = true
    uploadMessage.value = ''
    
    try {
      // Get original filename and sanitize it for storage
      const originalName = selectedFile.value.name
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${user.value.id}/${sanitizedName}`
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('inspection-reports')
        .upload(filePath, selectedFile.value, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Store metadata in database if needed
      const { error: metadataError } = await supabase
        .from('report_files')
        .insert({
          name: originalName,
          user_id: user.value.id,
          storage_path: filePath,
          size: selectedFile.value.size
        })
      
      if (metadataError) console.error('Metadata storage error:', metadataError)
      
      uploadSuccess.value = true
      uploadMessage.value = 'PDF uploaded successfully!'
      
      // Clear the selected file first
      selectedFile.value = null
      
      // Refresh file list and ensure it's updated
      await fetchUserFiles()
      
      // Force reactivity update by creating a new array reference
      uploadedFiles.value = [...uploadedFiles.value]
      
      return true
    } catch (error) {
      console.error('Upload error:', error)
      uploadSuccess.value = false
      uploadMessage.value = error.message || 'An error occurred during upload'
      selectedFile.value = null
      return false
    } finally {
      isUploading.value = false
    }
  }

  // Fetch user files
  const fetchUserFiles = async () => {
    if (!user.value) {
      console.log('No user, skipping file fetch') // Debug log
      return
    }

    try {
      console.log('Fetching files for user:', user.value.id) // Debug log
      const { data, error } = await supabase.storage
        .from('inspection-reports')
        .list(user.value.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

      if (error) throw error

      // Create new array to ensure reactivity
      const newFiles = data.map(file => ({
        id: file.id || file.name,
        name: file.name,
        created_at: file.created_at || new Date().toISOString(),
        size: file.size || 0
      }))
      
      console.log('Files fetched:', newFiles.length, newFiles) // Debug log
      uploadedFiles.value = newFiles
    } catch (error) {
      console.error('Error fetching files from storage:', error)
    }
  }

  // Delete file
  const deletePdf = async (fileName) => {
    try {
      const filePath = `${user.value.id}/${fileName}`
      const { error: storageError } = await supabase.storage
        .from('inspection-reports')
        .remove([filePath])

      if (storageError) throw storageError

      // Refresh the file list and force reactivity
      await fetchUserFiles()
      
      console.log('File deleted, files updated:', uploadedFiles.value.length) // Debug log
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }

  // Generate download URL
  const getDownloadUrl = async (fileName) => {
    try {
      const filePath = `${user.value.id}/${fileName}`
      const { data: urlData, error: urlError } = await supabase.storage
        .from('inspection-reports')
        .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

      if (urlError) throw urlError
      return urlData.signedUrl
    } catch (error) {
      console.error('Error generating download URL:', error)
      throw error
    }
  }

  // File handling methods
  const handleFileSelect = (file) => {
    const validation = validateFile(file)
    if (validation.valid) {
      selectedFile.value = file
      uploadMessage.value = ''
    } else {
      selectedFile.value = null
      uploadMessage.value = validation.message
      uploadSuccess.value = false
    }
    return validation.valid
  }

  const clearFile = () => {
    selectedFile.value = null
    uploadMessage.value = ''
    uploadSuccess.value = false
  }

  const resetUploadArea = () => {
    selectedFile.value = null
    uploadMessage.value = ''
    uploadSuccess.value = false
  }

  // Drag and drop handlers
  const handleDragEnter = (event) => {
    event.preventDefault()
    isDragOver.value = true
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    if (!event.currentTarget.contains(event.relatedTarget)) {
      isDragOver.value = false
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    isDragOver.value = true
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    isDragOver.value = false
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (handleFileSelect(file)) {
        return await uploadPdf()
      }
    }
    return false
  }

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
    else return (bytes / 1048576).toFixed(2) + ' MB'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    })
  }

  // Watch for user changes and fetch files when logged in
  watch(user, (newUser) => {
    if (newUser) {
      console.log('User logged in, fetching files...') // Debug log
      fetchUserFiles()
    } else {
      uploadedFiles.value = []
    }
  }, { immediate: true })

  // Also watch uploadedFiles for changes
  watch(uploadedFiles, (newFiles) => {
    console.log('Upload files changed:', newFiles.length) // Debug log
  }, { deep: true })

  // Force refresh files (can be called externally)
  const forceRefreshFiles = async () => {
    console.log('Force refreshing files...') // Debug log
    await fetchUserFiles()
    // Force reactivity by creating a completely new reference
    uploadedFiles.value = [...uploadedFiles.value]
  }

  return {
    // State
    selectedFile,
    isUploading,
    uploadMessage,
    uploadSuccess,
    uploadedFiles,
    isDragOver,
    
    // Methods
    uploadPdf,
    fetchUserFiles,
    forceRefreshFiles,
    deletePdf,
    getDownloadUrl,
    handleFileSelect,
    clearFile,
    resetUploadArea,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    formatFileSize,
    formatDate,
    validateFile
  }
}
