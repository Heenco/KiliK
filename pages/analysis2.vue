<template>
  <div class="min-h-screen bg-background text-foreground flex pt-16">
    <!-- Sidebar -->
    <aside :class="['transition-all duration-200 bg-card border-r border-border']" :style="{ width: open ? '18rem' : '5rem' }">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="p-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="bg-green-500 h-8 w-8 rounded"></div>
            <span v-if="open" class="font-semibold text-card-foreground">Analysis</span>
          </div>
          <button @click="toggle" class="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-accent transition">
            <svg class="h-4 w-4" :class="open ? 'rotate-0' : 'rotate-180'" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>

        <!-- Upload area -->
        <div class="px-3 py-2 border-t border-border">
          <input v-if="open" type="file" accept="application/pdf" @change="handleFileChange" class="w-full text-sm" />
        </div>

        <!-- File Tree Browser -->
        <div class="px-2 py-3 border-t border-border flex-1 overflow-auto">
          <FileTreeBrowser 
            :open="open" 
            @file-select="openReport"
            @file-delete="handleFileDelete"
            @process-and-ingest="handleProcessAndIngest"
          />
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <div v-if="!selectedReportId" class="space-y-4">
        <h1 class="text-2xl font-semibold">Analysis</h1>
        <p class="text-muted-foreground">Select a report to view</p>
      </div>

      <div v-else class="h-[calc(100vh-8rem)] flex gap-4">
        <!-- PDF Viewer -->
        <div class="w-1/2 border rounded-lg flex flex-col">
          <!-- PDF Controls -->
          <div class="p-2 border-b flex items-center justify-between gap-4">
            <!-- Page navigation -->
            <div class="flex items-center gap-2">
              <button @click="goToFirstPage" class="p-1 hover:bg-accent rounded" title="First Page">⏮</button>
              <button @click="goToPreviousPage" class="p-1 hover:bg-accent rounded" title="Previous Page">◀</button>
              <span class="text-sm">
                Page {{ currentPage }} of {{ numPages }}
              </span>
              <button @click="goToNextPage" class="p-1 hover:bg-accent rounded" title="Next Page">▶</button>
              <button @click="goToLastPage" class="p-1 hover:bg-accent rounded" title="Last Page">⏭</button>
            </div>
            
            <!-- Zoom controls -->
            <div class="flex items-center gap-2">
              <button @click="zoomOut" class="p-1 hover:bg-accent rounded" title="Zoom Out">-</button>
              <span class="text-sm">{{ Math.round(zoomLevel * 100) }}%</span>
              <button @click="zoomIn" class="p-1 hover:bg-accent rounded" title="Zoom In">+</button>
              <button @click="fitToWidth" class="p-1 hover:bg-accent rounded text-xs" title="Fit Width">FitW</button>
              <button @click="fitToPage" class="p-1 hover:bg-accent rounded text-xs" title="Fit Page">FitP</button>
            </div>
            
            <!-- Search controls -->
            <div class="flex items-center gap-2">
              <input 
                v-model="searchQuery"
                @keyup.enter="searchInPdf"
                type="text"
                placeholder="Search in PDF..."
                class="px-2 py-1 text-sm bg-background border rounded w-32"
              />
              <button @click="searchInPdf" class="p-1 hover:bg-accent rounded" title="Search">🔍</button>
              <button @click="findNext" class="p-1 hover:bg-accent rounded" title="Next">↓</button>
              <button @click="findPrevious" class="p-1 hover:bg-accent rounded" title="Previous">↑</button>
            </div>
          </div>
          
          <div class="flex-1 relative">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <div class="text-center">
                <div class="mb-2">Loading PDF... {{ Math.round(progress) }}%</div>
                <div class="w-32 h-1 bg-muted rounded-full">
                  <div class="h-full bg-primary rounded-full transition-all duration-300" :style="{ width: progress + '%' }" />
                </div>
              </div>
            </div>
            <div ref="pdfContainer" class="h-full overflow-y-auto" style="height: calc(100vh - 12rem);">
              <div class="pdfViewerContainer h-full w-full"></div>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="w-1/2 border rounded-lg flex flex-col">
          <!-- Chat Messages -->
          <div class="flex-1 p-4 overflow-y-auto space-y-3">
            <div v-for="msg in messages" :key="msg.id" 
              :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              ]">
                {{ msg.text }}
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="p-4 border-t">
            <div class="flex gap-2">
              <input 
                v-model="chatInput"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Ask about this document..."
                class="flex-1 px-3 py-2 text-sm bg-background border rounded-md"
              />
              <button 
                @click="sendMessage"
                :disabled="!chatInput.trim()"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { useAnalysisState } from '@/composables/useAnalysisState'
