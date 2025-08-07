<template>
  <div class="h-screen w-full relative flex">
    <!-- Map Container -->
    <div id="mapai2" class="flex-1 h-full relative">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="text-white text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>

      <!-- Map info overlay -->
      <Card class="absolute top-4 left-4 z-40 w-80">
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Globe class="h-5 w-5" />
            MapAI 2 - Simple Basemap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <!-- Current basemap info -->
            <div>
              <label class="text-sm font-medium text-muted-foreground">Current Basemap</label>
              <p class="text-sm">{{ currentBasemapName }}</p>
            </div>
            
            <!-- Basemap selection -->
            <div>
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Choose Basemap</label>
              <div class="grid grid-cols-2 gap-2">
                <Button 
                  v-for="basemap in basemaps" 
                  :key="basemap.id"
                  variant="outline" 
                  size="sm" 
                  :class="{ 'bg-primary text-primary-foreground': currentBasemap === basemap.id }"
                  @click="changeBasemap(basemap.id)"
                >
                  {{ basemap.name }}
                </Button>
              </div>
            </div>

            <!-- Map coordinates -->
            <div v-if="mapCenter">
              <label class="text-sm font-medium text-muted-foreground">Center Coordinates</label>
              <p class="text-xs font-mono">{{ mapCenter.lng.toFixed(4) }}, {{ mapCenter.lat.toFixed(4) }}</p>
              <p class="text-xs text-muted-foreground">Zoom: {{ mapZoom }}</p>
            </div>

            <!-- Overture Places Layer -->
            <div>
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Overture Places</label>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Places Layer</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="togglePlacesLayer"
                  >
                    {{ showPlacesLayer ? 'Hide' : 'Show' }}
                  </Button>
                </div>
                <div v-if="showPlacesLayer" class="text-xs text-muted-foreground">
                  <p>{{ placesCount }} places visible</p>
                  <p>Data: Overture Maps</p>
                </div>
              </div>
            </div>

            <!-- Quick navigation -->
            <div>
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Quick Navigation</label>
              <div class="space-y-2">
                <Button 
                  v-for="location in quickLocations" 
                  :key="location.name"
                  variant="outline" 
                  size="sm" 
                  class="w-full justify-start"
                  @click="flyToLocation(location)"
                >
                  <MapPin class="h-4 w-4 mr-2" />
                  {{ location.name }}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Map attribution and info -->
      <div class="absolute bottom-4 right-4 z-40">
        <Card class="p-2">
          <p class="text-xs text-muted-foreground">
            MapLibre GL JS • Open Source Mapping
          </p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import { Globe, MapPin } from 'lucide-vue-next'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/button/Button.vue'

// Map instance
let map = null

// Reactive state
const isLoading = ref(true)
const currentBasemap = ref('positron')
const currentBasemapName = ref('Light Theme')
const mapCenter = ref(null)
const mapZoom = ref(10)
const showPlacesLayer = ref(false)
const placesCount = ref(0)

// Basemap configurations
const basemaps = ref([
  {
    id: 'positron',
    name: 'Light',
    url: 'https://tiles.openfreemap.org/styles/positron'
  },
  {
    id: 'dark-matter',
    name: 'Dark',
    url: 'https://tiles.openfreemap.org/styles/dark-matter'
  },
  {
    id: 'liberty',
    name: 'Liberty',
    url: 'https://tiles.openfreemap.org/styles/liberty'
  },
  {
    id: 'default',
    name: 'Default',
    url: 'https://demotiles.maplibre.org/style.json'
  }
])

// Quick navigation locations
const quickLocations = ref([
  {
    name: 'Brisbane',
    center: [153.0251, -27.4698],
    zoom: 12
  },
  {
    name: 'Sydney',
    center: [151.2093, -33.8688],
    zoom: 12
  },
  {
    name: 'Melbourne',
    center: [144.9631, -37.8136],
    zoom: 12
  },
  {
    name: 'Perth',
    center: [115.8605, -31.9505],
    zoom: 12
  }
])

// Set page title
useHead({
  title: 'MapAI 2 - Simple Basemap'
})

