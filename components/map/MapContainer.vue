<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { useMapSources } from '@/composables/useMapSources'
import { useMapLayers } from '@/composables/useMapLayers'
import { useWalkabilityScore } from '@/composables/useWalkabilityScore'
import { createSVGIconUrl } from '@/utils/iconUtils'
import * as turf from '@turf/turf'
import { countFeaturesWithinIsochrone, calculateDistance, fetchFloodRiskData } from '@/utils/spatialUtils'

const props = defineProps({
  showAddressLayer: Boolean,
  showLotLayer: Boolean,
  showOsmPointLayer: Boolean,
  showFloodLayer: Boolean,
  showLandslideLayer: Boolean,
  showNoiseLayer: Boolean,
  showHealthLayer: Boolean,
  showFoodLayer: Boolean,
  showIsochroneLayer: Boolean,
  showStreetLightsLayer: Boolean,
  showPoliceLayer: Boolean,
  showSpeedCameraLayer: Boolean,
  showTrafficSignalsLayer: Boolean, // Add traffic signals layer property
  showFireStationsLayer: Boolean,  // Add fire stations layer property
  showHospitalsLayer: Boolean,     // Add hospitals layer property
  showRetailShopsLayer: Boolean,   // Add retail shops layer property
  showPlacesLayer: Boolean,       // Add OVERTURE places layer property
  showRailwayStationsLayer: Boolean, // Add Railway Stations layer property
  showRailwayLinesLayer: Boolean,    // Add Railway Lines layer property
  showBusStationsLayer: Boolean,     // Add Bus Stations layer property
  showElectricityTransmissionLayer: Boolean, // Add electricity transmission layer property
  showDiningCafeLayer: Boolean, // Add Dining & Cafe layer property
  showSeifaLayer: Boolean, // Add SEIFA layer property
  showEducationLayer: Boolean, // Add Schools & Education layer property
  healthFilter: {
    type: Array,
    default: () => []
  },
  foodFilter: {
    type: Array,
    default: () => []
  },
  travelMode: String,
  travelTime: Number,
  selectedAddress: Object
})

const emit = defineEmits([
  'update:showAddressLayer',
  'update:showLotLayer',
  'update:showOsmPointLayer',
  'update:showFloodLayer',
  'update:showLandslideLayer',
  'update:showNoiseLayer',
  'update:showHealthLayer',
  'update:showFoodLayer',
  'update:showIsochroneLayer',
  'update:showStreetLightsLayer',
  'update:showPoliceLayer',
  'update:showSpeedCameraLayer',
  'update:showTrafficSignalsLayer',
  'update:showFireStationsLayer',
  'update:showHospitalsLayer',
  'update:showRetailShopsLayer',
  'update:showPlacesLayer',
  'update:showRailwayStationsLayer',
  'update:showRailwayLinesLayer',
  'update:showBusStationsLayer',
  'update:showElectricityTransmissionLayer',
  'update:showDiningCafeLayer',
  'update:showSeifaLayer',
  'update:showEducationLayer',
  'addressSelected',
  'floodRiskData',
  'hospitalsWithinIsochroneChange',
  'walkabilityDataChange',
  'walkabilityLoading'
])

const route = useRoute()
const router = useRouter()
let map = null
let currentMarker = null
let popup = null; // Add this at the top of your script with other variable declarations

// Walkability score state
const walkabilityData = ref({
  score: 0,
  radarData: [],
  pieData: [],
  totalPOIs: 0
})
const isLoadingWalkability = ref(false)
const walkabilityError = ref(null)

// Emit loading state to parent whenever it changes
watch(isLoadingWalkability, (val) => {
  emit('walkabilityLoading', val);
});

// Mapbox configuration
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA'
mapboxgl.accessToken = MAPBOX_TOKEN

// Reference to store hospitals within isochrone count
const hospitalsWithinIsochrone = ref(0)