import { usePdfProcessor } from '@/composables/usePdfProcessor'
// pdfjs will be imported dynamically on the client to avoid SSR DOM APIs error

const open = ref(true)
const toggle = () => { open.value = !open.value }

// File management
const { uploadedFiles, handleFileSelect, uploadPdf, deletePdf, fetchUserFiles, getDownloadUrl } = useFileUpload()
const { selectedReportId, selectReport } = useAnalysisState()

const handleFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (file && handleFileSelect(file)) {
    await uploadPdf()
    await fetchUserFiles()
    // Clear the input to allow re-uploading the same file
    e.target.value = ''
  }
}

const openReport = async (fileName) => {
  selectReport(fileName)
  
  // Wait for the next tick to ensure DOM updates are complete
  await nextTick()
  
  // Small additional delay to ensure pdfContainer is ready
  await new Promise(resolve => setTimeout(resolve, 100))
  
  await updatePdfView(fileName)
}

const removeFile = async (fileName) => {
  if (!confirm('Delete ' + fileName + '?')) return
  await deletePdf(fileName)
  await fetchUserFiles()
}

// Handle file delete from tree browser
const handleFileDelete = async (fileName) => {
  await fetchUserFiles()
}

// Handle process and ingest event from file tree
const handleProcessAndIngest = async (payload) => {
  console.log('analysis2: handleProcessAndIngest payload:', payload)
  // payload may be the node object emitted from FileTreeBrowser or a simple file object
  const fileNode = payload?.type === 'file' ? payload : (payload?.file ? payload.file : payload)
  if (!fileNode || !fileNode.name) return

  // Initialize PDF processor on client
  if (typeof window === 'undefined') {
    console.warn('Process+Ingest attempted during SSR - aborting')
    return
  }

  const pdfProcessor = usePdfProcessor()
  console.log('analysis2: pdfProcessor initialized', {
    isProcessing: pdfProcessor.isProcessing.value,
    status: pdfProcessor.processingStatus.value
  })

  // Use full storage path when checking/processing (includes folders)
  const storagePath = fileNode.path || fileNode.name

  // Check if already processed
  let isAlreadyProcessed = false
  try {
    console.log('analysis2: checking processed state for storagePath:', storagePath)
    isAlreadyProcessed = await pdfProcessor.checkFileProcessed(storagePath)
    console.log('analysis2: checkFileProcessed result for', storagePath, isAlreadyProcessed)
  } catch (err) {
    console.error('analysis2: checkFileProcessed threw error', err)
  }
  if (isAlreadyProcessed) {
    alert(`The file "${fileNode.name}" has already been processed and ingested.`)
    return
  }
  
  // Confirm with user
  if (!confirm(`Process and ingest "${fileNode.name}" into the database for searching and querying?`)) {
    return
  }
  
  // Create processing dialog
  const processingDialog = document.createElement('div')
  processingDialog.style.position = 'fixed'
  processingDialog.style.top = '50%'
  processingDialog.style.left = '50%'
  processingDialog.style.transform = 'translate(-50%, -50%)'
  processingDialog.style.backgroundColor = 'white'
  processingDialog.style.padding = '20px'
  processingDialog.style.borderRadius = '8px'
  processingDialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
  processingDialog.style.zIndex = '1000'
  processingDialog.style.minWidth = '300px'
  processingDialog.style.maxWidth = '400px'
  
  // Create dialog content
  processingDialog.innerHTML = `
    <div style="text-align: center;">
      <h3 style="margin-top: 0; margin-bottom: 16px;">Processing PDF</h3>
      <p id="processing-status">Starting process...</p>
      <div style="width: 100%; height: 6px; background-color: #eee; border-radius: 3px; margin: 16px 0;">
        <div id="processing-progress" style="width: 0%; height: 100%; background-color: #4f46e5; border-radius: 3px; transition: width 0.3s ease;"></div>
      </div>
    </div>
  `
  
  // Add to document
  document.body.appendChild(processingDialog)
  
  // Setup progress tracking
  const updateProgress = () => {
    const progressBar = document.getElementById('processing-progress')
    const statusText = document.getElementById('processing-status')
    if (progressBar) {
      progressBar.style.width = `${pdfProcessor.processingProgress.value}%`
    }
    if (statusText) {
      statusText.textContent = pdfProcessor.processingStatus.value
    }
  }
  
  // Watch for progress updates
  const unwatch = watch(
    () => [pdfProcessor.processingProgress.value, pdfProcessor.processingStatus.value],
    updateProgress,
    { immediate: true }
  )
  
  try {
  // Process and ingest the PDF (use full storage path)
  console.log('analysis2: starting processAndIngestPdf for', storagePath)
  const success = await pdfProcessor.processAndIngestPdf(storagePath)
    
    if (success) {
      // Update UI to show success
      updateProgress()
      
      // Show success for 2 seconds before removing dialog
      await new Promise(resolve => setTimeout(resolve, 2000))
    } else {
      // Show error for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  } catch (error) {
    console.error('Error in handleProcessAndIngest:', error)
  } finally {
    // Clean up
    unwatch()
    document.body.removeChild(processingDialog)
  }
}

// PDF viewing with community PDF.js implementation
const pdfContainer = ref(null)
const isLoading = ref(false)
const progress = ref(0)
const zoomLevel = ref(1)
const cachedPdf = ref(null)
const numPages = ref(0)
const currentPage = ref(1)
const renderedPages = ref([])
const textLayers = ref([])

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3)
  rerenderPages()
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.25)
  rerenderPages()
}

