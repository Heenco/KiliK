<template>
  <div class="h-screen w-full relative">
    <div id="map" class="h-full w-full"></div>
    <div id="controlsContainer" class="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg space-y-3 z-10">
      <h3 class="font-semibold text-sm mb-2">Layer Controls</h3>
      
      <div class="space-y-2">
        <!-- Flood Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="floodToggle" 
            @change="toggleLayer('flood-layer')" 
            :checked="layerVisibility.flood" 
          />
          <label for="floodToggle" class="text-sm">Flood Zones</label>
          <div class="w-4 h-4 bg-blue-500 rounded border"></div>
        </div>

        <!-- Bushfire Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="bushfireToggle" 
            @change="toggleLayer('bushfire-layer')" 
            :checked="layerVisibility.bushfire" 
          />
          <label for="bushfireToggle" class="text-sm">Bushfire Zones</label>
          <div class="w-4 h-4 bg-red-500 rounded border"></div>
        </div>

        <!-- Noise Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="noiseToggle" 
            @change="toggleLayer('noise-layer')" 
            :checked="layerVisibility.noise" 
          />
          <label for="noiseToggle" class="text-sm">Noise Corridors</label>
          <div class="w-4 h-4 bg-purple-500 rounded border"></div>
        </div>

        <!-- Erosion Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="erosionToggle" 
            @change="toggleLayer('erosion-layer')" 
            :checked="layerVisibility.erosion" 
          />
          <label for="erosionToggle" class="text-sm">Erosion Zones</label>
          <div class="w-4 h-4 bg-orange-500 rounded border"></div>
        </div>

        <!-- Acid Sulfate Soils Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="acidSulfateToggle" 
            @change="toggleLayer('acid-sulfate-layer')" 
            :checked="layerVisibility.acidSulfate" 
          />
          <label for="acidSulfateToggle" class="text-sm">Acid Sulfate Soils</label>
          <div class="w-4 h-4 bg-yellow-500 rounded border"></div>
        </div>

        <!-- Oil Pipelines Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="oilPipelinesToggle" 
            @change="toggleLayer('oil-pipelines-layer')" 
            :checked="layerVisibility.oilPipelines" 
          />
          <label for="oilPipelinesToggle" class="text-sm">Oil Pipelines</label>
          <div class="w-4 h-4 bg-gray-700 rounded border"></div>
        </div>

        <!-- Gas Pipelines Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="gasPipelinesToggle" 
            @change="toggleLayer('gas-pipelines-layer')" 
            :checked="layerVisibility.gasPipelines" 
          />
          <label for="gasPipelinesToggle" class="text-sm">Gas Pipelines</label>
          <div class="w-4 h-4 bg-green-600 rounded border"></div>
        </div>

        <!-- Railway Stations Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="railwayStationsToggle" 
            @change="toggleLayer('railway-stations-layer')" 
            :checked="layerVisibility.railwayStations" 
          />
          <label for="railwayStationsToggle" class="text-sm">Railway Stations</label>
          <div class="w-4 h-4 bg-indigo-600 rounded border"></div>
        </div>

        <!-- Railway Lines Layer Toggle -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="railwayLinesToggle" 
            @change="toggleLayer('railway-lines-layer')" 
            :checked="layerVisibility.railwayLines" 
          />
          <label for="railwayLinesToggle" class="text-sm">Railway Lines</label>
          <div class="w-4 h-4 bg-gray-800 rounded border"></div>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="pt-3 border-t border-gray-200">
        <p class="text-xs text-gray-600">Hover over layers for details</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'

let map = null

// Layer visibility state
const layerVisibility = ref({
  flood: true,
  bushfire: true,
  noise: true,
  erosion: true,
  acidSulfate: true,
  oilPipelines: true,
  gasPipelines: true,
  railwayStations: true,
  railwayLines: true
})