// Add this before map initialization
const loadMapIcons = (map) => {
  const icons = [
    { id: 'supermarket-icon', icon: 'lucide:store', color: '#059669' },
    { id: 'convenience-icon', icon: 'lucide:shopping-cart', color: '#84cc16' },
    { id: 'bakery-icon', icon: 'lucide:croissant', color: '#f59e0b' },
    { id: 'butcher-icon', icon: 'lucide:beef', color: '#ef4444' },
    { id: 'grocer-icon', icon: 'lucide:apple', color: '#22c55e' }
  ]

  return Promise.all(
    icons.map((iconData) => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = createSVGIconUrl(iconData.icon, iconData.color)
        image.onload = () => {
          if (!map.hasImage(iconData.id)) {
            map.addImage(iconData.id, image)
          }
          resolve()
        }
        image.onerror = reject
      })
    })
  )
}

const { 
  layerDefinitions,
  addAllLayers,
  updateLayerFilter,
  setLayerVisibility 
} = useMapLayers()

onMounted(() => {
  const lat = Number(route.query.lat) || -27.4698
  const lng = Number(route.query.lng) || 153.0251

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [lng, lat],
    zoom: 15  })

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,  // Ensure no marker is created by geocoder
    placeholder: 'Search',
    countries: 'au',
    types: 'address,place',
    proximity: {
      longitude: lng,
      latitude: lat
    }
  })

  // Use the custom container instead of the default map control positioning
  const geocoderContainer = document.getElementById('geocoder-container');
  if (geocoderContainer) {
    geocoderContainer.appendChild(geocoder.onAdd(map));
  } else {
    // Fallback to default position if container not found
    map.addControl(geocoder, 'top-left');
  }

  // Add this helper function at the script scope level
const cleanAddressForAPI = (address) => {
  if (!address) return '';
  
  // Remove Australia and any repeated suburb/state info
  let cleanAddress = address.split(',')[0].trim();
  
  // Check if we need to add QLD
  if (!cleanAddress.includes('QLD') && !cleanAddress.includes('Queensland')) {
    cleanAddress += ' QLD';
  }
  
  return cleanAddress;
};

