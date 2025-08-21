<template>  <div class="min-h-screen flex flex-col bg-background text-foreground property-background">
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 flex-1 flex flex-col">
      <!-- Main Content -->
      <main class="flex flex-col items-center min-h-[60vh] py-6 flex-1 pt-112"><div class="text-center mb-3">          <span class="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
            Now available in <span class="text-green-400">Brisbane</span>, Australia
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
        <div class="max-w-5xl mx-auto mt-16">
          <div class="text-center mb-8">
            <h3 class="text-xl font-semibold text-foreground mb-3">
              Not sure where to start?
            </h3>
            <p class="text-muted-foreground max-w-2xl mx-auto mb-6">
              Experience the power of our comprehensive property analysis with this sample address.
            </p>
          </div>
          
          <div class="flex justify-center">
            <div 
              @click="searchSampleAddress"
              class="bg-card/50 backdrop-blur border border-border rounded-lg p-6 hover:shadow-lg hover:bg-card/70 transition-all duration-300 cursor-pointer group"
            >
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <div class="text-center sm:text-left flex-1">
                  <p class="text-sm text-muted-foreground mb-2">Try this sample address:</p>
                  <p class="font-medium text-foreground group-hover:text-green-600 transition-colors duration-200">6 Land Street, Toowong 4066, Queensland</p>
                </div>
                <ChevronRightIcon class="w-5 h-5 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Featured Blog Posts Section -->
      <section class="w-full max-w-6xl mx-auto px-4 py-16 mt-8">
        <div class="text-center mb-12">
          <h3 class="text-2xl md:text-3xl font-bold text-foreground mb-4">
            All you need to choose the right property
          </h3>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Expert guides and market insights to help you make informed property decisions
          </p>
        </div>

        <div v-if="featuredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="post in featuredPosts" 
            :key="post.slug"
            class="group bg-card/50 backdrop-blur rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            @click="router.push(`/blog/${post.slug}`)"
          >
            <!-- Image -->
            <div class="aspect-video overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <!-- Category Badge -->
              <div class="mb-3">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="post.categoryClass"
                >
                  {{ post.category }}
                </span>
              </div>

              <!-- Title -->
              <h4 class="font-semibold text-card-foreground mb-2 line-clamp-2 leading-tight">
                {{ post.title }}
              </h4>

              <!-- Description -->
              <p class="text-muted-foreground text-sm line-clamp-2 mb-4">
                {{ post.description }}
              </p>

              <!-- Meta -->
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ post.readTime }} min read</span>
                <span>{{ post.date }}</span>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="text-center">
          <p class="text-muted-foreground">Loading blog posts... ({{ featuredPosts.length }} posts found)</p>
        </div>
      </section>

      <div class="w-full flex justify-center items-center mb-2">
        <nav class="flex gap-6">
          <NuxtLink to="/blog" class="text-muted-foreground hover:text-foreground transition text-xs">Blog</NuxtLink>
          <NuxtLink to="/products" class="text-muted-foreground hover:text-foreground transition text-xs">Pricing</NuxtLink>
          <NuxtLink to="/index2" class="text-muted-foreground hover:text-foreground transition text-xs">Vision</NuxtLink>
          <NuxtLink to="/pdf-view" class="text-muted-foreground hover:text-foreground transition text-xs">Inspection Report</NuxtLink>
        </nav>
      </div>
      <footer class="w-full py-4 mt-0 border-t border-border text-center text-muted-foreground text-xs">
        &copy; {{ new Date().getFullYear() }} Heenco All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchIcon, MapPinIcon, ChevronRightIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const searchQuery = ref('')
const suggestions = ref([])
const debounceTimeout = ref(null)
const router = useRouter()

// Blog posts functionality - load from API
const featuredPosts = ref([])

// Load featured posts from API
const loadFeaturedPosts = async () => {
  try {
    console.log('Attempting to fetch blog posts from API...')
    const posts = await $fetch('/api/blog/featured')
    console.log('API response:', posts)
    featuredPosts.value = posts
    
    if (!posts || posts.length === 0) {
      console.log('No posts returned from API, using fallback')
      throw new Error('No posts returned')
    }
  } catch (error) {
    console.error('Error loading featured posts:', error)
    // Fallback to static data if API fails
    featuredPosts.value = [
      {
        slug: 'neighborhood-safety-evaluation',
        title: 'Evaluate Neighborhood Safety',
        description: 'Access comprehensive, up-to-date crime statistics to assess the safety of the area.',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
        category: 'Safety',
        categoryClass: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        readTime: 5,
        date: '2024-12-15'
      },
      {
        slug: 'flood-risk-assessment',
        title: 'Assess Flood Risk Levels',
        description: 'Evaluate flood risk levels for properties using detailed historical data to avoid future surprises.',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&auto=format',
        category: 'Risk Assessment',
        categoryClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
        readTime: 7,
        date: '2024-12-12'
      },
      {
        slug: 'property-investment-tips',
        title: 'Smart Property Investment Strategies',
        description: 'Learn proven strategies for property investment success.',
        image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop&auto=format',
        category: 'Investment',
        categoryClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
        readTime: 10,
        date: '2024-12-10'
      }
    ]
    console.log('Using fallback posts:', featuredPosts.value)
  }
}

// Load posts when component mounts
onMounted(async () => {
  console.log('Component mounted, loading featured posts...')
  await loadFeaturedPosts()
  console.log('Featured posts after load:', featuredPosts.value)
})

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
  const sampleAddress = '6 Land Street, Toowong 4066, Queensland, Australia';
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

/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Blog card hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>