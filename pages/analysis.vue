<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100 pt-20 property-background">
    <!-- Property Grid Background -->
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 py-8 relative z-10">
      <div class="max-w-2xl mx-auto">
        <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle class="text-gray-100">Analysis - Inspection Reports</CardTitle>
            <CardDescription class="text-gray-400">
              Upload and manage your inspection report PDFs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="uploadPdf">
              <!-- Drag and Drop Area -->
              <div 
                class="drag-drop-area"
                :class="{ 'drag-over': isDragOver, 'has-file': selectedFile }"
                @drop="handleDrop"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
                @click="triggerFileInput"
              >
                <input 
                  ref="fileInput"
                  id="pdfFile" 
                  type="file" 
                  accept=".pdf" 
                  class="hidden" 
                  @change="handleFileChange" 
                />
                
                <div class="drag-drop-content">
                  <div v-if="!selectedFile && !isUploading" class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-200 mb-2">Upload PDF Report</h3>
                    <p class="text-gray-400 mb-4">Drag and drop your PDF file here, or click to browse</p>
                    <p class="text-sm text-gray-500 mb-4">Supports PDF files up to 10MB</p>
                    <button type="button" class="btn-auth-outline btn-sm">
                      Browse Files
                    </button>
                  </div>
                  
                  <div v-else-if="isUploading" class="text-center">
                    <svg class="mx-auto h-12 w-12 text-blue-400 mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-200 mb-2">Uploading...</h3>
                    <p class="text-gray-400">{{ selectedFile?.name || 'Processing your PDF file' }}</p>
                  </div>
                  
                  <div v-else class="text-center">
                    <svg class="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-200 mb-2">Upload Complete</h3>
                    <p class="text-gray-300 font-medium">File uploaded successfully!</p>
                    <p class="text-sm text-gray-500 mb-4">Ready for another upload</p>
                    <button 
                      type="button" 
                      @click.stop="resetUploadArea" 
                      class="btn-auth-outline btn-sm"
                    >
                      Upload Another File
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div v-if="uploadMessage" class="mt-4">
          <div :class="['p-4 rounded border', uploadSuccess ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-red-900/30 border-red-700 text-red-400']">
            {{ uploadMessage }}
          </div>
        </div>
        
        <div v-if="uploadedFiles.length > 0" class="mt-8">
          <h3 class="text-lg font-medium mb-4 text-gray-200">Your Inspection Reports</h3>
          <ul class="border border-gray-700 rounded-lg divide-y divide-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
            <li v-for="file in uploadedFiles" :key="file.id" class="p-4 flex justify-between items-center">
              <div>
                <span class="font-medium text-gray-200">{{ file.name }}</span>
                <p class="text-sm text-gray-500">{{ formatDate(file.created_at) }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="viewPdf(file.name)" class="btn-auth-outline btn-sm">
                  View
                </button>
                <button @click="processPdf(file.name)" class="btn-auth-outline btn-sm text-blue-400 border-blue-700/50 hover:border-blue-500/50">
                  Process
                </button>
                <button @click="deletePdf(file.name)" class="btn-auth-outline btn-sm text-red-400 border-red-700/50 hover:border-red-500/50">
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- PDF Processing Results - Inline Display -->
        <div v-if="processingStatus || extractedText || extractedImages.length > 0 || pdfMetadata" class="mt-8">
          <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
            <CardHeader>
              <div class="flex justify-between items-center">
                <CardTitle class="text-gray-100">PDF Analysis Results</CardTitle>
                <button @click="clearResults" class="btn-auth-outline btn-sm text-red-400 border-red-700/50 hover:border-red-500/50">
                  Clear Results
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <!-- Processing Status -->
              <div v-if="processingStatus" class="mb-6 p-3 rounded bg-blue-900/30 border border-blue-700 text-blue-300">
                {{ processingStatus }}
              </div>
              
              <!-- PDF Metadata -->
              <div v-if="pdfMetadata" class="mb-6">
                <h4 class="font-medium text-gray-300 mb-3">PDF Information</h4>
                <div class="bg-gray-800/70 border border-gray-700 rounded p-4 text-gray-300 text-sm">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div v-if="pdfMetadata.title"><strong>Title:</strong> {{ pdfMetadata.title }}</div>
                    <div v-if="pdfMetadata.author"><strong>Author:</strong> {{ pdfMetadata.author }}</div>
                    <div v-if="pdfMetadata.pageCount"><strong>Pages:</strong> {{ pdfMetadata.pageCount }}</div>
                    <div v-if="pdfMetadata.creator"><strong>Creator:</strong> {{ pdfMetadata.creator }}</div>
                    <div v-if="pdfMetadata.creationDate"><strong>Created:</strong> {{ formatDate(pdfMetadata.creationDate) }}</div>
                    <div v-if="pdfMetadata.modDate"><strong>Modified:</strong> {{ formatDate(pdfMetadata.modDate) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Extracted Text -->
              <div v-if="extractedText" class="mb-6">
                <Accordion type="single" collapsible class="w-full">
                  <AccordionItem value="extracted-text">
                    <AccordionTrigger class="text-gray-300 hover:text-gray-100">
                      <div class="flex justify-between items-center w-full">
                        <span>Extracted Text</span>
                        <div class="flex gap-2 mr-4" @click.stop>
                          <button 
                            @click="summarizeText" 
                            :disabled="isSummarizing || isAnalyzingOpenAI || isAnalyzingGensim || !extractedText"
                            class="btn-auth-outline btn-sm text-purple-400 border-purple-700/50 hover:border-purple-500/50"
                          >
                            <span v-if="isSummarizing">Analyzing...</span>
                            <span v-else>Analyze (Python)</span>
                          </button>
                          <button 
                            @click="analyzeWithOpenAI" 
                            :disabled="isSummarizing || isAnalyzingOpenAI || isAnalyzingGensim || !extractedText"
                            class="btn-auth-outline btn-sm text-blue-400 border-blue-700/50 hover:border-blue-500/50"
                          >
                            <span v-if="isAnalyzingOpenAI">Analyzing...</span>
                            <span v-else>Analyze (OpenAI)</span>
                          </button>
                          <button 
                            @click="analyzeWithGensim" 
                            :disabled="isSummarizing || isAnalyzingOpenAI || isAnalyzingGensim || !extractedText"
                            class="btn-auth-outline btn-sm text-green-400 border-green-700/50 hover:border-green-500/50"
                          >
                            <span v-if="isAnalyzingGensim">Analyzing...</span>
                            <span v-else>Analyze (Gensim)</span>
                          </button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div class="bg-gray-800/70 border border-gray-700 rounded p-4 max-h-80 overflow-y-auto text-gray-300 text-sm">
                        <pre class="whitespace-pre-wrap">{{ extractedText }}</pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <!-- Summarized Issues -->
              <div v-if="summarizeStatus || openAIStatus || gensimStatus || summarizedIssues.length > 0 || gensimSummary" class="mb-6">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-gray-300">Analysis Results</h4>
                  <button 
                    v-if="summarizedIssues.length > 0 || summarizeStatus || openAIStatus || gensimStatus || gensimSummary"
                    @click="clearAnalysisResults"
                    class="btn-auth-outline btn-sm text-red-400 border-red-700/50 hover:border-red-500/50"
                  >
                    Clear Results
                  </button>
                </div>
                
                <!-- Analysis Status Messages -->
                <div v-if="summarizeStatus" class="mb-4 p-3 rounded bg-purple-900/30 border border-purple-700 text-purple-300">
                  <span class="font-medium">Python NLTK:</span> {{ summarizeStatus }}
                </div>
                
                <div v-if="openAIStatus" class="mb-4 p-3 rounded bg-blue-900/30 border border-blue-700 text-blue-300">
                  <span class="font-medium">OpenAI GPT-4:</span> {{ openAIStatus }}
                </div>
                
                <div v-if="gensimStatus" class="mb-4 p-3 rounded bg-green-900/30 border border-green-700 text-green-300">
                  <span class="font-medium">Gensim Summary:</span> {{ gensimStatus }}
                </div>
                
                <!-- Gensim Summary Text -->
                <div v-if="gensimSummary" class="mb-4 bg-gray-800/70 border border-gray-700 rounded p-4">
                  <h5 class="font-medium text-gray-200 mb-2">Text Summary</h5>
                  <div class="text-gray-300 text-sm whitespace-pre-wrap">{{ gensimSummary }}</div>
                </div>
                
                <!-- Issues List -->
                <div v-if="summarizedIssues.length > 0" class="space-y-3">
                  <h5 class="font-medium text-gray-200 mb-2">Identified Issues</h5>
                  <div 
                    v-for="(issue, index) in summarizedIssues" 
                    :key="index" 
                    class="bg-gray-800/70 border border-gray-700 rounded p-4"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <h6 class="font-medium text-gray-200">{{ issue.issue }}</h6>
                      <span 
                        :class="[
                          'px-2 py-1 rounded text-xs font-medium',
                          issue.severity === 'Major' 
                            ? 'bg-red-900/30 border border-red-700 text-red-300' 
                            : 'bg-yellow-900/30 border border-yellow-700 text-yellow-300'
                        ]"
                      >
                        {{ issue.severity }}
                      </span>
                    </div>
                    <p class="text-gray-400 text-sm">{{ issue.description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Extracted Images -->
              <div v-if="extractedImages && extractedImages.length > 0" class="mb-6">
                <Accordion type="single" collapsible class="w-full">
                  <AccordionItem value="extracted-images">
                    <AccordionTrigger class="text-gray-300 hover:text-gray-100">
                      Extracted Images ({{ extractedImages.length }})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div class="grid grid-cols-5 gap-4">
                        <div v-for="(image, index) in extractedImages" :key="index" class="relative border border-gray-700 rounded overflow-hidden bg-gray-800/50 hover:border-gray-500 transition-colors aspect-square">
                          <img :src="image" class="w-full h-full object-cover cursor-pointer" :alt="`Image ${index + 1} from PDF`" @click="openImageModal(image, index)" />
                          <!-- Image number overlay -->
                          <div class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {{ index + 1 }}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <!-- Image Modal Gallery with Navigation -->
        <div v-if="selectedImage" class="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="closeImageModal">
          <div class="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            <!-- Close Button -->
            <button @click="closeImageModal" class="absolute top-16 right-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <!-- Previous Button -->
            <button 
              v-if="extractedImages.length > 1"
              @click.stop="navigateImage('prev')" 
              class="absolute left-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-3 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <!-- Image -->
            <div class="flex items-center justify-center w-full h-full" @click.stop>
              <img :src="selectedImage" class="max-w-full max-h-full object-contain" :alt="`Image ${selectedImageIndex + 1} of ${extractedImages.length}`" />
            </div>
            
            <!-- Next Button -->
            <button 
              v-if="extractedImages.length > 1"
              @click.stop="navigateImage('next')" 
              class="absolute right-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-3 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
            
            <!-- Image Counter -->
            <div v-if="extractedImages.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-2 rounded-full text-sm">
              {{ selectedImageIndex + 1 }} / {{ extractedImages.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

const fileInput = ref(null);
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');
const uploadSuccess = ref(false);
const uploadedFiles = ref([]);
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const extractedImages = ref([]);
const extractedText = ref('');
const pdfMetadata = ref(null);
const selectedImage = ref(null);
const selectedImageIndex = ref(0);
const processingStatus = ref('');
const isProcessing = ref(false);
const summarizedIssues = ref([]);
const isSummarizing = ref(false);
const summarizeStatus = ref('');
const isAnalyzingOpenAI = ref(false);
const openAIStatus = ref('');
const isAnalyzingGensim = ref(false);
const gensimStatus = ref('');
const gensimSummary = ref('');
const isDragOver = ref(false);

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    uploadMessage.value = '';
    // Automatically upload the selected file
    await uploadPdf();
  } else {
    selectedFile.value = null;
    uploadMessage.value = 'Please select a valid PDF file';
    uploadSuccess.value = false;
  }
};

// Drag and drop handlers
const handleDrop = async (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      selectedFile.value = file;
      uploadMessage.value = '';
      // Automatically upload the dropped file
      await uploadPdf();
    } else {
      uploadMessage.value = 'Please drop a valid PDF file';
      uploadSuccess.value = false;
    }
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragEnter = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  // Only set to false if we're leaving the drop area completely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false;
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const clearFile = () => {
  selectedFile.value = null;
  uploadMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const resetUploadArea = () => {
  selectedFile.value = null;
  uploadMessage.value = '';
  uploadSuccess.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const uploadPdf = async () => {
  if (!selectedFile.value || !user.value) return;
  
  isUploading.value = true;
  uploadMessage.value = '';
  
  try {
    // Get original filename and sanitize it for storage
    const originalName = selectedFile.value.name;
    
    // Sanitize the filename to remove special characters
    let sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Add a timestamp to ensure uniqueness while preserving the original name
    const timestamp = Date.now();
    const fileExt = originalName.split('.').pop();
    const fileNameWithoutExt = sanitizedName.replace(`.${fileExt}`, '');
    const uniqueFileName = `${fileNameWithoutExt}_${timestamp}.${fileExt}`;
    
    // Create the path with user ID as folder
    const filePath = `${user.value.id}/${uniqueFileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('inspection-reports')
      .upload(filePath, selectedFile.value, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Store metadata in database if needed
    const { error: metadataError } = await supabase
      .from('report_files')
      .insert({
        name: originalName, // Store the truly original name for display
        user_id: user.value.id,
        storage_path: filePath,
        size: selectedFile.value.size
      });
    
    if (metadataError) console.error('Metadata storage error:', metadataError);
    
    uploadSuccess.value = true;
    uploadMessage.value = 'PDF uploaded successfully!';
    fetchUserFiles();
    
    // Clear file input but keep selectedFile for UI feedback
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
      if (uploadSuccess.value) {
        resetUploadArea();
      }
    }, 3000);
    
  } catch (error) {
    console.error('Upload error:', error);
    uploadSuccess.value = false;
    uploadMessage.value = error.message || 'An error occurred during upload';
    selectedFile.value = null;
  } finally {
    isUploading.value = false;
  }
};

const fetchUserFiles = async () => {
  if (!user.value) return;

  try {
    // Fetch all objects from the inspection-reports bucket
    const { data, error } = await supabase.storage
      .from('inspection-reports')
      .list(user.value.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;

    // Map the storage objects to the uploadedFiles array
    uploadedFiles.value = data.map(file => ({
      id: file.id || file.name, // Use name as fallback for id
      name: file.name,
      created_at: file.created_at || new Date().toISOString(), // Fallback to current date if missing
      size: file.size || 0 // Fallback to 0 if size is missing
    }));
  } catch (error) {
    console.error('Error fetching files from storage:', error);
  }
};

const viewPdf = async (fileName) => {
  try {
    // Generate a signed URL for the file in the storage bucket
    const filePath = `${user.value.id}/${fileName}`;
    const { data: urlData, error: urlError } = await supabase.storage
      .from('inspection-reports')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (urlError) throw urlError;

    // Trigger file download
    const link = document.createElement('a');
    link.href = urlData.signedUrl;
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error generating download URL:', error);
    alert('Failed to download file: ' + (error.message || 'Unknown error'));
  }
};

const processPdf = async (fileName) => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  processingStatus.value = 'Processing PDF - extracting text and images...';
  extractedImages.value = [];
  extractedText.value = '';
  pdfMetadata.value = null;
  
  try {
    const response = await fetch('/api/process-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, userId: user.value.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process PDF');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Update the UI with processed data
    processingStatus.value = `PDF processed successfully! Found ${result.images?.length || 0} images.`;
    extractedText.value = result.text || 'No text content found in PDF.';
    extractedImages.value = result.images || [];
    pdfMetadata.value = result.metadata || null;
    
    // Log metadata for debugging
    if (result.metadata) {
      console.log('PDF Metadata:', result.metadata);
    }
    
  } catch (error) {
    console.error('Error processing PDF:', error);
    processingStatus.value = `Error: ${error.message || 'Unknown error processing PDF'}`;
    extractedText.value = '';
    extractedImages.value = [];
    pdfMetadata.value = null;
  } finally {
    isProcessing.value = false;
  }
};

const clearResults = () => {
  processingStatus.value = '';
  extractedText.value = '';
  extractedImages.value = [];
  pdfMetadata.value = null;
  selectedImage.value = null;
  selectedImageIndex.value = 0;
  summarizedIssues.value = [];
  summarizeStatus.value = '';
  isSummarizing.value = false;
  isAnalyzingOpenAI.value = false;
  openAIStatus.value = '';
  isAnalyzingGensim.value = false;
  gensimStatus.value = '';
  gensimSummary.value = '';
};

const openImageModal = (imageUrl, index) => {
  selectedImage.value = imageUrl;
  selectedImageIndex.value = index;
};

const navigateImage = (direction) => {
  if (extractedImages.value.length === 0) return;
  
  if (direction === 'next') {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % extractedImages.value.length;
  } else {
    selectedImageIndex.value = selectedImageIndex.value === 0 
      ? extractedImages.value.length - 1 
      : selectedImageIndex.value - 1;
  }
  
  selectedImage.value = extractedImages.value[selectedImageIndex.value];
};

const closeImageModal = () => {
  selectedImage.value = null;
  selectedImageIndex.value = 0;
};

// Summarize extracted text using Python NLTK
const summarizeText = async () => {
  if (!extractedText.value || isSummarizing.value) return;
  
  isSummarizing.value = true;
  summarizeStatus.value = 'Analyzing text for issues...';
  summarizedIssues.value = [];
  
  try {
    const response = await fetch('/api/summarize-python', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to summarize text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    summarizedIssues.value = result.issues || [];
    summarizeStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`;
    
  } catch (error) {
    console.error('Error summarizing text:', error);
    summarizeStatus.value = `Error: ${error.message || 'Unknown error during summarization'}`;
    summarizedIssues.value = [];
  } finally {
    isSummarizing.value = false;
  }
};

// Analyze extracted text using OpenAI GPT-4
const analyzeWithOpenAI = async () => {
  if (!extractedText.value || isAnalyzingOpenAI.value) return;
  
  isAnalyzingOpenAI.value = true;
  openAIStatus.value = 'Analyzing text with OpenAI GPT-4...';
  summarizedIssues.value = [];
  
  try {
    const response = await fetch('/api/summarize-issues-fixed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    summarizedIssues.value = result.issues || [];
    openAIStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`;
    
  } catch (error) {
    console.error('Error analyzing text with OpenAI:', error);
    openAIStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`;
    summarizedIssues.value = [];
  } finally {
    isAnalyzingOpenAI.value = false;
  }
};

// Analyze extracted text using Gensim
const analyzeWithGensim = async () => {
  if (!extractedText.value || isAnalyzingGensim.value) return;
  
  isAnalyzingGensim.value = true;
  gensimStatus.value = 'Analyzing text with Gensim...';
  gensimSummary.value = '';
  
  try {
    const response = await fetch('/api/summarize-gensim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    gensimSummary.value = result.summary || '';
    gensimStatus.value = gensimSummary.value 
      ? 'Text summarized successfully' 
      : 'No summary generated';
    
  } catch (error) {
    console.error('Error analyzing text with Gensim:', error);
    gensimStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`;
    gensimSummary.value = '';
  } finally {
    isAnalyzingGensim.value = false;
  }
};

// Clear analysis results
const clearAnalysisResults = () => {
  summarizedIssues.value = [];
  summarizeStatus.value = '';
  openAIStatus.value = '';
  gensimStatus.value = '';
  gensimSummary.value = '';
  isSummarizing.value = false;
  isAnalyzingOpenAI.value = false;
  isAnalyzingGensim.value = false;
};

// Keyboard navigation for image gallery
const handleKeyPress = (event) => {
  if (!selectedImage.value) return;
  
  if (event.key === 'ArrowLeft') {
    navigateImage('prev');
  } else if (event.key === 'ArrowRight') {
    navigateImage('next');
  } else if (event.key === 'Escape') {
    closeImageModal();
  }
};

const deletePdf = async (fileName) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  try {
    // Delete the file from the storage bucket
    const filePath = `${user.value.id}/${fileName}`;
    const { error: storageError } = await supabase.storage
      .from('inspection-reports')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Refresh the file list
    fetchUserFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Failed to delete file: ' + (error.message || 'Unknown error'));
  }
};

// Watch for user changes and fetch files when the user is logged in
watch(user, (newUser) => {
  if (newUser) {
    fetchUserFiles();
  } else {
    uploadedFiles.value = [];
  }
}, { immediate: true });

onMounted(() => {
  if (user.value) {
    fetchUserFiles();
  }
  
  // Add keyboard event listener for image gallery navigation
  document.addEventListener('keydown', handleKeyPress);
  
  // Check the current route to handle redirects from /upload-pdf
  const route = useRoute();
  if (route.path === '/upload-pdf') {
    const router = useRouter();
    router.replace('/analysis');
  }
});

// Clean up event listener on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Button styles matching sign-in page */
.btn-auth {
  background: #22c55e;
  color: #000;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-auth:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-auth-outline {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-auth-outline:hover:not(:disabled) {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid #4ade80;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-auth-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Small button variant */
.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Color variants for outline buttons */
.btn-auth-outline.text-blue-400:hover:not(:disabled) {
  border-color: #3b82f6;
}

.btn-auth-outline.text-red-400:hover:not(:disabled) {
  border-color: #ef4444;
}

.btn-auth-outline.text-purple-400:hover:not(:disabled) {
  border-color: #a855f7;
}

.btn-auth-outline.text-green-400:hover:not(:disabled) {
  border-color: #22c55e;
}

/* Drag and Drop Area Styles */
.drag-drop-area {
  border: 2px dashed #374151;
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  background: rgba(31, 41, 55, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-drop-area:hover {
  border-color: #4ade80;
  background: rgba(31, 41, 55, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.drag-drop-area.drag-over {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.drag-drop-area.has-file {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.drag-drop-content {
  width: 100%;
}

.hidden {
  display: none;
}

/* Spinning animation for upload indicator */
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

/* Add some subtle animation for hover effects */
.hover\:border-green-500\/50:hover {
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.15);
  transition: all 0.2s ease;
}

.hover\:border-red-500\/50:hover {
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.15);
  transition: all 0.2s ease;
}

/* Property Blueprint Background - matching sign-in page */
.property-background {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.15;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}
</style>
