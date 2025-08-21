<template>
  <div 
    class="absolute top-16 right-6 z-20 transition-all duration-500 ease-in-out"
    :class="{ 'w-96': isExpanded, 'w-12': !isExpanded }"
    @mouseenter="handleInteraction"
    @mousemove="handleInteraction"
    @click="handleInteraction"
    @touchstart="handleInteraction"
  >
    <!-- Expanded view (full panel) -->
    <div 
      v-if="isExpanded" 
      class="bg-card rounded-lg shadow-lg p-4 h-full transition-opacity overflow-y-auto border border-border"
      :class="{'opacity-100': isExpanded, 'opacity-0': !isExpanded}"
      style="max-height: 80vh;"
    >
      <!-- Address Display -->
      <div class="mb-3">
        <div v-if="selectedAddress" class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <!-- Main address title -->
            <h3 class="text-xs font-semibold text-foreground truncate">{{ selectedAddress.title }}</h3>

            <!-- Second line with suburb and postcode -->
            <p class="text-xs text-muted-foreground mt-0.5">
              <span v-if="selectedAddress.suburb || selectedAddress.postcode">
                {{ [selectedAddress.suburb, selectedAddress.postcode].filter(Boolean).join(', ') }}
              </span>
              <span v-if="selectedAddress.lotplan" class="block mt-0.5">Lot/Plan: {{ selectedAddress.lotplan }}</span>
              <span v-else-if="selectedAddress.lot && selectedAddress.plan" class="block mt-0.5">Lot/Plan: {{ selectedAddress.lot }}/{{ selectedAddress.plan }}</span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Sticky/Pin toggle button -->
            <button 
              @click="toggleSticky"
              class="p-1 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              :class="{ 'bg-primary/10': isSticky }"
              :title="isSticky ? 'Unpin panel (auto-collapse enabled)' : 'Pin panel (disable auto-collapse)'"
            >
              <Pin 
                class="h-4 w-4" 
                :class="isSticky ? 'text-primary' : 'text-muted-foreground'"
              />
            </button>
            <a 
              :href="getStreetViewUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              title="View in Google Street View"
            >
              <CameraIcon class="h-4 w-4 text-muted-foreground" />
            </a>
            <button class="p-1 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
              <MapPinIcon class="h-4 w-4 text-muted-foreground" />
            </button>
            <button 
              @click="clearSelectedAddress" 
              class="p-1 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close"
            >
              <XIcon class="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div v-else class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-xs font-medium text-muted-foreground">No address selected</h3>
            <p class="text-xs text-muted-foreground/70 mt-0.5">Search for a property to view details</p>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Sticky/Pin toggle button -->
            <button 
              @click="toggleSticky"
              class="p-1 rounded-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              :class="{ 'bg-primary/10': isSticky }"
              :title="isSticky ? 'Unpin panel (auto-collapse enabled)' : 'Pin panel (disable auto-collapse)'"
            >
              <Pin 
                class="h-4 w-4" 
                :class="isSticky ? 'text-primary' : 'text-muted-foreground'"
              />
            </button>
          </div>
        </div>
        <hr class="my-3 border-border" />
      </div>

      <!-- Updated Tabs component -->
      <Tabs :defaultValue="selectedTab" class="w-full" @update:value="handleTabChange">
        <TabsList class="w-full mb-4">
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="hazard">Hazard</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="census">Census</TabsTrigger>
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
          :showBushfireLayer="layers.bushfire"
          :showNoiseLayer="layers.noise"
          :showErosionLayer="layers.erosion"
          :showAcidSulfateLayer="layers.acidSulfate"
          :showOilPipelinesLayer="layers.oilPipelines"
          :showGasPipelinesLayer="layers.gasPipelines"
          :hazardData="props.hazardData"
          :isLoadingHazards="props.isLoadingHazards"
          :hazardError="props.hazardError"
          :hasSpecificAddress="props.hasSpecificAddress"
          @update:showFloodLayer="layers.flood = $event"
          @update:showBushfireLayer="layers.bushfire = $event"
          @update:showNoiseLayer="layers.noise = $event"
          @update:showErosionLayer="layers.erosion = $event"
          @update:showAcidSulfateLayer="layers.acidSulfate = $event"
          @update:showOilPipelinesLayer="layers.oilPipelines = $event"
          @update:showGasPipelinesLayer="layers.gasPipelines = $event"
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
      class="flex flex-col bg-card rounded-lg shadow-lg py-4 px-2 h-auto transition-opacity border border-border"
      :class="{'opacity-100': !isExpanded, 'opacity-0': isExpanded}"
    >
      <button 
        title="Access"
        @click="expandAndSelectTab('access')" 
        class="p-2 my-1 rounded-full hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center"
      >
        <MapPinIcon class="h-5 w-5 text-foreground" />
      </button>
      <button 
        title="Hazard"
        @click="expandAndSelectTab('hazard')" 
        class="p-2 my-1 rounded-full hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center"
      >
        <AlertTriangleIcon class="h-5 w-5 text-foreground" />
      </button>
      <button 
        title="Safety"
        @click="expandAndSelectTab('safety')" 
        class="p-2 my-1 rounded-full hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center"
      >
        <ShieldIcon class="h-5 w-5 text-foreground" />
      </button>
      <button 
        title="Census"
        @click="expandAndSelectTab('census')" 
        class="p-2 my-1 rounded-full hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center"
      >
        <UsersIcon class="h-5 w-5 text-foreground" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  XIcon, CameraIcon, MapPinIcon, ChevronLeftIcon, 
  ChevronRightIcon, AlertTriangleIcon, ShieldIcon, UsersIcon, Pin 
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
  hasPropertySelected: Boolean,
  hasSpecificAddress: Boolean,
  hazardData: Object,
  isLoadingHazards: Boolean,
  hazardError: String
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
const isSticky = ref(false) // New state for sticky/pin functionality
let autoCollapseTimer = null // Timer for auto-collapse
const INACTIVE_TIMEOUT = 10000 // 10 seconds of inactivity before collapsing

// Reset the auto-collapse timer - define this function first before using it in watch
const resetAutoCollapseTimer = () => {
  if (autoCollapseTimer) {
    clearTimeout(autoCollapseTimer)
  }
  
  // Only set timer if panel is not pinned/sticky
  if (!isSticky.value) {
    autoCollapseTimer = setTimeout(() => {
      isExpanded.value = false
    }, INACTIVE_TIMEOUT)
  }
}

// Toggle sticky/pin state
const toggleSticky = () => {
  isSticky.value = !isSticky.value
  
  if (isSticky.value) {
    // Clear any existing timer when pinning
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer)
      autoCollapseTimer = null
    }
  } else {
    // Restart auto-collapse when unpinning
    resetAutoCollapseTimer()
  }
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

/* Keep existing styles */
:deep(.category-label) {
  font-size: 0.9375rem; /* 15px */
  font-weight: 500;
  color: hsl(var(--foreground));
}

:deep(.description-text) {
  font-size: 0.8125rem; /* 13px */
  font-weight: 400;
  color: hsl(var(--muted-foreground));
}

.w-full {
  width: 100%;
  height: 85%;
}
</style>