// Toggle layer visibility function
function toggleLayer(layerId) {
  if (!map || !map.getLayer(layerId)) return
  
  let visibility
  
  switch (layerId) {
    case 'flood-layer':
      layerVisibility.value.flood = !layerVisibility.value.flood
      visibility = layerVisibility.value.flood ? 'visible' : 'none'
      break
    case 'bushfire-layer':
      layerVisibility.value.bushfire = !layerVisibility.value.bushfire
      visibility = layerVisibility.value.bushfire ? 'visible' : 'none'
      break
    case 'noise-layer':
      layerVisibility.value.noise = !layerVisibility.value.noise
      visibility = layerVisibility.value.noise ? 'visible' : 'none'
      break
    case 'erosion-layer':
      layerVisibility.value.erosion = !layerVisibility.value.erosion
      visibility = layerVisibility.value.erosion ? 'visible' : 'none'
      break
    case 'acid-sulfate-layer':
      layerVisibility.value.acidSulfate = !layerVisibility.value.acidSulfate
      visibility = layerVisibility.value.acidSulfate ? 'visible' : 'none'
      break
    case 'oil-pipelines-layer':
      layerVisibility.value.oilPipelines = !layerVisibility.value.oilPipelines
      visibility = layerVisibility.value.oilPipelines ? 'visible' : 'none'
      break
    case 'gas-pipelines-layer':
      layerVisibility.value.gasPipelines = !layerVisibility.value.gasPipelines
      visibility = layerVisibility.value.gasPipelines ? 'visible' : 'none'
      break
    case 'railway-stations-layer':
      layerVisibility.value.railwayStations = !layerVisibility.value.railwayStations
      visibility = layerVisibility.value.railwayStations ? 'visible' : 'none'
      break
    case 'railway-lines-layer':
      layerVisibility.value.railwayLines = !layerVisibility.value.railwayLines
      visibility = layerVisibility.value.railwayLines ? 'visible' : 'none'
      break
  }
  
  map.setLayoutProperty(layerId, 'visibility', visibility)
}

