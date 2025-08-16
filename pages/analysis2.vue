<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex" :style="{ paddingTop: headerPadding + 'px' }">
    <!-- Sidebar -->
    <aside :class="['transition-all duration-200 bg-gray-800 border-r border-gray-700']" :style="{ width: open ? '18rem' : '5rem' }">
      <div class="h-full flex flex-col">
        <div class="p-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="bg-green-500 h-8 w-8 rounded"></div>
            <span v-if="open" class="font-semibold">Analysis</span>
          </div>
          <button
            @click="toggle"
            :aria-label="open ? 'Collapse sidebar' : 'Expand sidebar'"
            class="w-8 h-8 inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/20 hover:bg-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transform transition-transform"
              :class="open ? 'rotate-0' : 'rotate-180'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav class="px-2 py-4 space-y-1">
          <a class="flex items-center gap-3 p-2 rounded hover:bg-gray-700" href="#">
            <svg class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18"/></svg>
            <span v-if="open">Reports</span>
          </a>
          <a class="flex items-center gap-3 p-2 rounded hover:bg-gray-700" href="#">
            <svg class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            <span v-if="open">Settings</span>
          </a>
        </nav>

        <!-- Upload area -->
        <div class="px-3 py-2 border-t border-gray-700">
          <label class="block text-xs text-gray-400 mb-2" v-if="open">Upload PDF</label>
          <input v-if="open" type="file" accept="application/pdf" @change="handleFileChange" class="w-full text-sm text-gray-200 bg-gray-900/30 p-2 rounded" />
        </div>

        <!-- Your Reports -->
        <div class="px-2 py-3 border-t border-gray-700">
          <div class="text-xs text-gray-400 mb-2" v-if="open">Your Reports</div>
          <div class="space-y-1 max-h-40 overflow-y-auto">
            <div v-for="file in uploadedFiles" :key="file.id" class="flex items-center justify-between p-2 rounded hover:bg-gray-700">
              <div class="truncate text-sm text-gray-200">{{ file.name }}</div>
              <div class="flex items-center gap-2">
                <button @click.prevent="openReport(file.name)" class="text-xs text-green-400 hover:underline">Open</button>
                <button @click.prevent="removeFile(file.name)" class="text-xs text-red-400 hover:underline">Del</button>
              </div>
            </div>
            <div v-if="!uploadedFiles || uploadedFiles.length === 0" class="text-xs text-gray-500 px-2">No reports</div>
          </div>
        </div>

        <div class="mt-auto p-3 text-sm text-gray-400">v1 — minimal</div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <div v-if="!selectedReportId" class="space-y-4">
        <h1 class="text-2xl font-semibold">Analysis (minimal)</h1>
        <p class="text-gray-300">Select a report from the sidebar to view and process it.</p>
      </div>

      <div v-else-if="selectedReportId && !selectedReport" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-green-400 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <div class="text-gray-300">Loading report...</div>
      </div>

      <div v-else class="space-y-4">
        <ReportHeader :selectedReport="displayReport" @pdf-processed="onPdfProcessed" @pdf-view-requested="onPdfViewRequested" />

        <!-- Tabs -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg">
          <div class="border-b border-gray-700 px-4">
            <nav class="flex space-x-2" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="[ 'py-2 px-3 text-sm rounded-t', activeTab === tab.id ? 'bg-gray-900 text-green-400' : 'text-gray-400 hover:text-gray-200' ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <div class="p-4">
            <!-- Overview -->
            <div v-if="activeTab === 'overview'" class="min-h-[300px]">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="text-lg font-medium text-gray-100">Overview</h3>
                  <p class="text-sm text-gray-400">Process and inspect the selected PDF.</p>
                </div>
                <div>
                  <button @click="handleProcessPdf(displayReport?.name)" :disabled="isProcessing" class="btn-auth">
                    {{ isProcessing ? 'Processing...' : 'Process Report' }}
                  </button>
                </div>
              </div>

              <div v-if="hasPdf" class="border border-gray-700 rounded-lg overflow-hidden">
                <div ref="pdfContainer" class="w-full h-[720px] overflow-auto p-2" v-show="hasPdf"></div>
                <div v-show="!hasPdf" class="p-4 text-sm text-gray-400 flex items-center justify-center">
                  <span v-if="displayReport">Loading PDF...</span>
                  <span v-else>PDF not available.</span>
                  <button v-if="displayReport" @click="updatePdfUrl()" class="ml-2 text-green-400 hover:underline">Retry</button>
                </div>
              </div>
            </div>

            <!-- Text -->
            <div v-else-if="activeTab === 'text'">
              <div v-if="extractedText">
                <h4 class="text-sm text-gray-200 mb-2">Extracted Text</h4>
                <pre class="whitespace-pre-wrap text-gray-300 text-sm max-h-64 overflow-y-auto">{{ extractedText }}</pre>
              </div>
              <div v-else class="text-sm text-gray-400">No text extracted yet.</div>
            </div>

            <!-- Images -->
            <div v-else-if="activeTab === 'images'">
              <div v-if="extractedImages && extractedImages.length">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div v-for="(img, i) in extractedImages" :key="i" class="border border-gray-700 rounded overflow-hidden">
                    <img :src="img" class="w-full h-40 object-cover" />
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400">No images extracted.</div>
            </div>

            <!-- Analysis -->
            <div v-else-if="activeTab === 'analysis'">
              <div v-if="summarizedIssues && summarizedIssues.length">
                <div v-for="(issue, idx) in summarizedIssues" :key="idx" class="p-2 border-b border-gray-700">
                  <div class="text-sm text-gray-100">{{ issue.issue }}</div>
                  <div class="text-xs text-gray-400">{{ issue.description }}</div>
                </div>
              </div>
              <div v-else-if="gensimSummary" class="text-sm text-gray-300">{{ gensimSummary }}</div>
              <div v-else class="text-sm text-gray-400">No analysis available.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFileUpload } from '@/composables/useFileUpload'
