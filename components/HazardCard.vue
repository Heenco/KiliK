<template>
  <div class="p-6 bg-card/80 backdrop-blur rounded-lg shadow-lg border border-border hover:shadow-green hover:-translate-y-2 transition-all">
    <h2 class="text-xl font-bold text-card-foreground mb-2">Hazard</h2>
    <p class="text-muted-foreground text-sm mb-4">Evaluate potential risks and hazards in the area.</p>
    <div class="mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-card-foreground cursor-pointer hover:text-foreground" @click="loadFloodRiskManually">Flood Risk</span>
        <div>
          <div v-if="isLoadingFloodRisk" class="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
            Loading...
          </div>
          <div v-else-if="floodRiskError" class="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs">
            Could not load flood data
          </div>          <div v-else-if="property.floodRisk && property.floodRisk.length > 0">
            <span 
              v-if="property.highestFloodRisk"
              :class="{
                'px-2 py-1 rounded text-xs': true,
                'bg-orange-300/20 text-orange-300': property.highestFloodRisk.flood_risk.toLowerCase() === 'very low',
                'bg-green-400/20 text-green-400': property.highestFloodRisk.flood_risk.toLowerCase() === 'low',
                'bg-yellow-400/20 text-yellow-400': property.highestFloodRisk.flood_risk.toLowerCase() === 'medium',
                'bg-red-400/20 text-red-400': property.highestFloodRisk.flood_risk.toLowerCase() === 'high'
              }"
              :title="getFloodRiskTooltip()"
            >
              {{ property.highestFloodRisk.flood_risk }}
            </span>          </div>          <span v-else class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">
            No flood risk detected
          </span>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground cursor-pointer hover:text-foreground" @click="loadBushfireRiskManually">Bushfire Risk</span>
        <div>
          <div v-if="isLoadingBushfireRisk" class="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
            Loading...
          </div>
          <div v-else-if="bushfireRiskError" class="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs">
            Could not load bushfire data
          </div>
          <div v-else-if="property.bushfireRisk && property.bushfireRisk.length > 0">
            <span 
              v-if="property.highestBushfireRisk"
              :class="{
                'px-2 py-1 rounded text-xs': true,
                'bg-green-400/20 text-green-400': property.highestBushfireRisk.description.toLowerCase().includes('low'),
                'bg-yellow-400/20 text-yellow-400': property.highestBushfireRisk.description.toLowerCase().includes('medium'),
                'bg-red-400/20 text-red-400': property.highestBushfireRisk.description.toLowerCase().includes('high')
              }"
              :title="getBushfireRiskTooltip()"
            >
              {{ property.highestBushfireRisk.description }}
            </span>
          </div>
          <span v-else class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">
            No bushfire risk detected
          </span>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground cursor-pointer hover:text-foreground" @click="loadNoiseRiskManually">Noise Risk</span>
        <div>
          <div v-if="isLoadingNoiseRisk" class="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
            Loading...
          </div>
          <div v-else-if="noiseRiskError" class="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs">
            Could not load noise data
          </div>
          <div v-else-if="property.noiseRisk && property.noiseRisk.length > 0">
            <span 
              v-if="property.highestNoiseRisk"
              :class="{
                'px-2 py-1 rounded text-xs': true,
                'bg-orange-400/20 text-orange-400': property.highestNoiseRisk.description.toLowerCase().includes('category 0'),
                'bg-yellow-400/20 text-yellow-400': property.highestNoiseRisk.description.toLowerCase().includes('category 1'),
                'bg-orange-500/20 text-orange-500': property.highestNoiseRisk.description.toLowerCase().includes('category 2'),
                'bg-red-400/20 text-red-400': property.highestNoiseRisk.description.toLowerCase().includes('category 3'),
                'bg-red-500/20 text-red-500': property.highestNoiseRisk.description.toLowerCase().includes('category 4')
              }"
              :title="getNoiseRiskTooltip()"
            >
              {{ property.highestNoiseRisk.description }}
            </span>
          </div>
          <span v-else class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">
            No noise risk detected
          </span>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground cursor-pointer hover:text-foreground" @click="loadCoastalErosionRiskManually">Coastal Erosion Risk</span>
        <div>
          <div v-if="isLoadingCoastalErosionRisk" class="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
            Loading...
          </div>
          <div v-else-if="coastalErosionRiskError" class="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs">
            Could not load coastal erosion data
          </div>
          <div v-else-if="property.coastalErosionRisk && property.coastalErosionRisk.length > 0">
            <span 
              v-if="property.highestCoastalErosionRisk"
              :class="{
                'px-2 py-1 rounded text-xs': true,
                'bg-orange-400/20 text-orange-400': property.highestCoastalErosionRisk.ovl2_desc.toLowerCase().includes('low'),
                'bg-yellow-400/20 text-yellow-400': property.highestCoastalErosionRisk.ovl2_desc.toLowerCase().includes('medium'),
                'bg-red-400/20 text-red-400': property.highestCoastalErosionRisk.ovl2_desc.toLowerCase().includes('high')
              }"
              :title="getCoastalErosionRiskTooltip()"
            >
              {{ property.highestCoastalErosionRisk.ovl2_desc }}
            </span>
          </div>
          <span v-else class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs ml-auto">
            No risk detected
          </span>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground cursor-pointer hover:text-foreground" @click="loadAcidSulfateRiskManually">Acid Sulfate Risk</span>
        <div>
          <div v-if="isLoadingAcidSulfateRisk" class="px-2 py-1 bg-muted/50 text-muted-foreground rounded text-xs">
            Loading...
          </div>
          <div v-else-if="acidSulfateRiskError" class="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs">
            Could not load acid sulfate data
          </div>
          <div v-else-if="property.acidSulfateRisk && property.acidSulfateRisk.length > 0">
            <span 
              v-if="property.highestAcidSulfateRisk"
              :class="{
                'px-2 py-1 rounded text-xs': true,
                'bg-orange-400/20 text-orange-400': property.highestAcidSulfateRisk.acid_sulph.toLowerCase().includes('as1'),
                'bg-yellow-400/20 text-yellow-400': property.highestAcidSulfateRisk.acid_sulph.toLowerCase().includes('as2'),
                'bg-red-400/20 text-red-400': property.highestAcidSulfateRisk.acid_sulph.toLowerCase().includes('as3'),
                'bg-red-500/20 text-red-500': property.highestAcidSulfateRisk.acid_sulph.toLowerCase().includes('as4')
              }"
              :title="getAcidSulfateRiskTooltip()"
            >
              {{ property.highestAcidSulfateRisk.acid_sulph }}
            </span>
          </div>
          <span v-else class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">
            No acid sulfate risk detected
          </span>
        </div>
      </div>
    
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePropertyData } from '~/composables/usePropertyData';