const fitToWidth = async () => {
  if (!cachedPdf.value || !pdfContainer.value) return
  const containerWidth = pdfContainer.value.clientWidth - 40
  const page = await cachedPdf.value.getPage(1)
  const viewport = page.getViewport({ scale: 1 })
  zoomLevel.value = containerWidth / viewport.width
  rerenderPages()
}

const fitToPage = async () => {
  if (!cachedPdf.value || !pdfContainer.value) return
  const containerHeight = pdfContainer.value.clientHeight - 40
  const containerWidth = pdfContainer.value.clientWidth - 40
  const page = await cachedPdf.value.getPage(1)
  const viewport = page.getViewport({ scale: 1 })
  const scaleX = containerWidth / viewport.width
  const scaleY = containerHeight / viewport.height
  zoomLevel.value = Math.min(scaleX, scaleY)
  rerenderPages()
}

// Page navigation
const goToFirstPage = () => {
  currentPage.value = 1
  scrollToPage(1)
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToPage(currentPage.value)
  }
}

const goToNextPage = () => {
  if (currentPage.value < numPages.value) {
    currentPage.value++
    scrollToPage(currentPage.value)
  }
}

const goToLastPage = () => {
  currentPage.value = numPages.value
  scrollToPage(numPages.value)
}

const scrollToPage = (pageNum) => {
  const pageElement = pdfContainer.value?.querySelector(`[data-page="${pageNum}"]`)
  if (pageElement) {
    pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Community-inspired PDF.js implementation with accurate text layer
const renderPageWithTextLayer = async (pdf, pageNumber, container) => {
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale: 1 })
  const containerWidth = pdfContainer.value.clientWidth - 40
  const scale = (containerWidth / viewport.width) * zoomLevel.value
  const scaledViewport = page.getViewport({ scale })

  // Create page wrapper
  const pageDiv = document.createElement('div')
  pageDiv.className = 'pdf-page-wrapper relative mb-4 mx-auto border border-gray-300 shadow-sm'
  pageDiv.setAttribute('data-page', pageNumber)
  pageDiv.style.width = scaledViewport.width + 'px'
  pageDiv.style.height = scaledViewport.height + 'px'

  // Canvas layer for PDF content
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = scaledViewport.width
  canvas.height = scaledViewport.height
  canvas.className = 'absolute top-0 left-0'

  // Text layer container
  const textLayerDiv = document.createElement('div')
  textLayerDiv.className = 'text-layer absolute top-0 left-0 overflow-hidden'
  textLayerDiv.style.width = scaledViewport.width + 'px'
  textLayerDiv.style.height = scaledViewport.height + 'px'

  pageDiv.appendChild(canvas)
  pageDiv.appendChild(textLayerDiv)
  container.appendChild(pageDiv)

  // Render PDF content to canvas
  await page.render({
    canvasContext: context,
    viewport: scaledViewport
  }).promise

  // Render text layer using community approach (inspired by react-pdf)
  try {
    const textContent = await page.getTextContent()
    
    // Use PDF.js TextLayer if available, otherwise fallback to manual
    if (typeof window !== 'undefined') {
      try {
        // Try to use PDF.js TextLayer (community approach)
        const { renderTextLayer } = await import('pdfjs-dist/build/pdf')
        
        await renderTextLayer({
          textContent,
          container: textLayerDiv,
          viewport: scaledViewport,
          textDivs: [],
          textContentItemsStr: [],
          enhanceTextSelection: true
        })
        
        // Store text content for search
        textLayers.value[pageNumber - 1] = textContent.items
        
      } catch (error) {
        console.warn('TextLayer not available, using manual implementation:', error)
        // Fallback to manual text positioning
        await renderManualTextLayer(textContent, textLayerDiv, scaledViewport, scale, pageNumber)
      }
    }
  } catch (error) {
    console.warn('Failed to render text layer for page', pageNumber, error)
  }

  return pageDiv
}

