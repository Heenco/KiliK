<template>
  <div 
    class="absolute top-20 right-6 z-20 transition-all duration-500 ease-in-out"
    :class="{ 'w-80': isExpanded, 'w-12': !isExpanded }"
    @mouseenter="handleInteraction"
    @mousemove="handleInteraction"
    @click="handleInteraction"
    @touchstart="handleInteraction"
  >
    <!-- Expanded view (full panel) -->
    <div 
      v-if="isExpanded" 
      class="bg-white rounded-lg shadow-lg p-4 h-full transition-opacity overflow-y-auto"
      :class="{'opacity-100': isExpanded, 'opacity-0': !isExpanded}"
      style="max-height: 80vh;"
    >
      <!-- Address Display -->
      <div v-if="selectedAddress" class="mb-3">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <!-- Main address title -->
            <h3 class="text-xs font-semibold text-gray-800 truncate">{{ selectedAddress.title }}</h3>

            <!-- Second line with suburb and postcode -->
            <p class="text-xs text-gray-500 mt-0.5">
              <span v-if="selectedAddress.suburb || selectedAddress.postcode">
                {{ [selectedAddress.suburb, selectedAddress.postcode].filter(Boolean).join(', ') }}
              </span>
              <span v-if="selectedAddress.lotplan" class="block mt-0.5">Lot/Plan: {{ selectedAddress.lotplan }}</span>
              <span v-else-if="selectedAddress.lot && selectedAddress.plan" class="block mt-0.5">Lot/Plan: {{ selectedAddress.lot }}/{{ selectedAddress.plan }}</span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <a 
              :href="getStreetViewUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1 rounded hover:bg-gray-100"
              title="View in Google Street View"
            >
              <CameraIcon class="h-4 w-4 text-gray-500" />
            </a>
            <button class="p-1 rounded hover:bg-gray-100">
              <MapPinIcon class="h-4 w-4 text-gray-500" />
            </button>
            <button 
              @click="clearSelectedAddress" 
              class="p-1 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <XIcon class="h-3 w-3 text-gray-500" />
            </button>
          </div>
        </div>
        <hr class="my-3 border-gray-200" />
      </div>

      <!-- Updated Tabs component -->
      <Tabs :defaultValue="selectedTab" class="w-full" @update:value="handleTabChange">
        <TabsList class="w-full bg-gray-100 rounded-lg p-1 mb-4">
          <TabsTrigger value="access" class="tab-label">Access</TabsTrigger>
          <TabsTrigger value="hazard" class="tab-label">Hazard</TabsTrigger>
          <TabsTrigger value="safety" class="tab-label">Safety</TabsTrigger>
          <TabsTrigger value="census" class="tab-label">Census</TabsTrigger>
        </TabsList>
        
        <AccessTab
          :showIsochroneLayer="layers.isochrone"
          :showPlacesLayer="layers.places"
          :showHealthcareLayer="layers.healthcare"
          :showGroceriesLayer="layers.groceries"
          :showBankingLayer="layers.banking"
          :showRetailLayer="layers.retail"
          :showPetcareLayer="layers.petcare"
          :showDiningLayer="layers.dining"
          :showEntertainmentLayer="layers.entertainment"
          :showRecreationLayer="layers.recreation"
          :showTrailsLayer="layers.trails"
          :showTransportationLayer="layers.transportation"
          :showVehiclesLayer="layers.vehicles"
          :showSchoolsLayer="layers.schools"
          :showCommunityLayer="layers.community"
          :travelMode="travelMode"
          :travelTime="travelTime"
          :walkabilityData="props.walkabilityData"
          :isLoadingWalkability="props.isLoadingWalkability"
          :walkabilityError="props.walkabilityError"
          :hasPropertySelected="props.hasPropertySelected"
          @update:showIsochroneLayer="layers.isochrone = $event"
          @update:showPlacesLayer="layers.places = $event"
          @update:showHealthcareLayer="layers.healthcare = $event"
          @update:showGroceriesLayer="layers.groceries = $event"
          @update:showBankingLayer="layers.banking = $event"
          @update:showRetailLayer="layers.retail = $event"
          @update:showPetcareLayer="layers.petcare = $event"
          @update:showDiningLayer="layers.dining = $event"
          @update:showEntertainmentLayer="layers.entertainment = $event"
          @update:showRecreationLayer="layers.recreation = $event"
          @update:showTrailsLayer="layers.trails = $event"
          @update:showTransportationLayer="layers.transportation = $event"
          @update:showVehiclesLayer="layers.vehicles = $event"
          @update:showSchoolsLayer="layers.schools = $event"
          @update:showCommunityLayer="layers.community = $event"
          @update:travelMode="$emit('update:travelMode', $event)"
          @update:travelTime="$emit('update:travelTime', $event)"
          @retry-walkability="$emit('retry-walkability')"
          @reset-walkability="$emit('reset-walkability')"
          @show-walkability-details="$emit('show-walkability-details')"
        />
        <HazardTab 
          :showFloodLayer="layers.flood"
          :showLandslideLayer="layers.landslide"
          :showNoiseLayer="layers.noise"
          :floodRisk="floodRisk"
          @update:showFloodLayer="layers.flood = $event"
          @update:showLandslideLayer="layers.landslide = $event"
          @update:showNoiseLayer="layers.noise = $event"
        />
        <SafetyTab 
          :showStreetLightsLayer="layers.streetLights"
          :showPoliceLayer="layers.police"
          :showSpeedCameraLayer="layers.speedCamera"
          :showTrafficSignalsLayer="layers.trafficSignals"
          :showFireStationsLayer="layers.fireStations"
          :showHospitalsLayer="layers.hospitals"
          :showElectricityTransmissionLayer="layers.electricityTransmission"
          :showIsochroneLayer="layers.isochrone"
          :hospitalsWithinIsochrone="props.hospitalsWithinIsochrone"
          @update:showStreetLightsLayer="layers.streetLights = $event"
          @update:showPoliceLayer="layers.police = $event"
          @update:showSpeedCameraLayer="layers.speedCamera = $event"
          @update:showTrafficSignalsLayer="layers.trafficSignals = $event"
          @update:showFireStationsLayer="layers.fireStations = $event"
          @update:showHospitalsLayer="layers.hospitals = $event"
          @update:showElectricityTransmissionLayer="layers.electricityTransmission = $event"
        />
        <CensusTab 
          :showSeifaLayer="layers.seifa"
          :selectedAddress="selectedAddress"
          @update:showSeifaLayer="layers.seifa = $event"
        />
      </Tabs>
    </div>
    
    <!-- Collapsed view (vertical tabs) -->
    <div 
      v-else 
      class="flex flex-col bg-white rounded-lg shadow-lg py-4 px-2 h-auto transition-opacity"
      :class="{'opacity-100': !isExpanded, 'opacity-0': isExpanded}"
    >
      <button 
        title="Access"
        @click="expandAndSelectTab('access')" 
        class="p-2 my-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
      >
        <MapPinIcon class="h-5 w-5 text-gray-700" />
      </button>
      <button 
        title="Hazard"
        @click="expandAndSelectTab('hazard')" 
        class="p-2 my-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
      >
        <AlertTriangleIcon class="h-5 w-5 text-gray-700" />
      </button>
      <button 
        title="Safety"
        @click="expandAndSelectTab('safety')" 
        class="p-2 my-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
      >
        <ShieldIcon class="h-5 w-5 text-gray-700" />
      </button>
      <button 
        title="Census"
        @click="expandAndSelectTab('census')" 
        class="p-2 my-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
      >
        <UsersIcon class="h-5 w-5 text-gray-700" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  XIcon, CameraIcon, MapPinIcon, ChevronLeftIcon, 
  ChevronRightIcon, AlertTriangleIcon, ShieldIcon, UsersIcon 
} from 'lucide-vue-next'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import AccessTab from './tabs/AccessTab.vue'
import HazardTab from './tabs/HazardTab.vue'
import SafetyTab from './tabs/SafetyTab.vue'
import CensusTab from './tabs/CensusTab.vue'
import { useMapState } from '@/composables/useMapState'