// Update the geocoder result handler with this modified version
  geocoder.on('result', async (event) => {
    // Set walkability loading state when address is selected via geocoder
    isLoadingWalkability.value = true;
    walkabilityError.value = null;

    const coordinates = event.result.geometry.coordinates;
    
    // Remove existing marker if any
    if (currentMarker) {
      currentMarker.remove();
      currentMarker = null;
    }

    // First zoom to the searched location
    map.flyTo({
      center: coordinates,
      zoom: 18,
      essential: true
    });

    // Wait for the map movement to finish
    await new Promise(resolve => {
      map.once('moveend', resolve);
    });
    
    // Update the highlight layer with the searched point initially
    map.getSource('clicked-point').setData({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {}
    });

    // Create initial address data from search result
    let addressData = {
      title: event.result.place_name?.split(',')[0] || event.result.text || 'Search Result',
      suburb: event.result.context?.find(item => item.id?.startsWith('place'))?.text || '',
      postcode: event.result.context?.find(item => item.id?.startsWith('postcode'))?.text || '',
      lot: '', 
      plan: '',
      coordinates: coordinates
    };
    
    console.log('Initial search result address:', addressData);
    
    // Try to find lot/plan information from nearby address points
    try {
      // Force the address layer to be visible temporarily
      const wasAddressLayerVisible = map.getLayoutProperty('address-layer', 'visibility') === 'visible';
      map.setLayoutProperty('address-layer', 'visibility', 'visible');
      
      // Wait for the layer to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Make sure we have rendered features to query - use screen coordinates from map.project
      const point = map.project(coordinates);
      
      if (!point) {
        throw new Error('Could not project coordinates to screen point');
      }
      
      // Query address points around the search coordinates with larger radius
      const radius = 60; // Larger search radius in pixels
      const bbox = [
        [point.x - radius, point.y - radius],
        [point.x + radius, point.y + radius]
      ];
      
      // Query rendered features (address points)
      const nearbyFeatures = map.queryRenderedFeatures(bbox, { layers: ['address-layer'] });
      console.log(`Found ${nearbyFeatures.length} nearby address features:`, nearbyFeatures);
      
      if (nearbyFeatures.length > 0) {
        // Sort features by distance to clicked point
        nearbyFeatures.sort((a, b) => {
          const distA = calculateDistance(coordinates, a.geometry.coordinates);
          const distB = calculateDistance(coordinates, b.geometry.coordinates);
          return distA - distB;
        });
        
        // Use the closest address point's properties
        const closestFeature = nearbyFeatures[0];
        const props = closestFeature.properties;
        
        // Update address data with properties from the closest address point
        addressData = {
          title: props.address_fu || props.address || addressData.title,
          suburb: props.suburb || props.city || addressData.suburb,
          postcode: props.postcode || addressData.postcode,
          lot: props.lot_number || props.lot || '',
          plan: props.plan_number || props.plan || '',
          coordinates: closestFeature.geometry.coordinates
        };
        
        // Also update the highlight with the exact address point
        map.getSource('clicked-point').setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: closestFeature.geometry.coordinates
          },
          properties: {}
        });
      }
      
      // Restore the address layer visibility
      if (!wasAddressLayerVisible) {
        map.setLayoutProperty('address-layer', 'visibility', 'none');
      }
    } catch (error) {
      console.error('Error finding nearby address points:', error);
    }
    
    // Emit the address selected event to update the card display
    console.log('Emitting final address data:', addressData);
    emit('addressSelected', addressData);
    
    // Reset flood risk state
    emit('floodRiskData', 'Loading...');
    
    try {
      // Use new RPC endpoint to get flood risk
      const floodRisk = await fetchFloodRiskData(addressData.coordinates);
      console.log('Flood risk determined through API:', floodRisk);
      emit('floodRiskData', floodRisk);
    } catch (error) {
      console.error('Error determining flood risk:', error);
      emit('floodRiskData', 'Error');
    }

    // Update URL with the coordinates
    router.replace({
      query: {
        lng: addressData.coordinates[0],
        lat: addressData.coordinates[1]
      }
    });
  });

  map.on('load', async () => {
    await loadMapIcons(map)

    // Add sources using the composable
    const { addMapSources } = useMapSources(map)
    addMapSources()

    // Add clicked-point source if not added by useMapSources
    if (!map.getSource('clicked-point')) {
      map.addSource('clicked-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
    }

    // Add all layers with the composable
    addAllLayers(map)

    // Setup event handlers for layers
    setupLayerEventHandlers(map)

    // Initialize layer visibility based on props
    initializeLayerVisibility()

    // Add watchers for layer visibility and filters
    setupLayerWatchers()
    
    // If we have coordinates from the route, find and select the nearest address point
    if (route.query.lat && route.query.lng) {
      const coordinates = [lng, lat]
      
      // Add the highlight buffer at the initial coordinates
      map.getSource('clicked-point').setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        properties: {}
      })
      
      // Wait a moment for layers to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Now try to find the closest address point
      try {
        // Make sure the address layer is visible for querying
        const wasAddressLayerVisible = map.getLayoutProperty('address-layer', 'visibility') === 'visible'
        if (!wasAddressLayerVisible) {
          map.setLayoutProperty('address-layer', 'visibility', 'visible')
        }
        
        // Wait for address layer to render
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Get screen point for the coordinates
        const point = map.project(coordinates)
        
        // Query nearby address points with a generous radius
        const radius = 60
        const bbox = [
          [point.x - radius, point.y - radius],
          [point.x + radius, point.y + radius]
        ]
        
        const nearbyFeatures = map.queryRenderedFeatures(bbox, { layers: ['address-layer'] })
        console.log(`Found ${nearbyFeatures.length} nearby address points during initial load`)
        
        if (nearbyFeatures.length > 0) {
          // Get the closest address point
          nearbyFeatures.sort((a, b) => {
            const distA = calculateDistance(coordinates, a.geometry.coordinates)
            const distB = calculateDistance(coordinates, b.geometry.coordinates)
            return distA - distB
          })
          
          const closestFeature = nearbyFeatures[0]
          const props = closestFeature.properties
          
          // Create address object with lot and plan details
          const addressData = {
            title: props.address_fu || props.address || `${props.number || ''} ${props.street || ''}`.trim() || 'Address Point',
            suburb: props.suburb || props.city || '',
            postcode: props.postcode || '',
            lot: props.lot_number || props.lot || '',
            plan: props.plan_number || props.plan || '',
            coordinates: closestFeature.geometry.coordinates
          }
          
          // Update the highlight to the exact address point
          map.getSource('clicked-point').setData({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: closestFeature.geometry.coordinates
            },
            properties: {}
          })
          
          // Emit events to update the UI
          emit('addressSelected', addressData)
          
          // Get flood risk data
          emit('floodRiskData', 'Loading...')
          
          try {
            // Use new RPC endpoint to get flood risk
            const floodRisk = await fetchFloodRiskData(closestFeature.geometry.coordinates);
            console.log('Flood risk determined through API on initial load:', floodRisk);
            emit('floodRiskData', floodRisk);
          } catch (error) {
            console.error('Error determining flood risk on initial load:', error);
            emit('floodRiskData', 'Error');
          }
        }
        
        // Restore address layer visibility
        if (!wasAddressLayerVisible) {
          map.setLayoutProperty('address-layer', 'visibility', 'none')
        }
      } catch (error) {
        console.error('Error selecting initial address point:', error)
      }
    }
  })
})