// Manual text layer as fallback (improved community approach)
const renderManualTextLayer = async (textContent, container, viewport, scale, pageNumber) => {
  const textItems = textContent.items
  textLayers.value[pageNumber - 1] = textItems
  
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment()
  
  textItems.forEach((item, index) => {
    if (!item.str || !item.str.trim()) return
    
    const textDiv = document.createElement('div')
    textDiv.textContent = item.str
    textDiv.className = 'absolute cursor-text select-text'
    
    // Get transform matrix values
    const tx = item.transform
    
    // Calculate font size more accurately
    const scaleX = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1])
    const scaleY = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3])
    const fontSize = scaleY
    
    // Calculate position with better baseline handling
    const x = tx[4]
    const y = tx[5]
    
    // Adjust for PDF coordinate system (bottom-up) to HTML (top-down)
    // and account for font baseline
    const adjustedY = viewport.height - y - (fontSize * 0.75) // 0.75 for proper baseline adjustment
    
    // Apply styles with improved positioning
    textDiv.style.left = x + 'px'
    textDiv.style.top = adjustedY + 'px'
    textDiv.style.fontSize = fontSize + 'px'
    textDiv.style.fontFamily = item.fontName || 'sans-serif'
    textDiv.style.transformOrigin = '0% 100%' // Bottom-left origin to match PDF
    textDiv.style.transform = scaleX !== scaleY ? `scaleX(${scaleX / scaleY})` : 'none'
    textDiv.style.color = 'rgba(0,0,0,0.2)' // Semi-transparent for selection
    textDiv.style.pointerEvents = 'auto'
    textDiv.style.whiteSpace = 'pre'
    textDiv.style.lineHeight = '1'
    textDiv.style.margin = '0'
    textDiv.style.padding = '0'
    
    // Data attributes for search
    textDiv.setAttribute('data-page', pageNumber)
    textDiv.setAttribute('data-item', index)
    
    fragment.appendChild(textDiv)
  })
  
  container.appendChild(fragment)
}

