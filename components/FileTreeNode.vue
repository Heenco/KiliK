<template>
  <div class="group">
    <!-- Node -->
    <div 
      :class="[
        'flex items-center justify-between p-1 hover:bg-accent rounded-md cursor-pointer transition-colors',
        { 'pl-4': level > 0, 'pl-6': level > 1, 'pl-8': level > 2 },
        { 'bg-blue-100 border-2 border-blue-300 border-dashed': isDragOver && node.type === 'folder' },
        { 'opacity-50': isDragging }
      ]"
      @click.stop="node.type === 'folder' ? toggleExpanded($event) : handleFileSelect()"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter" 
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      :draggable="node.type === 'file'"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <div class="flex items-center gap-1 flex-1 truncate">
        <!-- Folder icon with expand/collapse -->
        <template v-if="node.type === 'folder'">
          <Folder 
            v-if="!node.expanded"
            :size="16" 
            class="flex-shrink-0 text-blue-600"
          />
          <FolderOpen 
            v-else
            :size="16" 
            class="flex-shrink-0 text-blue-600"
          />
          <ChevronRight 
            v-if="!node.expanded"
            :size="12" 
            class="flex-shrink-0"
          />
          <ChevronDown 
            v-else
            :size="12" 
            class="flex-shrink-0"
          />
        </template>
        
        <!-- File icon -->
        <template v-else>
          <FileText :size="16" class="flex-shrink-0 text-red-600" />
        </template>
        
        <!-- Name -->
        <span 
          v-if="open" 
          :class="[
            'text-sm truncate',
            node.type === 'file' ? 'text-card-foreground' : 'font-medium text-card-foreground'
          ]"
        >
          {{ node.name }}
        </span>
      </div>

      <!-- Actions - three-dot menu -->
        <div class="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="px-2 py-1 rounded hover:bg-accent/60" @click.stop>
                <span class="text-sm">⋯</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <!-- Folder actions -->
              <DropdownMenuItem v-if="node.type === 'folder'" @click.stop.prevent="triggerFileUpload">
                Upload file
              </DropdownMenuItem>
              <!-- File actions -->
              <DropdownMenuItem v-if="node.type === 'file'" @click.stop.prevent="handleFileSelect">
                Open file
              </DropdownMenuItem>
              <DropdownMenuItem v-if="node.type === 'file'" @click.stop.prevent="handleProcessAndIngest">
                <div class="flex items-center">
                  <span>Process and Ingest</span>
                  <span v-if="isProcessed" class="ml-2 text-green-500">✓</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click.stop.prevent="handleDelete" variant="destructive">
                Delete {{ node.type === 'folder' ? 'folder' : 'file' }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </div>
    
    <!-- Hidden file input for folder uploads (allow multiple PDFs) -->
    <input
      v-if="node.type === 'folder'"
      ref="fileInput"
      type="file"
      accept="application/pdf"
      multiple
      @change="handleFileUpload"
      class="hidden"
    />

    <!-- Children (recursive) -->
    <template v-if="node.type === 'folder' && node.expanded && node.children.length > 0">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :level="level + 1"
        :open="open"
        @file-select="$emit('file-select', $event)"
        @file-delete="$emit('file-delete', $event)"
        @folder-delete="$emit('folder-delete', $event)"
        @upload-to-folder="handleUploadToFolder"
        @file-moved="$emit('file-moved')"
        @toggle-expanded="$emit('toggle-expanded', $event)"
  @process-and-ingest="$emit('process-and-ingest', $event)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder, FolderOpen, ChevronRight, ChevronDown, FileText } from 'lucide-vue-next'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import { onMounted, watch } from 'vue'

// Define props
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  open: {
    type: Boolean,
    default: true
  }
})

// Define emits
const emit = defineEmits(['file-select', 'file-delete', 'folder-delete', 'upload-to-folder', 'file-moved', 'toggle-expanded', 'process-and-ingest'])

// Component state
const fileInput = ref(null)
const isDragOver = ref(false)
const isDragging = ref(false)
const isProcessed = ref(false)

// Supabase
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Toggle folder expansion
const toggleExpanded = (event) => {
  if (props.node.type === 'folder') {
    // Prevent event propagation
    event?.stopPropagation()
    emit('toggle-expanded', props.node.path)
  }
}

// Handle file selection
const handleFileSelect = () => {
  emit('file-select', props.node)
}

// Handle delete action
const handleDelete = () => {
  if (props.node.type === 'file') {
    const confirmed = confirm(`Delete "${props.node.name}"?`)
    if (confirmed) {
      emit('file-delete', props.node)
    }
  } else if (props.node.type === 'folder') {
    emit('folder-delete', props.node)
  }
}