watch([() => props.travelMode, () => props.travelTime, () => props.selectedAddress], async ([mode, time, address]) => {
  if (address && mode && time) {
    const coordinates = address.coordinates;
    console.log('Fetching isochrone for:', { mode, time, coordinates });
    const response = await fetch(`https://api.mapbox.com/isochrone/v1/mapbox/${mode}/${coordinates[0]},${coordinates[1]}?contours_minutes=${time}&polygons=true&access_token=${mapboxgl.accessToken}`);
    const data = await response.json();

    console.log('Isochrone API response:', data);

    if (map.getSource('isochrone')) {
      map.getSource('isochrone').setData(data);
    } else {
      map.addSource('isochrone', {
        type: 'geojson',
        data: data
      });
      map.addLayer({
        id: 'isochrone-layer', // Always use this id
        type: 'fill',
        source: 'isochrone',
        paint: {
          'fill-color': '#9C27B0', // Purple color
          'fill-opacity': 0.25, // Reduced opacity to show street names
          'fill-outline-color': '#6A1B9A' // Darker purple for outline
        }
      });
    }

    // Calculate hospitals within isochrone after updating the isochrone layer
    calculateHospitalsWithinIsochrone();
    
    // Calculate walkability score for the isochrone area
    calculateWalkabilityScore(data.features[0].geometry);
  }
}, { immediate: true });

// Function to calculate walkability score
const calculateWalkabilityScore = async (isochroneGeometry) => {
  // Ensure loading state is set even if geometry is missing or layer is hidden
  isLoadingWalkability.value = true;
  walkabilityError.value = null;

  if (!isochroneGeometry || !props.showIsochroneLayer) {
    // Reset walkability data if isochrone is not visible or geometry is missing
    walkabilityData.value = {
      score: 0,
      radarData: [],
      pieData: [],
      totalPOIs: 0
    };
    emit('walkabilityDataChange', walkabilityData.value);
    isLoadingWalkability.value = false; // Clear loading state
    return;
  }

  try {
    // Use the walkability score composable to calculate scores
    const { getWalkabilityScore } = useWalkabilityScore();
    const result = await getWalkabilityScore(isochroneGeometry.coordinates);

    console.log('Walkability score data:', result);

    // Update walkability data
    walkabilityData.value = result;

    // Emit the walkability data to parent components
    emit('walkabilityDataChange', walkabilityData.value);
  } catch (error) {
    console.error('Error calculating walkability score:', error);
    walkabilityError.value = 'Failed to calculate walkability score';

    // Reset walkability data on error
    walkabilityData.value = {
      score: 0,
      radarData: [],
      pieData: [],
      totalPOIs: 0
    };
    emit('walkabilityDataChange', walkabilityData.value);
  } finally {
    // Clear loading state
    isLoadingWalkability.value = false;
  }
}