const renderAllPages = async (pdf) => {
  const container = pdfContainer.value.querySelector('.pdfViewerContainer')
  if (!container) return
  
  container.innerHTML = ''
  renderedPages.value = []
  textLayers.value = []
  
  // Render pages progressively for better performance
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const pageElement = await renderPageWithTextLayer(pdf, i, container)
      renderedPages.value.push({
        pageNumber: i,
        element: pageElement
      })
    } catch (error) {
      console.error(`Failed to render page ${i}:`, error)
    }
  }
}

const rerenderPages = async () => {
  if (!cachedPdf.value) return
  await renderAllPages(cachedPdf.value)
}

// Worker is set dynamically when pdfjs is imported in updatePdfView

// Chat functionality
const messages = ref([])
const chatInput = ref('')
let messageId = 0

// Enhanced search functionality (community approach)
const searchQuery = ref('')
const searchResults = ref([])
const currentSearchIndex = ref(-1)

const searchInPdf = async () => {
  if (!searchQuery.value.trim() || !textLayers.value.length) return
  
  searchResults.value = []
  currentSearchIndex.value = -1
  
  // Clear previous highlights
  const highlights = pdfContainer.value?.querySelectorAll('.search-highlight')
  highlights?.forEach(el => el.classList.remove('search-highlight', 'current-highlight'))
  
  const query = searchQuery.value.toLowerCase()
  
  // Search through text layers
  textLayers.value.forEach((pageItems, pageIndex) => {
    if (!pageItems) return
    
    pageItems.forEach((item, itemIndex) => {
      if (item.str && item.str.toLowerCase().includes(query)) {
        searchResults.value.push({
          page: pageIndex + 1,
          item: itemIndex,
          text: item.str,
          position: item.transform
        })
        
        // Highlight the text element
        const textElement = pdfContainer.value?.querySelector(
          `[data-page="${pageIndex + 1}"][data-item="${itemIndex}"]`
        )
        if (textElement) {
          textElement.classList.add('search-highlight')
        }
      }
    })
  })
  
  if (searchResults.value.length > 0) {
    currentSearchIndex.value = 0
    highlightCurrentResult()
  }
  
  console.log(`Found ${searchResults.value.length} search results`)
}

const highlightCurrentResult = () => {
  if (currentSearchIndex.value < 0 || currentSearchIndex.value >= searchResults.value.length) return
  
  // Remove current highlight from all elements
  const currentHighlights = pdfContainer.value?.querySelectorAll('.current-highlight')
  currentHighlights?.forEach(el => el.classList.remove('current-highlight'))
  
  const result = searchResults.value[currentSearchIndex.value]
  const textElement = pdfContainer.value?.querySelector(
    `[data-page="${result.page}"][data-item="${result.item}"]`
  )
  
  if (textElement) {
    textElement.classList.add('current-highlight')
    textElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    currentPage.value = result.page
  }
}

const findNext = () => {
  if (searchResults.value.length === 0) {
    searchInPdf()
    return
  }
  
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
  highlightCurrentResult()
}

const findPrevious = () => {
  if (searchResults.value.length === 0) {
    searchInPdf()
    return
  }
  
  currentSearchIndex.value = currentSearchIndex.value === 0 
    ? searchResults.value.length - 1 
    : currentSearchIndex.value - 1
  highlightCurrentResult()
}

const sendMessage = () => {
  const text = chatInput.value.trim()
  if (!text) return

  // Add user message
  messages.value.push({
    id: ++messageId,
    sender: 'user',
    text
  })

  chatInput.value = ''

  // Simulate bot response
  setTimeout(() => {
    messages.value.push({
      id: ++messageId,
      sender: 'bot',
      text: `This is a demo response about "${selectedReportId.value}". Connect to an AI service for real responses.`
    })
  }, 500)
}

