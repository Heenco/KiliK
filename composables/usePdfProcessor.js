import { ref } from 'vue'

export const usePdfProcessor = () => {
  // State
  const extractedImages = ref([])
  const extractedText = ref('')
  const pdfMetadata = ref(null)
  const isProcessing = ref(false)
  const processingStatus = ref('')

  // Supabase
  const user = useSupabaseUser()

  // Process PDF
  const processPdf = async (fileName) => {
    if (isProcessing.value) return false
    
    isProcessing.value = true
    processingStatus.value = 'Processing PDF - extracting text and images...'
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

  return {
    // State
    extractedImages,
    extractedText,
    pdfMetadata,
    isProcessing,
    processingStatus,
    
    // Methods
    processPdf,
    viewPdf,
    clearProcessingResults,
    getTextStatistics
  }
}
