import { ref } from 'vue'

export const useAnalysisTools = () => {
  // State
  const summarizedIssues = ref([])
  const isSummarizing = ref(false)
  const summarizeStatus = ref('')
  const isAnalyzingOpenAI = ref(false)
  const openAIStatus = ref('')
  const isAnalyzingGensim = ref(false)
  const gensimStatus = ref('')
  const gensimSummary = ref('')

  // Python NLTK Analysis
  const summarizeText = async (text) => {
    if (!text || isSummarizing.value) return false
    
    isSummarizing.value = true
    summarizeStatus.value = 'Analyzing text for issues...'
    summarizedIssues.value = []
    
    try {
      const response = await fetch('/api/summarize-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to summarize text')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      summarizedIssues.value = result.issues || []
      summarizeStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`
      
      return true
    } catch (error) {
      console.error('Error summarizing text:', error)
      summarizeStatus.value = `Error: ${error.message || 'Unknown error during summarization'}`
      summarizedIssues.value = []
      return false
    } finally {
      isSummarizing.value = false
    }
  }

  // OpenAI GPT-4 Analysis
  const analyzeWithOpenAI = async (text) => {
    if (!text || isAnalyzingOpenAI.value) return false
    
    isAnalyzingOpenAI.value = true
    openAIStatus.value = 'Analyzing text with OpenAI GPT-4...'
    summarizedIssues.value = []
    
    try {
      const response = await fetch('/api/summarize-issues-fixed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      summarizedIssues.value = result.issues || []
      openAIStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`
      
      return true
    } catch (error) {
      console.error('Error analyzing text with OpenAI:', error)
      openAIStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`
      summarizedIssues.value = []
      return false
    } finally {
      isAnalyzingOpenAI.value = false
    }
  }

  // Gensim Analysis
  const analyzeWithGensim = async (text) => {
    if (!text || isAnalyzingGensim.value) return false
    
    isAnalyzingGensim.value = true
    gensimStatus.value = 'Analyzing text with Gensim...'
    gensimSummary.value = ''
    
    try {
      const response = await fetch('/api/summarize-gensim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      gensimSummary.value = result.summary || ''
      gensimStatus.value = gensimSummary.value 
        ? 'Text summarized successfully' 
        : 'No summary generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing text with Gensim:', error)
      gensimStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`
      gensimSummary.value = ''
      return false
    } finally {
      isAnalyzingGensim.value = false
    }
  }

  // Clear all analysis results
  const clearAnalysisResults = () => {
    summarizedIssues.value = []
    summarizeStatus.value = ''
    openAIStatus.value = ''
    gensimStatus.value = ''
    gensimSummary.value = ''
    isSummarizing.value = false
    isAnalyzingOpenAI.value = false
    isAnalyzingGensim.value = false
  }

  // Get analysis summary
  const getAnalysisSummary = () => {
    const hasIssues = summarizedIssues.value.length > 0
    const hasSummary = !!gensimSummary.value
    const hasAnalysis = hasIssues || hasSummary
    
    return {
      hasAnalysis,
      issuesCount: summarizedIssues.value.length,
      hasSummary,
      isProcessing: isSummarizing.value || isAnalyzingOpenAI.value || isAnalyzingGensim.value
    }
  }

  return {
    // State
    summarizedIssues,
    isSummarizing,
    summarizeStatus,
    isAnalyzingOpenAI,
    openAIStatus,
    isAnalyzingGensim,
    gensimStatus,
    gensimSummary,
    
    // Methods
    summarizeText,
    analyzeWithOpenAI,
    analyzeWithGensim,
    clearAnalysisResults,
    getAnalysisSummary
  }
}