// Define props first before using them
const props = defineProps({
  travelMode: String,
  travelTime: Number,
  showIsochroneLayer: Boolean,
  walkabilityData: {
    type: Object,
    default: () => ({
      score: 0,
      radarData: [],
      pieData: [],
      totalPOIs: 0
    })
  },
  isLoadingWalkability: Boolean,
  walkabilityError: String,
  hasPropertySelected: Boolean
});

const emit = defineEmits([
  'update:travelMode',
  'update:travelTime',
  'update:activeTab', // Add this emit for tab changes
  'retry-walkability',
  'reset-walkability',
  'show-walkability-details'
]);

const { layers, filters } = useMapState()

// Add state for selected address
const selectedAddress = ref(null)
const floodRisk = ref(null)
const isExpanded = ref(true) // New state for panel expansion
const selectedTab = ref('access') // Track selected tab
let autoCollapseTimer = null // Timer for auto-collapse
const INACTIVE_TIMEOUT = 10000 // 10 seconds of inactivity before collapsing

// Reset the auto-collapse timer - define this function first before using it in watch
const resetAutoCollapseTimer = () => {
  if (autoCollapseTimer) {
    clearTimeout(autoCollapseTimer)
  }
  
  autoCollapseTimer = setTimeout(() => {
    isExpanded.value = false
  }, INACTIVE_TIMEOUT)
}

