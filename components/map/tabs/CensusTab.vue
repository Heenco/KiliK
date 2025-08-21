<template>
  <TabsContent value="census" class="h-[calc(100%-40px)]">
    <div class="space-y-2">
      <div class="flex items-center space-x-2 py-0.5">
        <Switch 
          id="seifa-layer"
          :model-value="showSeifaLayer"
          @update:modelValue="$emit('update:showSeifaLayer', $event)"
        />
        <Label for="seifa-layer" class="layer-label">IRSAD Index 2021</Label>
      </div>

      <div class="py-1 mt-2">
        <p class="text-xs text-muted-foreground">SEIFA (Socio-Economic Indexes for Areas) shows relative socio-economic advantage and disadvantage. Higher scores (green) indicate areas of advantage, while lower scores (red) indicate areas of disadvantage.</p>
      </div>
      
      <!-- SEIFA Data Card - Only shown when selectedAddress exists and data is loaded -->
      <Card v-if="seifaData && selectedAddress" class="mt-1 shadow-sm">

        <CardContent>
          <div class="text-xs space-y-1">
            <div class="pb-1 border-b border-border">
              <div class="font-medium text-foreground bold">Statistical Area:</div>
              <div>{{ seifaData.sal_name_2021 }}</div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="font-medium text-foreground mb-1">State Ranking</div>
                <div class="flex justify-between items-center mb-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span class="underline underline-offset-2 cursor-help">Decile:</span>
                      </TooltipTrigger>
                      <TooltipContent class="max-w-xs" side="bottom">
                        <p class="text-[0.65rem] leading-tight">
                          Decile: Divides all areas into 10 groups based on score. 1 = most disadvantaged, 10 = least disadvantaged.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span class="font-semibold" 
                        :class="getDecileColor(seifaData.irsad_state_decile)">
                    {{ seifaData.irsad_state_decile }} / 10
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span class="underline underline-offset-2 cursor-help">Percentile:</span>
                      </TooltipTrigger>
                      <TooltipContent class="max-w-xs" side="bottom">
                        <p class="text-[0.65rem] leading-tight">
                          Percentiles indicate the percentage of areas that have a score lower than this area. A percentile of 80% means this area has a higher score than 80% of areas in the state.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>{{ seifaData.irsad_state_percentile }}%</span>
                </div>
              </div>
              
              <div>
                <div class="font-medium text-foreground mb-1">Australia Ranking</div>
                <div class="flex justify-between items-center mb-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span class="underline underline-offset-2 cursor-help">Decile:</span>
                      </TooltipTrigger>
                      <TooltipContent class="max-w-xs" side="bottom">
                        <p class="text-[0.65rem] leading-tight">
                          Deciles divide the distribution into 10 equal groups. A decile of 1 represents the bottom 10% (most disadvantaged), while 10 represents the top 10% (most advantaged) across Australia.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span class="font-semibold"
                        :class="getDecileColor(seifaData.irsad_aus_decile)">
                    {{ seifaData.irsad_aus_decile }} / 10
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span class="underline underline-offset-2 cursor-help">Percentile:</span>
                      </TooltipTrigger>
                      <TooltipContent class="max-w-xs" side="bottom">
                        <p class="text-[0.65rem] leading-tight">
                          Percentiles indicate the percentage of areas that have a score lower than this area. A percentile of 80% means this area has a higher score than 80% of areas across Australia.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>{{ seifaData.irsad_aus_percentile }}%</span>
                </div>
              </div>
            </div>
            
            <div class="text-muted-foreground italic text-[0.65rem] mt-1 pt-1 border-t border-border">
              Source: Australian Bureau of Statistics, SEIFA 2021
            </div>
          </div>
        </CardContent>
      </Card>
      
      <!-- Loading state for SEIFA data -->
      <div v-else-if="isLoading && selectedAddress" class="mt-4 py-3 px-4 bg-card rounded-lg shadow-sm border border-border">
        <div class="flex items-center space-x-2">
          <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <span class="text-xs text-muted-foreground">Loading SEIFA data...</span>
        </div>
      </div>
    </div>
  </TabsContent>
</template>

<script setup>
import { TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ref, watch } from 'vue'
import { fetchSeifaData } from '@/utils/spatialUtils' // Import the fetchSeifaData function

const props = defineProps({
  showSeifaLayer: Boolean,
  selectedAddress: Object
})

const emit = defineEmits([
  'update:showSeifaLayer'
])

// State for SEIFA data
const seifaData = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Function to get SEIFA data for the selected address
const loadSeifaData = async (coordinates) => {
  if (!coordinates || !coordinates.length) return
  
  try {
    isLoading.value = true
    error.value = null
    
    // Use our utility function from spatialUtils.js
    const data = await fetchSeifaData(coordinates)
    
    // Only update data if we have valid information
    if (data && data !== 'Error' && data !== 'Invalid coordinates' && data !== 'Endpoint not configured') {
      seifaData.value = data
      console.log('SEIFA data loaded successfully:', data)
    } else {
      console.log('No valid SEIFA data returned:', data)
      seifaData.value = null
    }
  } catch (err) {
    console.error('Error fetching SEIFA data:', err)
    error.value = err.message
    seifaData.value = null
  } finally {
    isLoading.value = false
  }
}

// Helper function to determine color based on decile value
const getDecileColor = (decile) => {
  if (!decile) return 'text-muted-foreground'
  
  // Colors based on decile value using tokens
  if (decile <= 3) return 'text-destructive' // Low - using destructive token
  if (decile <= 5) return 'text-foreground' // Medium - using default foreground color
  if (decile <= 7) return 'text-accent-foreground' // Medium-high - using accent-foreground
  return 'text-primary' // High - using primary color
}

// Watch for changes in the selected address
watch(() => props.selectedAddress, (newAddress) => {
  if (newAddress && newAddress.coordinates) {
    loadSeifaData(newAddress.coordinates)
  } else {
    seifaData.value = null
  }
}, { immediate: true })
</script>

<style scoped>
.layer-label {
  font-size: 0.715rem; /* 11px */
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}
</style>