// Define retry function for walkability score
const retryWalkabilityScore = () => {
  if (map && map.getSource('isochrone') && props.showIsochroneLayer) {
    const source = map.getSource('isochrone');
    const data = source._data;
    
    if (data && data.features && data.features[0]) {
      calculateWalkabilityScore(data.features[0].geometry);
    }
  }
}

// Define reset function for walkability score
const resetWalkabilityScore = () => {
  walkabilityData.value = {
    score: 0,
    radarData: [],
    pieData: [],
    totalPOIs: 0
  };
  walkabilityError.value = null;
  emit('walkabilityDataChange', walkabilityData.value);
}

// Function to calculate hospitals within isochrone polygon
const calculateHospitalsWithinIsochrone = () => {
  if (!map || !map.getSource('isochrone') || !props.showIsochroneLayer) {
    hospitalsWithinIsochrone.value = 0;
    emit('hospitalsWithinIsochroneChange', 0);
    return;
  }

  try {
    // Important: If the 'hospitals-layer' is not visible, we need to temporarily make the source available
    // by using a "virtual" feature state query that won't affect the visible map
    const isHospitalLayerVisible = map.getLayoutProperty('hospitals-layer', 'visibility') === 'visible';
    
    // Temporarily force load the overture-places source if it's needed but not active
    if (!isHospitalLayerVisible) {
      // This triggers the source to load without affecting the visible map
      const dummyFeatures = map.querySourceFeatures('overture-places', {
        sourceLayer: 'place'  // Use the correct source layer name
      });
      console.log('Preloaded overture-places source with', dummyFeatures.length, 'features');
    }
    
    // Use our utility function to count hospitals within isochrone
    const count = countFeaturesWithinIsochrone(map, 'isochrone', 'hospitals-layer');
    
    console.log(`Found ${count} hospitals within the isochrone polygon (in current view)`);
    hospitalsWithinIsochrone.value = count;
    
    // Emit the count to parent component
    emit('hospitalsWithinIsochroneChange', count);
    
  } catch (error) {
    console.error('Error calculating hospitals within isochrone:', error);
    hospitalsWithinIsochrone.value = 0;
    emit('hospitalsWithinIsochroneChange', 0);
  }
}