const updatePdfView = async (fileName) => {
  // Ensure client runtime (avoid SSR errors)
  if (typeof window === 'undefined') return
  if (!fileName) return
  
  // Wait for pdfContainer to be available with retry logic
  let retries = 5
  while (!pdfContainer.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!pdfContainer.value) {
    console.error('PDF container not available after retries')
    return
  }
  
  try {
    isLoading.value = true
    progress.value = 0

    const url = await getDownloadUrl(fileName)
    if (!url) return
    
    // Import pdfjs on the client only to avoid SSR errors (DOMMatrix etc.)
    const pdfjsLib = (await import('pdfjs-dist/build/pdf'))
    // worker
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
    }

    const loadingTask = pdfjsLib.getDocument(url)
    loadingTask.onProgress = (data) => {
      if (data.total > 0) {
        progress.value = (data.loaded / data.total) * 100
      }
    }

    const pdf = await loadingTask.promise
    cachedPdf.value = pdf
    numPages.value = pdf.numPages
    currentPage.value = 1
    
    // Render all pages with community approach
    await renderAllPages(pdf)
    
    progress.value = 100
  } catch (e) {
    console.error('Failed to load PDF:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUserFiles()
  
  // Add keyboard shortcuts for PDF navigation
  const handleKeydown = (event) => {
    if (!cachedPdf.value) return
    
    switch (event.key) {
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        goToPreviousPage()
        break
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault()
        goToNextPage()
        break
      case 'Home':
        event.preventDefault()
        goToFirstPage()
        break
      case 'End':
        event.preventDefault()
        goToLastPage()
        break
      case '+':
      case '=':
        if (event.ctrlKey) {
          event.preventDefault()
          zoomIn()
        }
        break
      case '-':
        if (event.ctrlKey) {
          event.preventDefault()
          zoomOut()
        }
        break
      case 'f':
        if (event.ctrlKey) {
          event.preventDefault()
          document.querySelector('input[placeholder="Search in PDF..."]')?.focus()
        }
        break
    }
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    
    // Clean up rendered pages and text layers
    renderedPages.value = []
    textLayers.value = []
    cachedPdf.value = null
  })
})
</script>

<style scoped>
/* keep styles minimal; tailwind classes used where available */
html {
  scroll-padding-top: 70px; /* Adjust this value to match your header height */
}

/* PDF.js viewer container */
.pdfViewerContainer {
  overflow: auto;
  width: 100%;
  height: 100%;
  padding: 10px;
}

/* Page wrappers (community approach) */
:deep(.pdf-page-wrapper) {
  position: relative;
  margin: 0 auto 20px auto;
}

/* Text layer for accurate selection (inspired by react-pdf) */
:deep(.text-layer) {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  line-height: 1;
  user-select: text;
  pointer-events: none;
}

:deep(.text-layer > div) {
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
  pointer-events: auto;
  user-select: text;
}

/* Search highlights (community style) */
:deep(.search-highlight) {
  background-color: rgba(255, 255, 0, 0.4) !important;
  color: rgba(0, 0, 0, 0.8) !important;
  border-radius: 2px;
  box-shadow: 0 0 1px rgba(255, 255, 0, 0.8);
}

:deep(.current-highlight) {
  background-color: rgba(255, 150, 0, 0.6) !important;
  color: rgba(0, 0, 0, 0.9) !important;
  border-radius: 2px;
  box-shadow: 0 0 3px rgba(255, 150, 0, 0.8);
}

/* Selection styles (cross-browser) */
:deep(.text-layer ::selection) {
  background-color: rgba(0, 100, 200, 0.3);
}

:deep(.text-layer ::-moz-selection) {
  background-color: rgba(0, 100, 200, 0.3);
}

:deep(.text-layer ::-webkit-selection) {
  background-color: rgba(0, 100, 200, 0.3);
}

/* Page canvas styling */
:deep(.pdf-page-wrapper canvas) {
  display: block;
  border-radius: 2px;
}

/* Loading states */
:deep(.pdf-page-wrapper.loading) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
