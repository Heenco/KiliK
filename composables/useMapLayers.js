import { ref } from 'vue'

export function useMapLayers() {
  // Track layer visibility
  const layerVisibility = ref({})

  // Define layer configurations
  const layerDefinitions = {
    address: {
      'id': 'address-layer',
      'type': 'circle',
      'source': 'address',
      'source-layer': 'Address',
      minzoom: 15,
      maxzoom: 22,
      'paint': {
        'circle-radius': 4,
        'circle-color': '#ffa500',
        'circle-opacity': 0.8
      },
      'layout': {
        'visibility': 'visible' // Changed from 'none' to 'visible' to always show address layer
      }
    },
    
    lot: {
      'id': 'lot-layer',
      'type': 'line',
      'source': 'lot',
      'source-layer': 'Lot_boundary',
      minzoom: 17,
      maxzoom: 22,
      'paint': {
        'line-color': '#ffffff',
        'line-width': 1,
        'line-opacity': 0.8
      },
      'layout': {
        'visibility': 'visible' // Changed from 'none' to 'visible' to always show lot layer
      }
    },
    
    flood: {
      'id': 'flood-layer',
      'type': 'fill',
      'source': 'flood',
      'source-layer': 'Flood',
      'paint': {
        'fill-color': '#2563eb',
        'fill-opacity': 0.3,
        'fill-outline-color': '#1e40af'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    landslide: {
      'id': 'landslide-layer',
      'type': 'fill',
      'source': 'landslide',
      'source-layer': 'Landslide',
      'paint': {
        'fill-color': '#f59e0b',
        'fill-opacity': 0.3,
        'fill-outline-color': '#d97706'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    noise: {
      'id': 'noise-layer',
      'type': 'fill',
      'source': 'noise',
      'source-layer': 'Noise_corridors',
      'paint': {
        'fill-color': '#ef4444',
        'fill-opacity': 0.3,
        'fill-outline-color': '#dc2626'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    health: {
      'id': 'health-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'filter': ['any',
        ['==', 'amenity', 'pharmacy'],
        ['==', 'amenity', 'hospital'],
        ['==', 'amenity', 'clinic'],
        ['==', 'amenity', 'doctors'],
        ['==', 'amenity', 'dentist']
      ],
      'paint': {
        'circle-radius': 6,
        'circle-color': [
          'match',
          ['get', 'amenity'],
          'pharmacy', '#22c55e',
          'hospital', '#ef4444',
          'clinic', '#f59e0b',
          'doctors', '#3b82f6',
          'dentist', '#8b5cf6',
          '#71717a'
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    food: {
      'id': 'food-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'filter': ['any',
        ['==', 'shop', 'bakery'],
        ['==', 'shop', 'beverages'],
        ['==', 'shop', 'butcher'],
        ['==', 'shop', 'chocolate'],
        ['==', 'shop', 'coffee'],
        ['==', 'shop', 'convenience'],
        ['==', 'shop', 'deli'],
        ['==', 'shop', 'health_food'],
        ['==', 'shop', 'supermarket'],
        ['==', 'shop', 'tea'],
        ['==', 'shop', 'wholesale']
      ],
      'paint': {
        'circle-radius': 6,
        'circle-color': [
          'match',
          ['get', 'shop'],
          'bakery', '#f59e0b',
          'beverages', '#3b82f6',
          'butcher', '#ef4444',
          'chocolate', '#78350f',
          'coffee', '#92400e',
          'convenience', '#84cc16',
          'deli', '#ea580c',
          'health_food', '#22c55e',
          'supermarket', '#16a34a',
          'tea', '#15803d',
          'wholesale', '#64748b',
          '#71717a' // default color
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    osmPoint: {
      'id': 'osm-point-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'paint': {
        'circle-radius': 1,
        'circle-color': '#71717a',
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Highlight layer for clicked points
    highlight: {
      'id': 'highlight-layer',
      'type': 'circle',
      'source': 'clicked-point',
      'paint': {
        'circle-radius': 12, // Larger radius for outer circle
        'circle-color': '#ffffff', // White fill
        'circle-opacity': 1.0, // Fully opaque
        'circle-stroke-width': 1.3,
        'circle-stroke-color': '#ffffff' // White border
      }
    },

    // Add a second layer for the center point (creating the donut "hole")
    highlightCenter: {
      'id': 'highlight-center-layer',
      'type': 'circle',
      'source': 'clicked-point',
      'paint': {
        'circle-radius': 5, // Smaller radius for inner circle
        'circle-color': '#E91E63', // Magenta center point (matches your image)
        'circle-opacity': 1.0,
        'circle-stroke-width': 0
      }
    },

    // Traffic Signals, Stops & Crossings layer
    trafficSignals: {
      'id': 'traffic-signals-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'filter': ['any',
        ['==', 'highway', 'traffic_signals'],
        //['==', 'highway', 'stop'],
        //['==', 'highway', 'crossing'],
        ['==', 'crossing', 'traffic_signals'],
        //['==', 'crossing', 'zebra']
      ],
      'paint': {
        'circle-radius': 5,
        'circle-color': [
          'match',
          ['get', 'highway'],
          'traffic_signals', '#10B981', // Green for traffic lights
          'stop', '#EF4444', // Red for stop signs
          'crossing', '#F59E0B', // Amber for crossings
          '#F59E0B'  // Default color for crossings
        ],
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White outline for visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Fire Stations & Rescue Services layer
    fireStations: {
      'id': 'fire-stations-layer',
      'type': 'circle',
      'source': 'osm-planetiler', // Updated to use OSM planetiler source
      'source-layer': 'poi',
      minzoom:13, 
      maxzoom:22,
      'filter': ['any',
        // Match against OSM subclass values for fire and rescue services
        ['==', ['get', 'subclass'], 'fire_station'],
        ['==', ['get', 'subclass'], 'ambulance_station']
      ],
      'paint': {
        'circle-radius': 6,
        'circle-color': '#DC2626', // Bright red
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FCA5A5' // Light red stroke
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Retail Shops layer
    retailShops: {
      'id': 'retail-shops-layer',
      'type': 'circle',
      'source': 'overture-places',
      'source-layer': 'place',
      minzoom: 13,
      maxzoom: 22,
      'filter': ['any',
        // Match against the categories fields for retail shops and shopping centers
        ['in', 'shop', ['get', 'categories']],
        ['in', 'store', ['get', 'categories']],
        ['in', 'retail', ['get', 'categories']],
        ['in', 'mall', ['get', 'categories']],
        ['in', 'shopping', ['get', 'categories']],
        ['in', 'boutique', ['get', 'categories']],
        ['in', 'department_store', ['get', 'categories']],
        ['in', 'supermarket', ['get', 'categories']]
      ],
      'paint': {
        'circle-radius': 5,
        'circle-color': '#8B5CF6', // Purple
        'circle-opacity': 0.8,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#C4B5FD' // Light purple stroke
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Hospitals & Healthcare layer
    hospitals: {
      'id': 'hospitals-layer',
      'type': 'circle',
      'source': 'osm-planetiler', // Updated to use OSM planetiler source
      'source-layer': 'poi',
      minzoom:13, 
      maxzoom:22,
      'filter': ['any',
        // Match against OSM subclass values for hospitals and healthcare
        ['==', ['get', 'subclass'], 'hospital'],
        ['==', ['get', 'subclass'], 'clinic'],
        ['==', ['get', 'subclass'], 'doctors'],
        ['==', ['get', 'subclass'], 'dentist']
      ],
      'paint': {
        'circle-radius': 4,
        'circle-color': '#059669', // Green
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White stroke for better visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Speed Camera layer
    speedCamera: {
      'id': 'speed-camera-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'filter': ['any',
        ['==', 'highway', 'speed_camera'],
        ['==', 'amenity', 'speed_camera'],
        ['==', 'enforcement', 'maxspeed']
      ],
      'paint': {
        'circle-radius': 6,
        'circle-color': '#DC2626', // Red
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FECACA' // Light red stroke
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Police stations and services layer
    police: {
      'id': 'police-layer',
      'type': 'circle',
      'source': 'osm-planetiler',  // Updated to use OSM planetiler source
      'source-layer': 'poi',
      minzoom:13, 
      maxzoom:22,
      'filter': ['any',
        // Match against OSM subclass values for police and law enforcement
        ['==', ['get', 'subclass'], 'police'],
        ['==', ['get', 'subclass'], 'courthouse'],
        ['==', ['get', 'subclass'], 'prison']
      ],
      'paint': {
        'circle-radius': 7,
        'circle-color': '#1E3A8A', // Dark blue
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White stroke for better visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Street lights layer - with shining effect
    streetLights: {
      'id': 'street-lights-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      minzoom:13, 
      maxzoom:22,
      'filter': ['==', 'highway', 'street_lamp'],
      'paint': {
        // Outer glow (large, faint circle)
        'circle-radius': 11,
        'circle-color': '#FFEB3B',
        'circle-opacity': 0.15,
        // No stroke for the outer glow
        'circle-stroke-width': 0
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Inner bright core for street lights
    streetLightsCore: {
      'id': 'street-lights-core-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      'filter': ['==', 'highway', 'street_lamp'],
      'paint': {
        // Small bright center
        'circle-radius': 2,
        'circle-color': '#FFFFFF', // Bright white center
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFEB3B', // Yellow glow
        'circle-stroke-opacity': 0.7
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Places (OVERTURE) layer - POIs from Overture data
    places: {
      'id': 'places-layer',
      'type': 'circle',
      'source': 'overture-places',
      'source-layer': 'place',
      // Filter for hospitals - looking for hospital-related terms in the categories JSON
      
      'paint': {
        'circle-radius': 8,
        'circle-color': '#E11D48', // Brighter red color for hospitals
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White stroke for better visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Electricity transmission lines layer
    electricityTransmission: {
      'id': 'electricity-transmission-layer',
      'type': 'line',
      'source': 'electricity',
      'source-layer': 'Electricity_Transmission_Lines',
      minzoom: 10,
      maxzoom: 22,
      'paint': {
        'line-color': '#FFEB3B', // Yellow color for electricity lines
        'line-width': 3,
        'line-opacity': 0.9,
        'line-dasharray': [2, 1] // Dashed line to represent electricity
      },
      'layout': {
        'visibility': 'none',
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    
    // SEIFA 2021 layer
    seifa: {
      'id': 'seifa-layer',
      'type': 'fill',
      'source': 'seifa',
      'source-layer': 'SEIFA_2021_SAL_2021',
      minzoom: 8,
      maxzoom: 22,
      'paint': {
        'fill-color': [
          'case',
          ['==', ['get', 'irsad_score'], null], 'rgba(0, 0, 0, 0)', // Transparent if null
          ['has', 'irsad_score'], [
            'interpolate',
            ['linear'],
            ['get', 'irsad_score'],
            456, '#3b5bdb', // Lowest score - modern indigo blue
            607, '#748ffc', // Low-medium - lighter blue
            759, '#f8f9fa', // Medium - neutral light gray
            911, '#40c057', // Medium-high - vibrant green
            1063, '#0ca678', // High - teal green
            1217, '#087f5b' // Highest score - deep teal
          ],
          'rgba(0, 0, 0, 0)' // Default transparent for any other case
        ],
        'fill-opacity': 0.55,
        'fill-outline-color': 'rgba(0, 0, 0, 0.3)' // Subtle outline
      },
      'layout': {
        'visibility': 'none'
      }
    },

    // Railway Stations layer
    railwayStations: {
      'id': 'railway-stations-layer',
      'type': 'circle',
      'source': 'railway-stations',
      'source-layer': 'Railway_Stations',
      minzoom: 13,
      maxzoom: 22,
      'paint': {
        'circle-radius': 6,
        'circle-color': '#A855F7', // Purple color for railway stations
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White stroke for better visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Railway Lines layer
    railwayLines: {
      'id': 'railway-lines-layer',
      'type': 'line',
      'source': 'railway-lines',
      'source-layer': 'Railway_Lines',
      minzoom: 13,
      maxzoom: 22,
      'paint': {
        'line-color': '#A855F7', // Purple color for railway lines
        'line-width': 2.5,
        'line-opacity': 0.8,
        'line-dasharray': [1, 1] // Dashed line to represent railway tracks
      },
      'layout': {
        'visibility': 'none',
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    
    // Dining & Cafe layer
    diningCafe: {
      'id': 'dining-cafe-layer',
      'type': 'circle',
      'source': 'overture-places',
      'source-layer': 'place',
      minzoom: 13,
      maxzoom: 22,
      'filter': ['any',
        // Match against the categories fields for dining establishments
        ['in', 'restaurant', ['get', 'categories']],
        ['in', 'cafe', ['get', 'categories']],
        ['in', 'coffee', ['get', 'categories']],
        ['in', 'bar', ['get', 'categories']],
        ['in', 'pub', ['get', 'categories']],
        ['in', 'food', ['get', 'categories']],
        ['in', 'dining', ['get', 'categories']],
        ['in', 'fast_food', ['get', 'categories']],
        ['in', 'bakery', ['get', 'categories']],
        ['in', 'pizza', ['get', 'categories']],
        ['in', 'tea', ['get', 'categories']]
      ],
      'paint': {
        'circle-radius': 5,
        'circle-color': '#F59E0B', // Amber/orange color for food places
        'circle-opacity': 0.8,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#FCD34D' // Light yellow stroke
      },
      'layout': {
        'visibility': 'none'
      }
    },
    
    // Bus Stations layer
    busStations: {
      'id': 'bus-stations-layer',
      'type': 'circle',
      'source': 'osm-points',
      'source-layer': 'planet_osm_point',
      minzoom: 13,
      maxzoom: 22,
      'filter': ['any',
        // Filter OSM bus stations and stops
        ['==', 'highway', 'bus_stop'],
        ['==', 'amenity', 'bus_station'],
        ['==', 'public_transport', 'stop_position'],
        ['==', 'public_transport', 'station']
      ],
      'paint': {
        'circle-radius': 5,
        'circle-color': '#0891B2', // Teal blue color for bus stations
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF' // White stroke for better visibility
      },
      'layout': {
        'visibility': 'none'
      }
    },

    // Schools and Education Centres layer
    education: {
      'id': 'education-layer',
      'type': 'circle',
      'source': 'overture-places',
      'source-layer': 'place',
      minzoom: 13,
      maxzoom: 22,
      'filter': ['any',
        // Match against the categories fields for education establishments
        ['in', 'school', ['get', 'categories']],
        ['in', 'college', ['get', 'categories']],
        ['in', 'university', ['get', 'categories']],
        ['in', 'education', ['get', 'categories']],
        ['in', 'kindergarten', ['get', 'categories']],
        ['in', 'preschool', ['get', 'categories']],
        ['in', 'childcare', ['get', 'categories']],
        ['in', 'daycare', ['get', 'categories']],
        ['in', 'training', ['get', 'categories']],
        ['in', 'academy', ['get', 'categories']],
        ['in', 'campus', ['get', 'categories']],
        ['in', 'library', ['get', 'categories']]
      ],
      'paint': {
        'circle-radius': 5,
        'circle-color': '#2563EB', // Blue color for education places
        'circle-opacity': 0.8,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#93C5FD' // Light blue stroke
      },
      'layout': {
        'visibility': 'none'
      }
    },

    isochrone: {
      id: 'isochrone-layer',
      type: 'fill',
      source: 'isochrone',
      minzoom: 13,
      maxzoom: 22,
      paint: {
        'fill-color': '#4c446c',
        'fill-opacity': 1,
        'fill-outline-color': '#4c446c' // Use the pattern defined in the sources
      }
      
    }
    
  }

  // Function to add all layers to the map
  const addAllLayers = (map) => {
    // Find the first layer that should be above the isochrone
    // We're looking for the first "road" or "label" layer to keep those on top
    let insertBeforeId;
    const layers = map.getStyle().layers;
    
    // Find the appropriate layer to insert before
    for (const layer of layers) {
      // Look for base road/path layers which should be above data visualization layers
      if (layer.id.includes('road') || 
          layer.id.includes('path') || 
          layer.id.includes('street') ||
          layer.id.includes('highway') ||
          (layer.type === 'line' && layer.id.includes('transportation'))) {
        insertBeforeId = layer.id;
        break;
      }
    }
    
    // If no suitable layer was found, fallback to the first symbol layer
    if (!insertBeforeId) {
      for (const layer of layers) {
        if (layer.type === 'symbol') {
          insertBeforeId = layer.id;
          break;
        }
      }
    }
    
    // Store railway layers to add in the correct order
    let railwayLinesLayer = null;
    let railwayStationsLayer = null;
    
    // Add data layers in the correct order
    Object.entries(layerDefinitions).forEach(([key, layer]) => {
      // Special handling for isochrone layer to ensure roads and labels appear on top
      if (key === 'isochrone') {
        if (insertBeforeId) {
          map.addLayer(layer, insertBeforeId); // Add before the first road or symbol layer
        } else {
          map.addLayer(layer); // Fallback if no appropriate layer found
        }
      } 
      // Special handling for railway layers to control the order
      else if (key === 'railwayLines') {
        railwayLinesLayer = layer; // Store for later, add lines first
      }
      else if (key === 'railwayStations') {
        railwayStationsLayer = layer; // Store for later, add stations after lines
      }
      else {
        map.addLayer(layer);
      }
    });
    
    // Add railway layers in correct order: lines first, then stations on top
    if (railwayLinesLayer) {
      map.addLayer(railwayLinesLayer);
    }
    if (railwayStationsLayer) {
      map.addLayer(railwayStationsLayer);
    }
  }
  
  // Function to add a specific layer
  const addLayer = (map, layerKey) => {
    if (layerDefinitions[layerKey]) {
      map.addLayer(layerDefinitions[layerKey])
    }
  }
  
  // Function to update layer filter
  const updateLayerFilter = (map, layerId, filter) => {
    if (map && map.getLayer(layerId)) {
      map.setFilter(layerId, filter)
    }
  }
  
  // Function to set layer visibility
  const setLayerVisibility = (map, layerId, visible) => {
    if (map && map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
      layerVisibility.value[layerId] = visible
    }
  }

  return {
    layerDefinitions,
    addAllLayers,
    addLayer,
    updateLayerFilter,
    setLayerVisibility,
    layerVisibility
  }
}