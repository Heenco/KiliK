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
  const isAnalyzingOllama = ref(false)
  const ollamaStatus = ref('')
  const ollamaSummary = ref('')
  
  // Chat state
  const chatMessages = ref([])
  const isChatting = ref(false)
  const chatError = ref('')

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

  // Ollama Analysis (all chunks processed sequentially)
  const analyzeWithOllama = async (text) => {
    if (!text || isAnalyzingOllama.value) return false
    
    console.log('Starting Ollama analysis with text length:', text.length);
    isAnalyzingOllama.value = true
    ollamaStatus.value = 'Processing document in chunks with Ollama llama3...'
    ollamaSummary.value = ''
    
    try {
      const response = await fetch('/api/summarize-ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      console.log('Ollama response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Ollama fetch error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}` || 'Failed to analyze text')
      }

      const result = await response.json()
      console.log('Ollama result:', result);
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      ollamaSummary.value = result.summary || ''
      ollamaStatus.value = ollamaSummary.value 
        ? 'Ollama llama3 analysis complete (all sections processed)' 
        : 'No summary generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing text with Ollama:', error)
      ollamaStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`
      ollamaSummary.value = ''
      return false
    } finally {
      isAnalyzingOllama.value = false
    }
  }

  // Chat with Ollama
  const sendChatMessage = async (message, reportContext = null) => {
    if (!message?.trim() || isChatting.value) return false
    
    console.log('Sending chat message:', message);
    isChatting.value = true
    chatError.value = ''
    
    // Add user message to chat immediately
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    }
    chatMessages.value.push(userMessage)
    
    try {
      // Prepare context from current report
      const context = {
        text: reportContext?.extractedText || '',
        metadata: reportContext?.pdfMetadata || null,
        images: reportContext?.extractedImages || [],
        analysisResults: {
          issues: summarizedIssues.value,
          gensimSummary: gensimSummary.value,
          ollamaSummary: ollamaSummary.value
        }
      }
      
      const response = await fetch('/api/chat-ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          reportContext: context,
          conversationHistory: chatMessages.value.slice(-10) // Last 10 messages
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant',
        content: result.response || 'I apologize, but I didn\'t generate a response.',
        timestamp: Date.now()
      }
      chatMessages.value.push(assistantMessage)
      
      return true
    } catch (error) {
      console.error('Error in chat:', error)
      chatError.value = error.message || 'Unknown error during chat'
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${chatError.value}`,
        timestamp: Date.now()
      }
      chatMessages.value.push(errorMessage)
      
      return false
    } finally {
      isChatting.value = false
    }
  }

  // Clear chat history
  const clearChatHistory = () => {
    chatMessages.value = []
    chatError.value = ''
  }

  // Clear all analysis results
  const clearAnalysisResults = () => {
    summarizedIssues.value = []
    summarizeStatus.value = ''
    openAIStatus.value = ''
    gensimStatus.value = ''
    gensimSummary.value = ''
    ollamaStatus.value = ''
    ollamaSummary.value = ''
    isSummarizing.value = false
    isAnalyzingOpenAI.value = false
    isAnalyzingGensim.value = false
    isAnalyzingOllama.value = false
    // Don't clear chat on analysis clear
  }

  // Get analysis summary
  const getAnalysisSummary = () => {
    const hasIssues = summarizedIssues.value.length > 0
    const hasSummary = !!gensimSummary.value
    const hasOllamaSummary = !!ollamaSummary.value
    const hasAnalysis = hasIssues || hasSummary || hasOllamaSummary
    
    return {
      hasAnalysis,
      issuesCount: summarizedIssues.value.length,
      hasSummary,
      hasOllamaSummary,
      isProcessing: isSummarizing.value || isAnalyzingOpenAI.value || isAnalyzingGensim.value || isAnalyzingOllama.value
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
    isAnalyzingOllama,
    ollamaStatus,
    ollamaSummary,
    
    // Chat state
    chatMessages,
    isChatting,
    chatError,
    
    // Methods
    summarizeText,
    analyzeWithOpenAI,
    analyzeWithGensim,
    analyzeWithOllama,
    clearAnalysisResults,
    
    // Chat methods
    sendChatMessage,
    clearChatHistory,
    getAnalysisSummary
  }
}