import { useAnalysisState } from '@/composables/useAnalysisState'
import { usePdfProcessor } from '@/composables/usePdfProcessor'
import ReportHeader from '~/components/analysis/ReportHeader.vue'
import { useAnalysisTools } from '@/composables/useAnalysisTools'

const open = ref(true)
const toggle = () => { open.value = !open.value }

// Compute header height so content sits immediately below fixed header
const headerPadding = ref(0)

const updateHeaderPadding = () => {
  const headerEl = document.querySelector('header')
  headerPadding.value = headerEl ? headerEl.offsetHeight : 0
}

onMounted(() => {
  updateHeaderPadding()
  window.addEventListener('resize', updateHeaderPadding)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderPadding)
})

// File upload composable
const { uploadedFiles, handleFileSelect, uploadPdf, deletePdf, fetchUserFiles } = useFileUpload()
const router = useRouter()

const handleFileChange = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  if (handleFileSelect(file)) {
    await uploadPdf()
    await fetchUserFiles()
  }
}

const openReport = async (fileName) => {
  try {
    // Select report locally and switch to overview
    analysisState.selectReport(fileName)
    setActiveTab('overview')
    
    // Use nextTick to ensure DOM has updated before continuing
    await nextTick()
    
    // Wait a bit longer for good measure since the DOM needs to fully render
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Set flag to ensure we know we want PDF to display
    hasPdf.value = false
    
    // update PDF display
    await updatePdfUrl()
  } catch (err) {
    console.error('Error opening report:', err)
  }
}

const removeFile = async (fileName) => {
  if (!confirm('Delete ' + fileName + '?')) return
  try {
    await deletePdf(fileName)
    await fetchUserFiles()
  } catch (e) {
    console.error(e)
  }
}

// Analysis and PDF processing
const analysisState = useAnalysisState()
const pdfProcessor = usePdfProcessor()
const { selectedReportId, selectedReport, tabs, activeTab, setActiveTab } = analysisState
const { extractedText, extractedImages, isProcessing, processPdf } = pdfProcessor

// analysis tools outputs (summaries)
const { summarizedIssues, gensimSummary } = useAnalysisTools()

