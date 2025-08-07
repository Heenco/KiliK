<template>
  <div class="h-screen w-full relative">
    <div id="map" class="h-full w-full"></div>
    <div id="checkboxContainer" class="absolute top-40 left-4 bg-white p-4 rounded">
      <input type="checkbox" id="toggleCheckbox" @change="toggleLayerVisibility" :checked="isLayerVisible" />
      <label for="toggleCheckbox"> LZN Layer</label>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA'
mapboxgl.accessToken = MAPBOX_TOKEN

let map = null
let isLayerVisible = true

function toggleLayerVisibility() {
  if (map && map.getLayer('custom-layer')) {
    isLayerVisible = !isLayerVisible
    map.setLayoutProperty('custom-layer', 'visibility', isLayerVisible ? 'visible' : 'none')
  }
}

onMounted(() => {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [151.2120881644596, -33.88465867322051],
    zoom: 18
  })

  map.on('load', () => {
    // Existing custom tiles layer
    map.addSource('custom-tiles', {
      type: 'vector',
      tiles: ['http://172.105.174.70:3000/LZN/{z}/{x}/{y}'],
      minzoom: 0,
      maxzoom: 22
    })

    map.addLayer({
      id: 'custom-layer',
      type: 'fill',
      source: 'custom-tiles',
      'source-layer': 'LZN',
      paint: {
        'fill-color': '#DAA520',
        'fill-opacity': 0.7
      }
    })

    // New LandZoning layer
    map.addSource('land-zoning', {
      type: 'vector',
      tiles: ['http://172.105.174.70:8090/LandZoning/{z}/{x}/{y}'],
      minzoom: 0,
      maxzoom: 22
    })

    map.addLayer({
      id: 'land-zoning-layer',
      type: 'fill',
      source: 'land-zoning',
      'source-layer': 'LandZoning',
      paint: {
        'fill-color': '#32CD32', // lime green color
        'fill-opacity': 0.6
      }
    })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>
