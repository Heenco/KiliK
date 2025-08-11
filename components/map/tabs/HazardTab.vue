<template>
  <TabsContent value="hazard">
    <!-- Info message when no address is selected -->
    <div v-if="!hasSpecificAddress" class="mb-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
      <div class="flex items-center">
        <span class="mr-1">🔍</span>
        Search for an address to see specific property risks.
      </div>
    </div>
    
    <div class="space-y-1">
      <!-- Flood Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center">
          <Switch 
            id="flood-layer"
            :model-value="showFloodLayer"
            @update:modelValue="$emit('update:showFloodLayer', $event)"
          />
          <div class="w-3 h-3 bg-blue-500 rounded border ml-2"></div>
          <Label for="flood-layer" class="layer-label ml-2">Flood</Label>
        </div>
        
        <!-- Flood Risk Badge -->
        <div class="ml-2">
          <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
            --
          </div>
          <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-xs">
            Loading...
          </div>
          <div v-else-if="hazardError" class="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
            Error
          </div>
          <div v-else-if="hazardData?.flood_risk">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-xs': true,
                'bg-green-400/20 text-green-400': hazardData.flood_risk.toLowerCase() === 'low',
                'bg-yellow-400/20 text-yellow-400': hazardData.flood_risk.toLowerCase() === 'medium',
                'bg-red-400/20 text-red-400': hazardData.flood_risk.toLowerCase() === 'high'
              }"
            >
              {{ hazardData.flood_risk }}
            </span>
          </div>
          <span v-else class="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
            No risk
          </span>
        </div>
      </div>

      <!-- Bushfire Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center">
          <Switch 
            id="bushfire-layer"
            :model-value="showBushfireLayer"
            @update:modelValue="$emit('update:showBushfireLayer', $event)"
          />
          <div class="w-3 h-3 bg-red-500 rounded border ml-2"></div>
          <Label for="bushfire-layer" class="layer-label ml-2">Bushfire</Label>
        </div>
        
        <!-- Bushfire Risk Badge -->
        <div class="ml-2">
          <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
            --
          </div>
          <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-xs">
            Loading...
          </div>
          <div v-else-if="hazardError" class="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
            Error
          </div>
          <div v-else-if="hazardData?.bushfire_desc">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-xs': true,
                'bg-green-400/20 text-green-400': hazardData.bushfire_desc.toLowerCase().includes('low'),
                'bg-yellow-400/20 text-yellow-400': hazardData.bushfire_desc.toLowerCase().includes('medium'),
                'bg-red-400/20 text-red-400': hazardData.bushfire_desc.toLowerCase().includes('high')
              }"
            >
              {{ hazardData.bushfire_desc }}
            </span>
          </div>
          <span v-else class="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
            No risk
          </span>
        </div>
      </div>

      <!-- Noise Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center">
          <Switch 
            id="noise-layer"
            :model-value="showNoiseLayer"
            @update:modelValue="$emit('update:showNoiseLayer', $event)"
          />
          <div class="w-3 h-3 bg-purple-500 rounded border ml-2"></div>
          <Label for="noise-layer" class="layer-label ml-2">Noise Corridors</Label>
        </div>
        
        <!-- Noise Risk Badge -->
        <div class="ml-2">
          <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
            --
          </div>
          <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-xs">
            Loading...
          </div>
          <div v-else-if="hazardError" class="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
            Error
          </div>
          <div v-else-if="hazardData?.noise_desc">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-xs': true,
                'bg-orange-400/20 text-orange-400': hazardData.noise_desc.toLowerCase().includes('category 0'),
                'bg-yellow-400/20 text-yellow-400': hazardData.noise_desc.toLowerCase().includes('category 1'),
                'bg-orange-500/20 text-orange-500': hazardData.noise_desc.toLowerCase().includes('category 2'),
                'bg-red-400/20 text-red-400': hazardData.noise_desc.toLowerCase().includes('category 3'),
                'bg-red-500/20 text-red-500': hazardData.noise_desc.toLowerCase().includes('category 4')
              }"
            >
              {{ hazardData.noise_desc }}
            </span>
          </div>
          <span v-else class="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
            No risk
          </span>
        </div>
      </div>

      <!-- Erosion Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center">
          <Switch 
            id="erosion-layer"
            :model-value="showErosionLayer"
            @update:modelValue="$emit('update:showErosionLayer', $event)"
          />
          <div class="w-3 h-3 bg-orange-500 rounded border ml-2"></div>
          <Label for="erosion-layer" class="layer-label ml-2">Erosion</Label>
        </div>
        
        <!-- Erosion Risk Badge -->
        <div class="ml-2">
          <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
            --
          </div>
          <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-xs">
            Loading...
          </div>
          <div v-else-if="hazardError" class="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
            Error
          </div>
          <div v-else-if="hazardData?.erosion_desc">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-xs': true,
                'bg-green-400/20 text-green-400': hazardData.erosion_desc.toLowerCase().includes('low'),
                'bg-yellow-400/20 text-yellow-400': hazardData.erosion_desc.toLowerCase().includes('medium'),
                'bg-red-400/20 text-red-400': hazardData.erosion_desc.toLowerCase().includes('high')
              }"
            >
              {{ hazardData.erosion_desc }}
            </span>
          </div>
          <span v-else class="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
            No risk
          </span>
        </div>
      </div>

      <!-- Acid Sulfate Soils Layer section -->
      <div class="flex items-center justify-between py-0.5">
        <div class="flex items-center">
          <Switch 
            id="acid-sulfate-layer"
            :model-value="showAcidSulfateLayer"
            @update:modelValue="$emit('update:showAcidSulfateLayer', $event)"
          />
          <div class="w-3 h-3 bg-yellow-500 rounded border ml-2"></div>
          <Label for="acid-sulfate-layer" class="layer-label ml-2">Acid Sulfate Soils</Label>
        </div>
        
        <!-- Acid Sulfate Risk Badge -->
        <div class="ml-2">
          <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
            --
          </div>
          <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-xs">
            Loading...
          </div>
          <div v-else-if="hazardError" class="px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs">
            Error
          </div>
          <div v-else-if="hazardData?.acid_sulph">
            <span 
              :class="{
                'px-3 py-1 rounded-full text-xs': true,
                'bg-orange-400/20 text-orange-400': hazardData.acid_sulph.toLowerCase().includes('as1'),
                'bg-yellow-400/20 text-yellow-400': hazardData.acid_sulph.toLowerCase().includes('as2'),
                'bg-red-400/20 text-red-400': hazardData.acid_sulph.toLowerCase().includes('as3'),
                'bg-red-500/20 text-red-500': hazardData.acid_sulph.toLowerCase().includes('as4')
              }"
            >
              {{ hazardData.acid_sulph }}
            </span>
          </div>
          <span v-else class="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
            No risk
          </span>
        </div>
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
  showBushfireLayer: Boolean,
  showNoiseLayer: Boolean,
  showErosionLayer: Boolean,
  showAcidSulfateLayer: Boolean,
  hazardData: Object,
  isLoadingHazards: Boolean,
  hazardError: String,
  hasSpecificAddress: Boolean
})

const emit = defineEmits([
  'update:showFloodLayer',
  'update:showBushfireLayer', 
  'update:showNoiseLayer',
  'update:showErosionLayer',
  'update:showAcidSulfateLayer'
])
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