const handleProcessPdf = async (fileName) => {
  await processPdf(fileName)
}

const onPdfProcessed = () => { console.log('processed') }
const onPdfViewRequested = () => { console.log('view') }

// Fetch files on mount to populate list
onMounted(() => { fetchUserFiles() })

// computed selectedReport (fallback if analysisState.selectedReport isn't reactive to composable instance)
const computedSelectedReport = computed(() => {
  if (!selectedReportId.value) return null
  return uploadedFiles.value.find(f => f.id === selectedReportId.value || f.name === selectedReportId.value) || null
})

const displayReport = computed(() => selectedReport.value || computedSelectedReport.value)

// PDF viewing
const pdfContainer = ref(null)
const hasPdf = ref(false)
const getDownloadUrl = useFileUpload().getDownloadUrl

const clearPdfContainer = () => {
  if (!pdfContainer.value) return
  pdfContainer.value.innerHTML = ''
  hasPdf.value = false
}

const renderPdfBlob = async (blob) => {
  try {
    clearPdfContainer()
    
    // Wait for Vue to complete the next rendering cycle
    await nextTick()
    
    // Ensure PDF container is visible first by checking if it's in the DOM
    let attempts = 0
    const maxAttempts = 10  // Increased from 5 to 10
    
    while (!pdfContainer.value && attempts < maxAttempts) {
      console.log(`Waiting for PDF container, attempt ${attempts + 1}/${maxAttempts}`)
      // Longer wait between attempts
      await new Promise(resolve => setTimeout(resolve, 200))
      await nextTick()
      attempts++
    }
    
    // Final check before proceeding
    if (!pdfContainer.value) {
      console.warn('PDF container not available after multiple attempts')
      hasPdf.value = false
      return
    }
    
    const arrayBuffer = await blob.arrayBuffer()
    
    // Use CDN for PDF.js to avoid Vite import resolution issues
    if (!window.pdfjsLib) {
      // Load PDF.js from CDN if not already loaded
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.min.js'
      script.async = true
      
      // Wait for script to load
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
      
      // Set the worker source using CDN
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'
    }
    
    // Use the globally loaded PDF.js library
    const pdfjsLib = window.pdfjsLib

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    // Check container again after async operations in case component was unmounted
    const container = pdfContainer.value
    if (!container) {
      console.warn('PDF container no longer available after PDF loaded')
      return
    }
    
    // Render all pages sequentially
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      // Check container still exists on each iteration
      if (!pdfContainer.value) break
      
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.display = 'block'
      canvas.style.margin = '0 auto 12px'
      pdfContainer.value.appendChild(canvas)
      const ctx = canvas.getContext('2d')
      const renderContext = { canvasContext: ctx, viewport }
      await page.render(renderContext).promise
    }
    
    // Only set hasPdf to true if container still exists
    if (pdfContainer.value) {
      hasPdf.value = true
    }
  } catch (err) {
    console.error('PDF render failed', err)
    clearPdfContainer()
  }
}

const updatePdfUrl = async () => {
  const report = displayReport.value
  if (!report) {
    clearPdfContainer()
    return
  }
  try {
    const signed = await getDownloadUrl(report.name)
    if (!signed) {
      clearPdfContainer()
      return
    }
    const res = await fetch(signed)
    if (!res.ok) throw new Error('Failed to download PDF')
    const blob = await res.blob()
    await renderPdfBlob(blob)
  } catch (e) {
    console.error('Failed to fetch PDF or render', e)
    clearPdfContainer()
  }
}

watch(() => displayReport.value && displayReport.value.name, () => updatePdfUrl())
onMounted(() => updatePdfUrl())

// Add auto-retry logic to update PDF when tab changes
watch(() => activeTab, async (newTab) => {
  if (newTab === 'overview' && displayReport.value) {
    // Small delay to let the DOM update with the tab content
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Check if we need to retry loading the PDF
    if (displayReport.value && !hasPdf.value) {
      console.log('Tab changed to overview, retrying PDF load')
      updatePdfUrl()
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* keep styles minimal; tailwind classes used where available */
</style>
