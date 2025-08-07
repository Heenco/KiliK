<template>
  <div class="h-screen w-full relative">
    <div id="map" class="h-full w-full"></div>
    
    <!-- Layer Control Panel -->
    <div class="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 min-w-48">
      <h3 class="font-semibold text-sm mb-3">Layers</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            v-model="layersVisible.arcgis"
            @change="toggleLayer('arcgis')"
            class="mr-2"
          >
          <span class="text-sm">ArcGIS Layer</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

let map = null
let cachedLayerInfo = null // Cache the layer info so we don't fetch it repeatedly

// Layer visibility state
const layersVisible = reactive({
  arcgis: true
})

// Toggle layer visibility
const toggleLayer = (layerId) => {
  if (map) {
    const visibility = layersVisible[layerId] ? 'visible' : 'none'
    map.setLayoutProperty(layerId, 'visibility', visibility)
  }
}

onMounted(() => {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty', // Light base map style
    center: [151.0281, -33.4678],
    zoom: 12
  })

  map.on('load', () => {
    // Add ArcGIS REST feature service as GeoJSON source
    // This will load data for the current map view
    loadArcGISLayer()
  })

  // Function to load ArcGIS layer data based on current map bounds
  const loadArcGISLayer = async () => {
    try {
      const bounds = map.getBounds()
      const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`
      
      const url = `https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Principal_Planning_Layers/MapServer/7/query?where=1%3D1&geometry=${bbox}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=geojson`
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('GeoJSON data sample:', data.features?.slice(0, 2)) // Log first 2 features
      
      // Log the properties of the first feature to see available fields
      if (data.features && data.features.length > 0) {
        console.log('First feature properties:', data.features[0].properties)
        console.log('Available property keys:', Object.keys(data.features[0].properties))
      }
      
      // Add or update the GeoJSON source
      if (map.getSource('arcgis-source')) {
        map.getSource('arcgis-source').setData(data)
      } else {
        // First, get the layer info to extract drawing info (use cache if available)
        if (!cachedLayerInfo) {
          cachedLayerInfo = await getLayerDrawingInfo()
        }
        const colorMapping = createColorMapping(cachedLayerInfo, data.features)
        
        map.addSource('arcgis-source', {
          type: 'geojson',
          data: data
        })
        
        // Add the layer with dynamic color mapping
        map.addLayer({
          id: 'arcgis',
          type: 'fill',
          source: 'arcgis-source',
          paint: {
            'fill-color': colorMapping,
            'fill-opacity': 0.6
          }
        })
        
        // Add stroke layer
        map.addLayer({
          id: 'arcgis-stroke',
          type: 'line',
          source: 'arcgis-source',
          paint: {
            'line-color': '#000000',
            'line-width': 0.5
          }
        })
      }
    } catch (error) {
      console.error('Error loading ArcGIS layer:', error)
    }
  }

  // Function to get layer drawing info from ArcGIS service
  const getLayerDrawingInfo = async () => {
    try {
      const layerInfoUrl = 'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Principal_Planning_Layers/MapServer/7?f=json'
      const response = await fetch(layerInfoUrl)
      const layerInfo = await response.json()
      return layerInfo
    } catch (error) {
      console.error('Error fetching layer info:', error)
      return null
    }
  }

  // Function to create color mapping from drawing info
  const createColorMapping = (layerInfo, features) => {
    console.log('Layer info received:', layerInfo)
    console.log('Sample feature data for field matching:', features?.[0]?.properties)
    
    if (!layerInfo || !layerInfo.drawingInfo || !layerInfo.drawingInfo.renderer) {
      console.log('No drawing info found, using fallback color')
      return '#888888'
    }

    const renderer = layerInfo.drawingInfo.renderer
    console.log('Renderer:', renderer)
    
    if (renderer.type === 'uniqueValue' && renderer.uniqueValueInfos) {
      // Build MapLibre style expression
      const colorExpression = ['case']
      
      console.log('Processing unique value infos:', renderer.uniqueValueInfos.length, 'items')
      console.log('Renderer field1:', renderer.field1)
      
      // Log some sample renderer values to see what we're matching against
      const rendererValues = renderer.uniqueValueInfos.slice(0, 5).map(info => info.value)
      console.log('Sample renderer values:', rendererValues)
      
      // Try to match the correct field name
      let fieldName = renderer.field1 || 'SYM_CODE'
      
      // If we have sample data, check what fields are actually available
      if (features && features.length > 0) {
        const availableFields = Object.keys(features[0].properties || {})
        console.log('Available fields in data:', availableFields)
        
        // Check some actual SYM_CODE values from the data
        const symCodeValues = features.slice(0, 5).map(f => f.properties.SYM_CODE)
        console.log('Sample SYM_CODE values from data:', symCodeValues)
        
        // Try common field names
        const possibleFields = [renderer.field1, 'SYM_CODE', 'SYMCODE', 'ZONE_CODE', 'ZONING', 'CODE','LAY_CLASS']
        for (const field of possibleFields) {
          if (field && availableFields.includes(field)) {
            fieldName = field
            console.log(`Using field: ${fieldName}`)
            break
          }
        }
      }
      
      renderer.uniqueValueInfos.forEach((valueInfo, index) => {
        const fullValue = valueInfo.value
        // Extract just the code part (before the comma) to match the data
        const symCode = fullValue.includes(',') ? fullValue.split(',')[0] : fullValue
        const color = valueInfo.symbol?.color
        
        if (index < 5) { // Log first 5 for debugging
          console.log(`Item ${index}:`, { fullValue, symCode, color, symbol: valueInfo.symbol })
        }
        
        if (color && Array.isArray(color) && color.length >= 3) {
          // Convert [R, G, B, A] to hex - handle both 0-255 and 0-1 ranges
          let r, g, b
          if (color[0] <= 1 && color[1] <= 1 && color[2] <= 1) {
            // Colors are in 0-1 range, convert to 0-255
            r = Math.round(color[0] * 255)
            g = Math.round(color[1] * 255)
            b = Math.round(color[2] * 255)
          } else {
            // Colors are in 0-255 range
            r = color[0]
            g = color[1]
            b = color[2]
          }
          
          const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          
          if (index < 5) { // Log first 5 mappings
            console.log(`Mapping ${symCode} -> ${hexColor} (RGB: ${r},${g},${b})`)
          }
          
          colorExpression.push(['==', ['get', fieldName], symCode])
          colorExpression.push(hexColor)
        }
      })
      
      // Add default color
      colorExpression.push('#cccccc') // Light grey for any unmapped codes
      
      console.log('Final color expression length:', colorExpression.length)
      console.log('Using field name:', fieldName)
      return colorExpression
    }
    
    // Fallback if renderer type is not supported
    console.log('Renderer type not supported:', renderer.type)
    return '#888888'
  }

  // Reload data when map moves (for better performance, you might want to debounce this)
  map.on('moveend', loadArcGISLayer)
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>
