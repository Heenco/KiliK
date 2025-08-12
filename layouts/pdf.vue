<template>
  <div class="pdf-layout">
    <slot />
  </div>
</template>

<script setup>
// No header for PDF layout
</script>

<style>
.pdf-layout {
  /* PDF-specific layout styles */
  margin: 0;
  padding: 0;
  background: white;
}

/* Suppress any global header styles for PDF */
@media print {
  .pdf-layout {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
