<template>
  <div class="container mx-auto py-8">
    <div class="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Inspection Report</CardTitle>
        </CardHeader>

        <CardContent>
          <ClientOnly>
            <!-- A4-sized preview: 210mm x 297mm. uses min() so it fits smaller viewports responsively -->
            <div class="a4-wrapper">
              <div class="a4-frame" role="document" aria-label="Inspection Report (A4)">
                <object :data="pdfUrl" type="application/pdf">
                  <!-- Fallback to iframe if object embedding is not supported -->
                  <iframe :src="pdfUrl" class="pdf-iframe" frameborder="0" title="Inspection Report"></iframe>
                </object>
              </div>
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
.a4-wrapper { display:flex; justify-content:center; padding:16px; }
.a4-frame {
  /* A4 size in mm; min() ensures it fits the available width on small screens */
  width: min(210mm, 100%);
  aspect-ratio: 210 / 297;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.a4-frame object, .a4-frame iframe { width:100%; height:100%; border:0; display:block; }
.pdf-iframe { border:0 }
</style>
