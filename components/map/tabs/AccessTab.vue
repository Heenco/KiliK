<template>
  <TabsContent value="access">
    <div class="space-y-1">
      <!-- Walkability Score Component - New addition -->
      <WalkabilityScore
        v-if="isLoadingWalkability || (showIsochroneLayer && hasPropertySelected)"
        :score="walkabilityData.score"
        :radarData="walkabilityData.radarData"
        :pieData="walkabilityData.pieData"
        :totalPOIs="walkabilityData.totalPOIs"
        :travelMode="travelMode"
        :travelTime="travelTime"
        :isLoading="isLoadingWalkability"
        :error="walkabilityError"
        :hasPropertySelected="hasPropertySelected"
        @retry="$emit('retry-walkability')"
        @reset="$emit('reset-walkability')"
        @show-details="$emit('show-walkability-details')"
      />

      <!-- Travel Mode and Time - Moved to top -->
      <div class="flex gap-3 py-0.5 mb-1">
        <div class="flex-1">
          <Label for="travel-mode" class="layer-label block mb-1">Travel mode</Label>
          <Select id="travel-mode" :value="travelMode" @update:modelValue="$emit('update:travelMode', $event)" class="w-full">
            <SelectTrigger class="w-full bg-white h-9 px-3 rounded-md text-xs">
              <SelectValue>{{ displayTravelMode }}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="walking" class="text-xs">Walking</SelectItem>
              <SelectItem value="cycling" class="text-xs">Cycling</SelectItem>
              <SelectItem value="driving" class="text-xs">Driving</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex-1">
          <Label for="travel-time" class="layer-label block mb-1">Travel time</Label>
          <Select id="travel-time" :value="travelTime" @update:modelValue="$emit('update:travelTime', $event)" class="w-full">
            <SelectTrigger class="w-full bg-white h-9 px-3 rounded-md text-xs">
              <SelectValue>{{ travelTime }} minutes</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="time in [5, 10, 15, 20, 25, 30]" :key="time" :value="time" class="text-xs">
                {{ time }} minutes
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Isochrone Layer section - Moved up near travel controls -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="isochrone-layer"
          :model-value="showIsochroneLayer"
          @update:modelValue="$emit('update:showIsochroneLayer', $event)"
        />
        <Label for="isochrone-layer" class="layer-label">Isochrone Polygon</Label>
      </div>
      
      <!-- Hospitals & Healthcare Layer section - Moved from SafetyTab -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="hospitals-layer"
          :model-value="showHospitalsLayer"
          @update:modelValue="$emit('update:showHospitalsLayer', $event)"
        />
        <div class="flex items-center">
          <Label for="hospitals-layer" class="layer-label">Hospitals & Healthcare</Label>
          <!-- Updated to use the pill-badge style -->
          <span v-if="showIsochroneLayer && hospitalsWithinIsochrone > 0" 
                class="pill-badge badge-green ml-2">
            {{ hospitalsWithinIsochrone }} locations nearby
          </span>
        </div>
      </div>
      
      <!-- Address and Lot boundary layers removed - now always visible -->
      
      <!-- OSM Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="osm-layer"
          :model-value="showOsmPointLayer"
          @update:modelValue="$emit('update:showOsmPointLayer', $event)"
        />
        <Label for="osm-layer" class="layer-label">OSM Layer</Label>
      </div>

      <!-- Retail Shops Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="retail-shops-layer"
          :model-value="showRetailShopsLayer"
          @update:modelValue="$emit('update:showRetailShopsLayer', $event)"
        />
        <Label for="retail-shops-layer" class="layer-label">Retail Shops</Label>
      </div>

      <!-- Places (OVERTURE) Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="places-layer"
          :model-value="showPlacesLayer"
          @update:modelValue="$emit('update:showPlacesLayer', $event)"
        />
        <Label for="places-layer" class="layer-label">Places (OVERTURE)</Label>
      </div>

      <!-- Dining & Cafe Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="dining-cafe-layer"
          :model-value="showDiningCafeLayer"
          @update:modelValue="$emit('update:showDiningCafeLayer', $event)"
        />
        <Label for="dining-cafe-layer" class="layer-label">Dining & Cafe</Label>
      </div>

      <!-- Schools and Education Centres Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="education-layer"
          :model-value="showEducationLayer"
          @update:modelValue="$emit('update:showEducationLayer', $event)"
        />
        <Label for="education-layer" class="layer-label">Schools & Education Centres</Label>
      </div>

      <!-- Railway Stations Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="railway-layer"
          :model-value="showRailwayStationsLayer && showRailwayLinesLayer"
          @update:modelValue="toggleRailwayLayers"
        />
        <Label for="railway-layer" class="layer-label">Railway Lines & Stations</Label>
      </div>

      <!-- Bus Stations Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="bus-stations-layer"
          :model-value="showBusStationsLayer"
          @update:modelValue="$emit('update:showBusStationsLayer', $event)"
        />
        <Label for="bus-stations-layer" class="layer-label">Bus Stations</Label>
      </div>

      <!-- Essential Daily Needs Accordion -->
      <Accordion type="single" collapsible class="w-full mt-1">
        <AccordionItem value="daily-needs">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Essential Daily Needs</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              <!-- Health & Personal Care section -->
              <div>
                <div class="flex items-center space-x-2">
                  <Switch 
                    id="health-layer"
                    :model-value="showHealthLayer"
                    @update:modelValue="toggleHealthLayer"
                  />
                  <Label for="health-layer" class="layer-label">Health & Personal Care</Label>
                </div>
                <HealthTypes 
                  v-if="showHealthLayer"
                  :model-value="selectedHealthTypes"
                  @update:modelValue="updateHealthFilter"
                  class="mt-2"
                />
              </div>

              <!-- Food & Groceries section -->
              <div>
                <div class="flex items-center space-x-2">
                  <Switch 
                    id="food-layer"
                    :model-value="showFoodLayer"
                    @update:modelValue="toggleFoodLayer"
                  />
                  <Label for="food-layer" class="layer-label">Food & Groceries</Label>
                </div>
                <FoodTypes 
                  v-if="showFoodLayer"
                  :model-value="selectedFoodTypes"
                  @update:modelValue="updateFoodFilter"
                  class="mt-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </TabsContent>
