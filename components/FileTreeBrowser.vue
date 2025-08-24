<template>
  <div class="space-y-2">
    <!-- Upload Progress Bar -->
    <div v-if="isUploading" class="w-full px-2 py-1 border-b border-border">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted-foreground">Uploading file...</span>
        <span class="text-xs font-medium">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary rounded-full transition-all duration-300" 
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Create New Folder Button -->
    <div class="flex items-center gap-2 p-2 border-b border-border">
      <button 
        @click="showNewFolderInput = !showNewFolderInput"
        class="flex items-center gap-1 px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded transition"
        title="Create New Folder"
      >
        <FolderPlus :size="14" />
        <span v-if="open">New Folder</span>
      </button>
      
      <!-- New Folder Input -->
      <div v-if="showNewFolderInput && open" class="flex gap-1 flex-1">
        <input
          ref="newFolderInput"
          v-model="newFolderName"
          @keyup.enter="createNewFolder"
          @keyup.escape="cancelNewFolder"
          type="text"
          placeholder="Folder name..."
          class="flex-1 px-2 py-1 text-xs bg-background border rounded"
        />
        <button 
          @click="createNewFolder"
          class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Check :size="12" />
        </button>
        <button 
          @click="cancelNewFolder"
          class="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <X :size="12" />
        </button>
      </div>
    </div>

    <!-- File Tree -->
    <div 
      class="space-y-1 max-h-96 overflow-y-auto"
      @dragover.prevent
      @drop.prevent="handleRootDrop"
    >
      <div v-if="uploadedFiles.length === 0" class="text-sm text-muted-foreground p-2">
        No files found. Upload a PDF to get started.
      </div>
      <div v-else-if="fileTree.length === 0" class="text-sm text-muted-foreground p-2">
        Files loading...
      </div>
      <FileTreeNode
        v-for="node in fileTree"
        :key="node.path"
        :node="node"
        :level="0"
        :open="open"
        @file-select="handleFileSelect"
        @file-delete="handleFileDelete"
        @folder-delete="handleFolderDelete"
        @upload-to-folder="handleUploadToFolder"
        @file-moved="handleFileMoved"
        @toggle-expanded="handleToggleExpanded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { FolderPlus, Check, X } from 'lucide-vue-next'

// Define props
const props = defineProps({
  open: {
    type: Boolean,
    default: true
  }
})

// Define emits
const emit = defineEmits(['file-select', 'file-delete'])

// File upload composable
const { uploadedFiles, fetchUserFiles, deletePdf, isUploading, uploadProgress } = useFileUpload()

// Component state
const showNewFolderInput = ref(false)
const newFolderName = ref('')
const newFolderInput = ref(null)
// Track expanded folders by path so expansion survives recomputes
const expandedFolders = ref([])

