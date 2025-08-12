<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useWalkabilityScore } from '@/composables/useWalkabilityScore';

// Mapbox token for isochrone API (we still need this for isochrone functionality)
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA';

const props = defineProps({
  showIsochroneLayer: Boolean,
  showPlacesLayer: Boolean,
  showHealthcareLayer: Boolean,
  showGroceriesLayer: Boolean,
  showBankingLayer: Boolean,
  showRetailLayer: Boolean,
  showPetcareLayer: Boolean,
  showDiningLayer: Boolean,
  showEntertainmentLayer: Boolean,
  showRecreationLayer: Boolean,
  showTrailsLayer: Boolean,
  showTransportationLayer: Boolean,
  showVehiclesLayer: Boolean,
  showSchoolsLayer: Boolean,
  showCommunityLayer: Boolean,
  showFloodLayer: Boolean,
  showBushfireLayer: Boolean,
  showNoiseLayer: Boolean,
  showErosionLayer: Boolean,
  showAcidSulfateLayer: Boolean,
  showOilPipelinesLayer: Boolean,
  showGasPipelinesLayer: Boolean,
  // Safety layer props
  showStreetLightsLayer: Boolean,
  showPoliceLayer: Boolean,
  showSpeedCameraLayer: Boolean,
  showTrafficSignalsLayer: Boolean,
  showFireStationsLayer: Boolean,
  showHospitalsLayer: Boolean,
  showElectricityTransmissionLayer: Boolean,
  travelMode: String,
  travelTime: Number,
  selectedAddress: Object
});

const emit = defineEmits([
  'addressSelected',
  'walkabilityDataChange',
  'walkabilityLoading'
]);

let map = null;
const isLoadingWalkability = ref(false);
const walkabilityError = ref(null);

// Initialize walkability score composable
const { getWalkabilityScore } = useWalkabilityScore();

const getLayerColor = (layerId) => {
  const colorMap = {
    places: '#808080',          // Gray for all places
    healthcare: '#FF4444',      // Red for healthcare/medical
    groceries: '#4CAF50',       // Green for food/groceries
    banking: '#2196F3',         // Blue for banking/financial
    retail: '#9C27B0',          // Purple for retail/shopping
    petcare: '#FF9800',         // Orange for pet care
    dining: '#E91E63',          // Pink for dining/restaurants
    entertainment: '#673AB7',    // Deep purple for entertainment
    recreation: '#4CAF50',      // Green for recreation/sports
    trails: '#8BC34A',          // Light green for trails/parks
    transportation: '#607D8B',   // Blue-gray for transportation
    vehicles: '#424242',        // Dark gray for vehicle services
    schools: '#FF9800',         // Orange for schools/education
    community: '#795548',       // Brown for community resources
  };
  return colorMap[layerId] || '#888888';
};

const toggleLayer = (layerId, visible) => {
  if (map) {
    const visibility = visible ? 'visible' : 'none';
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  }
};

const toggleHazardLayer = (layerId, visible) => {
  if (map) {
    const visibility = visible ? 'visible' : 'none';
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  }
};

// Watch for layer visibility changes
watch(() => props.showPlacesLayer, (visible) => toggleLayer('places', visible));
watch(() => props.showHealthcareLayer, (visible) => toggleLayer('healthcare', visible));
watch(() => props.showGroceriesLayer, (visible) => toggleLayer('groceries', visible));
watch(() => props.showBankingLayer, (visible) => toggleLayer('banking', visible));
watch(() => props.showRetailLayer, (visible) => toggleLayer('retail', visible));
watch(() => props.showPetcareLayer, (visible) => toggleLayer('petcare', visible));
watch(() => props.showDiningLayer, (visible) => toggleLayer('dining', visible));
watch(() => props.showEntertainmentLayer, (visible) => toggleLayer('entertainment', visible));
watch(() => props.showRecreationLayer, (visible) => toggleLayer('recreation', visible));
watch(() => props.showTrailsLayer, (visible) => toggleLayer('trails', visible));
watch(() => props.showTransportationLayer, (visible) => toggleLayer('transportation', visible));
watch(() => props.showVehiclesLayer, (visible) => toggleLayer('vehicles', visible));
watch(() => props.showSchoolsLayer, (visible) => toggleLayer('schools', visible));
watch(() => props.showCommunityLayer, (visible) => toggleLayer('community', visible));

