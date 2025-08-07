<template>
  <TabsContent value="safety" class="h-[calc(100%-40px)]">
    <div class="space-y-2">

      
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="street-lights-layer"
          :model-value="showStreetLightsLayer"
          @update:modelValue="$emit('update:showStreetLightsLayer', $event)"
        />
        <Label for="street-lights-layer" class="layer-label">Street Lights</Label>
      </div>
      
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="police-layer"
          :model-value="showPoliceLayer"
          @update:modelValue="$emit('update:showPoliceLayer', $event)"
        />
        <Label for="police-layer" class="layer-label">Police Stations</Label>
      </div>
      
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="fire-stations-layer"
          :model-value="showFireStationsLayer"
          @update:modelValue="$emit('update:showFireStationsLayer', $event)"
        />
        <Label for="fire-stations-layer" class="layer-label">Fire Stations & Rescue</Label>
      </div>
      
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
      
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="speed-camera-layer"
          :model-value="showSpeedCameraLayer"
          @update:modelValue="$emit('update:showSpeedCameraLayer', $event)"
        />
        <Label for="speed-camera-layer" class="layer-label">Speed Cameras</Label>
      </div>

      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="traffic-signals-layer"
          :model-value="showTrafficSignalsLayer"
          @update:modelValue="$emit('update:showTrafficSignalsLayer', $event)"
        />
        <Label for="traffic-signals-layer" class="layer-label">Traffic Signals & Crossings</Label>
      </div>

      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="electricity-transmission-layer"
          :model-value="showElectricityTransmissionLayer"
          @update:modelValue="$emit('update:showElectricityTransmissionLayer', $event)"
        />
        <Label for="electricity-transmission-layer" class="layer-label">Electricity Transmission Lines</Label>
      </div>
      
      <div class="py-1 mt-2">
       <!-- <h3 class="font-medium mb-2 text-sm">Safety Information</h3> -->
        <p class="text-xs text-gray-600">View street lights, emergency services, healthcare facilities, and road safety features to identify secure routes and access to critical services.</p>
      </div>
    </div>
  </TabsContent>
</template>

<script setup>
import { TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const props = defineProps({
  showStreetLightsLayer: Boolean,
  showPoliceLayer: Boolean,
  showFireStationsLayer: Boolean,
  showHospitalsLayer: Boolean,
  showSpeedCameraLayer: Boolean,
  showTrafficSignalsLayer: Boolean,
  showElectricityTransmissionLayer: Boolean,
  showIsochroneLayer: Boolean,
  hospitalsWithinIsochrone: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'update:showStreetLightsLayer',
  'update:showPoliceLayer',
  'update:showFireStationsLayer',
  'update:showHospitalsLayer',
  'update:showSpeedCameraLayer',
  'update:showTrafficSignalsLayer',
  'update:showElectricityTransmissionLayer'
])
</script>

<style scoped>
.layer-label {
  font-size: 0.715rem; /* 11px */
  font-weight: 500;
  color: #555555;
}

/* Pill-shaped badge component */
.pill-badge {
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  line-height: 1.2;
}

/* Badge colors */
.badge-green {
  background-color: #d4f4dd;
  color: #16a34a;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>