// Supabase
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Convert flat file list to nested tree structure
const fileTree = computed(() => {
  console.log('Computing file tree with files:', uploadedFiles.value.length, uploadedFiles.value.map(f => f.name))
  
  const tree = []
  const folderMap = new Map()
  
  // First, collect all folders from file paths
  uploadedFiles.value.forEach(file => {
    const parts = file.name.split('/')
    console.log('Checking file for folders:', file.name, 'parts:', parts)
    if (parts.length > 1) {
      // File is in a folder, create folder path
      let currentPath = ''
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i]
        const parentPath = currentPath
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName
        
        console.log('Creating folder structure:', {
          folderName,
          currentPath,
          parentPath
        })
        
        if (!folderMap.has(currentPath)) {
          const folderNode = {
            type: 'folder',
            name: folderName,
            path: currentPath,
            parentPath: parentPath || null,
            children: [],
            // Use expandedFolders to determine expansion; default to false if not in list
            expanded: expandedFolders.value.includes(currentPath),
            isEmpty: true
          }
          folderMap.set(currentPath, folderNode)
          console.log('Created folder node:', folderNode)
        }
      }
    }
  })
  
  console.log('Folder map after processing:', Object.fromEntries(folderMap))
  
  // Then, add files to their respective folders or root
  uploadedFiles.value.forEach(file => {
    const parts = file.name.split('/')
    const fileName = parts[parts.length - 1]
    
    console.log('Processing file:', file.name, 'parts:', parts, 'fileName:', fileName)
    
    // Skip placeholder files in the UI but keep them for folder structure
    if (fileName === '.placeholder' || fileName === '.keep') {
      console.log('Skipping placeholder file:', fileName)
      return
    }
    
    if (parts.length === 1) {
      // File is in root
      console.log('Adding file to root:', fileName)
      tree.push({
        type: 'file',
        name: fileName,
        path: file.name,
        file: file,
        parentPath: null
      })
    } else {
      // File is in a folder
      const folderPath = parts.slice(0, -1).join('/')
      const folder = folderMap.get(folderPath)
      console.log('Adding file to folder:', fileName, 'folderPath:', folderPath, 'found folder:', !!folder)
      if (folder) {
        folder.children.push({
          type: 'file',
          name: fileName,
          path: file.name,
          file: file,
          parentPath: folderPath
        })
        folder.isEmpty = false
        console.log('File added to folder, folder now has', folder.children.length, 'children')
      } else {
        console.warn('Folder not found for file:', fileName, 'expected folder path:', folderPath)
      }
    }
  })
  
  // Build the tree structure
  const buildTree = (parentPath = null) => {
    const nodes = []
    
    // Add folders at this level (including empty ones)
    for (const [path, folder] of folderMap) {
      if (folder.parentPath === parentPath) {
        folder.children = [
          ...folder.children,
          ...buildTree(path)
        ]
        // Add folder even if it's empty (has .keep file)
        nodes.push(folder)
      }
    }
    
    // Add files at root level if parentPath is null
    if (parentPath === null) {
      tree.forEach(node => {
        if (node.type === 'file' && node.parentPath === null) {
          nodes.push(node)
        }
      })
    }
    
    return nodes.sort((a, b) => {
      // Folders first, then files, both alphabetically
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }
  
  const finalTree = buildTree()
  console.log('Final file tree:', finalTree)
  return finalTree
})

// Handle file selection
const handleFileSelect = (node) => {
  if (node.type === 'file') {
    emit('file-select', node.file.name)
  }
}

