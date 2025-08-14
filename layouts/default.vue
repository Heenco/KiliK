<template>
  <div class="layout-container">
    <Header />
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/ui/Header.vue'
</script>

<style>
/* Global styles for default layout */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #000 !important;
  min-height: 100vh;
  min-height: calc(100vh + env(safe-area-inset-top));
}

#__nuxt {
  min-height: 100vh;
  min-height: calc(100vh + env(safe-area-inset-top));
  background: #000;
}

.layout-container {
  min-height: 100vh;
  min-height: calc(100vh + env(safe-area-inset-top));
  background: #000;
}

.layout-main {
  background: transparent;
}

/* iOS safe area support */
@supports (padding: max(0px)) {
  html {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
</style>