const { property, isLoadingFloodRisk, floodRiskError, loadFloodRisk, isLoadingBushfireRisk, bushfireRiskError, loadBushfireRisk, isLoadingNoiseRisk, noiseRiskError, loadNoiseRisk, isLoadingCoastalErosionRisk, coastalErosionRiskError, loadCoastalErosionRisk, isLoadingAcidSulfateRisk, acidSulfateRiskError, loadAcidSulfateRisk } = usePropertyData();

function loadFloodRiskManually() {
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadFloodRisk(property.value.lotDetails.lotplan);
  } else {
    loadFloodRisk('6RP66231');
  }
}

function loadBushfireRiskManually() {
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadBushfireRisk(property.value.lotDetails.lotplan);
  } else {
    loadBushfireRisk('1RP56852');
  }
}

function loadNoiseRiskManually() {
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadNoiseRisk(property.value.lotDetails.lotplan);
  } else {
    loadNoiseRisk('4SP210797');
  }
}

function loadCoastalErosionRiskManually() {
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadCoastalErosionRisk(property.value.lotDetails.lotplan);
  } else {
    loadCoastalErosionRisk('63RP18356');
  }
}

function loadAcidSulfateRiskManually() {
  if (property.value.lotDetails && property.value.lotDetails.lotplan) {
    loadAcidSulfateRisk(property.value.lotDetails.lotplan);
  } else {
    loadAcidSulfateRisk('63RP18356');
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

  let tooltip = 'Showing highest risk only. All flood risks:\n';
  property.value.floodRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.flood_risk} - ${risk.flood_type}\n`;
  });

  return tooltip;
}

function getBushfireRiskTooltip() {
  if (!property.value.bushfireRisk || property.value.bushfireRisk.length === 0) {
    return 'No bushfire risk detected in this area';
  }

  let tooltip = 'All bushfire risks:\n';
  property.value.bushfireRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.description}\n`;
  });

  return tooltip;
}

function getNoiseRiskTooltip() {
  if (!property.value.noiseRisk || property.value.noiseRisk.length === 0) {
    return 'No noise risk detected in this area';
  }

  let tooltip = 'All noise risks:\n';
  property.value.noiseRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.description}\n`;
  });

  return tooltip;
}

function getCoastalErosionRiskTooltip() {
  if (!property.value.coastalErosionRisk || property.value.coastalErosionRisk.length === 0) {
    return 'No coastal erosion risk detected in this area';
  }

  let tooltip = 'All coastal erosion risks:\n';
  property.value.coastalErosionRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.ovl2_desc}\n`;
  });

  return tooltip;
}

function getAcidSulfateRiskTooltip() {
  if (!property.value.acidSulfateRisk || property.value.acidSulfateRisk.length === 0) {
    return 'No acid sulfate risk detected in this area';
  }

  let tooltip = 'All acid sulfate risks:\n';
  property.value.acidSulfateRisk.forEach((risk, index) => {
    tooltip += `${index + 1}. ${risk.acid_sulph}\n`;
  });

  return tooltip;
}
</script>

<style scoped>
.hover\:shadow-green:hover {
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
}
</style>
