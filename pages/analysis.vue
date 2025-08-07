<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100 pt-20">
    <div class="container mx-auto px-4 py-8">
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
              <div class="mb-4">
                <Label for="pdfFile" class="text-gray-300">Choose PDF file</Label>
                <Input 
                  ref="fileInput"
                  id="pdfFile" 
                  type="file" 
                  accept=".pdf" 
                  class="mt-1 bg-gray-800/50 border-gray-700 text-gray-200" 
                  @change="handleFileChange" 
                />
              </div>
              <div v-if="selectedFile" class="mb-4">
                <p class="text-sm text-gray-300">Selected file: {{ selectedFile.name }}</p>
                <p class="text-sm text-gray-500">Size: {{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <Button type="submit" :disabled="isUploading || !selectedFile" class="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500/50">
                <span v-if="isUploading">Uploading...</span>
                <span v-else>Upload Report</span>
              </Button>
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
                <Button variant="outline" size="sm" @click="viewPdf(file.name)" class="border-gray-600 hover:border-green-500/50 text-gray-300">
                  View
                </Button>
                <Button variant="outline" size="sm" @click="processPdf(file.name)" class="border-gray-600 hover:border-blue-500/50 text-blue-400">
                  Process
                </Button>
                <Button variant="outline" size="sm" @click="deletePdf(file.name)" class="border-gray-600 hover:border-red-500/50 text-red-400">
                  Delete
                </Button>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- PDF Processing Results Modal -->
        <div v-if="showGallery" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div class="max-w-4xl w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-200">PDF Analysis Results</h3>
                <Button variant="ghost" size="icon" @click="showGallery = false" class="text-gray-400 hover:text-gray-200">
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              </div>
              
              <!-- Processing Status -->
              <div v-if="processingStatus" class="mb-4 p-3 rounded bg-blue-900/30 border border-blue-700 text-blue-300">
                {{ processingStatus }}
              </div>
              
              <!-- Extracted Text -->
              <div v-if="extractedText" class="mb-6">
                <h4 class="font-medium text-gray-300 mb-2">Extracted Text</h4>
                <div class="bg-gray-800/70 border border-gray-700 rounded p-4 max-h-60 overflow-y-auto text-gray-300 text-sm">
                  <pre class="whitespace-pre-wrap">{{ extractedText }}</pre>
                </div>
              </div>
              
              <!-- Extracted Images -->
              <div v-if="extractedImages && extractedImages.length > 0" class="mb-6">
                <h4 class="font-medium text-gray-300 mb-2">Extracted Images ({{ extractedImages.length }})</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div v-for="(image, index) in extractedImages" :key="index" class="border border-gray-700 rounded overflow-hidden bg-gray-800/50">
                    <img :src="image" class="w-full h-auto" :alt="`Image ${index + 1} from PDF`" />
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end mt-4">
                <Button @click="showGallery = false" class="bg-gray-800 hover:bg-gray-700 border border-gray-700">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

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
const showGallery = ref(false);
const processingStatus = ref('');
const isProcessing = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    uploadMessage.value = '';
  } else {
    selectedFile.value = null;
    uploadMessage.value = 'Please select a valid PDF file';
    uploadSuccess.value = false;
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
    
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    selectedFile.value = null;
    
  } catch (error) {
    console.error('Upload error:', error);
    uploadSuccess.value = false;
    uploadMessage.value = error.message || 'An error occurred during upload';
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
  processingStatus.value = 'Downloading PDF, please wait...';
  showGallery.value = true;
  extractedImages.value = [];
  extractedText.value = '';
  
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
      throw new Error(errorData.error || 'Failed to download PDF');
    }

    const result = await response.json();
    
    // Show success message with file path
    processingStatus.value = `PDF downloaded successfully to temporary location: ${result.filePath}`;
    extractedText.value = `The PDF file "${result.fileName}" has been saved to:\n${result.filePath}\n\nThis file is stored temporarily and will be available for further processing.`;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    processingStatus.value = `Error: ${error.message || 'Unknown error downloading PDF'}`;
  } finally {
    isProcessing.value = false;
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
  
  // Check the current route to handle redirects from /upload-pdf
  const route = useRoute();
  if (route.path === '/upload-pdf') {
    const router = useRouter();
    router.replace('/analysis');
  }
});
</script>

<style scoped>
.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
</style>