// Watch hazard layer visibility
watch(() => props.showFloodLayer, (visible) => toggleHazardLayer('flood-layer', visible));
watch(() => props.showBushfireLayer, (visible) => toggleHazardLayer('bushfire-layer', visible));
watch(() => props.showNoiseLayer, (visible) => toggleHazardLayer('noise-layer', visible));
watch(() => props.showErosionLayer, (visible) => toggleHazardLayer('erosion-layer', visible));
watch(() => props.showAcidSulfateLayer, (visible) => toggleHazardLayer('acid-sulfate-layer', visible));
watch(() => props.showOilPipelinesLayer, (visible) => toggleHazardLayer('oil-pipelines-layer', visible));
watch(() => props.showGasPipelinesLayer, (visible) => toggleHazardLayer('gas-pipelines-layer', visible));

// Watch safety layer visibility
watch(() => props.showPoliceLayer, (visible) => toggleHazardLayer('police-layer', visible));
watch(() => props.showFireStationsLayer, (visible) => toggleHazardLayer('fire-stations-layer', visible));
watch(() => props.showHospitalsLayer, (visible) => toggleHazardLayer('hospitals-layer', visible));
watch(() => props.showStreetLightsLayer, (visible) => toggleHazardLayer('street-lights-layer', visible));
watch(() => props.showSpeedCameraLayer, (visible) => toggleHazardLayer('speed-camera-layer', visible));
watch(() => props.showTrafficSignalsLayer, (visible) => toggleHazardLayer('traffic-signals-layer', visible));

