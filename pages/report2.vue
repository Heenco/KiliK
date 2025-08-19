<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 flex-1">
      
      
      <!-- Property Info Card - Full Width -->
      <div class="bg-card/80 backdrop-blur rounded-lg shadow-lg border border-border mb-6 overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Address Information -->          <div class="p-6 flex-1">            <div class="mb-4">
              <p class="text-3xl text-card-foreground font-semibold">{{ address.split(',')[0] }}</p>
              <p class="text-base text-muted-foreground mt-1">{{ address.split(',').slice(1, -1).join(',') }}</p>
              <div v-if="property.lotDetails" class="inline-flex items-center mt-2">
                <span class="px-2 py-1 text-xs rounded bg-blue-400/20 text-blue-400 font-medium">
                  {{ property.lotDetails.lotplan }}
                </span>
                <!-- Interactive Map Link - Next to Lotplan -->
                <a 
                  @click="goToMap"
                  href="javascript:void(0)"
                  class="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-150 cursor-pointer ml-4"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
                  </svg>
                  View on Map
                </a>
              </div>
              <div v-else-if="isLoadingLotDetails" class="mt-2">
                <span class="text-xs text-muted-foreground">Loading property details...</span>
              </div>
            </div>            <div class="grid grid-cols-2 gap-4 mt-4">              
              <div class="border-l-2 border-green-400 pl-3">
                <p class="text-sm text-muted-foreground">Property Type</p>
                <p class="text-lg text-card-foreground">
                  {{ property.lotDetails?.tenure || 'Residential' }}
                </p>
              </div>

              <div v-if="property.lotDetails?.shire_name" class="border-l-2 border-purple-400 pl-3 md:mt-2">
                <p class="text-sm text-muted-foreground">Local Government</p>
                <p class="text-lg text-card-foreground">{{ property.lotDetails.shire_name }}</p>
              </div>

              <div v-if="property.lotDetails?.lot_area" class="border-l-2 border-yellow-400 pl-3">
                <p class="text-sm text-muted-foreground">Land Area</p>
                <p class="text-lg text-card-foreground">{{ property.lotDetails.lot_area }} m²</p>
              </div>
            </div></div>
            <!-- Property Image with 360 Street View -->          <div class="md:w-1/4 relative h-20 md:h-auto p-2">
            <div class="border-2 border-border rounded-lg shadow-lg overflow-hidden h-full relative">
              <div class="h-full cursor-pointer group" @click="openStreetView360">
                <img
                  :src="propertyImageUrl"
                  alt="Property Image"
                  class="object-cover w-full h-full"
                  @error="imageError = true"
                />
                <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm font-semibold">
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
                class="text-xs flex items-center justify-center py-1 px-2 bg-secondary hover:bg-secondary/80 text-blue-400 rounded transition duration-150"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Official Property Map
              </a>
            </div>
            <!-- Interactive Map Button -->
            <div class="mt-2">
              <button 
                @click="goToMap"
                class="text-xs flex items-center justify-center py-1 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition duration-150 w-full"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                View Interactive Map
              </button>
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
      <!-- <div class="mt-6">
        <FinancialAssessment2Card />
      </div> -->        <!-- Price Estimate Card -->
      <!-- Property Search Card -->
      <!-- <div class="mt-6">
        <PropertySearch />
      </div> -->
      
      <!-- Building Specifications Card -->
      <div class="mt-6">
        <BuildingSpecificationsCard />
      </div>
      
    
      
      <!-- Inspection Checklist Card -->
      <div class="mt-6">
        <InspectionChecklist />
      </div>
    </main>

    <!-- PDF Generation Button -->
    <div class="fixed bottom-6 right-6 z-50">
      <button 
        @click="generatePDF" 
        :disabled="isGeneratingPDF"
        class="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg shadow-lg border border-border flex items-center space-x-2 transition-all transform hover:scale-105"
      >
        <svg v-if="!isGeneratingPDF" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <div v-else class="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
        <span>{{ isGeneratingPDF ? 'Generating...' : 'Generate PDF' }}</span>
      </button>
    </div>

    <!-- Footer -->
    <footer class="py-4 bg-card text-center text-muted-foreground text-sm border-t border-border">
      © 2025 CliQ Property Insights
    </footer>

    <!-- Street View Modal -->
    <div v-if="showStreetView360" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div class="relative w-full max-w-5xl h-[80vh] bg-card rounded-lg shadow-xl border border-border overflow-hidden">
        <div class="w-full h-full" id="street-view-360"></div>
        <button @click="closeStreetView360" class="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow transition">
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
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, nextTick } from 'vue';
import { usePropertyData } from '~/composables/usePropertyData';
import { useWalkabilityState } from '~/composables/useWalkabilityState';
import InspectionChecklist from './inspection-checklist.vue';
import HazardCard from '@/components/HazardCard.vue';
import AccessibilityCard from '@/components/AccessibilityCard.vue';
import SafetyCard from '~/components/SafetyCard.vue';
import FinancialAssessmentCard from '@/components/FinancialAssessmentCard.vue';
import FinancialAssessment2Card from '@/components/FinancialAssessment2Card.vue';
import BuildingSpecificationsCard from '@/components/BuildingSpecificationsCard.vue';
import PropertySearch from '@/components/PropertySearch.vue';