// Initialize map
onMounted(async () => {
  try {
    // Initialize MapLibre map
    map = new maplibregl.Map({
      container: 'mapai2',
      style: basemaps.value.find(b => b.id === currentBasemap.value).url,
      center: [153.0251, -27.4698], // Brisbane coordinates
      zoom: 10,
      attributionControl: false // We'll add custom attribution
    })

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Add scale control
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left')

    // Map event listeners
    map.on('load', () => {
      isLoading.value = false
      updateMapInfo()
      addPlacesLayer()
      console.log('MapAI2 map loaded successfully')
    })

    map.on('move', () => {
      updateMapInfo()
      if (showPlacesLayer.value) {
        updatePlacesCount()
      }
    })

    map.on('zoom', () => {
      updateMapInfo()
      if (showPlacesLayer.value) {
        updatePlacesCount()
      }
    })

    // Add click handler to log coordinates and show place info
    map.on('click', (e) => {
      console.log('Clicked coordinates:', e.lngLat)
      
      // Check if we clicked on a place
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['overture-places-layer']
      })
      
      if (features.length > 0) {
        const feature = features[0]
        const properties = feature.properties
        
        // Create popup with place information
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${properties.name || 'Unknown Place'}</h3>
              ${properties.category ? `<p class="text-xs text-gray-600">Category: ${properties.category}</p>` : ''}
              ${properties.brand ? `<p class="text-xs text-gray-600">Brand: ${properties.brand}</p>` : ''}
              ${properties.addr_street ? `<p class="text-xs text-gray-600">Address: ${properties.addr_street}</p>` : ''}
            </div>
          `)
          .addTo(map)
      } else {
        // Optional: Add a temporary marker at clicked location
        const marker = new maplibregl.Marker()
          .setLngLat(e.lngLat)
          .addTo(map)
        
        // Remove marker after 3 seconds
        setTimeout(() => {
          marker.remove()
        }, 3000)
      }
    })

    // Change cursor on hover over places
    map.on('mouseenter', 'overture-places-layer', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'overture-places-layer', () => {
      map.getCanvas().style.cursor = ''
    })

  } catch (error) {
    console.error('Error initializing map:', error)
    isLoading.value = false
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Update map center and zoom info
const updateMapInfo = () => {
  if (map) {
    mapCenter.value = map.getCenter()
    mapZoom.value = Math.round(map.getZoom() * 10) / 10
  }
}

// Add Overture Places layer
const addPlacesLayer = () => {
  if (!map) return

  try {
    // Add PMTiles source for Overture Places
    map.addSource('overture-places', {
      type: 'vector',
      tiles: [`${window.location.origin}/api/pmtiles-proxy?dataset=places&z={z}&x={x}&y={y}`],
      minzoom: 10,
      maxzoom: 14
    })

    // Add places layer (circles for points)
    map.addLayer({
      id: 'overture-places-layer',
      type: 'circle',
      source: 'overture-places',
      'source-layer': 'places', // This might need to be adjusted based on PMTiles structure
      layout: {
        visibility: 'none' // Start hidden
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 3,
          14, 8
        ],
        'circle-color': [
          'case',
          ['has', 'category'],
          [
            'match',
            ['get', 'category'],
            'restaurant', '#FF6B6B',
            'retail', '#4ECDC4',
            'education', '#45B7D1',
            'healthcare', '#96CEB4',
            'entertainment', '#FFEAA7',
            'accommodation', '#DDA0DD',
            'transportation', '#98D8C8',
            '#6C5CE7' // default color
          ],
          '#6C5CE7' // fallback if no category
        ],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8
      }
    })

    console.log('Overture Places layer added successfully')
  } catch (error) {
    console.error('Error adding Overture Places layer:', error)
  }
}

// Toggle Places layer visibility
const togglePlacesLayer = () => {
  if (!map) return

  showPlacesLayer.value = !showPlacesLayer.value
  
  const visibility = showPlacesLayer.value ? 'visible' : 'none'
  map.setLayoutProperty('overture-places-layer', 'visibility', visibility)
  
  if (showPlacesLayer.value) {
    updatePlacesCount()
  } else {
    placesCount.value = 0
  }
}

// Update places count (rough estimate based on visible features)
const updatePlacesCount = () => {
  if (!map || !showPlacesLayer.value) {
    placesCount.value = 0
    return
  }
  
  try {
    const features = map.queryRenderedFeatures({
      layers: ['overture-places-layer']
    })
    placesCount.value = features.length
  } catch (error) {
    console.error('Error counting places:', error)
    placesCount.value = 0
  }
}

// Change basemap style
const changeBasemap = (basemapId) => {
  const basemap = basemaps.value.find(b => b.id === basemapId)
  if (basemap && map) {
    isLoading.value = true
    currentBasemap.value = basemapId
    currentBasemapName.value = basemap.name
    
    map.setStyle(basemap.url)
    
    map.once('styledata', () => {
      // Re-add the places layer after style change
      addPlacesLayer()
      if (showPlacesLayer.value) {
        setTimeout(() => {
          togglePlacesLayer()
        }, 100)
      }
      isLoading.value = false
    })
  }
}

// Fly to a specific location
const flyToLocation = (location) => {
  if (map) {
    map.flyTo({
      center: location.center,
      zoom: location.zoom,
      duration: 2000,
      essential: true
    })
  }
}
</script>

<style scoped>
@import 'maplibre-gl/dist/maplibre-gl.css';

/* Map container styling */
#mapai2 {
  background-color: #f8f9fa;
  position: relative;
  width: 100%;
  height: 100%;
}

/* Ensure map controls are properly positioned */
#mapai2 .maplibregl-ctrl-top-right {
  top: 10px;
  right: 10px;
}

#mapai2 .maplibregl-ctrl-bottom-left {
  bottom: 10px;
  left: 10px;
}

/* Custom styles for loading overlay */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}
</style>
