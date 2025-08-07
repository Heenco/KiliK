<template>
  <div class="container mx-auto py-8">
    <div class="max-w-4xl mx-auto">
      <Card v-if="pdfPath">
        <CardHeader>
          <CardTitle>PDF Viewer</CardTitle>
          <CardDescription>
            Viewing: {{ fileName }}
          </CardDescription>
        </CardHeader>        <CardContent>
          <PdfViewer :url="pdfPath" />
        </CardContent>
        <CardFooter>
          <Button @click="goBack">Back to Analysis</Button>
        </CardFooter>
      </Card>
        <div v-else class="flex items-center justify-center h-64">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-700">No PDF Selected</h3>
          <p class="text-gray-500 mt-2">Please select a PDF from the Analysis page</p>
          <Button class="mt-4" @click="goToUploadPage">Go to Analysis Page</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import PdfViewer from '~/components/PdfViewer.vue';

const route = useRoute();
const router = useRouter();
const pdfPath = ref('');
const fileName = ref('');

onMounted(async () => {
  const pathParam = route.query.path;
  const nameParam = route.query.name;
  
  if (pathParam) {
    // Check if this is a Supabase signed URL
    if (pathParam.includes('supabase') && pathParam.includes('signed=')) {
      // Use the direct signed URL
      pdfPath.value = pathParam;
      
      // Use the provided name or extract from URL
      if (nameParam) {
        fileName.value = nameParam;
      } else {
        const url = new URL(pathParam);
        const parts = url.pathname.split('/');
        fileName.value = parts[parts.length - 1].split('_').pop() || 'Document';
      }
    } else {
      // Handle the legacy path format (local server)
      // Extract filename from path
      const parts = String(pathParam).split('/');
      const filename = parts[parts.length - 1];
      
      // Format the path for our API endpoint
      pdfPath.value = `/api/pdf/${filename}`;
      
      // Try to get original filename from metadata
      try {
        const response = await fetch('/api/list-pdfs');
        if (response.ok) {
          const data = await response.json();
          const fileInfo = data.files.find(f => f.path.includes(filename));
          if (fileInfo) {
            fileName.value = fileInfo.originalName;
          } else {
            fileName.value = filename;
          }
        }
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        fileName.value = filename;
      }
    }
  }
});

const goBack = () => {
  router.back();
};

const goToUploadPage = () => {
  // Redirect to Analysis page instead of upload-pdf
  navigateTo('/analysis');
};
</script>