onMounted(() => {
  // Add PMTiles protocol
  let protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);

  // Check for URL parameters for initial map positioning
  const urlParams = new URLSearchParams(window.location.search);
  const lat = parseFloat(urlParams.get('lat'));
  const lng = parseFloat(urlParams.get('lng'));
  const searchQuery = urlParams.get('search') || urlParams.get('address');

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: lat && lng ? [lng, lat] : [153.0281, -27.4678],
    zoom: lat && lng ? 16 : 12, // Zoom in if we have specific coordinates
  });

  // Add geocoder
  const geocoder = new MapboxGeocoder({
    accessToken: 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA',
    countries: 'au',
    types: 'address',
    marker: false,
    placeholder: 'Search for an address...'
  });

  // Add geocoder to container
  const geocoderContainer = document.getElementById('geocoder-container');
  if (geocoderContainer) {
    geocoderContainer.appendChild(geocoder.onAdd(map));
  } else {
    map.addControl(geocoder, 'top-left');
  }

  // Handle initial search from URL parameters - store for later use in load handler
  let initialAddressData = null;
  if (searchQuery && lat && lng) {
    // Set the input value in the geocoder
    geocoder.setInput(searchQuery);
    
    // Parse the address from URL search query (same format as geocoder)
    const addressParts = searchQuery.split(', ');
    
    let title = '';
    let suburb = '';
    let statePostcode = '';
    let country = '';
    
    if (addressParts.length >= 1) {
      title = addressParts[0]; // "1 Bearke Place"
    }
    
    if (addressParts.length >= 2) {
      // "Bracken Ridge Queensland 4017" - need to separate suburb from state/postcode
      const secondPart = addressParts[1];
      // Try to extract postcode (4-digit number) and everything before it
      const postcodeMatch = secondPart.match(/^(.+?)\s+([A-Z][a-z]+)\s+(\d{4})$/);
      if (postcodeMatch) {
        suburb = postcodeMatch[1]; // "Bracken Ridge"
        const state = postcodeMatch[2]; // "Queensland"
        const postcode = postcodeMatch[3]; // "4017"
        statePostcode = `${state} ${postcode}`;
      } else {
        // Fallback if pattern doesn't match
        suburb = secondPart;
      }
    }
    
    if (addressParts.length >= 3) {
      country = addressParts[2]; // "Australia"
    }
    
    // Prepare address data for use after map loads
    initialAddressData = {
      title: title,
      subtitle: searchQuery, // Full address
      suburb: suburb,
      postcode: statePostcode, // "Queensland 4017"
      state: statePostcode.split(' ')[0] || '', // "Queensland"
      country: country,
      lot: '',
      plan: '',
      coordinates: [lng, lat]
    };
  } else if (searchQuery) {
    // Just populate the search box if no coordinates
    geocoder.setInput(searchQuery);
  }

  // Handle geocoder results
  geocoder.on('result', async (event) => {
    emit('walkabilityLoading', true);
    
    const coordinates = event.result.geometry.coordinates;
    
    // Create address data from search result
    const fullAddress = event.result.place_name || event.result.text || 'Search Result';
    
    // Parse the address from Mapbox format: "1 Bearke Place, Bracken Ridge Queensland 4017, Australia"
    const addressParts = fullAddress.split(', ');
    
    let title = '';
    let suburb = '';
    let statePostcode = '';
    let country = '';
    
    if (addressParts.length >= 1) {
      title = addressParts[0]; // "1 Bearke Place"
    }
    
    if (addressParts.length >= 2) {
      // "Bracken Ridge Queensland 4017" - need to separate suburb from state/postcode
      const secondPart = addressParts[1];
      // Try to extract postcode (4-digit number) and everything before it
      const postcodeMatch = secondPart.match(/^(.+?)\s+([A-Z][a-z]+)\s+(\d{4})$/);
      if (postcodeMatch) {
        suburb = postcodeMatch[1]; // "Bracken Ridge"
        const state = postcodeMatch[2]; // "Queensland"
        const postcode = postcodeMatch[3]; // "4017"
        statePostcode = `${state} ${postcode}`;
      } else {
        // Fallback if pattern doesn't match
        suburb = secondPart;
      }
    }
    
    if (addressParts.length >= 3) {
      country = addressParts[2]; // "Australia"
    }
    
    const addressData = {
      title: title,
      subtitle: fullAddress, // Full address
      suburb: suburb,
      postcode: statePostcode, // "Queensland 4017"
      state: statePostcode.split(' ')[0] || '', // "Queensland"
      country: country,
      lot: '',
      plan: '',
      coordinates: coordinates
    };
    
    // Debug log to see what address data we're getting
    console.log('Address data from geocoder:', addressData);
    console.log('Full geocoder result:', event.result);
    
    // Add clicked point
    if (map.getSource('clicked-point')) {
      map.getSource('clicked-point').setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        properties: {}
      });
    }
    
    emit('addressSelected', addressData);
  });

  map.on('load', () => {
    // Add clicked point source
    map.addSource('clicked-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Add clicked point layer
    map.addLayer({
      id: 'clicked-point',
      type: 'circle',
      source: 'clicked-point',
      paint: {
        'circle-radius': 8,
        'circle-color': '#ff0000',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Handle initial address from URL parameters (after sources are created)
    if (initialAddressData) {
      // Add clicked point to show selection
      map.getSource('clicked-point').setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: initialAddressData.coordinates
        },
        properties: {}
      });
      
      // Emit address selected event to populate the UI
      emit('addressSelected', initialAddressData);
    }

    // Add PMTiles sources and layers
    map.addSource('overture-places', {
      type: 'vector',
      url: 'pmtiles://https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2025-04-23/places.pmtiles',
    });

    // Add OSM planetiler source for safety layers
    map.addSource('osm-planetiler', {
      type: 'vector',
      tiles: ['https://dwuxtsziek7cf.cloudfront.net/planet/{z}/{x}/{y}.mvt'],
      minzoom: 0,
      maxzoom: 14
    });

    // Add PMTiles hazard data sources
    map.addSource('flood-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/flood.pmtiles'
    });

    map.addSource('bushfire-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/bushfire.pmtiles'
    });

    map.addSource('noise-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/noise.pmtiles'
    });

    map.addSource('erosion-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/erosion.pmtiles'
    });

    map.addSource('acid-sulfate-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/acid_sulfate_soils.pmtiles'
    });

    // Add infrastructure PMTiles source
    map.addSource('infrastructure-data', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/infrastructure.pmtiles'
    });

    // Add lot boundaries PMTiles source
    map.addSource('lot-boundaries', {
      type: 'vector',
      url: 'pmtiles://https://pub-eaadd50980ed450cbdd0394c5f3cdbc8.r2.dev/Lot.pmtiles'
    });

    // Define layer configurations
    const layerConfigs = {
      places: {
        color: '#808080'
      },
      healthcare: {
        filter: [
          'any',
          ['in', 'clinic', ['get', 'categories']],
          ['in', 'hospital', ['get', 'categories']],
          ['in', 'pharmacy', ['get', 'categories']],
          ['in', 'medical', ['get', 'categories']],
          ['in', 'dentist', ['get', 'categories']],
        ],
        color: '#FF4444'
      },
      groceries: {
        filter: [
          'any',
          ['in', 'grocery', ['get', 'categories']],
          ['in', 'supermarket', ['get', 'categories']],
          ['in', 'convenience', ['get', 'categories']],
          ['in', 'food', ['get', 'categories']],
        ],
        color: '#4CAF50'
      },
      banking: {
        filter: [
          'any',
          ['in', 'bank', ['get', 'categories']],
          ['in', 'atm', ['get', 'categories']],
          ['in', 'financial', ['get', 'categories']],
        ],
        color: '#2196F3'
      },
      retail: {
        filter: [
          'any',
          ['in', 'shop', ['get', 'categories']],
          ['in', 'retail', ['get', 'categories']],
          ['in', 'clothing', ['get', 'categories']],
          ['in', 'electronics', ['get', 'categories']],
        ],
        color: '#9C27B0'
      },
      petcare: {
        filter: [
          'any',
          ['in', 'pet', ['get', 'categories']],
          ['in', 'veterinary', ['get', 'categories']],
          ['in', 'animal', ['get', 'categories']],
        ],
        color: '#FF9800'
      },
      dining: {
        filter: [
          'any',
          ['in', 'restaurant', ['get', 'categories']],
          ['in', 'cafe', ['get', 'categories']],
          ['in', 'bar', ['get', 'categories']],
          ['in', 'fast_food', ['get', 'categories']],
        ],
        color: '#E91E63'
      },
      entertainment: {
        filter: [
          'any',
          ['in', 'cinema', ['get', 'categories']],
          ['in', 'theater', ['get', 'categories']],
          ['in', 'entertainment', ['get', 'categories']],
          ['in', 'nightclub', ['get', 'categories']],
        ],
        color: '#673AB7'
      },
      recreation: {
        filter: [
          'any',
          ['in', 'sports', ['get', 'categories']],
          ['in', 'gym', ['get', 'categories']],
          ['in', 'recreation', ['get', 'categories']],
          ['in', 'fitness', ['get', 'categories']],
        ],
        color: '#4CAF50'
      },
      trails: {
        filter: [
          'any',
          ['in', 'trail', ['get', 'categories']],
          ['in', 'park', ['get', 'categories']],
          ['in', 'recreation', ['get', 'categories']],
        ],
        color: '#8BC34A'
      },
      transportation: {
        filter: [
          'any',
          ['in', 'bus_stop', ['get', 'categories']],
          ['in', 'bus_station', ['get', 'categories']],
          ['in', 'train_station', ['get', 'categories']],
          ['in', 'subway', ['get', 'categories']],
          ['in', 'transport', ['get', 'categories']],
        ],
        color: '#607D8B'
      },
      vehicles: {
        filter: [
          'any',
          ['in', 'fuel', ['get', 'categories']],
          ['in', 'car_repair', ['get', 'categories']],
          ['in', 'parking', ['get', 'categories']],
          ['in', 'automotive', ['get', 'categories']],
        ],
        color: '#424242'
      },
      schools: {
        filter: [
          'any',
          ['in', 'school', ['get', 'categories']],
          ['in', 'education', ['get', 'categories']],
          ['in', 'university', ['get', 'categories']],
          ['in', 'college', ['get', 'categories']],
        ],
        color: '#FF9800'
      },
      community: {
        filter: [
          'any',
          ['in', 'community', ['get', 'categories']],
          ['in', 'library', ['get', 'categories']],
          ['in', 'civic', ['get', 'categories']],
          ['in', 'government', ['get', 'categories']],
        ],
        color: '#795548'
      },
    };

    // Add layers
    Object.entries(layerConfigs).forEach(([layerId, config]) => {
      const layerDefinition = {
        id: layerId,
        type: 'circle',
        source: 'overture-places',
        'source-layer': 'place',
        layout: { 
          visibility: props[`show${layerId.charAt(0).toUpperCase() + layerId.slice(1)}Layer`] ? 'visible' : 'none' 
        },
        paint: {
          'circle-radius': 5,
          'circle-color': config.color,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8,
        },
      };

      if (config.filter) {
        layerDefinition.filter = config.filter;
      }

      map.addLayer(layerDefinition);
    });

    // Add hazard layers with error handling
    try {
      // Add flood layer
      map.addLayer({
        id: 'flood-layer',
        type: 'fill',
        source: 'flood-data',
        'source-layer': 'flood',
        paint: {
          'fill-color': '#2196F3',
          'fill-opacity': 0.5,
          'fill-outline-color': '#1976D2'
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding flood layer with source-layer "flood", trying alternatives:', error);
      // Try with alternative source layer names
      const floodAlternatives = ['flooding', 'flood-zones', 'default'];
      for (const layerName of floodAlternatives) {
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
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed flood layer with source-layer: ${layerName}`);
        }
      }
    }

    try {
      // Add bushfire layer
      map.addLayer({
        id: 'bushfire-layer',
        type: 'fill',
        source: 'bushfire-data',
        'source-layer': 'bushfire',
        paint: {
          'fill-color': '#FF5722',
          'fill-opacity': 0.5,
          'fill-outline-color': '#D32F2F'
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding bushfire layer, trying alternatives:', error);
      const bushfireAlternatives = ['bushfires', 'fire', 'default'];
      for (const layerName of bushfireAlternatives) {
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
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed bushfire layer with source-layer: ${layerName}`);
        }
      }
    }

    try {
      // Add noise layer
      map.addLayer({
        id: 'noise-layer',
        type: 'fill',
        source: 'noise-data',
        'source-layer': 'noise_corridors',
        paint: {
          'fill-color': '#9C27B0',
          'fill-opacity': 0.5,
          'fill-outline-color': '#7B1FA2'
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding noise layer, trying alternatives:', error);
      const noiseAlternatives = ['noise', 'corridors', 'default'];
      for (const layerName of noiseAlternatives) {
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
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed noise layer with source-layer: ${layerName}`);
        }
      }
    }

    try {
      // Add erosion layer
      map.addLayer({
        id: 'erosion-layer',
        type: 'fill',
        source: 'erosion-data',
        'source-layer': 'erosion',
        paint: {
          'fill-color': '#FF9800',
          'fill-opacity': 0.5,
          'fill-outline-color': '#F57C00'
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding erosion layer, trying alternatives:', error);
      const erosionAlternatives = ['erosions', 'erosion-zones', 'default'];
      for (const layerName of erosionAlternatives) {
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
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed erosion layer with source-layer: ${layerName}`);
        }
      }
    }

    try {
      // Add acid sulfate soils layer
      map.addLayer({
        id: 'acid-sulfate-layer',
        type: 'fill',
        source: 'acid-sulfate-data',
        'source-layer': 'acid_sulfate_soils',
        paint: {
          'fill-color': '#FFC107',
          'fill-opacity': 0.5,
          'fill-outline-color': '#FF8F00'
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding acid sulfate soils layer, trying alternatives:', error);
      const acidSulfateAlternatives = ['acid_sulfate', 'soils', 'default'];
      for (const layerName of acidSulfateAlternatives) {
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
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed acid sulfate soils layer with source-layer: ${layerName}`);
        }
      }
    }

    // Add Oil Pipelines layer
    try {
      map.addLayer({
        id: 'oil-pipelines-layer',
        type: 'line',
        source: 'infrastructure-data',
        'source-layer': 'Oil_Pipelines',
        paint: {
          'line-color': '#8B5C2A',
          'line-width': 3,
          'line-opacity': 0.8
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding oil pipelines layer, trying alternatives:', error);
      const oilPipelineAlternatives = ['oil-pipelines', 'oil_pipelines', 'pipelines', 'default'];
      for (const layerName of oilPipelineAlternatives) {
        try {
          map.addLayer({
            id: 'oil-pipelines-layer',
            type: 'line',
            source: 'infrastructure-data',
            'source-layer': layerName,
            paint: {
              'line-color': '#8B5C2A',
              'line-width': 3,
              'line-opacity': 0.8
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed oil pipelines layer with source-layer: ${layerName}`);
        }
      }
    }

    // Add Gas Pipelines layer
    try {
      map.addLayer({
        id: 'gas-pipelines-layer',
        type: 'line',
        source: 'infrastructure-data',
        'source-layer': 'Gas_Pipelines',
        paint: {
          'line-color': '#EAB308',
          'line-width': 3,
          'line-opacity': 0.8
        },
        layout: { 'visibility': 'none' }
      });
    } catch (error) {
      console.warn('Error adding gas pipelines layer, trying alternatives:', error);
      const gasPipelineAlternatives = ['gas-pipelines', 'gas_pipelines', 'pipelines', 'default'];
      for (const layerName of gasPipelineAlternatives) {
        try {
          map.addLayer({
            id: 'gas-pipelines-layer',
            type: 'line',
            source: 'infrastructure-data',
            'source-layer': layerName,
            paint: {
              'line-color': '#EAB308',
              'line-width': 3,
              'line-opacity': 0.8
            },
            layout: { 'visibility': 'none' }
          });
          break;
        } catch (err) {
          console.log(`Failed gas pipelines layer with source-layer: ${layerName}`);
        }
      }
    }

    // Add lot boundaries layer (automatically visible at high zoom levels)
    try {
      map.addLayer({
        id: 'lot-boundaries-layer',
        type: 'line',
        source: 'lot-boundaries',
        'source-layer': 'Lot', // This might need adjustment based on the PMTiles structure
        minzoom: 16, // Only show when zoomed in enough to see individual lots
        maxzoom: 22,
        paint: {
          'line-color': '#FF6B35', // Orange color for better visibility
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16, 1,    // Thicker lines at zoom 16
            18, 2,    // Medium-thick lines at zoom 18
            20, 3     // Very thick lines at zoom 20+
          ],
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16, 0.7,  // More visible at zoom 16
            18, 0.85, // Very visible at zoom 18
            20, 1.0   // Fully opaque at zoom 20+
          ]
        },
        layout: { 
          'visibility': 'visible' // Always visible (when zoom level is appropriate)
        }
      });
      console.log('Lot boundaries layer added successfully');
    } catch (error) {
      console.warn('Error adding lot boundaries layer with source-layer "Lot", trying alternatives:', error);
      // Try with alternative source layer names
      const lotAlternatives = ['lot', 'lots', 'boundaries', 'parcels', 'default'];
      for (const layerName of lotAlternatives) {
        try {
          map.addLayer({
            id: 'lot-boundaries-layer',
            type: 'line',
            source: 'lot-boundaries',
            'source-layer': layerName,
            minzoom: 16,
            maxzoom: 22,
            paint: {
              'line-color': '#FF6B35', // Orange color for better visibility
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                16, 1,    // Thicker lines at zoom 16
                18, 2,    // Medium-thick lines at zoom 18
                20, 3     // Very thick lines at zoom 20+
              ],
              'line-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                16, 0.7,  // More visible at zoom 16
                18, 0.85, // Very visible at zoom 18
                20, 1.0   // Fully opaque at zoom 20+
              ]
            },
            layout: { 
              'visibility': 'visible'
            }
          });
          console.log(`Lot boundaries layer added with source-layer: ${layerName}`);
          break;
        } catch (err) {
          console.log(`Failed lot boundaries layer with source-layer: ${layerName}`);
        }
      }
    }

    // Add safety layers using OSM planetiler source
    // Police layer
    map.addLayer({
      id: 'police-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'subclass'], 'police'],
        ['==', ['get', 'subclass'], 'courthouse'],
        ['==', ['get', 'subclass'], 'prison']
      ],
      paint: {
        'circle-radius': 7,
        'circle-color': '#1E3A8A',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF'
      },
      layout: { 'visibility': 'none' }
    });

    // Fire stations layer
    map.addLayer({
      id: 'fire-stations-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'subclass'], 'fire_station'],
        ['==', ['get', 'subclass'], 'ambulance_station']
      ],
      paint: {
        'circle-radius': 6,
        'circle-color': '#DC2626',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FCA5A5'
      },
      layout: { 'visibility': 'none' }
    });

    // Hospitals layer
    map.addLayer({
      id: 'hospitals-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'subclass'], 'hospital'],
        ['==', ['get', 'subclass'], 'clinic'],
        ['==', ['get', 'subclass'], 'doctors'],
        ['==', ['get', 'subclass'], 'dentist']
      ],
      paint: {
        'circle-radius': 4,
        'circle-color': '#059669',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF'
      },
      layout: { 'visibility': 'none' }
    });

    // Street lights layer (using OSM planetiler source, need to check available subclasses)
    map.addLayer({
      id: 'street-lights-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'amenity'], 'street_lamp'],
        ['==', ['get', 'highway'], 'street_lamp']
      ],
      paint: {
        'circle-radius': 8,
        'circle-color': '#FFEB3B',
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF'
      },
      layout: { 'visibility': 'none' }
    });

    // Speed cameras layer
    map.addLayer({
      id: 'speed-camera-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'amenity'], 'speed_camera'],
        ['==', ['get', 'highway'], 'speed_camera']
      ],
      paint: {
        'circle-radius': 6,
        'circle-color': '#DC2626',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FECACA'
      },
      layout: { 'visibility': 'none' }
    });

    // Traffic signals layer
    map.addLayer({
      id: 'traffic-signals-layer',
      type: 'circle',
      source: 'osm-planetiler',
      'source-layer': 'poi',
      filter: ['any',
        ['==', ['get', 'highway'], 'traffic_signals'],
        ['==', ['get', 'amenity'], 'traffic_signals']
      ],
      paint: {
        'circle-radius': 5,
        'circle-color': '#10B981',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF'
      },
      layout: { 'visibility': 'none' }
    });

    // Add hover events for hazard layers
    const hazardLayers = [
      { id: 'flood-layer', name: 'Flood Zone', color: '#2196F3' },
      { id: 'bushfire-layer', name: 'Bushfire Zone', color: '#FF5722' },
      { id: 'noise-layer', name: 'Noise Corridor', color: '#9C27B0' },
      { id: 'erosion-layer', name: 'Erosion Zone', color: '#FF9800' },
      { id: 'acid-sulfate-layer', name: 'Acid Sulfate Soils', color: '#FFC107' },
      { id: 'oil-pipelines-layer', name: 'Oil Pipeline', color: '#8B5C2A' },
      { id: 'gas-pipelines-layer', name: 'Gas Pipeline', color: '#EAB308' }
    ];

    // Add hover events for safety layers
    const safetyLayers = [
      { id: 'police-layer', name: 'Police Station', color: '#1E3A8A' },
      { id: 'fire-stations-layer', name: 'Fire Station', color: '#DC2626' },
      { id: 'hospitals-layer', name: 'Hospital/Clinic', color: '#059669' },
      { id: 'street-lights-layer', name: 'Street Light', color: '#FFEB3B' },
      { id: 'speed-camera-layer', name: 'Speed Camera', color: '#DC2626' },
      { id: 'traffic-signals-layer', name: 'Traffic Signal', color: '#10B981' }
    ];

    // Create hazard popup
    const hazardPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    hazardLayers.forEach(layer => {
      // Mouse enter event
      map.on('mouseenter', layer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        const feature = e.features[0];
        const props = feature.properties;
        
        let content = `<div class="p-2 max-w-xs">
          <h4 class="font-bold text-sm mb-1" style="color: ${layer.color}">${layer.name}</h4>`;
        
        // Add properties if available
        Object.keys(props).forEach(key => {
          if (props[key] && key !== 'geometry') {
            content += `<div class="text-xs mb-1"><strong>${key}:</strong> ${props[key]}</div>`;
          }
        });
        
        content += '</div>';
        
        hazardPopup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      // Mouse leave event
      map.on('mouseleave', layer.id, () => {
        map.getCanvas().style.cursor = '';
        hazardPopup.remove();
      });
    });

    // Create safety popup
    const safetyPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    safetyLayers.forEach(layer => {
      // Mouse enter event
      map.on('mouseenter', layer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        const feature = e.features[0];
        const props = feature.properties;
        
        let content = `<div class="p-2 max-w-xs">
          <h4 class="font-bold text-sm mb-1" style="color: ${layer.color}">${layer.name}</h4>`;
        
        // Add name if available
        const name = props.name || props.names || 'Unnamed';
        if (name && name !== 'Unnamed') {
          content += `<div class="text-xs mb-1"><strong>Name:</strong> ${name}</div>`;
        }
        
        // Add subclass info
        if (props.subclass) {
          content += `<div class="text-xs mb-1"><strong>Type:</strong> ${props.subclass}</div>`;
        }
        
        content += '</div>';
        
        safetyPopup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      // Mouse leave event
      map.on('mouseleave', layer.id, () => {
        map.getCanvas().style.cursor = '';
        safetyPopup.remove();
      });
    });

    // Create popup for hover details
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // Add hover events for all layers
    Object.keys(layerConfigs).forEach(layerId => {
      map.on('mouseenter', layerId, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        const feature = e.features[0];
        const props = feature.properties;
        
        let content = '<div class="p-2 max-w-xs max-h-64 overflow-y-auto">';
        
        let placeName = props.name || props.names || props.title || props.label || 'Unnamed Place';
        
        if (typeof placeName === 'string' && placeName.startsWith('{')) {
          try {
            const namesObj = JSON.parse(placeName);
            placeName = namesObj.primary || namesObj.common || namesObj.official || Object.values(namesObj)[0] || 'Unnamed Place';
          } catch (e) {
            // Keep original value if parsing fails
          }
        }
        
        content += `<h4 class="font-bold text-sm mb-1 text-gray-800">${placeName}</h4>`;
        content += `<div class="mb-2">`;
        content += `<span class="font-semibold text-xs" style="color: ${getLayerColor(layerId)}">${layerId}</span>`;
        content += `</div>`;
        content += '</div>';
        
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    // Add isochrone functionality
    
    // Add isochrone source and layer
    map.addSource('isochrone', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    map.addLayer({
      id: 'isochrone-layer',
      type: 'fill',
      source: 'isochrone',
      layout: { 
        visibility: props.showIsochroneLayer ? 'visible' : 'none' 
      },
      paint: {
        'fill-color': '#9C27B0', // Purple color
        'fill-opacity': 0.25,
        'fill-outline-color': '#6A1B9A'
      }
    });
  });

  // Function to fetch and update isochrone
  const updateIsochrone = async () => {
    if (!map || !props.selectedAddress || !props.travelMode || !props.travelTime) {
      return;
    }

    try {
      const coordinates = props.selectedAddress.coordinates;
      const mode = props.travelMode;
      const time = props.travelTime;

      console.log('Fetching isochrone for:', { mode, time, coordinates });
      
      const response = await fetch(
        `https://api.mapbox.com/isochrone/v1/mapbox/${mode}/${coordinates[0]},${coordinates[1]}?contours_minutes=${time}&polygons=true&access_token=${MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      console.log('Isochrone API response:', data);

      if (map.getSource('isochrone')) {
        map.getSource('isochrone').setData(data);
      }

      // Calculate walkability score with proper implementation
      if (data.features && data.features.length > 0) {
        await calculateWalkabilityScore(data.features[0].geometry);
      }
    } catch (error) {
      console.error('Error fetching isochrone:', error);
      walkabilityError.value = 'Failed to fetch isochrone data';
      emit('walkabilityDataChange', {
        score: 0,
        radarData: [],
        pieData: [],
        totalPOIs: 0
      });
    }
  };

  // Function to calculate walkability score
  const calculateWalkabilityScore = async (isochroneGeometry) => {
    // Set loading state
    isLoadingWalkability.value = true;
    walkabilityError.value = null;
    emit('walkabilityLoading', true);

    if (!isochroneGeometry || !props.showIsochroneLayer) {
      // Reset walkability data if isochrone is not visible or geometry is missing
      const resetData = {
        score: 0,
        radarData: [],
        pieData: [],
        totalPOIs: 0
      };
      emit('walkabilityDataChange', resetData);
      isLoadingWalkability.value = false;
      emit('walkabilityLoading', false);
      return;
    }

    try {
      // Use the walkability score composable to calculate scores
      const result = await getWalkabilityScore(isochroneGeometry.coordinates);
      console.log('Walkability score data:', result);

      // Emit the walkability data to parent components
      emit('walkabilityDataChange', result);
    } catch (error) {
      console.error('Error calculating walkability score:', error);
      walkabilityError.value = 'Failed to calculate walkability score';

      // Reset walkability data on error
      const errorData = {
        score: 0,
        radarData: [],
        pieData: [],
        totalPOIs: 0
      };
      emit('walkabilityDataChange', errorData);
    } finally {
      // Clear loading state
      isLoadingWalkability.value = false;
      emit('walkabilityLoading', false);
    }
  };

  // Watch for changes that should trigger isochrone update
  watch([() => props.selectedAddress, () => props.travelMode, () => props.travelTime], () => {
    updateIsochrone();
  }, { immediate: true });

  // Watch for isochrone layer visibility
  watch(() => props.showIsochroneLayer, (visible) => {
    if (map && map.getLayer('isochrone-layer')) {
      map.setLayoutProperty('isochrone-layer', 'visibility', visible ? 'visible' : 'none');
    }
  });
});
</script>
