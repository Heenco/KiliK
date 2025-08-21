<template>
  <div class="pdf-viewer-container">
    <div v-if="!mounted" class="loading-indicator">
      <div class="spinner"></div>
      <div>Loading PDF viewer...</div>
    </div>

    <div v-else class="viewer-content">
      <object v-if="supportsObject" :data="embeddedUrl" type="application/pdf" width="100%" height="80vh">
        <iframe :src="embeddedUrl" class="pdf-iframe" frameborder="0" style="width:100%;height:80vh;border:0"></iframe>
      </object>
      <iframe v-else :src="embeddedUrl" class="pdf-iframe" frameborder="0" style="width:100%;height:80vh;border:0"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ url: { type: String, required: true } })
const mounted = ref(false)
const supportsObject = ref(true)

const embeddedUrl = computed(() => {
  const timestamp = new Date().getTime()
  return `${props.url}${props.url.includes('?') ? '&' : '?'}_t=${timestamp}`
})

onMounted(() => {
  mounted.value = true
  // Basic feature detection: some browsers may not support embedding via <object>
  try {
    // create a dummy object element to test support
    const obj = document.createElement('object')
    obj.type = 'application/pdf'
    supportsObject.value = !!(obj && obj.type === 'application/pdf')
  } catch (e) {
    supportsObject.value = false
  }
})
</script>

<style scoped>
.pdf-viewer-container { position: relative; width: 100%; }
.loading-indicator { display:flex; align-items:center; justify-content:center; padding:16px }
.pdf-iframe { width:100%; height:80vh; border:0 }
</style>
