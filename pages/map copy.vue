<template>
  <div class="h-screen w-full relative">
    <div id="map" class="h-full w-full"></div>
    
    <!-- Updated card dimensions -->
    <div class="absolute top-4 right-4 z-10 w-[25vw] h-[60vh]">
      <Card class="bg-white/90 shadow-lg h-full">
        <CardContent class="p-3 h-full overflow-y-auto">
          <Tabs default-value="hazard" class="w-full h-full">
            <TabsList class="grid w-full grid-cols-4">
              <TabsTrigger value="hazard">Hazard</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="census">Census</TabsTrigger>
            </TabsList>
            
            <!-- Update TabsContent sections to handle overflow -->
            <TabsContent value="hazard" class="h-[calc(100%-40px)]">
              <div class="py-2">
                <h3 class="font-medium mb-2">Hazard Information</h3>
                <p class="text-sm text-gray-600">Hazard content here</p>
              </div>
            </TabsContent>
            <TabsContent value="access" class="h-[calc(100%-40px)]">
              <div class="py-2">
                <h3 class="font-medium mb-2"></h3>
                <div class="flex items-center space-x-2 mb-4">
                  <Switch id="address-layer" v-model="showAddressLayer" />
                  <Label for="address-layer"> Address </Label>
                </div>
                <p class="text-sm text-gray-600"></p>
              </div>
            </TabsContent>
            <TabsContent value="safety" class="h-[calc(100%-40px)]">
              <div class="py-2">
                <h3 class="font-medium mb-2">Safety Information</h3>
                <p class="text-sm text-gray-600">Safety content here</p>
              </div>
            </TabsContent>
            <TabsContent value="census" class="h-[calc(100%-40px)]">
              <div class="py-2">
                <h3 class="font-medium mb-2">Census Information</h3>
                <p class="text-sm text-gray-600">Census content here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Input } from '@/components/ui/input'
import { 
  Card,
  CardContent
} from '@/components/ui/card'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const route = useRoute()
const router = useRouter()
let map = null
let currentMarker = null

// Mapbox configuration
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA'
mapboxgl.accessToken = MAPBOX_TOKEN

const showAddressLayer = ref(false)

onMounted(() => {
  const lat = Number(route.query.lat) || -27.4698 // Default to Brisbane
  const lng = Number(route.query.lng) || 153.0251

  // Initialize map
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [lng, lat],
    zoom: 15
  })

  // Add geocoder control
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    placeholder: 'Search',
    countries: 'au', // Restrict to Australia
    types: 'address,place', // Restrict to addresses and places
    proximity: {
      longitude: lng,
      latitude: lat
    }
  })

  map.addControl(geocoder, 'top-left')

  // Handle result selection
  geocoder.on('result', (event) => {
    const coordinates = event.result.geometry.coordinates
    
    if (currentMarker) {
      currentMarker.remove()
    }

    currentMarker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map)

    map.flyTo({
      center: coordinates,
      zoom: 15,
      essential: true
    })

    router.replace({
      query: {
        lng: coordinates[0],
        lat: coordinates[1]
      }
    })
  })

  // Add navigation controls and initial marker
 
  currentMarker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map)

  // Add vector tile source after map loads
  map.on('load', () => {
    map.addSource('address', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3001/Address/{z}/{x}/{y}'],
      minzoom: 10,
      maxzoom: 22
    })

    map.addLayer({
      'id': 'address-layer',
      'type': 'circle',
      'source': 'address',
      'source-layer': 'Address', // Adjust this if your source layer name is different
      'paint': {
        'circle-radius': 4,
        'circle-color': '#2563eb',
        'circle-opacity': 0.8
      },
      'layout': {
        'visibility': 'none'
      }
    })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

// Watch for changes to the switch
watch(showAddressLayer, (newValue) => {
  if (map) {
    map.setLayoutProperty(
      'address-layer',
      'visibility',
      newValue ? 'visible' : 'none'
    )
  }
})
</script>

<style>
@import 'mapbox-gl/dist/mapbox-gl.css';

/* Geocoder custom styles */
.mapboxgl-ctrl-geocoder {
  min-width: 300px !important;
  font-family: inherit;
  background-color: rgba(255, 255, 255, 0.9);
}

.mapboxgl-ctrl-geocoder--input {
  height: 40px !important;
  font-size: 0.875rem !important; /* 14px */
}

.mapboxgl-ctrl-geocoder--input::placeholder {
  font-size: 0.875rem; /* 14px */
  opacity: 0.75;
}

.mapboxgl-ctrl-geocoder--suggestion {
  color: #333;
}

.mapboxgl-ctrl-bottom-right {
  display: none;
}

/* Update the margin-top for map controls */
.mapboxgl-ctrl-top-right {
  margin-top: calc(60vh + 1rem); /* Adjust based on card height */
}

/* Add styles for the card content scrolling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Custom Tab Styles */
[data-tab-trigger] {
  font-weight: 500;
  transition: all 0.2s ease;
}

[data-tab-trigger][data-state="active"] {
  background-color: white;
  color: #ea580c;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Add hover effect for non-active tabs */
[data-tab-trigger]:not([data-state="active"]):hover {
  background-color: rgba(255, 255, 255, 0.8);
  color: #f97316;
}

/* Style the tab list container */
[role="tablist"] {
  background-color: rgba(243, 244, 246, 0.8);
  padding: 2px;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

/* Add transition for content */
[role="tabpanel"] {
  transition: all 0.3s ease;
}

[role="tabpanel"][data-state="active"] {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>