<template>
  <div>
    <Header />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/ui/Header.vue'
</script>

<style>
/* Global styles for default layout */
</style>
