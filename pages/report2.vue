<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 overflow-hidden">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 flex-1">
      
      
      <!-- Property Info Card - Full Width -->
      <div class="bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Address Information -->          <div class="p-6 flex-1">            <div class="mb-4">
              <p class="text-3xl text-white font-semibold">{{ address.split(',')[0] }}</p>
              <p class="text-base text-white text-opacity-80 mt-1">{{ address.split(',').slice(1, -1).join(',') }}</p>
              <div v-if="property.lotDetails" class="inline-flex items-center mt-2">
                <span class="px-2 py-1 text-xs rounded bg-blue-400/20 text-blue-400 font-medium">
                  {{ property.lotDetails.lotplan }}
                </span>
              </div>
              <div v-else-if="isLoadingLotDetails" class="mt-2">
                <span class="text-xs text-gray-400">Loading property details...</span>
              </div>
            </div>            <div class="grid grid-cols-2 gap-4 mt-4">              
              <div class="border-l-2 border-green-400 pl-3">
                <p class="text-sm text-gray-400">Property Type</p>
                <p class="text-lg text-white">
                  {{ property.lotDetails?.tenure || 'Residential' }}
                </p>
              </div>

              <div v-if="property.lotDetails?.shire_name" class="border-l-2 border-purple-400 pl-3 md:mt-2">
                <p class="text-sm text-gray-400">Local Government</p>
                <p class="text-lg text-white">{{ property.lotDetails.shire_name }}</p>
              </div>

              <div v-if="property.lotDetails?.lot_area" class="border-l-2 border-yellow-400 pl-3">
                <p class="text-sm text-gray-400">Land Area</p>
                <p class="text-lg text-white">{{ property.lotDetails.lot_area }} m²</p>
              </div>
            </div></div>
            <!-- Property Image with 360 Street View -->          <div class="md:w-1/4 relative h-20 md:h-auto p-2">
            <div class="border-2 border-gray-600 rounded-lg shadow-lg overflow-hidden h-full relative">
              <div class="h-full cursor-pointer group" @click="openStreetView360">
                <img
                  :src="propertyImageUrl"
                  alt="Property Image"
                  class="object-cover w-full h-full"
                  @error="imageError = true"
                />
                <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-400 text-sm font-semibold">
                  No Image available
                </div>
                <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-8 h-8 mb-1 text-white drop-shadow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="rgba(0,0,0,0.2)"/>
                    <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="text-white text-sm font-bold drop-shadow">View 360°</span>
                </div>
              </div>
            </div>
            <div v-if="property.lotDetails?.smis_map" class="mt-2">
              <a 
                :href="property.lotDetails.smis_map" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-xs flex items-center justify-center py-1 px-2 bg-gray-700 hover:bg-gray-600 text-blue-300 rounded transition duration-150"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Official Property Map
              </a>
            </div>
          </div>
        </div>
      </div>      <!-- Three Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HazardCard />
        <AccessibilityCard />
        <SafetyCard />      </div><!-- Financial Assessment Card -->
      <div class="mt-6">
        <FinancialAssessmentCard />
      </div>
        <!-- AI-Powered Financial Assessment -->
      <div class="mt-6">
        <FinancialAssessment2Card />
      </div>        <!-- Price Estimate Card -->
      <!-- Property Search Card -->
      <div class="mt-6">
        <PropertySearch />
      </div>
      
      <!-- Building Specifications Card -->
      <div class="mt-6">
        <BuildingSpecificationsCard />
      </div>
      
    
      
      <!-- Inspection Checklist Card -->
      <div class="mt-6">
        <InspectionChecklist />
      </div>
    </main>    <!-- Footer -->
    <footer class="py-4 bg-gray-900 text-center text-gray-400 text-sm">
      © 2025 CliQ Property Insights
    </footer>

    <!-- Street View Modal -->
    <div v-if="showStreetView360" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div class="relative w-full max-w-5xl h-[80vh] bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div class="w-full h-full" id="street-view-360"></div>
        <button @click="closeStreetView360" class="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/ui/Header.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, nextTick } from 'vue';
import { usePropertyData } from '~/composables/usePropertyData';
import InspectionChecklist from './inspection-checklist.vue';
import HazardCard from '@/components/HazardCard.vue';
import AccessibilityCard from '@/components/AccessibilityCard.vue';
import SafetyCard from '~/components/SafetyCard.vue';
import FinancialAssessmentCard from '@/components/FinancialAssessmentCard.vue';
import FinancialAssessment2Card from '@/components/FinancialAssessment2Card.vue';
import BuildingSpecificationsCard from '@/components/BuildingSpecificationsCard.vue';
import PropertySearch from '@/components/PropertySearch.vue';

const route = useRoute();
const address = ref(route.query.address || '');
const propertyImageUrl = ref('');
const imageError = ref(false);
const showStreetView360 = ref(false);

// Initialize property data including lot details
const { property, isLoadingLotDetails, lotDetailsError, isLoadingFloodRisk, floodRiskError, loadFloodRisk } = usePropertyData({
  address: '',
  lotDetails: null,
});

