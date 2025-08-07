<template>
  <div class="pdf-viewer-container">
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <div>Loading PDF...</div>
    </div>
    <div v-if="error" class="error-message">
      <p>Failed to load PDF. {{ errorMessage }}</p>
      <Button variant="outline" size="sm" class="mt-2" @click="reload">Try Again</Button>
    </div>
    
    <!-- Using @i2d/nuxt-pdf-frame component -->
    <ClientOnly v-if="!loading && !error">
      <PDFFrame 
        :src="embeddedUrl" 
        :page="currentPage" 
        @loaded="onPdfLoaded" 
        @error="onPdfError"
        @pageChanged="handlePageChange"
        class="pdf-frame"
      />
      <div v-if="totalPages > 0" class="pdf-controls">
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="currentPage <= 1" 
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          Previous
        </Button>
        <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="currentPage >= totalPages" 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          Next
        </Button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Button from '~/components/ui/button/Button.vue';

// Props
const props = defineProps({
  url: {
    type: String,
    required: true
  }
});

// Reactive state
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const currentPage = ref(1);
const totalPages = ref(0);

// Computed Properties
const embeddedUrl = computed(() => {
  // Add cache-busting parameter to prevent caching issues
  const timestamp = new Date().getTime();
  const urlWithTimestamp = `${props.url}${props.url.includes('?') ? '&' : '?'}_t=${timestamp}`;
  return urlWithTimestamp;
});

// PDF frame event handlers
const onPdfLoaded = (pdfDoc) => {
  loading.value = false;
  error.value = false;
  totalPages.value = pdfDoc.numPages || 0;
};

const onPdfError = (err) => {
  console.error('Error loading PDF:', err);
  loading.value = false;
  error.value = true;
  errorMessage.value = 'Failed to load the PDF. The file might be corrupted or the server might be unavailable.';
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// Reload functionality
const reload = () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  currentPage.value = 1;
};

// Watch for URL changes
watch(() => props.url, () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  currentPage.value = 1;
});

// Initialize when component mounts
onMounted(() => {
  if (props.url) {
    loading.value = true;
  }
});
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 800px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  overflow: hidden;
  position: relative;
}

.loading-indicator,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: #4b5563;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f9fafb;
  z-index: 10;
}

.error-message {
  text-align: center;
  color: #ef4444;
}

.mt-2 {
  margin-top: 0.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pdf-frame {
  flex: 1;
  width: 100%;
  height: calc(100% - 40px);
  border: none;
}

.pdf-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.page-indicator {
  margin: 0 10px;
  font-size: 14px;
  color: #4b5563;
}
</style>