// Helper function to set up event handlers
const setupLayerEventHandlers = (map) => {
  // Clear highlight when clicking elsewhere on the map
  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['address-layer'] })
    if (!features.length) {
      map.getSource('clicked-point').setData({
        type: 'FeatureCollection',
        features: []
      })
    }
  })

  // Address layer click handler
  map.on('click', 'address-layer', async (e) => {
    if (e.features && e.features.length > 0) {
      // Set walkability loading state when address is selected
      isLoadingWalkability.value = true;
      walkabilityError.value = null;

      const feature = e.features[0];
      const props = feature.properties;
      
      // Create address object with lot and plan details
      const addressData = {
        title: props.address_fu || props.address || `${props.number || ''} ${props.street || ''}`.trim() || 'Address Point',
        suburb: props.suburb || props.city || '', 
        postcode: props.postcode || '',
        lot: props.lot_number || props.lot || '',
        plan: props.plan_number || props.plan || '',
        coordinates: feature.geometry.coordinates
      };
      
      // Add buffer circle around the clicked address point
      map.getSource('clicked-point').setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: feature.geometry.coordinates
        },
        properties: {}
      });
      
      // Emit the addressSelected event
      emit('addressSelected', addressData);
      
      // Start with loading state for flood risk
      emit('floodRiskData', 'Loading...');
      
      try {
        // Use new RPC endpoint to get flood risk
        const floodRisk = await fetchFloodRiskData(feature.geometry.coordinates);
        console.log('Flood risk determined through API:', floodRisk);
        emit('floodRiskData', floodRisk);
      } catch (error) {
        console.error('Error determining flood risk:', error);
        emit('floodRiskData', 'Error');
      }
    }
  });

  // Add hover effects for address layer
  map.on('mouseenter', 'address-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'address-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  // Add hover effects for health layer
  map.on('mouseenter', 'health-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    
    const feature = e.features[0].properties;
    const details = [
      { label: 'Name', value: feature.name }
    ].filter(item => item.value);

    popup = new mapboxgl.Popup({
      closeButton: false,
      className: 'custom-popup',
      maxWidth: '300px'
    })
      .setLngLat(e.lngLat)
      .setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-sm mb-2">${feature.name || 'Unnamed Facility'}</h3>
          <div class="space-y-1">
            ${details.map(({ label, value }) => `
              <div class="text-xs">
                <span class="text-gray-600">${label}:</span>
                <span class="ml-1">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `)
      .addTo(map);
  });

  map.on('mouseleave', 'health-layer', () => {
    map.getCanvas().style.cursor = '';
    if (popup) {
      popup.remove();
      popup = null;
    }
  });

  // Add hover effects for Places (OVERTURE) layer
  map.on('mouseenter', 'places-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    
    if (e.features && e.features.length > 0) {
      const feature = e.features[0].properties;
      
      // Log the raw feature for debugging
      console.log('Overture Place Feature:', feature);
      console.log('Categories structure:', feature.categories);
      
      // Helper function to safely parse JSON strings
      const parseJsonIfString = (str) => {
        if (typeof str !== 'string') return str;
        try {
          return JSON.parse(str);
        } catch (e) {
          return str;
        }
      };
      
      // Extract and format place details
      const names = parseJsonIfString(feature.names);
      const categories = parseJsonIfString(feature.categories);
      const addresses = parseJsonIfString(feature.addresses);
      const phones = parseJsonIfString(feature.phones);
      const websites = parseJsonIfString(feature.websites);
      const socials = parseJsonIfString(feature.socials);
      const brand = feature.brand;
      
      // Prepare content for popup
      let popupContent = `
        <div class="p-3 max-h-72 overflow-y-auto">
          <h3 class="font-semibold text-sm mb-2">${feature["@name"] || (names && Array.isArray(names) ? names[0] : names) || 'Unnamed Place'}</h3>
          <div class="space-y-1">
      `;
      
      // Categories
      if (categories && categories.length) {
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Categories:</span>
            <span class="ml-1">${Array.isArray(categories) ? categories.join(', ') : categories}</span>
          </div>
        `;
      }
      
      // Brand
      if (brand) {
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Brand:</span>
            <span class="ml-1">${brand}</span>
          </div>
        `;
      }
      
      // Addresses
      if (addresses && (addresses.length || Object.keys(addresses).length)) {
        let addressText = '';
        if (Array.isArray(addresses)) {
          addressText = addresses[0];
        } else if (typeof addresses === 'object') {
          addressText = Object.values(addresses).join(', ');
        } else {
          addressText = addresses;
        }
        
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Address:</span>
            <span class="ml-1">${addressText}</span>
          </div>
        `;
      }
      
      // Phones
      if (phones && phones.length) {
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Phone:</span>
            <span class="ml-1">${Array.isArray(phones) ? phones[0] : phones}</span>
          </div>
        `;
      }
      
      // Websites
      if (websites && websites.length) {
        const websiteUrl = Array.isArray(websites) ? websites[0] : websites;
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Website:</span>
            <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" class="ml-1 text-blue-600 hover:underline">${websiteUrl}</a>
          </div>
        `;
      }
      
      // Social media links
      if (socials && Object.keys(socials).length) {
        popupContent += `
          <div class="text-xs">
            <span class="text-gray-600">Social:</span>
            <div class="ml-1">
        `;
        
        Object.entries(socials).forEach(([platform, url]) => {
          popupContent += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline mr-2">${platform}</a>`;
        });
        
        popupContent += `
            </div>
          </div>
        `;
      }
      
      // ID and other metadata
      if (feature.id) {
        popupContent += `
          <div class="text-xs text-gray-400 mt-2">
            ID: ${feature.id}
          </div>
        `;
      }
      
      popupContent += `
          </div>
        </div>
      `;
      
      // Create and add popup to map
      popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'custom-popup',
        maxWidth: '300px'
      })
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    }
  });

  map.on('mouseleave', 'places-layer', () => {
    map.getCanvas().style.cursor = '';
    if (popup) {
      popup.remove();
      popup = null;
    }
  });

}