// Sample data for the property insights
// In a real app, this would be fetched from an API
const propertyData = ref({
  hazards: [
    { name: 'Flood Risk', level: 'Low', color: 'green' },
    { name: 'Fire Risk', level: 'Medium', color: 'yellow' },
    { name: 'Natural Disasters', level: 'Low', color: 'green' }
  ],
  accessibility: [
    { name: 'Public Transit', level: 'High', color: 'blue' },
    { name: 'Schools', level: 'High', color: 'blue' },
    { name: 'Shopping', level: 'Medium', color: 'green' }
  ],
  socioEconomic: [
    { name: 'Income Level', level: 'Medium', color: 'yellow' },
    { name: 'Employment', level: 'High', color: 'blue' },
    { name: 'Crime Rate', level: 'Low', color: 'green' }
  ]
});

onMounted(() => {
  const { lat, lng } = route.query;
  const config = useRuntimeConfig();
  const googleApiKey = config.public.GOOGLE_MAPS_API_KEY;

  if (lat && lng && googleApiKey) {
    propertyImageUrl.value = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&key=${googleApiKey}`;
  } else {
    console.error('Missing latitude, longitude, or API key');
  }
  
  // Load Google Maps JS API for Street View 360 if needed
  if (typeof window !== 'undefined' && (!window.google || !window.google.maps)) {
    const gmapScript = document.createElement('script');
    gmapScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&loading=async`;
    gmapScript.async = true;
    gmapScript.defer = true;
    document.head.appendChild(gmapScript);
  }
  
  // If property.lotDetails already exists but floodRisk is empty, try to load flood risk
  if (property.value.lotDetails && property.value.lotDetails.lotplan && 
      (!property.value.floodRisk || property.value.floodRisk.length === 0)) {
    loadFloodRisk(property.value.lotDetails.lotplan);
  }
});

function openStreetView360() {
  if (imageError.value) return;
  showStreetView360.value = true;
  nextTick(() => {
    initStreetView360();
    // Add event listener for Escape key
    document.addEventListener('keydown', handleEscKey);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  });
}

function closeStreetView360() {
  showStreetView360.value = false;
  // Remove event listener when closing
  document.removeEventListener('keydown', handleEscKey);
  // Restore body scrolling
  document.body.style.overflow = '';
}

function handleEscKey(event) {
  if (event.key === 'Escape') {
    closeStreetView360();
  }
}

function loadFloodRiskManually() {
  // If we already have lot details, use the lotplan from there
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadFloodRisk(property.value.lotDetails.lotplan);
  } else {
    // Use a test lotplan for demonstration if no lotplan is available
    loadFloodRisk('6RP66231');
  }
}

function getFloodRiskTooltip() {
  if (!property.value.floodRisk || property.value.floodRisk.length === 0) {
    return 'No flood risk detected in this area';
  }
  
  if (property.value.floodRisk.length === 1) {
    const risk = property.value.floodRisk[0];
    return `${risk.flood_risk} - ${risk.flood_type}`;
  }
  
  // If there are multiple risks, show all of them in the tooltip
  let tooltip = 'Showing highest risk only. All flood risks:\n';
  property.value.floodRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.flood_risk} - ${risk.flood_type}\n`;
  });
  
  return tooltip;
}

function initStreetView360() {
  const svDiv = document.getElementById('street-view-360');
  if (!svDiv) return;
  
  // Clear any previous content
  svDiv.innerHTML = '';
  
  // Get coordinates from URL parameters
  const lat = parseFloat(route.query.lat);
  const lng = parseFloat(route.query.lng);
  
  if (window.google && window.google.maps) {
    if (lat && lng) {
      // Use provided lat/lng directly
      const svService = new window.google.maps.StreetViewService();
      const location = { lat, lng };
      
      svService.getPanorama({ location, radius: 50 }, (data, svStatus) => {
        if (svStatus === 'OK' && data && data.location) {
          // Use the first heading from links if available, or fallback to default
          let heading = 165;
          if (data.links && data.links.length > 0 && typeof data.links[0].heading === 'number') {
            heading = data.links[0].heading;
          }
          
          // Create the street view panorama
          new window.google.maps.StreetViewPanorama(svDiv, {
            position: { lat: data.location.latLng.lat(), lng: data.location.latLng.lng() },
            pov: { heading, pitch: 0 },
            zoom: 1,
            addressControl: false,
            fullscreenControl: false,
            linksControl: true,
            panControl: true,
            enableCloseButton: false
          });
        } else {
          // Show error if no street view available
          svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-700 text-gray-400 text-lg font-semibold">No Street View available for this location.</div>';
        }
      });
    } else {
      // Show error for missing coordinates
      svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-700 text-gray-400 text-lg font-semibold">Missing coordinates for Street View.</div>';
    }
  } else {
    // Google Maps API not loaded
    svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-700 text-gray-400 text-lg font-semibold">Google Maps API not loaded.</div>';
  }
}
</script>

<style scoped>
main {
  margin-top: 60px;
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.hover\:shadow-green:hover {
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
}

.hover\:shadow-blue:hover {
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
}

.hover\:shadow-yellow:hover {
  box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
}

.hover\:shadow-purple:hover {
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
}

/* Add styling for the street view feature */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}

/* Modal animation */
.fixed {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Subtle grid pattern for cards */
.bg-gray-800 {
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: rgb(31, 41, 55);
}
</style>