const route = useRoute();
const router = useRouter();
const address = ref(route.query.address || '');
const propertyImageUrl = ref('');
const imageError = ref(false);
const showStreetView360 = ref(false);
const isGeneratingPDF = ref(false);

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

function goToMap() {
  console.log('goToMap function called'); // Debug log
  console.log('Current address:', address.value); // Debug log
  
  // Navigate to map2 page with current address and coordinates
  const { lat, lng } = route.query;
  
  console.log('Navigation data:', { address: address.value, lat, lng }); // Debug log
  
  router.push({
    path: '/map2',
    query: {
      address: address.value,
      lat: lat,
      lng: lng,
      search: address.value // Pass address as search parameter for the search box
    }
  });
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

async function generatePDF() {
  try {
    isGeneratingPDF.value = true
    console.log('Starting PDF generation...')
    
    const { lat, lng } = route.query
    
    // Get walkability data from cache if available
    const { getWalkabilityData } = useWalkabilityState()
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    let walkabilityParams = ''
    
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      const cachedWalkability = getWalkabilityData(latNum, lngNum)
      if (cachedWalkability) {
        console.log('📤 Passing walkability data to PDF:', cachedWalkability)
        walkabilityParams = `&walkabilityScore=${cachedWalkability.score}&walkabilityRadarData=${encodeURIComponent(JSON.stringify(cachedWalkability.radarData))}&walkabilityTotalPOIs=${cachedWalkability.totalPOIs}`
      }
    }
    
    // Build the API URL with query parameters
    const apiUrl = new URL('/api/generate-pdfshift', window.location.origin)
    apiUrl.searchParams.set('address', address.value)
    if (lat) apiUrl.searchParams.set('lat', String(lat))
    if (lng) apiUrl.searchParams.set('lng', String(lng))
    
    // Add walkability data to the PDF URL that will be generated
    if (walkabilityParams) {
      const pdfUrl = `${window.location.origin}/PDF_report/pdf?address=${encodeURIComponent(address.value)}&lat=${lat}&lng=${lng}${walkabilityParams}`
      apiUrl.searchParams.set('url', pdfUrl)
    }
    
    // Use native fetch to get JSON response with base64 PDF
    const response = await fetch(apiUrl.toString())
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // Get the JSON response containing base64 PDF
    const data = await response.json()
    console.log('PDF data received, size:', data.size, 'bytes')
    
    if (!data.success || !data.pdf) {
      throw new Error('Invalid PDF response from server')
    }
    
    // Convert base64 back to binary
    const binaryString = atob(data.pdf)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Create blob from binary data
    const blob = new Blob([bytes], { type: 'application/pdf' })
    console.log('PDF blob created, size:', blob.size, 'bytes')
    
    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `property-report-${address.value.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('PDF downloaded successfully!')
    
  } catch (error) {
    console.error('PDF generation failed:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    isGeneratingPDF.value = false
  }
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
          svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-muted text-muted-foreground text-lg font-semibold">No Street View available for this location.</div>';
        }
      });
    } else {
      // Show error for missing coordinates
      svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-muted text-muted-foreground text-lg font-semibold">Missing coordinates for Street View.</div>';
    }
  } else {
    // Google Maps API not loaded
    svDiv.innerHTML = '<div class="flex items-center justify-center h-full bg-muted text-muted-foreground text-lg font-semibold">Google Maps API not loaded.</div>';
  }
}
</script>

<style scoped>
main {
  margin-top: 60px;
}

footer {
  border-top: 1px solid hsl(var(--border));
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

/* Remove old grid pattern - now using design tokens */
</style>
