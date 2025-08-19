<template>  <div class="min-h-screen flex flex-col bg-background text-foreground property-background">
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 flex-1 flex flex-col">
      <!-- Main Content -->
      <main class="flex flex-col justify-center items-center min-h-[60vh] py-6 flex-1"><div class="text-center mb-3">          <span class="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
            Now available in Brisbane, Australia
          </span>        </div>        <h2 class="text-center text-4xl font-bold mb-2 text-foreground">
          Find Your Dream Home with <span class="text-green-400">Confidence</span>
        </h2>

        <!-- Search Bar -->
        <div class="max-w-2xl w-full flex justify-center items-center mt-2">
          <div class="relative w-full">
            <Input 
              v-model="searchQuery"
              type="search"              placeholder="Search address..." 
              class="w-full pl-10 h-10"
              @input="handleSearch"
            />
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div v-if="suggestions.length > 0" class="absolute z-10 w-full mt-1 bg-popover rounded-b-md shadow-lg border-x border-b border-border backdrop-blur max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              <ul class="py-1">                <li
                  v-for="suggestion in suggestions"
                  :key="suggestion.id"
                  @click="selectAddress(suggestion)"
                  class="px-4 py-2 bg-popover hover:bg-accent cursor-pointer text-popover-foreground text-sm"
                >
                  {{ suggestion.place_name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Sample Address -->
        <div class="max-w-2xl mx-auto mt-12">
          <p class="text-sm text-muted-foreground mb-3 text-center">
           Not sure where to start? Try this sample address:
          </p>
          
          <div class="flex justify-center">
            <button 
              @click="searchSampleAddress"
              class="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-secondary-foreground text-sm transition-colors duration-200"
            >
              6 Land Street, Toowong QLD
            </button>
          </div>
        </div>
      </main>      <div class="w-full flex justify-center items-center mb-2">
        <nav class="flex gap-6">
          <a href="#" class="text-muted-foreground hover:text-foreground transition text-xs">Blog</a>
          <NuxtLink to="/products" class="text-muted-foreground hover:text-foreground transition text-xs">Pricing</NuxtLink>
          <NuxtLink to="/index2" class="text-muted-foreground hover:text-foreground transition text-xs">Alternative Home</NuxtLink>
        </nav>
      </div>
      <footer class="w-full py-4 mt-0 border-t border-border text-center text-muted-foreground text-xs">
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

const searchSampleAddress = async () => {
  const sampleAddress = '6 Land Street, Toowong QLD, Australia';
  searchQuery.value = sampleAddress;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(sampleAddress)}.json?` + 
      new URLSearchParams({
        access_token: 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA',
        country: 'au',
        types: 'address',
        limit: 1
      })
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      router.push({
        path: '/report2',
        query: {
          address: data.features[0].place_name,
          lat: lat,
          lng: lng
        }
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }
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
/* Property Blueprint Background */
.property-background {
  position: relative;
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.1;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, hsl(var(--ring) / 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--ring) / 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='hsl(158 64%% 52%% / 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='hsl(158 64%% 52%% / 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='hsl(158 64%% 52%% / 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='hsl(158 64%% 52%% / 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}

/* Property data visualization animation */
@keyframes dataFlow {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.08;
  }
  50% {
    opacity: 0.12;
  }
  100% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.08;
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

/* Custom scrollbar for the suggestions dropdown */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar-track {
  background: hsl(var(--muted) / 0.2);
  border-radius: 3px;
}

.scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 3px;
}
</style>