// Process and ingest file
const handleProcessAndIngest = () => {
  console.log('FileTreeNode: Process and Ingest clicked for node:', props.node)
  if (props.node.type === 'file') {
    // Emit the full node so parents have context (folder path, file object etc.)
    emit('process-and-ingest', props.node)
  } else {
    console.warn('Process and Ingest clicked on non-file node:', props.node)
  }
}

// Check if file has already been processed and ingested
const checkProcessingStatus = async () => {
  if (props.node.type === 'file' && user.value) {
    try {
      // Check if this file exists in the documents table
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', user.value.id)
        .eq('document_name', props.node.name)
        .limit(1)
      
      if (!error && data && data.length > 0) {
        isProcessed.value = true
      } else {
        isProcessed.value = false
      }
    } catch (error) {
      console.error('Error checking processing status:', error)
      isProcessed.value = false
    }
  }
}

// Trigger file upload for folder
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// Handle file upload to folder (support multiple files)
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files || [])
  for (const file of files) {
    if (file && file.type === 'application/pdf') {
      emit('upload-to-folder', props.node, file)
    } else {
      console.warn('Skipping non-PDF file:', file?.name)
    }
  }
  // Reset input
  event.target.value = ''
}

// Handle upload to folder event from children
const handleUploadToFolder = (node, file) => {
  emit('upload-to-folder', node, file)
}

// Drag and Drop handlers
const handleDragStart = (event) => {
  if (props.node.type === 'file') {
    isDragging.value = true
    event.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'file',
      path: props.node.path,
      name: props.node.name
    }))
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleDragEnter = (event) => {
  if (props.node.type === 'folder') {
    event.preventDefault()
    isDragOver.value = true
  }
}

const handleDragOver = (event) => {
  if (props.node.type === 'folder') {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragLeave = (event) => {
  if (props.node.type === 'folder') {
    // Only remove drag over if we're actually leaving the element
    if (!event.currentTarget.contains(event.relatedTarget)) {
      isDragOver.value = false
    }
  }
}

const handleDrop = async (event) => {
  if (props.node.type === 'folder') {
    event.preventDefault()
    isDragOver.value = false
    
    try {
      // Handle file drops from computer
      if (event.dataTransfer.files.length > 0) {
        const files = Array.from(event.dataTransfer.files)
        for (const file of files) {
          if (file.type === 'application/pdf') {
            emit('upload-to-folder', props.node, file)
          } else {
            console.warn('Skipping non-PDF file:', file.name)
          }
        }
        return
      }
      
      // Handle internal file moves
      const dragData = event.dataTransfer.getData('text/plain')
      if (dragData) {
        const draggedItem = JSON.parse(dragData)
        if (draggedItem.type === 'file' && draggedItem.path !== props.node.path) {
          await moveFileToFolder(draggedItem, props.node)
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }
}

// Move file between folders
const moveFileToFolder = async (draggedFile, targetFolder) => {
  try {
    // Get the original file data
    const originalPath = `${user.value.id}/${draggedFile.path}`
    const fileName = draggedFile.name
    const newPath = `${user.value.id}/${targetFolder.path}/${fileName}`
    
    console.log('Moving file:', {
      from: originalPath,
      to: newPath,
      fileName
    })
    
    // Download the original file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('inspection-reports')
      .download(originalPath)
    
    if (downloadError) throw downloadError
    
    // Upload to new location
    const { error: uploadError } = await supabase.storage
      .from('inspection-reports')
      .upload(newPath, fileData, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // Delete original file
    const { error: deleteError } = await supabase.storage
      .from('inspection-reports')
      .remove([originalPath])
    
    if (deleteError) throw deleteError
    
    // Update metadata if it exists
    try {
      const { error: metadataError } = await supabase
        .from('report_files')
        .update({
          name: `${targetFolder.path}/${fileName}`,
          storage_path: newPath
        })
        .eq('storage_path', originalPath)
      
      if (metadataError) console.warn('Metadata update error (non-critical):', metadataError)
    } catch (metaError) {
      console.warn('Metadata table may not exist, continuing...', metaError)
    }
    
    // Refresh the file list
    emit('file-moved')
    
    console.log('File moved successfully')
  } catch (error) {
    console.error('Error moving file:', error)
    alert('Error moving file: ' + error.message)
  }
}

// Check processing status when component mounts and when user changes
onMounted(() => {
  if (user.value) {
    checkProcessingStatus()
  }
})

watch(user, (newUser) => {
  if (newUser) {
    checkProcessingStatus()
  }
})

// Watch for node changes to update processing status
watch(() => props.node, (newNode) => {
  if (newNode && newNode.type === 'file') {
    checkProcessingStatus()
  }
}, { deep: true })
</script>