// Helper function to initialize layer visibility
const initializeLayerVisibility = () => {
  setLayerVisibility(map, 'address-layer', props.showAddressLayer)
  setLayerVisibility(map, 'lot-layer', props.showLotLayer)
  setLayerVisibility(map, 'osm-point-layer', props.showOsmPointLayer)
  setLayerVisibility(map, 'flood-layer', props.showFloodLayer)
  setLayerVisibility(map, 'landslide-layer', props.showLandslideLayer)
  setLayerVisibility(map, 'noise-layer', props.showNoiseLayer)
  setLayerVisibility(map, 'health-layer', props.showHealthLayer)
  setLayerVisibility(map, 'food-layer', props.showFoodLayer)
  setLayerVisibility(map, 'isochrone-layer', props.showIsochroneLayer)
  setLayerVisibility(map, 'street-lights-layer', props.showStreetLightsLayer)
  setLayerVisibility(map, 'street-lights-core-layer', props.showStreetLightsLayer)
  setLayerVisibility(map, 'police-layer', props.showPoliceLayer)
  setLayerVisibility(map, 'speed-camera-layer', props.showSpeedCameraLayer)
  setLayerVisibility(map, 'traffic-signals-layer', props.showTrafficSignalsLayer)
  setLayerVisibility(map, 'fire-stations-layer', props.showFireStationsLayer)
  setLayerVisibility(map, 'hospitals-layer', props.showHospitalsLayer)
  setLayerVisibility(map, 'retail-shops-layer', props.showRetailShopsLayer)
  setLayerVisibility(map, 'places-layer', props.showPlacesLayer) // Add Places (OVERTURE) layer
  setLayerVisibility(map, 'railway-stations-layer', props.showRailwayStationsLayer) // Add Railway Stations layer
  setLayerVisibility(map, 'railway-lines-layer', props.showRailwayLinesLayer) // Add Railway Lines layer
  setLayerVisibility(map, 'bus-stations-layer', props.showBusStationsLayer) // Add Bus Stations layer
  setLayerVisibility(map, 'electricity-transmission-layer', props.showElectricityTransmissionLayer) // Add Electricity Transmission layer
  setLayerVisibility(map, 'dining-cafe-layer', props.showDiningCafeLayer) // Add Dining & Cafe layer
  setLayerVisibility(map, 'seifa-layer', props.showSeifaLayer) // Add SEIFA layer initialization
  setLayerVisibility(map, 'education-layer', props.showEducationLayer) // Add Education layer initialization
}

