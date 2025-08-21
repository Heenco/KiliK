<template>
  <TabsContent value="hazard">
    <!-- Info message when no address is selected -->
    <div v-if="!hasSpecificAddress" class="mb-3 p-2 bg-accent/50 border border-border rounded text-xs text-muted-foreground">
      <div class="flex items-center">
        Search for an address to see specific property risks.
      </div>
    </div>
    
    <div class="space-y-1">
      <!-- Flood Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="flood-layer"
              :model-value="showFloodLayer"
              @update:modelValue="$emit('update:showFloodLayer', $event)"
            />
            <Label for="flood-layer" class="layer-label ml-2">Flood</Label>
          </div>
          
          <!-- Flood Risk Badge -->
          <div class="ml-2">
            <div v-if="!hasSpecificAddress" class="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
              --
            </div>
            <div v-else-if="isLoadingHazards" class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
              Loading...
            </div>
            <div v-else-if="hazardError" class="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-xs">
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
        
        <!-- Flood Legend -->
        <div v-if="showFloodLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-3 bg-blue-500 rounded border mr-2"></div>
          <span>Flood zones</span>
        </div>
      </div>

      <!-- Bushfire Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="bushfire-layer"
              :model-value="showBushfireLayer"
              @update:modelValue="$emit('update:showBushfireLayer', $event)"
            />
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
        
        <!-- Bushfire Legend -->
        <div v-if="showBushfireLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-3 bg-red-500 rounded border mr-2"></div>
          <span>Bushfire risk zones</span>
        </div>
      </div>

      <!-- Noise Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="noise-layer"
              :model-value="showNoiseLayer"
              @update:modelValue="$emit('update:showNoiseLayer', $event)"
            />
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
        
        <!-- Noise Legend -->
        <div v-if="showNoiseLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-3 bg-purple-500 rounded border mr-2"></div>
          <span>Noise corridors</span>
        </div>
      </div>

      <!-- Erosion Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="erosion-layer"
              :model-value="showErosionLayer"
              @update:modelValue="$emit('update:showErosionLayer', $event)"
            />
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
        
        <!-- Erosion Legend -->
        <div v-if="showErosionLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-3 bg-orange-500 rounded border mr-2"></div>
          <span>Erosion zones</span>
        </div>
      </div>

      <!-- Acid Sulfate Soils Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="acid-sulfate-layer"
              :model-value="showAcidSulfateLayer"
              @update:modelValue="$emit('update:showAcidSulfateLayer', $event)"
            />
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
        
        <!-- Acid Sulfate Legend -->
        <div v-if="showAcidSulfateLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-3 bg-yellow-500 rounded border mr-2"></div>
          <span>Acid sulfate soil areas</span>
        </div>
      </div>

      <!-- Oil Pipelines Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="oil-pipelines-layer"
              :model-value="showOilPipelinesLayer"
              @update:modelValue="$emit('update:showOilPipelinesLayer', $event)"
            />
            <Label for="oil-pipelines-layer" class="layer-label ml-2">Oil Pipelines</Label>
          </div>
        
        <!-- Oil Pipelines Info Badge -->
        <div class="ml-2">
          <span class="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs">
            Infrastructure
          </span>
        </div>
        </div>
        
        <!-- Oil Pipelines Legend -->
        <div v-if="showOilPipelinesLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-1 bg-yellow-500 rounded border mr-2"></div>
          <span>Oil pipeline infrastructure</span>
        </div>
      </div>

      <!-- Gas Pipelines Layer section -->
      <div class="py-0.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Switch 
              id="gas-pipelines-layer"
              :model-value="showGasPipelinesLayer"
              @update:modelValue="$emit('update:showGasPipelinesLayer', $event)"
            />
            <Label for="gas-pipelines-layer" class="layer-label ml-2">Gas Pipelines</Label>
          </div>
        
        <!-- Gas Pipelines Info Badge -->
        <div class="ml-2">
          <span class="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs">
            Infrastructure
          </span>
        </div>
        </div>
        
        <!-- Gas Pipelines Legend -->
        <div v-if="showGasPipelinesLayer" class="ml-0 mt-3 flex items-center text-xs text-gray-600">
          <div class="w-3 h-1 bg-yellow-500 rounded border mr-2"></div>
          <span>Gas pipeline infrastructure</span>
        </div>
      </div>
    </div>
    
    <!-- Description text -->
    <div class="mt-4 p-2 bg-accent/50 border border-border rounded text-xs text-muted-foreground">
      View flood zones, bushfire risks, noise corridors, erosion areas, acid sulfate soils, and infrastructure pipelines to assess potential environmental hazards and utility considerations for informed property decisions.
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
  showOilPipelinesLayer: Boolean,
  showGasPipelinesLayer: Boolean,
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
  'update:showAcidSulfateLayer',
  'update:showOilPipelinesLayer',
  'update:showGasPipelinesLayer'
])
</script>

<style scoped>
/* Appealing layer labels */
.layer-label {
  font-size: 0.8rem; /* 13px */
  font-weight: 500;
  color: hsl(var(--foreground));
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

/* Pill-shaped badge component */
.pill-badge {
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  line-height: 1.2;
}

/* Badge colors - updated to use theme tokens */
.badge-green {
  background-color: hsl(var(--success, 142 76% 36%) / 0.2);
  color: hsl(var(--success, 142 76% 36%));
}

.badge-red {
  background-color: hsl(var(--destructive) / 0.2);
  color: hsl(var(--destructive));
}

.badge-yellow {
  background-color: hsl(var(--warning, 48 96% 53%) / 0.2);
  color: hsl(var(--warning, 48 96% 53%));
}

.badge-lime {
  background-color: hsl(var(--success, 142 76% 36%) / 0.1);
  color: hsl(var(--success, 142 76% 36%));
}

.badge-gray {
  background-color: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
}

.badge-error {
  background-color: hsl(var(--destructive) / 0.2);
  color: hsl(var(--destructive));
}

/* Override default classes to use theme tokens */
:deep([class*="bg-gray-100"]) {
  background-color: hsl(var(--muted)) !important;
  color: hsl(var(--muted-foreground)) !important;
}

:deep([class*="bg-gray-600"]) {
  background-color: hsl(var(--primary) / 0.1) !important;
  color: hsl(var(--primary)) !important;
}

:deep([class*="text-gray-"]) {
  color: hsl(var(--muted-foreground)) !important;
}

:deep([class*="border-gray-"]) {
  border-color: hsl(var(--border)) !important;
}
</style>