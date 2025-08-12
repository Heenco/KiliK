<template>
  <TabsContent value="access">
    <div class="space-y-1">
      <!-- Walkability Score Component -->
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

      <!-- Travel Mode and Time -->
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

      <!-- Travel Area Layer -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="isochrone-layer"
          :model-value="showIsochroneLayer"
          @update:modelValue="$emit('update:showIsochroneLayer', $event)"
        />
        <Label for="isochrone-layer" class="layer-label">Travel Area</Label>
      </div>

      <!-- Overture Places Layers organized by category -->
      <Accordion type="multiple" class="w-full mt-2" :default-value="['mobility', 'essential', 'shopping']">

        <!-- All Places -->
        <div class="flex items-center space-x-2 py-0.5 mb-2">
          <Switch 
            id="places-layer"
            :model-value="showPlacesLayer"
            @update:modelValue="$emit('update:showPlacesLayer', $event)"
          />
          <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #808080;"></div>
          <Label for="places-layer" class="layer-label">All Places</Label>
        </div>

        <!-- Mobility -->
        <AccordionItem value="mobility">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Mobility</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="transportation-layer"
                  :model-value="showTransportationLayer"
                  @update:modelValue="$emit('update:showTransportationLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #607D8B;"></div>
                <Label for="transportation-layer" class="layer-label">Public Transportation</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="vehicles-layer"
                  :model-value="showVehiclesLayer"
                  @update:modelValue="$emit('update:showVehiclesLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #424242;"></div>
                <Label for="vehicles-layer" class="layer-label">Vehicle Services</Label>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Essential Daily Needs -->
        <AccordionItem value="essential">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Essential Daily Needs</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="healthcare-layer"
                  :model-value="showHealthcareLayer"
                  @update:modelValue="$emit('update:showHealthcareLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #FF4444;"></div>
                <Label for="healthcare-layer" class="layer-label">Health & Personal Care</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="groceries-layer"
                  :model-value="showGroceriesLayer"
                  @update:modelValue="$emit('update:showGroceriesLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #4CAF50;"></div>
                <Label for="groceries-layer" class="layer-label">Food & Groceries</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="banking-layer"
                  :model-value="showBankingLayer"
                  @update:modelValue="$emit('update:showBankingLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #2196F3;"></div>
                <Label for="banking-layer" class="layer-label">Banking & Financial</Label>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Shopping -->
        <AccordionItem value="shopping">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Shopping</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="retail-layer"
                  :model-value="showRetailLayer"
                  @update:modelValue="$emit('update:showRetailLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #9C27B0;"></div>
                <Label for="retail-layer" class="layer-label">Retail Shops</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="petcare-layer"
                  :model-value="showPetcareLayer"
                  @update:modelValue="$emit('update:showPetcareLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #FF9800;"></div>
                <Label for="petcare-layer" class="layer-label">Pet Care & Services</Label>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Lifestyle -->
        <AccordionItem value="lifestyle">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Lifestyle</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="dining-layer"
                  :model-value="showDiningLayer"
                  @update:modelValue="$emit('update:showDiningLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #E91E63;"></div>
                <Label for="dining-layer" class="layer-label">Dining & Cafes</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="entertainment-layer"
                  :model-value="showEntertainmentLayer"
                  @update:modelValue="$emit('update:showEntertainmentLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #673AB7;"></div>
                <Label for="entertainment-layer" class="layer-label">Entertainment Venues</Label>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Recreation & Outdoors -->
        <AccordionItem value="recreation">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Recreation & Outdoors</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="recreation-layer"
                  :model-value="showRecreationLayer"
                  @update:modelValue="$emit('update:showRecreationLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #4CAF50;"></div>
                <Label for="recreation-layer" class="layer-label">Recreation & Sports</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="trails-layer"
                  :model-value="showTrailsLayer"
                  @update:modelValue="$emit('update:showTrailsLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #8BC34A;"></div>
                <Label for="trails-layer" class="layer-label">Walking & Cycling Trails</Label>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Community & Learning -->
        <AccordionItem value="community">
          <AccordionTrigger class="flex w-full items-center justify-between py-2 font-medium transition-all hover:underline">
            <span class="layer-label">Community & Learning</span>
          </AccordionTrigger>
          <AccordionContent class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div class="space-y-1 pt-1">
              
              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="schools-layer"
                  :model-value="showSchoolsLayer"
                  @update:modelValue="$emit('update:showSchoolsLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #FF9800;"></div>
                <Label for="schools-layer" class="layer-label">Schools & Education</Label>
              </div>

              <div class="flex items-center space-x-2 py-0.5">
                <Switch 
                  id="community-layer"
                  :model-value="showCommunityLayer"
                  @update:modelValue="$emit('update:showCommunityLayer', $event)"
                />
                <div class="w-3 h-3 rounded-full mr-2 border border-gray-300" style="background-color: #795548;"></div>
                <Label for="community-layer" class="layer-label">Community Resources</Label>
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
import WalkabilityScore from '../WalkabilityScore.vue'

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
  travelMode: String,
  travelTime: Number,
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
  'update:showIsochroneLayer',
  'update:showPlacesLayer',
  'update:showHealthcareLayer',
  'update:showGroceriesLayer',
  'update:showBankingLayer',
  'update:showRetailLayer',
  'update:showPetcareLayer',
  'update:showDiningLayer',
  'update:showEntertainmentLayer',
  'update:showRecreationLayer',
  'update:showTrailsLayer',
  'update:showTransportationLayer',
  'update:showVehiclesLayer',
  'update:showSchoolsLayer',
  'update:showCommunityLayer',
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
</script>

<style scoped>
/* Layer labels with Inter font to match HazardTab */
.layer-label {
  font-size: 0.8rem; /* 13px */
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.01em;
  line-height: 1.2;
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