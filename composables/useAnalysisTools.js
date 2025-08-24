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
  const isAnalyzingDeepInfra = ref(false)
  const deepInfraStatus = ref('')
  const deepInfraSummary = ref('')
  
  // Image analysis state
  const isAnalyzingImages = ref(false)
  const imageAnalysisStatus = ref('')
  const imageAnalysisResult = ref('')

  // Layout analysis state
  const isAnalyzingLayout = ref(false)
  const layoutAnalysisStatus = ref('')
  const layoutAnalysisResult = ref('')

  // PDF analysis state
  const isAnalyzingPdf = ref(false)
  const pdfAnalysisStatus = ref('')
  const pdfAnalysisResult = ref('')
  
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

  // DeepInfra Analysis
  const analyzeWithDeepInfra = async (text) => {
    if (!text || isAnalyzingDeepInfra.value) return false
    
    console.log('Starting DeepInfra analysis with text length:', text.length);
    isAnalyzingDeepInfra.value = true
    deepInfraStatus.value = 'Analyzing with DeepInfra Qwen2.5-VL-32B...'
    deepInfraSummary.value = ''
    
    try {
      const response = await fetch('/api/summarize-deepinfra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      console.log('DeepInfra response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text()
        console.error('DeepInfra fetch error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}` || 'Failed to analyze text')
      }

      const result = await response.json()
      console.log('DeepInfra result:', result);
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      deepInfraSummary.value = result.summary || ''
      deepInfraStatus.value = deepInfraSummary.value 
        ? 'DeepInfra analysis complete' 
        : 'No summary generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing text with DeepInfra:', error)
      deepInfraStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`
      deepInfraSummary.value = ''
      return false
    } finally {
      isAnalyzingDeepInfra.value = false
    }
  }

  // DeepInfra Image Analysis
  const analyzeImagesWithDeepInfra = async (images, extractedText = '') => {
    if (!images || !Array.isArray(images) || images.length === 0 || isAnalyzingImages.value) {
      return false
    }
    
    console.log('Starting DeepInfra image analysis with', images.length, 'images');
    isAnalyzingImages.value = true
    imageAnalysisStatus.value = `Analyzing ${Math.min(images.length, 5)} images with DeepInfra Qwen2.5-VL...`
    imageAnalysisResult.value = ''
    
    try {
      const response = await fetch('/api/analyze-images-deepinfra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images: images.slice(0, 5), // Limit to 5 images
          text: extractedText 
        }),
      })

      console.log('DeepInfra image analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text()
        console.error('DeepInfra image analysis fetch error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}` || 'Failed to analyze images')
      }

      const result = await response.json()
      console.log('DeepInfra image analysis result:', result);
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      imageAnalysisResult.value = result.analysis || ''
      imageAnalysisStatus.value = result.analysis 
        ? `Image analysis complete (${result.imagesAnalyzed || 0} images analyzed)` 
        : 'No analysis generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing images with DeepInfra:', error)
      imageAnalysisStatus.value = `Error: ${error.message || 'Unknown error during image analysis'}`
      imageAnalysisResult.value = ''
      return false
    } finally {
      isAnalyzingImages.value = false
    }
  }

  // DeepInfra Layout Analysis
  const analyzeLayoutWithDeepInfra = async (images, extractedText = '') => {
    if (!images || !Array.isArray(images) || images.length === 0 || isAnalyzingLayout.value) {
      return false
    }
    
    console.log('Starting DeepInfra layout analysis with', images.length, 'images');
    isAnalyzingLayout.value = true
    layoutAnalysisStatus.value = `Analyzing layout of ${Math.min(images.length, 5)} images with DeepInfra Qwen2.5-VL...`
    layoutAnalysisResult.value = ''
    
    try {
      const response = await fetch('/api/analyze-layout-deepinfra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images: images.slice(0, 5), // Limit to 5 images
          text: extractedText 
        }),
      })

      console.log('DeepInfra layout analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text()
        console.error('DeepInfra layout analysis fetch error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}` || 'Failed to analyze layout')
      }

      const result = await response.json()
      console.log('DeepInfra layout analysis result:', result);
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      layoutAnalysisResult.value = result.analysis || ''
      layoutAnalysisStatus.value = result.analysis 
        ? `Layout analysis complete (${result.imagesAnalyzed || 0} images analyzed)` 
        : 'No layout analysis generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing layout with DeepInfra:', error)
      layoutAnalysisStatus.value = `Error: ${error.message || 'Unknown error during layout analysis'}`
      layoutAnalysisResult.value = ''
      return false
    } finally {
      isAnalyzingLayout.value = false
    }
  }

  // DeepInfra PDF Analysis
  const analyzePdfWithDeepInfra = async (fileName, extractedText = '') => {
    if (!fileName || isAnalyzingPdf.value) {
      return false
    }
    
    // Get the current user
    const user = useSupabaseUser()
    if (!user.value) {
      pdfAnalysisStatus.value = 'Error: User not authenticated'
      return false
    }
    
    console.log('Starting DeepInfra PDF analysis for:', fileName);
    isAnalyzingPdf.value = true
    pdfAnalysisStatus.value = 'Analyzing PDF with DeepInfra Qwen2.5-VL...'
    pdfAnalysisResult.value = ''
    
    try {
      const response = await fetch('/api/analyze-pdf-deepinfra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileName,
          textContext: extractedText,
          userId: user.value.id
        }),
      })

      console.log('DeepInfra PDF analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text()
        console.error('DeepInfra PDF analysis fetch error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}` || 'Failed to analyze PDF')
      }

      const result = await response.json()
      console.log('DeepInfra PDF analysis result:', result);
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      pdfAnalysisResult.value = result.analysis || ''
      pdfAnalysisStatus.value = result.analysis 
        ? `PDF analysis complete using ${result.model}` 
        : 'No analysis generated'
      
      return true
    } catch (error) {
      console.error('Error analyzing PDF with DeepInfra:', error)
      pdfAnalysisStatus.value = `Error: ${error.message || 'Unknown error during PDF analysis'}`
      pdfAnalysisResult.value = ''
      return false
    } finally {
      isAnalyzingPdf.value = false
    }
  }

  // Chat with DeepInfra (updated to use DeepInfra instead of Ollama)
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
      // Prepare context from current report and analysis results
      const context = {
        text: reportContext?.extractedText || '',
        metadata: reportContext?.pdfMetadata || null,
        images: reportContext?.extractedImages || [],
        analysisResults: {
          issues: summarizedIssues.value,
          gensimSummary: gensimSummary.value,
          ollamaSummary: ollamaSummary.value,
          deepInfraSummary: deepInfraSummary.value  // Include DeepInfra summary
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
    deepInfraStatus.value = ''
    deepInfraSummary.value = ''
    imageAnalysisStatus.value = ''
    imageAnalysisResult.value = ''
    layoutAnalysisStatus.value = ''
    layoutAnalysisResult.value = ''
    pdfAnalysisStatus.value = ''
    pdfAnalysisResult.value = ''
    isSummarizing.value = false
    isAnalyzingOpenAI.value = false
    isAnalyzingGensim.value = false
    isAnalyzingOllama.value = false
    isAnalyzingDeepInfra.value = false
    isAnalyzingImages.value = false
    isAnalyzingPdf.value = false
    // Don't clear chat on analysis clear
  }

  // Get analysis summary
  const getAnalysisSummary = () => {
    const hasIssues = summarizedIssues.value.length > 0
    const hasSummary = !!gensimSummary.value
    const hasOllamaSummary = !!ollamaSummary.value
    const hasDeepInfraSummary = !!deepInfraSummary.value
    const hasAnalysis = hasIssues || hasSummary || hasOllamaSummary || hasDeepInfraSummary
    
    return {
      hasAnalysis,
      issuesCount: summarizedIssues.value.length,
      hasSummary,
      hasOllamaSummary,
      hasDeepInfraSummary,
      isProcessing: isSummarizing.value || isAnalyzingOpenAI.value || isAnalyzingGensim.value || isAnalyzingOllama.value || isAnalyzingDeepInfra.value
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
    isAnalyzingDeepInfra,
    deepInfraStatus,
    deepInfraSummary,
    
    // Image analysis state
    isAnalyzingImages,
    imageAnalysisStatus,
    imageAnalysisResult,
    
    // Layout analysis state
    isAnalyzingLayout,
    layoutAnalysisStatus,
    layoutAnalysisResult,
    
    // PDF analysis state
    isAnalyzingPdf,
    pdfAnalysisStatus,
    pdfAnalysisResult,
    
    // Chat state
    chatMessages,
    isChatting,
    chatError,
    
    // Methods
    summarizeText,
    analyzeWithOpenAI,
    analyzeWithGensim,
    analyzeWithOllama,
    analyzeWithDeepInfra,
    analyzeImagesWithDeepInfra,
    analyzeLayoutWithDeepInfra,
    analyzePdfWithDeepInfra,
    clearAnalysisResults,
    
    // Chat methods
    sendChatMessage,
    clearChatHistory,
    getAnalysisSummary
  }
}
