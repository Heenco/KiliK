<template>
  <div class="pdf-viewer-container">
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <div>Loading PDF viewer...</div>
    </div>

    <div v-if="error" class="error-message">
      <p>Failed to load PDF viewer. {{ errorMessage }}</p>
      <Button variant="outline" size="sm" class="mt-2" @click="reload">Try Again</Button>
    </div>

    <div v-if="!error && !useIframeFallback" class="viewer-content">
      <component v-if="PdfComp" :is="PdfComp" :src="embeddedUrl" :worker-src="workerUrl" style="width:100%;height:80vh;"/>
    </div>

    <div v-if="useIframeFallback" class="viewer-content">
      <iframe :src="embeddedUrl" class="pdf-iframe" frameborder="0" style="width:100%;height:80vh;"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Button from '~/components/ui/button/Button.vue'

const props = defineProps({ url: { type: String, required: true } })

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const PdfComp = ref(null)
const workerUrl = ref('')
const useIframeFallback = ref(false)
const workerBlobUrlRef = { url: null }

const embeddedUrl = computed(() => {
  const timestamp = new Date().getTime()
  return `${props.url}${props.url.includes('?') ? '&' : '?'}_t=${timestamp}`
})

const reload = () => {
  // Reset and retry
  loading.value = true
  error.value = false
  errorMessage.value = ''
  useIframeFallback.value = false
  initViewer()
}

const initViewer = async () => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('Viewer must run in the browser')
    }

    // Dynamically import vue3-pdfjs first
    const [{ default: wrapperModule } = {}] = await Promise.all([
      import('vue3-pdfjs')
    ])

    PdfComp.value = wrapperModule || null

    // Try to resolve a worker URL: prefer .js for broader browser compatibility
    let workerAssetUrl = null
    try {
      const w = await import('pdfjs-dist/legacy/build/pdf.worker.min.js?url')
      workerAssetUrl = w && (w.default || w)
      console.log('Using pdf.worker.min.js via vite ?url')
    } catch (e1) {
      try {
        const w2 = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
        workerAssetUrl = w2 && (w2.default || w2)
        console.log('Using pdf.worker.min.mjs via vite ?url')
      } catch (e2) {
        console.warn('Could not import worker via ?url, will fallback to /pdf.worker.min.js or /pdf.worker.min.mjs', e1, e2)
        // Fallback to public paths — ensure these files exist in /public
        workerAssetUrl = '/pdf.worker.min.js'
      }
    }

    // If Chrome warns about non-JS module files or the worker is an mjs, create a blob URL with application/javascript
    try {
      // Heuristic: if the resolved URL ends with .mjs or the UA indicates Chrome and warning was seen,
      // fetch the worker and create a blob URL with JS MIME type to avoid deprecation warnings.
      const isMjs = workerAssetUrl && workerAssetUrl.endsWith('.mjs')
      if (isMjs) {
        const resp = await fetch(workerAssetUrl)
        if (resp.ok) {
          const text = await resp.text()
          const blob = new Blob([text], { type: 'application/javascript' })
          const blobUrl = URL.createObjectURL(blob)
          workerBlobUrlRef.url = blobUrl
          workerUrl.value = blobUrl
          console.log('Created blob worker URL to avoid non-JS module warning')
        } else {
          workerUrl.value = workerAssetUrl
        }
      } else {
        workerUrl.value = workerAssetUrl
      }
    } catch (e) {
      console.warn('Creating blob worker URL failed, falling back to asset URL', e)
      workerUrl.value = workerAssetUrl
    }

    // Some wrappers require global workerSrc set on pdfjs. Try to set it if available globally
    try {
      const pdfjs = window.pdfjsLib
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.value
        console.log('Set global pdfjs workerSrc to', workerUrl.value)
      }
    } catch (e) {
      console.warn('Could not set global workerSrc', e)
    }

    loading.value = false
  } catch (err) {
    console.error('Failed to load vue3-pdfjs', err)
    // Fallback to native embed for maximum compatibility
    error.value = true
    errorMessage.value = err?.message || String(err)
    useIframeFallback.value = true
    loading.value = false
  }
}

onMounted(() => initViewer())

onBeforeUnmount(() => {
  try {
    if (workerBlobUrlRef.url) {
      URL.revokeObjectURL(workerBlobUrlRef.url)
      workerBlobUrlRef.url = null
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.pdf-viewer-container { position: relative; width: 100%; }
.loading-indicator, .error-message { display:flex; align-items:center; justify-content:center; padding:16px }
.pdf-iframe { width:100%; height:80vh; border:0 }
</style>