</template>

<script setup>
import { ChevronDown, ChevronsUpDown } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import HealthTypes from './HealthTypes.vue'
import FoodTypes from './FoodTypes.vue'
import WalkabilityScore from '../WalkabilityScore.vue'

const props = defineProps({
  showAddressLayer: Boolean,
  showLotLayer: Boolean,
  showHealthLayer: Boolean,
  showFoodLayer: Boolean,
  showOsmPointLayer: Boolean,
  showIsochroneLayer: Boolean,
  showRetailShopsLayer: Boolean,
  showPlacesLayer: Boolean,
  showDiningCafeLayer: Boolean,
  showRailwayStationsLayer: Boolean,
  showRailwayLinesLayer: Boolean,
  showBusStationsLayer: Boolean,
  showEducationLayer: Boolean,
  showHospitalsLayer: Boolean,
  travelMode: String,
  travelTime: Number,
  hospitalsWithinIsochrone: Number,
  walkabilityData: {
    type: Object,
    default: () => ({
      score: 0,
      radarData: [],
      pieData: [],
      totalPOIs: 0,
    })
  },
  isLoadingWalkability: Boolean,
  walkabilityError: String,
  hasPropertySelected: Boolean
})

const emit = defineEmits([
  'update:showAddressLayer',
  'update:showLotLayer',
  'update:showHealthLayer',
  'update:showFoodLayer',
  'update:healthFilter',
  'update:foodFilter',
  'update:showOsmPointLayer',
  'update:showIsochroneLayer',
  'update:showRetailShopsLayer',
  'update:showPlacesLayer',
  'update:showDiningCafeLayer',
  'update:showRailwayStationsLayer',
  'update:showRailwayLinesLayer',
  'update:showBusStationsLayer',
  'update:showEducationLayer',
  'update:showHospitalsLayer',
  'update:travelMode',
  'update:travelTime',
  'retry-walkability',
  'reset-walkability',
  'show-walkability-details'
])

// Computed property to capitalize travel mode
const displayTravelMode = computed(() => {
  if (!props.travelMode) return '';
  return props.travelMode.charAt(0).toUpperCase() + props.travelMode.slice(1);
})

const selectedHealthTypes = ref(['hospital', 'pharmacy', 'clinic', 'doctors', 'dentist'])
const selectedFoodTypes = ref(['supermarket', 'convenience', 'bakery', 'butcher', 'greengrocer'])

const updateHealthFilter = (types) => {
  selectedHealthTypes.value = types
  emit('update:healthFilter', types)
}

const updateFoodFilter = (types) => {
  selectedFoodTypes.value = types
  emit('update:foodFilter', types)
}

const toggleHealthLayer = (value) => {
  emit('update:showHealthLayer', value)
  if (value) {
    selectedHealthTypes.value = ['hospital', 'pharmacy', 'clinic', 'doctors', 'dentist']
    emit('update:healthFilter', selectedHealthTypes.value)
  }
}

const toggleFoodLayer = (value) => {
  emit('update:showFoodLayer', value)
  if (value) {
    selectedFoodTypes.value = ['supermarket', 'convenience', 'bakery', 'butcher', 'greengrocer']
    emit('update:foodFilter', selectedFoodTypes.value)
  }
}

const toggleRailwayLayers = (value) => {
  emit('update:showRailwayStationsLayer', value)
  emit('update:showRailwayLinesLayer', value)
}
</script>

<style scoped>
/* Smaller layer labels */
.layer-label {
  font-size: 0.715rem; /* 11px */
  font-weight: 500;
  color: #555555;
}

/* Reduced padding in accordion */
:deep(.accordion-trigger) {
  padding: 0.5rem 0;
}

:deep(.accordion-content) {
  padding: 0.5rem 0;
}

/* Custom styling for select dropdown */
:deep(.select-trigger) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Style the dropdown arrow */
:deep([data-slot="select-trigger"] svg) {
  width: 16px;
  height: 16px;
  opacity: 0.75;
}

/* Style the pill badges */
.pill-badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  font-weight: 500;
}

.badge-green {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(22, 163, 74);
}

@keyframes accordion-down {
  from { height: 0 }
  to { height: var(--radix-accordion-content-height) }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height) }
  to { height: 0 }
}
</style>