<template>
  <div class="container mx-auto py-8">
    <div class="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Inspection Report</CardTitle>
        </CardHeader>

        <CardContent>
          <ClientOnly>
            <!-- Use native PDF embed to avoid pdf.js compatibility issues in some browsers -->
            <div class="pdf-embed-wrap">
              <object :data="pdfUrl" type="application/pdf" width="100%" height="80vh">
                <!-- Fallback to iframe if object embedding is not supported -->
                <iframe :src="pdfUrl" class="pdf-iframe" frameborder="0" style="width:100%;height:80vh;border:0;"></iframe>
              </object>
            </div>
          </ClientOnly>
        </CardContent>

        <CardFooter>
          <Button @click="goBack">Back</Button>
          <Button variant="outline" @click="downloadPdf" class="ml-2">Download</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

const router = useRouter()
const pdfUrl = ref('/InspectionReport.pdf')

const goBack = () => router.back()

const downloadPdf = () => {
  const a = document.createElement('a')
  a.href = pdfUrl.value
  a.download = 'InspectionReport.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<style scoped>
.pdf-viewer { height: 800px; }
.pdf-embed-wrap { width: 100%; }
.pdf-iframe { width: 100%; height: 80vh; border: 0; }
</style>
