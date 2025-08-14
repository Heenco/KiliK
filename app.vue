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
/* Global styles for safe area support */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #000000 !important;
  min-height: 100vh;
  min-height: calc(100vh + env(safe-area-inset-top));
  overflow-x: hidden;
}

#__nuxt, .app-root {
  min-height: 100vh;
  min-height: calc(100vh + env(safe-area-inset-top));
  background: #000000;
  position: relative;
}

/* iOS safe area support */
@supports (padding: max(0px)) {
  html {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  
  body {
    /* Remove padding from body to prevent double padding */
    padding: 0 !important;
  }
}

/* Ensure viewport covers full screen on mobile */
@media screen and (max-width: 768px) {
  html, body {
    min-height: 100dvh !important;
    min-height: calc(100dvh + env(safe-area-inset-top)) !important;
  }
  
  #__nuxt, .app-root {
    min-height: 100dvh;
    min-height: calc(100dvh + env(safe-area-inset-top));
  }
}
</style>