// Helper function for setting up watchers
const setupLayerWatchers = () => {
  // Add watchers
  watch(() => props.showAddressLayer, (visible) => {
    setLayerVisibility(map, 'address-layer', visible)
  })

  watch(() => props.showLotLayer, (visible) => {
    setLayerVisibility(map, 'lot-layer', visible)
  })

  watch(() => props.showFloodLayer, (visible) => {
    setLayerVisibility(map, 'flood-layer', visible)
  })

  watch(() => props.showLandslideLayer, (visible) => {
    setLayerVisibility(map, 'landslide-layer', visible)
  })

  watch(() => props.showNoiseLayer, (visible) => {
    setLayerVisibility(map, 'noise-layer', visible)
  })

  watch(() => props.showOsmPointLayer, (visible) => {
    setLayerVisibility(map, 'osm-point-layer', visible)
  })
  
  // Add watcher for isochrone layer visibility
  watch(() => props.showIsochroneLayer, (visible) => {
    setLayerVisibility(map, 'isochrone-layer', visible)
  })
  
  // Add watcher for street lights layer visibility
  watch(() => props.showStreetLightsLayer, (visible) => {
    setLayerVisibility(map, 'street-lights-layer', visible)
    setLayerVisibility(map, 'street-lights-core-layer', visible) // Also toggle the core layer
  })
  
  // Add watcher for police layer visibility
  watch(() => props.showPoliceLayer, (visible) => {
    setLayerVisibility(map, 'police-layer', visible)
  })

  // Add watcher for speed camera layer visibility
  watch(() => props.showSpeedCameraLayer, (visible) => {
    setLayerVisibility(map, 'speed-camera-layer', visible)
  })
  
  // Add watcher for traffic signals layer visibility
  watch(() => props.showTrafficSignalsLayer, (visible) => {
    setLayerVisibility(map, 'traffic-signals-layer', visible)
  })
  
  // Add watcher for fire stations layer visibility
  watch(() => props.showFireStationsLayer, (visible) => {
    setLayerVisibility(map, 'fire-stations-layer', visible)
  })
  
  // Add watcher for hospitals layer visibility
  watch(() => props.showHospitalsLayer, (visible) => {
    setLayerVisibility(map, 'hospitals-layer', visible)
  })
  
  // Add watcher for retail shops layer visibility
  watch(() => props.showRetailShopsLayer, (visible) => {
    setLayerVisibility(map, 'retail-shops-layer', visible)
  })
  
  // Add watcher for Places (OVERTURE) layer visibility
  watch(() => props.showPlacesLayer, (visible) => {
    setLayerVisibility(map, 'places-layer', visible)
  })

  // Add watcher for Railway Stations layer visibility
  watch(() => props.showRailwayStationsLayer, (visible) => {
    setLayerVisibility(map, 'railway-stations-layer', visible)
  })

  // Add watcher for Railway Lines layer visibility
  watch(() => props.showRailwayLinesLayer, (visible) => {
    setLayerVisibility(map, 'railway-lines-layer', visible)
  })

  // Add watcher for Bus Stations layer visibility
  watch(() => props.showBusStationsLayer, (visible) => {
    setLayerVisibility(map, 'bus-stations-layer', visible)
  })

  // Add watcher for Electricity Transmission layer visibility
  watch(() => props.showElectricityTransmissionLayer, (visible) => {
    setLayerVisibility(map, 'electricity-transmission-layer', visible)
  })

  // Add watcher for Dining & Cafe layer visibility
  watch(() => props.showDiningCafeLayer, (visible) => {
    setLayerVisibility(map, 'dining-cafe-layer', visible)
  })

  // Add watcher for SEIFA layer visibility
  watch(() => props.showSeifaLayer, (visible) => {
    setLayerVisibility(map, 'seifa-layer', visible)
  })

  // Add watcher for Education layer visibility
  watch(() => props.showEducationLayer, (visible) => {
    setLayerVisibility(map, 'education-layer', visible)
  })

  watch([() => props.showHealthLayer, () => props.healthFilter], ([visible, filter]) => {
    setLayerVisibility(map, 'health-layer', visible)
    
    if (filter && filter.length > 0) {
      const filterExpression = ['any', ...filter.map(type => ['==', 'amenity', type])]
      updateLayerFilter(map, 'health-layer', filterExpression)
    }
  }, { deep: true })

  watch([() => props.showFoodLayer, () => props.foodFilter], ([visible, filter]) => {
    setLayerVisibility(map, 'food-layer', visible)
    
    if (filter && filter.length > 0) {
      const filterExpression = ['any', ...filter.map(type => ['==', 'shop', type])]
      updateLayerFilter(map, 'food-layer', filterExpression)
    }
  }, { deep: true })

  // Add watchers for hospital count within isochrone
  watch([() => props.showHospitalsLayer, () => props.showIsochroneLayer], () => {
    // Calculate hospitals within isochrone when either layer visibility changes
    calculateHospitalsWithinIsochrone();
  })
  
  // Add map event listener for when the map moves or zooms
  if (map) {
    map.on('moveend', () => {
      // Recalculate when the map view changes (new hospitals might be in view)
      if (props.showIsochroneLayer) {
        calculateHospitalsWithinIsochrone();
      }
    });
  }
}

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style>
/* Custom popup styles */
.custom-popup .mapboxgl-popup-content {
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-popup .mapboxgl-popup-close-button {
  padding: 4px 8px;
  color: #666;
}

.custom-popup .mapboxgl-popup-close-button:hover {
  color: #000;
  background: none;
}
</style>
