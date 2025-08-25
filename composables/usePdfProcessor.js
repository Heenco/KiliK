import { ref } from 'vue'

export const usePdfProcessor = () => {
  // State
  const extractedImages = ref([])
  const extractedText = ref('')
  const pdfMetadata = ref(null)
  const isProcessing = ref(false)
  const processingStatus = ref('')
  const processingProgress = ref(0)

  // Supabase
  const user = useSupabaseUser()

  // Process PDF
  const processPdf = async (fileName) => {
    if (isProcessing.value) return false
    
    isProcessing.value = true
    processingStatus.value = 'Processing PDF - extracting text and images...'
    processingProgress.value = 0
    extractedImages.value = []
    extractedText.value = ''
    pdfMetadata.value = null
    
    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, userId: user.value.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process PDF')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Update the state with processed data
      processingStatus.value = `PDF processed successfully! Found ${result.images?.length || 0} images.`
      processingProgress.value = 100
      extractedText.value = result.text || 'No text content found in PDF.'
      extractedImages.value = result.images || []
      pdfMetadata.value = result.metadata || null
      
      // Log metadata for debugging
      if (result.metadata) {
        console.log('PDF Metadata:', result.metadata)
      }
      
      return true
    } catch (error) {
      console.error('Error processing PDF:', error)
      processingStatus.value = `Error: ${error.message || 'Unknown error processing PDF'}`
      processingProgress.value = 0
      extractedText.value = ''
      extractedImages.value = []
      pdfMetadata.value = null
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // View/download PDF
  const viewPdf = async (fileName) => {
    try {
      const supabase = useSupabaseClient()
      const filePath = `${user.value.id}/${fileName}`
      const { data: urlData, error: urlError } = await supabase.storage
        .from('inspection-reports')
        .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

      if (urlError) throw urlError

      // Trigger file download
      const link = document.createElement('a')
      link.href = urlData.signedUrl
      link.download = fileName
      link.click()
      
      return true
    } catch (error) {
      console.error('Error generating download URL:', error)
      throw error
    }
  }

  // Clear processing results
  const clearProcessingResults = () => {
    processingStatus.value = ''
    processingProgress.value = 0
    extractedText.value = ''
    extractedImages.value = []
    pdfMetadata.value = null
  }

  // Get text statistics
  const getTextStatistics = () => {
    if (!extractedText.value) {
      return {
        characters: 0,
        words: 0,
        lines: 0
      }
    }

    return {
      characters: extractedText.value.length,
      words: extractedText.value.split(/\s+/).length,
      lines: extractedText.value.split(/\n/).length
    }
  }

  // Ingest PDF into vector database
  const ingestPdf = async (fileName) => {
    if (isProcessing.value) return false
    
    isProcessing.value = true
    processingStatus.value = 'Ingesting PDF into the database...'
    processingProgress.value = 0
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        if (processingProgress.value < 90) {
          processingProgress.value += Math.random() * 10
        }
      }, 1000)
      
      const response = await fetch('/api/ingest-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, userId: user.value.id }),
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to ingest PDF')
      }
      
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      processingStatus.value = 'PDF successfully ingested into the database!'
      processingProgress.value = 100
      
      return true
    } catch (error) {
      console.error('Error ingesting PDF:', error)
      processingStatus.value = `Error: ${error.message || 'Unknown error ingesting PDF'}`
      processingProgress.value = 0
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // Process and ingest PDF in one operation
  const processAndIngestPdf = async (fileName) => {
    if (isProcessing.value) return false
    
    isProcessing.value = true
    processingStatus.value = 'Processing and ingesting PDF...'
    processingProgress.value = 0
    extractedImages.value = []
    extractedText.value = ''
    pdfMetadata.value = null
    
    try {
      // Step 1: Process the PDF
      processingStatus.value = 'Step 1/2: Processing PDF...'
      
      // Simulate progress for processing phase (0-50%)
      const processProgressInterval = setInterval(() => {
        if (processingProgress.value < 45) {
          processingProgress.value += Math.random() * 5
        }
      }, 800)
      
      console.log('usePdfProcessor: POST /api/process-pdf', { fileName, userId: user.value.id })
      const processResponse = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, userId: user.value.id }),
      })
      
      clearInterval(processProgressInterval)
      processingProgress.value = 50
      
      if (!processResponse.ok) {
        let errText = ''
        try {
          errText = await processResponse.text()
        } catch (e) {
          errText = String(e)
        }
        console.error('usePdfProcessor: /api/process-pdf returned non-OK:', processResponse.status, errText)
        throw new Error(errText || 'Failed to process PDF')
      }
      
      const processResult = await processResponse.json()
      
      if (processResult.error) {
        throw new Error(processResult.error)
      }
      
      // Update with processing results
      extractedText.value = processResult.text || 'No text content found in PDF.'
      extractedImages.value = processResult.images || []
      pdfMetadata.value = processResult.metadata || null
      
      // Step 2: Ingest the PDF
      processingStatus.value = 'Step 2/2: Ingesting PDF into database...'
      
      // Simulate progress for ingestion phase (50-95%)
      const ingestProgressInterval = setInterval(() => {
        if (processingProgress.value < 90) {
          processingProgress.value += Math.random() * 5
        }
      }, 800)
      
      console.log('usePdfProcessor: POST /api/ingest-pdf', { fileName, userId: user.value.id })
      const ingestResponse = await fetch('/api/ingest-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, userId: user.value.id }),
      })
      
      clearInterval(ingestProgressInterval)
      
      if (!ingestResponse.ok) {
        let errText = ''
        try {
          errText = await ingestResponse.text()
        } catch (e) {
          errText = String(e)
        }
        console.error('usePdfProcessor: /api/ingest-pdf returned non-OK:', ingestResponse.status, errText)
        throw new Error(errText || 'Failed to ingest PDF')
      }
      
      const ingestResult = await ingestResponse.json()
      
      if (ingestResult.error) {
        throw new Error(ingestResult.error)
      }
      
      // Complete
      processingStatus.value = 'PDF successfully processed and ingested!'
      processingProgress.value = 100
      
      return true
    } catch (error) {
      console.error('Error processing and ingesting PDF:', error)
      processingStatus.value = `Error: ${error.message || 'Unknown error processing and ingesting PDF'}`
      processingProgress.value = 0
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // Check if a file has been processed and ingested
  const checkFileProcessed = async (fileName) => {
    try {
      const supabase = useSupabaseClient()
      
      // Check if this file exists in the documents table
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', user.value.id)
        .eq('document_name', fileName)
        .limit(1)
      
      if (error) throw error
      
      return data && data.length > 0
    } catch (error) {
      console.error('Error checking if file is processed:', error)
      return false
    }
  }

  return {
    // State
    extractedImages,
    extractedText,
    pdfMetadata,
    isProcessing,
    processingStatus,
    processingProgress,
    
    // Methods
    processPdf,
    viewPdf,
    ingestPdf,
    processAndIngestPdf,
    clearProcessingResults,
    getTextStatistics,
    checkFileProcessed
  }
}
