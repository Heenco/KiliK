<template>
  <div class="app-root">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Layouts will handle headers based on page requirements
</script>

<style>
/* Global styles for safe area support - High specificity overrides */
html, 
html body, 
body {
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  background-attachment: fixed !important;
  min-height: 100vh !important;
  min-height: calc(100vh + env(safe-area-inset-top)) !important;
  overflow-x: hidden !important;
  width: 100% !important;
}

/* Target Nuxt root elements specifically */
#__nuxt, 
#__nuxt > div,
.app-root {
  min-height: 100vh !important;
  min-height: calc(100vh + env(safe-area-inset-top)) !important;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  background-attachment: fixed !important;
  position: relative !important;
  width: 100% !important;
}

/* iOS safe area support */
@supports (padding: max(0px)) {
  html {
    padding-top: env(safe-area-inset-top) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;
  }
  
  body {
    /* Remove padding from body to prevent double padding */
    padding: 0 !important;
  }
}

/* Ensure viewport covers full screen on mobile */
@media screen and (max-width: 768px) {
  html, 
  html body, 
  body {
    min-height: 100dvh !important;
    min-height: calc(100dvh + env(safe-area-inset-top)) !important;
  }
  
  #__nuxt, 
  #__nuxt > div,
  .app-root {
    min-height: 100dvh !important;
    min-height: calc(100dvh + env(safe-area-inset-top)) !important;
  }
}
</style>