// Watch for tab changes to handle isochrone layer visibility
watch(selectedTab, (newTab) => {
  if (newTab !== 'access') {
    layers.value.isochrone = false;
  }
});

// Handle tab changes and toggle isochrone layer accordingly
const handleTabChange = (newTab) => {
  selectedTab.value = newTab;
  emit('update:activeTab', newTab);
  if (newTab !== 'access') {
    layers.value.isochrone = false;
  }
  resetAutoCollapseTimer();
}

// Function to expand panel and select a tab
const expandAndSelectTab = (tabName) => {
  isExpanded.value = true
  selectedTab.value = tabName
  resetAutoCollapseTimer()
}

// Handle user interaction with the panel
const handleInteraction = () => {
  if (!isExpanded.value) {
    isExpanded.value = true
  }
  resetAutoCollapseTimer()
}

// Setup and cleanup the timer
onMounted(() => {
  resetAutoCollapseTimer()
})

onBeforeUnmount(() => {
  if (autoCollapseTimer) {
    clearTimeout(autoCollapseTimer)
  }
})

// Add function to generate the Street View URL
const getStreetViewUrl = () => {
  if (!selectedAddress.value || !selectedAddress.value.coordinates) return '#';
  
  // Google Maps uses lat,lng format (reverse of GeoJSON's lng,lat)
  const lat = selectedAddress.value.coordinates[1];
  const lng = selectedAddress.value.coordinates[0];
  
  // Generate Google Street View URL
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
};

// No changes to other methods
const setSelectedAddress = (address) => {
  selectedAddress.value = {
    ...address,
    lot: address.lot || '',
    plan: address.plan || ''
  }
  
  // Auto-expand when an address is selected
  isExpanded.value = true
  resetAutoCollapseTimer()
}

// Method to clear the selected address
const clearSelectedAddress = () => {
  selectedAddress.value = null
  floodRisk.value = null
  resetAutoCollapseTimer()
}

// Add method to update flood risk
const updateFloodRisk = (risk) => {
  floodRisk.value = risk
  resetAutoCollapseTimer()
}

// Expose methods to parent component
defineExpose({ 
  setSelectedAddress, 
  clearSelectedAddress,
  updateFloodRisk
})
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.tab-label {
  font-size: 0.775rem; /* 14px */
  font-weight: 500;
  color: #666666;
  transition: color 0.2s ease, font-weight 0.2s ease;
}

/* Add these styles for the selected tab state */
:deep(.tab-label[data-state="active"]) {
  color: #000000 !important; /* Black text for selected tab */
  font-weight: 600; /* Make it slightly bolder */
}

/* Optional: Add a subtle bottom indicator for the active tab */
:deep(.tab-label[data-state="active"]) {
  position: relative;
}

:deep(.tab-label[data-state="active"])::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 25%;
  width: 50%;
  height: 2px;

  border-radius: 1px;
}

/* Keep existing styles */
:deep(.category-label) {
  font-size: 0.9375rem; /* 15px */
  font-weight: 500;
  color: #333333;
}

:deep(.description-text) {
  font-size: 0.8125rem; /* 13px */
  font-weight: 400;
  color: #666666;
}
.w-full {
  width: 100%;
  height: 85%;
}
</style>