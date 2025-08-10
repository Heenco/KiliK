<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
    <Header />

    <main class="container mx-auto px-4 py-6 flex-1">
      <HazardCard />
    </main>

    <footer class="py-4 bg-gray-900 text-center text-gray-400 text-sm">
      © 2025 CliQ Property Insights
    </footer>
  </div>
</template>

<script setup>
import Header from '@/components/ui/Header.vue';
import HazardCard from '@/components/HazardCard.vue';
</script>

<style scoped>
main {
  margin-top: 80px;
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>