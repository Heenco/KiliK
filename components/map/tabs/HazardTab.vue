<template>
  <TabsContent value="hazard">
    <div class="space-y-1">
      <!-- Flood Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center space-x-2">
          <Switch 
            id="flood-layer"
            :model-value="showFloodLayer"
            @update:modelValue="$emit('update:showFloodLayer', $event)"
          />
          <Label for="flood-layer" class="layer-label">Flood</Label>
        </div>
        
        <!-- Display flood risk with pill-shaped badge -->
        <div v-if="floodRisk" class="flex items-center">
          <span class="text-xs text-gray-500 mr-1">Risk:</span>
          <span 
            class="pill-badge"
            :class="getRiskClass(floodRisk)"
          >
            {{ floodRisk === 'None' ? 'Non-detected' : floodRisk }}
          </span>
        </div>
      </div>

      <!-- Landslide Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="landslide-layer"
          :model-value="showLandslideLayer"
          @update:modelValue="$emit('update:showLandslideLayer', $event)"
        />
        <Label for="landslide-layer" class="layer-label">Landslide</Label>
      </div>

      <!-- Noise Layer section -->
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="noise-layer"
          :model-value="showNoiseLayer"
          @update:modelValue="$emit('update:showNoiseLayer', $event)"
        />
        <Label for="noise-layer" class="layer-label">Noise</Label>
      </div>
    </div>
  </TabsContent>
</template>

<script setup>
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

const props = defineProps({
  showFloodLayer: Boolean,
  showLandslideLayer: Boolean,
  showNoiseLayer: Boolean,
  floodRisk: String
})

const emit = defineEmits([
  'update:showFloodLayer',
  'update:showLandslideLayer',
  'update:showNoiseLayer'
])

// Function to determine risk indicator styling based on risk level
const getRiskClass = (risk) => {
  switch(risk) {
    case 'High':
      return 'badge-red';
    case 'Medium':
      return 'badge-yellow';
    case 'Low':
      return 'badge-lime';
    case 'None':
      return 'badge-green';
    case 'Loading...':
      return 'badge-gray';
    case 'Error':
      return 'badge-error';
    default:
      return 'badge-gray';
  }
}
</script>

<style scoped>
/* Smaller layer labels */
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

.badge-red {
  background-color: #fecaca;
  color: #dc2626;
}

.badge-yellow {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-lime {
  background-color: #ecfccb;
  color: #65a30d;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}

.badge-error {
  background-color: #fee2e2;
  color: #ef4444;
}
</style>