onMounted(() => {
  // Add PMTiles protocol support
  let protocol = new Protocol()
  maplibregl.addProtocol('pmtiles', protocol.tile)

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [153.0260, -27.4705],
    zoom: 12
  })

  // Create popup for layer information
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  })

  map.on('load', () => {
    // Flood data layer using PMTiles
    map.addSource('flood-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/flood.pmtiles'
    })

    // Bushfire data layer using PMTiles
    map.addSource('bushfire-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/bushfire.pmtiles'
    })

    // Noise data layer using PMTiles
    map.addSource('noise-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/noise.pmtiles'
    })

    // Erosion data layer using PMTiles
    map.addSource('erosion-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/erosion.pmtiles'
    })

    // Acid Sulfate Soils data layer using PMTiles
    map.addSource('acid-sulfate-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/acid_sulfate_soils.pmtiles'
    })

    // Infrastructure data layer using PMTiles (for all infrastructure layers)
    map.addSource('infrastructure-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/infrastructure.pmtiles'
    })

    // Debug: Log source info
    console.log('Flood, Bushfire, Noise, Erosion, Acid Sulfate Soils, and Infrastructure sources added, waiting for data...')
    
    map.on('data', (e) => {
      if (e.sourceId === 'flood-data' && e.isSourceLoaded) {
        console.log('Flood source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('flood-data')
        console.log('Available flood features:', features.length)
        if (features.length > 0) {
          console.log('Sample flood feature:', features[0])
          console.log('Flood feature properties:', features[0].properties)
          console.log('Flood feature source layer:', features[0].sourceLayer)
        }
      }
      
      if (e.sourceId === 'bushfire-data' && e.isSourceLoaded) {
        console.log('Bushfire source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('bushfire-data')
        console.log('Available bushfire features:', features.length)
        if (features.length > 0) {
          console.log('Sample bushfire feature:', features[0])
          console.log('Bushfire feature properties:', features[0].properties)
          console.log('Bushfire feature source layer:', features[0].sourceLayer)
        }
      }
      
      if (e.sourceId === 'noise-data' && e.isSourceLoaded) {
        console.log('Noise source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('noise-data')
        console.log('Available noise features:', features.length)
        if (features.length > 0) {
          console.log('Sample noise feature:', features[0])
          console.log('Noise feature properties:', features[0].properties)
          console.log('Noise feature source layer:', features[0].sourceLayer)
        }
      }
      
      if (e.sourceId === 'erosion-data' && e.isSourceLoaded) {
        console.log('Erosion source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('erosion-data')
        console.log('Available erosion features:', features.length)
        if (features.length > 0) {
          console.log('Sample erosion feature:', features[0])
          console.log('Erosion feature properties:', features[0].properties)
          console.log('Erosion feature source layer:', features[0].sourceLayer)
        }
      }
      
      if (e.sourceId === 'acid-sulfate-data' && e.isSourceLoaded) {
        console.log('Acid Sulfate Soils source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('acid-sulfate-data')
        console.log('Available acid sulfate soils features:', features.length)
        if (features.length > 0) {
          console.log('Sample acid sulfate soils feature:', features[0])
          console.log('Acid sulfate soils feature properties:', features[0].properties)
          console.log('Acid sulfate soils feature source layer:', features[0].sourceLayer)
        }
      }
      
      if (e.sourceId === 'infrastructure-data' && e.isSourceLoaded) {
        console.log('Infrastructure source loaded successfully!')
        
        // Try to query the source to see what's available
        const features = map.querySourceFeatures('infrastructure-data')
        console.log('Available infrastructure features:', features.length)
        if (features.length > 0) {
          console.log('Sample infrastructure feature:', features[0])
          console.log('Infrastructure feature properties:', features[0].properties)
          console.log('Infrastructure feature source layer:', features[0].sourceLayer)
        }
      }
    })

    map.addLayer({
      id: 'flood-layer',
      type: 'fill',
      source: 'flood-data',
      'source-layer': 'flood',
      paint: {
        'fill-color': '#2196F3',
        'fill-opacity': 0.5,
        'fill-outline-color': '#1976D2'
      }
    })

    map.addLayer({
      id: 'bushfire-layer',
      type: 'fill',
      source: 'bushfire-data',
      'source-layer': 'bushfire',
      paint: {
        'fill-color': '#FF5722',
        'fill-opacity': 0.5,
        'fill-outline-color': '#D32F2F'
      }
    })

    map.addLayer({
      id: 'noise-layer',
      type: 'fill',
      source: 'noise-data',
      'source-layer': 'noise_corridors',
      paint: {
        'fill-color': '#9C27B0',
        'fill-opacity': 0.5,
        'fill-outline-color': '#7B1FA2'
      }
    })

    map.addLayer({
      id: 'erosion-layer',
      type: 'fill',
      source: 'erosion-data',
      'source-layer': 'erosion',
      paint: {
        'fill-color': '#FF9800',
        'fill-opacity': 0.5,
        'fill-outline-color': '#F57C00'
      }
    })

    map.addLayer({
      id: 'acid-sulfate-layer',
      type: 'fill',
      source: 'acid-sulfate-data',
      'source-layer': 'acid_sulfate_soils',
      paint: {
        'fill-color': '#FFC107',
        'fill-opacity': 0.5,
        'fill-outline-color': '#FF8F00'
      }
    })

    // Add infrastructure layers
    map.addLayer({
      id: 'oil-pipelines-layer',
      type: 'line',
      source: 'infrastructure-data',
      'source-layer': 'Oil_Pipelines',
      paint: {
        'line-color': '#374151',
        'line-width': 3,
        'line-opacity': 0.8
      }
    })

    map.addLayer({
      id: 'gas-pipelines-layer',
      type: 'line',
      source: 'infrastructure-data',
      'source-layer': 'Gas_Pipelines',
      paint: {
        'line-color': '#059669',
        'line-width': 3,
        'line-opacity': 0.8
      }
    })

    map.addLayer({
      id: 'railway-stations-layer',
      type: 'circle',
      source: 'infrastructure-data',
      'source-layer': 'Railway_Stations',
      paint: {
        'circle-color': '#4F46E5',
        'circle-radius': 6,
        'circle-opacity': 0.8,
        'circle-stroke-color': '#312E81',
        'circle-stroke-width': 2
      }
    })

    map.addLayer({
      id: 'railway-lines-layer',
      type: 'line',
      source: 'infrastructure-data',
      'source-layer': 'Railway_Lines',
      paint: {
        'line-color': '#1F2937',
        'line-width': 4,
        'line-opacity': 0.8
      }
    })

    // Try alternative source layer names if the first one fails
    map.on('error', (e) => {
      if (e.error && e.error.message && (e.error.message.includes('flood-layer') || e.error.message.includes('bushfire-layer') || e.error.message.includes('noise-layer') || e.error.message.includes('erosion-layer') || e.error.message.includes('acid-sulfate-layer') || e.error.message.includes('oil-pipelines-layer') || e.error.message.includes('gas-pipelines-layer') || e.error.message.includes('railway-stations-layer') || e.error.message.includes('railway-lines-layer'))) {
        console.log('Layer failed, trying alternative source layer names...')
        
        // Handle flood layer alternatives
        if (e.error.message.includes('flood-layer') && map.getLayer('flood-layer')) {
          map.removeLayer('flood-layer')
          
          const alternativeNames = ['default', 'flood-zones', 'flooding', 'flood-data', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'flood-layer',
                type: 'fill',
                source: 'flood-data',
                'source-layer': layerName,
                paint: {
                  'fill-color': '#2196F3',
                  'fill-opacity': 0.5,
                  'fill-outline-color': '#1976D2'
                }
              })
              console.log(`Successfully added flood layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed flood layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle bushfire layer alternatives
        if (e.error.message.includes('bushfire-layer') && map.getLayer('bushfire-layer')) {
          map.removeLayer('bushfire-layer')
          
          const alternativeNames = ['default', 'bushfire-zones', 'bushfire-risk', 'bushfire-data', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'bushfire-layer',
                type: 'fill',
                source: 'bushfire-data',
                'source-layer': layerName,
                paint: {
                  'fill-color': '#FF5722',
                  'fill-opacity': 0.5,
                  'fill-outline-color': '#D32F2F'
                }
              })
              console.log(`Successfully added bushfire layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed bushfire layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle noise layer alternatives
        if (e.error.message.includes('noise-layer') && map.getLayer('noise-layer')) {
          map.removeLayer('noise-layer')
          
          const alternativeNames = ['default', 'noise', 'noise-zones', 'noise-data', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'noise-layer',
                type: 'fill',
                source: 'noise-data',
                'source-layer': layerName,
                paint: {
                  'fill-color': '#9C27B0',
                  'fill-opacity': 0.5,
                  'fill-outline-color': '#7B1FA2'
                }
              })
              console.log(`Successfully added noise layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed noise layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle erosion layer alternatives
        if (e.error.message.includes('erosion-layer') && map.getLayer('erosion-layer')) {
          map.removeLayer('erosion-layer')
          
          const alternativeNames = ['default', 'erosion-zones', 'erosion-risk', 'erosion-data', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'erosion-layer',
                type: 'fill',
                source: 'erosion-data',
                'source-layer': layerName,
                paint: {
                  'fill-color': '#FF9800',
                  'fill-opacity': 0.5,
                  'fill-outline-color': '#F57C00'
                }
              })
              console.log(`Successfully added erosion layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed erosion layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Try alternative source layer names for acid sulfate soils layer
        if (e.error.message.includes('acid-sulfate-layer') && map.getLayer('acid-sulfate-layer')) {
          map.removeLayer('acid-sulfate-layer')
          
          const alternativeNames = ['default', 'acid_sulfate', 'acid-sulfate', 'soils', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'acid-sulfate-layer',
                type: 'fill',
                source: 'acid-sulfate-data',
                'source-layer': layerName,
                paint: {
                  'fill-color': '#FFC107',
                  'fill-opacity': 0.5,
                  'fill-outline-color': '#FF8F00'
                }
              })
              console.log(`Successfully added acid sulfate soils layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed acid sulfate soils layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle Oil Pipelines layer alternatives
        if (e.error.message.includes('oil-pipelines-layer') && map.getLayer('oil-pipelines-layer')) {
          map.removeLayer('oil-pipelines-layer')
          
          const alternativeNames = ['default', 'oil-pipelines', 'oil_pipelines', 'pipelines', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'oil-pipelines-layer',
                type: 'line',
                source: 'infrastructure-data',
                'source-layer': layerName,
                paint: {
                  'line-color': '#374151',
                  'line-width': 3,
                  'line-opacity': 0.8
                }
              })
              console.log(`Successfully added oil pipelines layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed oil pipelines layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle Gas Pipelines layer alternatives
        if (e.error.message.includes('gas-pipelines-layer') && map.getLayer('gas-pipelines-layer')) {
          map.removeLayer('gas-pipelines-layer')
          
          const alternativeNames = ['default', 'gas-pipelines', 'gas_pipelines', 'pipelines', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'gas-pipelines-layer',
                type: 'line',
                source: 'infrastructure-data',
                'source-layer': layerName,
                paint: {
                  'line-color': '#059669',
                  'line-width': 3,
                  'line-opacity': 0.8
                }
              })
              console.log(`Successfully added gas pipelines layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed gas pipelines layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle Railway Stations layer alternatives
        if (e.error.message.includes('railway-stations-layer') && map.getLayer('railway-stations-layer')) {
          map.removeLayer('railway-stations-layer')
          
          const alternativeNames = ['default', 'railway-stations', 'railway_stations', 'stations', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'railway-stations-layer',
                type: 'circle',
                source: 'infrastructure-data',
                'source-layer': layerName,
                paint: {
                  'circle-color': '#4F46E5',
                  'circle-radius': 6,
                  'circle-opacity': 0.8,
                  'circle-stroke-color': '#312E81',
                  'circle-stroke-width': 2
                }
              })
              console.log(`Successfully added railway stations layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed railway stations layer with source-layer: ${layerName}`)
            }
          }
        }
        
        // Handle Railway Lines layer alternatives
        if (e.error.message.includes('railway-lines-layer') && map.getLayer('railway-lines-layer')) {
          map.removeLayer('railway-lines-layer')
          
          const alternativeNames = ['default', 'railway-lines', 'railway_lines', 'lines', 'geojsonl']
          
          for (const layerName of alternativeNames) {
            try {
              map.addLayer({
                id: 'railway-lines-layer',
                type: 'line',
                source: 'infrastructure-data',
                'source-layer': layerName,
                paint: {
                  'line-color': '#1F2937',
                  'line-width': 4,
                  'line-opacity': 0.8
                }
              })
              console.log(`Successfully added railway lines layer with source-layer: ${layerName}`)
              break
            } catch (err) {
              console.log(`Failed railway lines layer with source-layer: ${layerName}`)
            }
          }
        }
      }
    })

    // Add hover events for flood, bushfire, noise, erosion, acid sulfate soils, and infrastructure layers
    const layers = [
      { id: 'flood-layer', name: 'Flood Zone', color: '#2196F3' },
      { id: 'bushfire-layer', name: 'Bushfire Zone', color: '#FF5722' },
      { id: 'noise-layer', name: 'Noise Corridor', color: '#9C27B0' },
      { id: 'erosion-layer', name: 'Erosion Zone', color: '#FF9800' },
      { id: 'acid-sulfate-layer', name: 'Acid Sulfate Soils', color: '#FFC107' },
      { id: 'oil-pipelines-layer', name: 'Oil Pipeline', color: '#374151' },
      { id: 'gas-pipelines-layer', name: 'Gas Pipeline', color: '#059669' },
      { id: 'railway-stations-layer', name: 'Railway Station', color: '#4F46E5' },
      { id: 'railway-lines-layer', name: 'Railway Line', color: '#1F2937' }
    ]

    layers.forEach(layer => {
      // Mouse enter event
      map.on('mouseenter', layer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer'
        
        const feature = e.features[0]
        const props = feature.properties
        
        let content = `<div class="p-2 max-w-xs">
          <h4 class="font-bold text-sm mb-1" style="color: ${layer.color}">${layer.name}</h4>`
        
        // Add specific property information for layers
        if (layer.id === 'flood-layer') {
          if (props.flood_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.flood_type}</div>`
          }
          if (props.flood_risk) {
            content += `<div class="text-xs mb-1"><strong>Risk:</strong> ${props.flood_risk}</div>`
          }
          // Show all available properties for flood layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'flood_type' && key !== 'flood_risk') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'bushfire-layer') {
          if (props.bushfire_risk) {
            content += `<div class="text-xs mb-1"><strong>Risk:</strong> ${props.bushfire_risk}</div>`
          }
          if (props.bushfire_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.bushfire_type}</div>`
          }
          // Show all available properties for bushfire layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'bushfire_type' && key !== 'bushfire_risk') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'noise-layer') {
          if (props.noise_level) {
            content += `<div class="text-xs mb-1"><strong>Noise Level:</strong> ${props.noise_level}</div>`
          }
          if (props.noise_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.noise_type}</div>`
          }
          // Show all available properties for noise layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'noise_level' && key !== 'noise_type') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'erosion-layer') {
          if (props.erosion_risk) {
            content += `<div class="text-xs mb-1"><strong>Risk:</strong> ${props.erosion_risk}</div>`
          }
          if (props.erosion_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.erosion_type}</div>`
          }
          // Show all available properties for erosion layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'erosion_risk' && key !== 'erosion_type') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'acid-sulfate-layer') {
          if (props.acid_sulfate_risk) {
            content += `<div class="text-xs mb-1"><strong>Risk:</strong> ${props.acid_sulfate_risk}</div>`
          }
          if (props.soil_type) {
            content += `<div class="text-xs mb-1"><strong>Soil Type:</strong> ${props.soil_type}</div>`
          }
          if (props.depth) {
            content += `<div class="text-xs mb-1"><strong>Depth:</strong> ${props.depth}</div>`
          }
          // Show all available properties for acid sulfate soils layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'acid_sulfate_risk' && key !== 'soil_type' && key !== 'depth') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'oil-pipelines-layer') {
          if (props.pipeline_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.pipeline_type}</div>`
          }
          if (props.operator) {
            content += `<div class="text-xs mb-1"><strong>Operator:</strong> ${props.operator}</div>`
          }
          // Show all available properties for oil pipelines layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'pipeline_type' && key !== 'operator') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'gas-pipelines-layer') {
          if (props.pipeline_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.pipeline_type}</div>`
          }
          if (props.operator) {
            content += `<div class="text-xs mb-1"><strong>Operator:</strong> ${props.operator}</div>`
          }
          // Show all available properties for gas pipelines layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'pipeline_type' && key !== 'operator') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'railway-stations-layer') {
          if (props.station_name) {
            content += `<div class="text-xs mb-1"><strong>Station:</strong> ${props.station_name}</div>`
          }
          if (props.station_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.station_type}</div>`
          }
          // Show all available properties for railway stations layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'station_name' && key !== 'station_type') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        } else if (layer.id === 'railway-lines-layer') {
          if (props.line_name) {
            content += `<div class="text-xs mb-1"><strong>Line:</strong> ${props.line_name}</div>`
          }
          if (props.line_type) {
            content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.line_type}</div>`
          }
          // Show all available properties for railway lines layer
          Object.keys(props).forEach(key => {
            if (props[key] && key !== 'geometry' && key !== 'line_name' && key !== 'line_type') {
              content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`
            }
          })
        }
        
        content += '</div>'
        
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map)
      })

      // Mouse leave event
      map.on('mouseleave', layer.id, () => {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
/* Ensure proper styling for controls */
#controlsContainer {
  min-width: 200px;
  max-width: 250px;
}

/* Custom checkbox styling */
input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
}

/* Layer indicator colors */
.bg-blue-500 {
  background-color: #2196F3;
}

.bg-red-500 {
  background-color: #FF5722;
}

.bg-purple-500 {
  background-color: #9C27B0;
}

.bg-orange-500 {
  background-color: #FF9800;
}

.bg-gray-700 {
  background-color: #374151;
}

.bg-green-600 {
  background-color: #059669;
}

.bg-indigo-600 {
  background-color: #4F46E5;
}

.bg-gray-800 {
  background-color: #1F2937;
}
</style>
