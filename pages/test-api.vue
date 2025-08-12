<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
    <div class="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-6 text-center">API Test Page</h1>
      
      <button 
        @click="testSimpleAPI" 
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg mb-4"
      >
        {{ loading ? 'Testing...' : 'Test Simple API' }}
      </button>
      
      <div v-if="result" class="mt-4 p-4 bg-gray-700 rounded-lg">
        <h3 class="font-bold mb-2">Result:</h3>
        <pre class="text-sm text-green-400">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="mt-4 p-4 bg-red-900 rounded-lg">
        <h3 class="font-bold mb-2 text-red-400">Error:</h3>
        <pre class="text-sm text-red-300">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const result = ref(null)
const error = ref(null)

const testSimpleAPI = async () => {
  loading.value = true
  result.value = null
  error.value = null
  
  try {
    console.log('Testing API endpoint...')
    
    const response = await fetch('/api/simple-test')
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Response data:', data)
    
    result.value = data
    
  } catch (err) {
    console.error('API test failed:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