// Handle file deletion
const handleFileDelete = async (node) => {
  if (node.type === 'file') {
    try {
      await deletePdf(node.file.name)
      emit('file-delete', node.file.name)
      await fetchUserFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
}

// Handle folder deletion
const handleFolderDelete = async (node) => {
  if (node.type === 'folder') {
    const confirmed = confirm(`Delete folder "${node.name}" and all its contents?`)
    if (!confirmed) return
    
    try {
      // Get all files in this folder and subfolders
      const filesToDelete = []
      uploadedFiles.value.forEach(file => {
        if (file.name.startsWith(node.path + '/')) {
          filesToDelete.push(file.name)
        }
      })
      
      // Delete all files in the folder
      for (const fileName of filesToDelete) {
        await deletePdf(fileName)
      }
      
      await fetchUserFiles()
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }
}

// Handle upload to specific folder
const handleUploadToFolder = async (node, file) => {
  if (node.type === 'folder' && file) {
    try {
      // Create new file path with folder
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${user.value.id}/${node.path}/${fileName}`
      
      console.log('Uploading file to folder:', {
        originalFileName: file.name,
        sanitizedFileName: fileName,
        folderPath: node.path,
        fullStoragePath: filePath
      })
      
      // Track upload progress using a more reliable method
      const uploadWithProgress = async () => {
        try {
          // Show upload is happening
          isUploading.value = true;
          uploadProgress.value = 0;
          
          // Create a FormData object to upload the file with progress tracking
          const formData = new FormData();
          formData.append('file', file);
          
          // Use the standard Supabase upload but track the progress manually
          // by periodically updating the progress value
          // This is more reliable than signed URLs which can expire
          
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
            .upload(filePath, file, {
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
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      console.log('File uploaded successfully:', data);
      
      // Store metadata in database if needed (optional)
      try {
        const { error: metadataError } = await supabase
          .from('report_files')
          .insert({
            name: `${node.path}/${fileName}`,
            user_id: user.value.id,
            storage_path: filePath,
            size: file.size
          })
        
        if (metadataError) console.warn('Metadata storage error (non-critical):', metadataError)
      } catch (metaError) {
        console.warn('Metadata table may not exist, continuing...', metaError)
      }
      
      // Wait a moment for the upload to be processed
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await fetchUserFiles()
      
      console.log('Files after upload:', uploadedFiles.value.map(f => f.name))
      
      // Reset upload state
      isUploading.value = false;
      uploadProgress.value = 0;
    } catch (error) {
      console.error('Error uploading to folder:', error)
      
      // Reset upload state on error
      isUploading.value = false;
      uploadProgress.value = 0;
      
      // Provide a more helpful error message based on the error type
      let errorMessage = error.message || 'An unknown error occurred';
      
      if (error.message && error.message.includes('Network')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message && error.message.includes('already exists')) {
        errorMessage = 'A file with the same name already exists in this folder.';
      } else if (error.statusCode === 413 || (error.message && error.message.includes('too large'))) {
        errorMessage = 'The file is too large. Maximum file size is 10MB.';
      }
      
      alert('Error uploading file: ' + errorMessage);
    }
  }
}

// Create new folder
const createNewFolder = async () => {
  const folderName = newFolderName.value.trim()
  if (!folderName) return
  
  try {
    // Create a placeholder file in the folder to ensure it exists
    // Use a more persistent placeholder name
    const placeholderPath = `${user.value.id}/${folderName}/.keep`
    const placeholderFile = new Blob(['This file keeps the folder structure'], { type: 'text/plain' })
    
    const { error } = await supabase.storage
      .from('inspection-reports')
      .upload(placeholderPath, placeholderFile, {
        cacheControl: '3600',
        upsert: true // Allow overwriting if exists
      })
    
    if (error) throw error
    
    // Wait a moment for the upload to complete
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await fetchUserFiles()
    cancelNewFolder()
    
    console.log('Folder created successfully:', folderName)
  } catch (error) {
    console.error('Error creating folder:', error)
    alert('Error creating folder: ' + error.message)
  }
}

// Cancel new folder creation
const cancelNewFolder = () => {
  showNewFolderInput.value = false
  newFolderName.value = ''
}

// Auto-focus input when shown
watch(showNewFolderInput, async (show) => {
  if (show) {
    await nextTick()
    newFolderInput.value?.focus()
  }
})

// Handle file moved between folders
const handleFileMoved = async () => {
  await fetchUserFiles()
}

// Handle folder expand/collapse by updating the expandedFolders list
const handleToggleExpanded = (path) => {
  const idx = expandedFolders.value.indexOf(path)
  if (idx === -1) {
    // add
    expandedFolders.value = [...expandedFolders.value, path]
  } else {
    // remove
    expandedFolders.value = expandedFolders.value.filter(p => p !== path)
  }
  
  // Prevent immediate recomputation of the tree to avoid visual glitches
  nextTick(() => {
    console.log('Folder expansion updated:', { 
      path, 
      isExpanded: expandedFolders.value.includes(path),
      expandedFolders: [...expandedFolders.value]
    })
  })
}

// Handle files dropped on root (outside of folders)
const handleRootDrop = async (event) => {
  const files = Array.from(event.dataTransfer.files)
  for (const file of files) {
    if (file.type === 'application/pdf') {
      // Use the existing upload mechanism for root level files
      const { handleFileSelect, uploadPdf } = useFileUpload()
      if (handleFileSelect(file)) {
        await uploadPdf()
        await fetchUserFiles()
      }
    } else {
      console.warn('Skipping non-PDF file:', file.name)
    }
  }
}

// Ensure files are fetched on mount
onMounted(() => {
  console.log('FileTreeBrowser mounted, fetching files...')
  
  // Initialize expandedFolders with empty array if it's null
  if (!expandedFolders.value) {
    expandedFolders.value = []
  }
  
  fetchUserFiles()
})
</script>
