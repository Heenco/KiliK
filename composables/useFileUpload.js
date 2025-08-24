import { ref, watch } from 'vue'

// Shared reactive state (singleton)
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadMessage = ref('')
const uploadSuccess = ref(false)
const uploadedFiles = ref([])
const isDragOver = ref(false)
const uploadQueue = ref([])

let _setupDone = false

export const useFileUpload = () => {
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
    uploadProgress.value = 0
    uploadMessage.value = ''
    
    try {
      // Get original filename and sanitize it for storage
      const originalName = selectedFile.value.name
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${user.value.id}/${sanitizedName}`
      
      // Track upload progress with a more reliable method
      const uploadWithProgress = async () => {
        try {
          // Reset progress indicators
          uploadProgress.value = 0;
          
          // Start a progress simulation for user feedback
          const startTime = Date.now();
          const updateProgressInterval = setInterval(() => {
            // Calculate simulated progress based on time elapsed
            // Max out at 90% until we get confirmation of success
            const elapsed = Date.now() - startTime;
            const simulatedProgress = Math.min(90, Math.round((elapsed / 5000) * 100));
            uploadProgress.value = simulatedProgress;
          }, 100);
          
          // Perform the actual upload using the standard Supabase method
          const { data, error } = await supabase.storage
            .from('inspection-reports')
            .upload(filePath, selectedFile.value, {
              cacheControl: '3600',
              upsert: false
            });
            
          // Clear the progress interval
          clearInterval(updateProgressInterval);
          
          // Set progress to 100% on success
          if (!error) {
            uploadProgress.value = 100;
          }
          
          return { data, error };
        } catch (err) {
          console.error('Upload error:', err);
          return { data: null, error: err };
        }
      };
      
      // Perform the upload with progress
      const { data, error } = await uploadWithProgress();
      
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
      
      // Wait a moment for Supabase to process the upload, then refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      await fetchUserFiles()
      
      // If the file still isn't there, try once more
      if (!uploadedFiles.value.find(f => f.name === sanitizedName)) {
        console.log('File not found in list, retrying fetch...', { 
          looking_for: sanitizedName, 
          found_files: uploadedFiles.value.map(f => f.name) 
        })
        await new Promise(resolve => setTimeout(resolve, 2000))
        await fetchUserFiles()
        
        // Final check
        if (!uploadedFiles.value.find(f => f.name === sanitizedName)) {
          console.warn('File still not found after retry:', { 
            looking_for: sanitizedName, 
            found_files: uploadedFiles.value.map(f => f.name) 
          })
        }
      }
      
      return true
    } catch (error) {
      console.error('Upload error:', error)
      uploadSuccess.value = false
      
      // Provide a more helpful error message based on the error type
      let errorMessage = error.message || 'An unknown error occurred';
      
      if (error.message && error.message.includes('Network')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message && error.message.includes('already exists')) {
        errorMessage = 'A file with the same name already exists.';
      } else if (error.statusCode === 413 || (error.message && error.message.includes('too large'))) {
        errorMessage = 'The file is too large. Maximum file size is 10MB.';
      }
      
      uploadMessage.value = errorMessage;
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
      
      // Get all files recursively from user's folder (simpler approach)
      const getAllFiles = async (prefix = '') => {
        const { data, error } = await supabase.storage
          .from('inspection-reports')
          .list(`${user.value.id}${prefix}`, { 
            limit: 1000, 
            sortBy: { column: 'created_at', order: 'desc' } 
          })

        if (error) throw error

        const allFiles = []
        
        for (const item of data) {
          const fullPath = prefix ? `${prefix.slice(1)}/${item.name}` : item.name // Remove leading slash
          
          if (item.id === null && item.name !== '.emptyFolderPlaceholder') {
            // This is a folder, recurse into it
            const subFiles = await getAllFiles(`/${fullPath}`)
            allFiles.push(...subFiles)
          } else if (item.id !== null && !item.name.startsWith('.emptyFolderPlaceholder')) {
            // This is a file (include .keep files for folder structure)
            allFiles.push({
              id: fullPath, // Use full path as consistent ID
              name: fullPath,
              created_at: item.created_at || new Date().toISOString(),
              size: item.size || 0
            })
          }
        }
        
        return allFiles
      }

      const allFiles = await getAllFiles()
      
      console.log('Files fetched:', allFiles.length, allFiles.map(f => ({ id: f.id, name: f.name }))) // Debug log
      uploadedFiles.value = allFiles
    } catch (error) {
      console.error('Error fetching files from storage:', error)
      // Fallback to simple listing if recursive fails
      try {
        const { data, error } = await supabase.storage
          .from('inspection-reports')
          .list(user.value.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

        if (error) throw error

        const simpleFiles = data
          .filter(file => file.id !== null && file.name !== '.emptyFolderPlaceholder')
          .map(file => ({
            id: file.name,
            name: file.name,
            created_at: file.created_at || new Date().toISOString(),
            size: file.size || 0
          }))
        
        console.log('Fallback: Files fetched:', simpleFiles.length)
        uploadedFiles.value = simpleFiles
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError)
      }
    }
  }

  // Delete file
  const deletePdf = async (fileName) => {
    try {
      // Handle both regular files and files in folders
      const filePath = fileName.includes('/') 
        ? `${user.value.id}/${fileName}` 
        : `${user.value.id}/${fileName}`
      
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
      // Handle both regular files and files in folders
      const filePath = fileName.includes('/') 
        ? `${user.value.id}/${fileName}` 
        : `${user.value.id}/${fileName}`
        
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
  if (!_setupDone) {
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

    _setupDone = true
  }

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
    uploadProgress,
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
