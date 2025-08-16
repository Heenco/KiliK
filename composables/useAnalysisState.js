import { ref, computed, watch } from 'vue'

export const useAnalysisState = () => {
  // Global state
  const selectedReportId = ref('')
  const activeTab = ref('overview')

  // Get composables
  const fileUpload = useFileUpload()
  const pdfProcessor = usePdfProcessor()
  const analysisTools = useAnalysisTools()

  // Computed properties
  const selectedReport = computed(() => {
    return fileUpload.uploadedFiles.value.find(file => file.id === selectedReportId.value) || null
  })

  // Tab configuration
  const tabs = computed(() => {
    const analysisSummary = analysisTools.getAnalysisSummary()
    
    return [
      { 
        id: 'overview', 
        name: 'Overview', 
        icon: 'overview-icon',
        badge: null
      },
      { 
        id: 'text', 
        name: 'Text', 
        icon: 'text-icon',
        badge: pdfProcessor.extractedText.value ? '1' : null
      },
      { 
        id: 'images', 
        name: 'Images', 
        icon: 'images-icon',
        badge: pdfProcessor.extractedImages.value.length || null
      },
      { 
        id: 'analysis', 
        name: 'Analysis', 
        icon: 'analysis-icon',
        badge: (analysisSummary.issuesCount || (analysisSummary.hasSummary ? 1 : 0)) || null
      }
    ]
  })

  // Actions
  const selectReport = (reportId) => {
    selectedReportId.value = reportId
    // Clear current analysis data when switching reports
    clearAllResults()
  }

  const setActiveTab = (tabId) => {
    activeTab.value = tabId
  }

  const clearAllResults = () => {
    pdfProcessor.clearProcessingResults()
    analysisTools.clearAnalysisResults()
  }

  // Watch for selectedReportId changes and clear analysis data
  watch(selectedReportId, () => {
    clearAllResults()
  })

  // Get current state summary
  const getCurrentState = () => {
    return {
      hasSelectedReport: !!selectedReport.value,
      hasExtractedContent: !!(pdfProcessor.extractedText.value || pdfProcessor.extractedImages.value.length > 0),
      isProcessing: pdfProcessor.isProcessing.value,
      analysis: analysisTools.getAnalysisSummary(),
      activeTab: activeTab.value
    }
  }

  return {
    // State
    selectedReportId,
    activeTab,
    selectedReport,
    tabs,
    
    // Actions
    selectReport,
    setActiveTab,
    clearAllResults,
    getCurrentState
  }
}
