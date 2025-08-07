<template>
  <div class="h-screen w-full relative">    <!-- Add the glassy header at the top -->
    <Header />
    
    <!-- Add a container for the search box below the header -->
    <div id="geocoder-container" class="absolute top-20 left-4 z-10 w-80"></div>
    
    <MapContainer 
      :showAddressLayer="layers.address"
      :showLotLayer="layers.lot"
      :showHealthLayer="layers.health"
      :showFoodLayer="layers.food"
      :showOsmPointLayer="layers.osm"
      :showFloodLayer="layers.flood"
      :showLandslideLayer="layers.landslide"
      :showNoiseLayer="layers.noise"
      :showIsochroneLayer="layers.isochrone"
      :showStreetLightsLayer="layers.streetLights"
      :showPoliceLayer="layers.police"
      :showSpeedCameraLayer="layers.speedCamera"
      :showTrafficSignalsLayer="layers.trafficSignals"
      :showFireStationsLayer="layers.fireStations"
      :showHospitalsLayer="layers.hospitals"
      :showRetailShopsLayer="layers.retailShops"
      :showEducationLayer="layers.education"
      :showPlacesLayer="layers.places"
      :showRailwayStationsLayer="layers.railwayStations"
      :showRailwayLinesLayer="layers.railwayLines"
      :showBusStationsLayer="layers.busStations"
      :showElectricityTransmissionLayer="layers.electricityTransmission"
      :showDiningCafeLayer="layers.diningCafe"
      :showSeifaLayer="layers.seifa"
      :healthFilter="filters.health"
      :foodFilter="filters.food"
      :travelMode="travelMode"
      :travelTime="travelTime"
      :selectedAddress="selectedAddress"
      @addressSelected="handleAddressSelected"
      @floodRiskData="handleFloodRiskData"
      @hospitalsWithinIsochroneChange="handleHospitalsWithinIsochrone"
      @walkabilityDataChange="handleWalkabilityDataChange"
      @walkabilityLoading="isLoadingWalkability = $event"
    />
    <MapControls 
      ref="mapControlsRef" 
      :travelMode="travelMode" 
      :travelTime="travelTime"
      :showIsochroneLayer="layers.isochrone"
      :hospitalsWithinIsochrone="hospitalCount"
      :walkabilityData="walkabilityData"
      :isLoadingWalkability="isLoadingWalkability"
      :walkabilityError="walkabilityError"
      :hasPropertySelected="!!selectedAddress"
      @update:travelMode="travelMode = $event"
      @update:travelTime="travelTime = $event"
      @update:activeTab="handleTabChange"
      @hospitalsWithinIsochroneChange="handleHospitalsWithinIsochrone"
      @retry-walkability="handleRetryWalkability"
      @reset-walkability="handleResetWalkability"
      @show-walkability-details="handleShowWalkabilityDetails"
    />
  </div>
</template>

<script setup>
import { useMapState } from '@/composables/useMapState'
import { ref } from 'vue'
import Header from '@/components/ui/Header.vue'

const { layers, filters, travelMode, travelTime } = useMapState()

// Reference to MapControls component
const mapControlsRef = ref(null)
const selectedAddress = ref(null)
const hospitalCount = ref(0) // Add hospital count state

// Walkability state 
const walkabilityData = ref({
  score: 0,
  radarData: [],
  pieData: [],
  totalPOIs: 0
})
const isLoadingWalkability = ref(false)
const walkabilityError = ref(null)

// Handler for address selection
const handleAddressSelected = (addressData) => {
  selectedAddress.value = addressData
  
  if (mapControlsRef.value) {
    mapControlsRef.value.setSelectedAddress({
      title: addressData.title,
      suburb: addressData.suburb,
      postcode: addressData.postcode,
      // Pass lot and plan values
      lot: addressData.lot || '',
      plan: addressData.plan || '',
      coordinates: addressData.coordinates
    })
  }
}

// Handler for tab changes from MapControls
const handleTabChange = (activeTab) => {
  console.log(`Tab changed in parent: ${activeTab}`);
  
  // Update isochrone layer visibility based on active tab
  if (activeTab === 'access') {
    layers.isochrone = true;
    console.log('Access tab - isochrone layer turned ON in map.vue');
  } else {
    layers.isochrone = false;
    console.log('Non-access tab - isochrone layer turned OFF in map.vue');
  }
}

// Handler for flood risk data
const handleFloodRiskData = (riskData) => {
  if (mapControlsRef.value) {
    mapControlsRef.value.updateFloodRisk(riskData)
  }
}

// Handler for hospitals within isochrone count
const handleHospitalsWithinIsochrone = (count) => {
  hospitalCount.value = count
}

// Handler for walkability score data
const handleWalkabilityDataChange = (data) => {
  walkabilityData.value = data
  isLoadingWalkability.value = false
  walkabilityError.value = null
}

// Handler for retrying walkability calculation
const handleRetryWalkability = () => {
  isLoadingWalkability.value = true
  walkabilityError.value = null
}

// Handler for resetting walkability data
const handleResetWalkability = () => {
  walkabilityData.value = {
    score: 0,
    radarData: [],
    pieData: [],
    totalPOIs: 0
  }
  walkabilityError.value = null
}

// Handler for showing detailed walkability information
const handleShowWalkabilityDetails = () => {
  // This could open a modal, extend the current view, or navigate to a details page
  console.log('Show walkability details requested')
  // For demonstration purposes only - this would be replaced with actual functionality
  alert('Walkability Score Details:\n\nScore: ' + walkabilityData.value.score + 
        '\nTotal POIs: ' + walkabilityData.value.totalPOIs)
}
</script>

<style>
@import 'mapbox-gl/dist/mapbox-gl.css';

/* Custom container for geocoder below header */
#geocoder-container {
  padding: 0;
  transition: all 0.3s ease;
}

#geocoder-container .mapboxgl-ctrl-geocoder {
  min-width: 100% !important;
  max-width: 100% !important;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin: 0;
  font-family: inherit;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

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

.mapboxgl-ctrl-geocoder--input:focus {
  outline: none;
  border-color: rgba(74, 222, 128, 0.5); /* text-green-400 equivalent */
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1); /* text-green-400 with lower opacity */
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