<template>
  <Card class="border border-border bg-card/50 backdrop-blur shadow-xl mb-4">
    <CardContent class="p-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg text-foreground font-semibold leading-tight truncate">{{ displayName }}</h2>
          <p class="text-xs text-muted-foreground">Uploaded {{ formatDate(selectedReport.created_at) }}</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="handleViewPdf" 
            class="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/50"
            title="View PDF"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          <button 
            @click="handleProcessPdf" 
            :disabled="isProcessing"
            class="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="isProcessing ? 'Processing...' : 'Process Report'"
          >
            <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent } from '~/components/ui/card'
import { computed } from 'vue'

// Props
const props = defineProps({
  selectedReport: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['pdf-processed', 'pdf-view-requested'])

// Composables
const { isProcessing, processPdf, viewPdf } = usePdfProcessor()
const { formatDate } = useFileUpload()

// Create a displayName that replaces underscores with spaces
const displayName = computed(() => {
  try {
    const name = props && props.selectedReport && props.selectedReport.name ? String(props.selectedReport.name) : ''
    return name.replace(/_/g, ' ')
  } catch (e) {
    return ''
  }
})

// Methods
const handleProcessPdf = async () => {
  const success = await processPdf(props.selectedReport.name)
  if (success) {
    emit('pdf-processed')
  }
}

const handleViewPdf = async () => {
  try {
    await viewPdf(props.selectedReport.name)
    emit('pdf-view-requested')
  } catch (error) {
    alert('Failed to download file: ' + (error.message || 'Unknown error'))
  }
}
</script>

<style scoped>
/* Spinning animation for processing indicator */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}
</style>
