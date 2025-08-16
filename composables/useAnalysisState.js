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
    console.log('selectedReport computed triggered')
    console.log('selectedReportId.value:', selectedReportId.value)
    console.log('fileUpload.uploadedFiles.value:', fileUpload.uploadedFiles.value)
    
    if (!selectedReportId.value) {
      console.log('No selectedReportId, returning null')
      return null
    }
    
    if (!fileUpload.uploadedFiles.value || !fileUpload.uploadedFiles.value.length) {
      console.log('No uploadedFiles, returning null')
      return null
    }
    
    const report = fileUpload.uploadedFiles.value.find(file => 
      file.id === selectedReportId.value || file.name === selectedReportId.value
    )
    
    console.log('Found report:', report)
    return report || null
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
    console.log('selectReport called with:', reportId)
    selectedReportId.value = reportId
    console.log('selectedReportId.value is now:', selectedReportId.value)
  }

  const setActiveTab = (tabId) => {
    activeTab.value = tabId
  }

  const clearAllResults = () => {
    pdfProcessor.clearProcessingResults()
    analysisTools.clearAnalysisResults()
  }

  // Watch for selectedReportId changes and clear analysis data
  watch(selectedReportId, (newId, oldId) => {
    if (newId !== oldId) {
      clearAllResults()
    }
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
