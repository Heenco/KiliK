<template>  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 property-background">
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 flex-1 flex flex-col">
      <!-- Main Content -->
      <main class="flex flex-col justify-center items-center min-h-[60vh] py-6 flex-1"><div class="text-center mb-3">          <span class="text-xs bg-gray-100 px-3 py-1 rounded-full">
            Now available in Brisbane, Australia
          </span>        </div>        <h2 class="text-center text-4xl font-bold mb-2">
          One Kili<span class="text-green-400">K</span> property profile
        </h2><p class="text-center text-gray-600 mb-3 max-w-xl mx-auto text-sm">
          Search for properties in your ideal neighborhood, assess safety, and evaluate proximity to amenities.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl w-full flex justify-center items-center mt-2">
          <div class="relative w-full">
            <Input 
              v-model="searchQuery"
              type="search"              placeholder="Search address..." 
              class="w-full pl-10 h-10 bg-white/5 border-gray-700 text-gray-100 placeholder:text-gray-400 text-sm"
              @input="handleSearch"
            />
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div v-if="suggestions.length > 0" class="absolute z-10 w-full mt-1 bg-gray-900/95 rounded-b-md shadow-lg border-x border-b border-gray-700 backdrop-blur max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              <ul class="py-1">                <li
                  v-for="suggestion in suggestions"
                  :key="suggestion.id"
                  @click="selectAddress(suggestion)"
                  class="px-4 py-2 bg-gray-900 hover:bg-gray-700 cursor-pointer text-gray-200 text-sm"
                >
                  {{ suggestion.place_name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Example Addresses 
        <div class="max-w-2xl mx-auto mt-12">
          <p class="text-sm text-gray-600 mb-4">
           Not sure where to start? Try one of these random addresses to see how the search works:
          </p>
          
          <div class="space-y-4">
            <div v-for="(address, index) in addresses" :key="index" 
                 class="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3">
                <MapPinIcon class="h-5 w-5 text-gray-400" />
                <div>
                  <h3 class="font-medium">{{ address.street }}</h3>
                  <p class="text-sm text-gray-500">{{ address.location }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Badge v-if="address.isNew" variant="secondary">New</Badge>
                <ChevronRightIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        -->
      </main>      <div class="w-full flex justify-center items-center mb-2">
        <nav class="flex gap-6">
          <a href="#" class="text-gray-400 hover:text-white transition text-xs">Blog</a>
          <NuxtLink to="/index2" class="text-gray-400 hover:text-white transition text-xs">Alternative Home</NuxtLink>
        </nav>
      </div>
      <footer class="w-full py-4 mt-0 border-t border-gray-800 text-center text-gray-500 text-xs">
        &copy; {{ new Date().getFullYear() }} Heenco All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SearchIcon, MapPinIcon, ChevronRightIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const searchQuery = ref('')
const suggestions = ref([])
const debounceTimeout = ref(null)
const router = useRouter()

const handleSearch = async () => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
  
  if (!searchQuery.value) {
    suggestions.value = []
    return
  }

  debounceTimeout.value = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?` + 
        new URLSearchParams({
          access_token: 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA',
          country: 'au',
          types: 'address',
          limit: 5
        })
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      suggestions.value = data.features
    } catch (error) {
      console.error('Geocoding error:', error)
      suggestions.value = []
    }
  }, 300)
}

const selectAddress = (suggestion) => {
  searchQuery.value = suggestion.place_name;
  suggestions.value = [];
  const [lng, lat] = suggestion.center;
  router.push({
    path: '/report2',
    query: {
      address: suggestion.place_name,
      lat: lat,
      lng: lng
    }
  });
}

const goToReport = () => {
  if (!searchQuery.value) return;
  router.push({
    path: '/report',
    query: {
      address: searchQuery.value
    }
  });
};

const goToMap = () => {
  if (!searchQuery.value) return;
  // If user already selected a suggestion, use its coordinates
  const selected = suggestions.value.find(s => s.place_name === searchQuery.value);
  if (selected) {
    const [lng, lat] = selected.center;
    router.push({
      path: '/map',
      query: { lat, lng }
    });
  } else {
    // Otherwise, trigger search and use the first suggestion
    handleSearch();
    setTimeout(() => {
      if (suggestions.value.length > 0) {
        const [lng, lat] = suggestions.value[0].center;
        router.push({
          path: '/map',
          query: { lat, lng }
        });
      }
    }, 400);
  }
};

// Example addresses for demonstration
const addresses = [

]

const buttonClass = "hover:bg-orange-500/10 text-gray-200"
</script>

<style scoped>
/* Update text colors for dark theme */
:deep(h2) {
  color: #ffffff;
}

:deep(p) {
  color: #9ca3af;
}



:deep(.bg-gray-100) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

/* Remove or comment out the .bg-white override for the root div and ensure .bg-gradient is visible */
/*
:deep(.bg-white) {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}
*/

:deep(.bg-white) {
  background-color: white;
}

/* Keep existing logo styles */
.logo-text {
  font-family: 'Outfit', sans-serif;
  background: none;
  color: #fff;
  font-size: 3rem;
  letter-spacing: -1px;
  font-weight: 600;
  text-transform: camelcase;
  line-height: 1;
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.logo-text:hover {
  transform: translateY(-1px);
  text-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

/* Add these new styles */
:deep(.dark\:bg-gray-800) {
  background-color: rgba(31, 41, 55, 0.95);
}

:deep(.dark\:hover\:bg-gray-700:hover) {
  background-color: rgba(55, 65, 81, 0.95);
}

:deep(.h-10) {
  height: 2.5rem;
}

:deep(input[type="search"]) {
  font-size: 0.875rem;
  padding-right: 0.75rem;
}

:deep(input[type="search"]::placeholder) {
  opacity: 0.7;
}

:deep(input[type="search"]:focus) {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(74, 222, 128, 0.5); /* text-green-400 equivalent */
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1); /* text-green-400 with lower opacity */
}

/* Custom scrollbar for the suggestions dropdown */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.2);
  border-radius: 3px;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

/* Property Blueprint Background */
.property-background {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.15;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}

/* Property data visualization animation */
@keyframes dataFlow {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.15;
  }
}

.property-grid {
  animation: dataFlow 20s infinite alternate ease-in-out;
}

/* Make sure all content is above the background elements */
.container {
  position: relative;
  z-index: 1;
}
</style>