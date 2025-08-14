<template>  <div class="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-blue hover:-translate-y-2 transition-all">
    <h2 class="text-xl font-bold text-blue-400 mb-2">Accessibility</h2>
    <p class="text-gray-300 text-sm mb-4">Assess ease of access to amenities and transportation.</p>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="mt-4 flex items-center justify-center py-2">
      <div class="h-5 w-5 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
      <span class="ml-2 text-gray-300 text-sm">Calculating walkability...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="mt-4 text-red-400 text-sm">
      {{ error }}
    </div>
    
    <!-- Walkability score -->
    <div v-else-if="walkabilityData.score > 0" class="mt-4">
      <div class="mb-3 flex items-center">
        <div class="mr-3 w-10 h-10 rounded-full flex items-center justify-center" :class="scoreColorClass">
          <span class="font-bold text-lg">{{ walkabilityData.score }}</span>
        </div>
        <div>
          <div class="text-white font-medium">Walkability Score</div>
          <div class="text-xs text-gray-300">{{ scoreDescription }}</div>
        </div>
      </div>
      
      <div class="mt-4 space-y-2">
        <div v-for="(item, index) in walkabilityData.radarData" :key="index" class="flex justify-between items-center">
          <span class="text-gray-300">{{ item.name }}</span>
          <span class="px-2 py-1 rounded text-xs" :class="getRatingClass(item.value)">
            {{ getRatingText(item.value) }}
          </span>
        </div>
        
        <div v-if="coordinates" class="mt-4 pt-2 border-t border-gray-700">
          <div class="text-xs text-gray-400 flex items-center justify-between">
            <span>{{ walkabilityData.totalPOIs }} points of interest found</span>
            <button 
              v-if="showChartButton" 
              @click="toggleChart" 
              class="text-blue-400 hover:text-blue-300 text-xs"
            >
              {{ showChart ? 'Hide Details' : 'Show Details' }}
            </button>
          </div>
          
          <!-- Distance Matrix Tabs -->
          <div v-if="showChart" class="mt-3">
            <DistanceMatrixTabs :places="walkabilityData.categories" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fallback state (if no data) -->
    <div v-else class="mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-gray-300">Public Transit</span>
        <span class="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">High</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-300">Schools</span>
        <span class="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">High</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-300">Shopping</span>
        <span class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">Medium</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWalkabilityScore } from '~/composables/useWalkabilityScore';
import { useWalkabilityState } from '~/composables/useWalkabilityState';
import * as turf from '@turf/turf';
import DistanceMatrixTabs from './DistanceMatrixTabs.vue';

// Get the route to access lat/lng
const route = useRoute();
const { getWalkabilityScore } = useWalkabilityScore();
const { hasDataForCoordinates, getWalkabilityData, setWalkabilityData, setLoading, setError } = useWalkabilityState();

// State variables
const isLoading = ref(false);
const error = ref(null);
const walkabilityData = ref({
  score: 0,
  radarData: [],
  pieData: [],
  totalPOIs: 0,
  categories: {}
});
const coordinates = ref(null);
const showChart = ref(false);
const showChartButton = ref(false);

// Generate a simple isochrone (circle) from lat/lng
const generateIsochrone = () => {
  const lat = parseFloat(route.query.lat);
  const lng = parseFloat(route.query.lng);
  
  if (isNaN(lat) || isNaN(lng)) {
    error.value = "Missing coordinates";
    return null;
  }
    try {
    // Create a circle with radius of MAX_DIST (3218m from useWalkabilityScore)
    const center = [lng, lat];
    const radiusInKm = 3.218; // 2 miles in km
    const options = { steps: 24, units: 'kilometers' };
    const circle = turf.circle(center, radiusInKm, options);
    return circle.geometry.coordinates;
  } catch (err) {
    console.error("Error generating isochrone:", err);
    error.value = "Error generating walkability area";
    return null;
  }
};

// Calculate walkability score
const calculateWalkability = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Generate isochrone (circle) around the property
    const isochroneCoords = generateIsochrone();
    
    if (!isochroneCoords) {
      return;
    }
    
    coordinates.value = isochroneCoords;
    
    // Check if we already have cached data for these coordinates
    const lat = parseFloat(route.query.lat);
    const lng = parseFloat(route.query.lng);
    
    if (hasDataForCoordinates(lat, lng)) {
      const cachedData = getWalkabilityData(lat, lng);
      if (cachedData) {
        walkabilityData.value = cachedData;
        console.log('✅ AccessibilityCard: Using cached walkability data:', cachedData);
        showChartButton.value = cachedData.radarData.length >= 3;
        return;
      }
    }
    
    console.log('🔄 AccessibilityCard: Calculating new walkability data for:', lat, lng);
    
    // Get walkability data
    const result = await getWalkabilityScore(isochroneCoords);
    walkabilityData.value = result;
    
    // Cache the result for future use
    setWalkabilityData(lat, lng, result);
    
    // Show chart button if we have enough data points
    showChartButton.value = result.radarData.length >= 3;
  } catch (err) {
    console.error("Error calculating walkability:", err);
    error.value = "Error calculating walkability score";
    setError("Error calculating walkability score");
  } finally {
    isLoading.value = false;
  }
};

// Format the rating based on the score
const getRatingText = (value) => {
  if (value >= 16) return 'High';
  if (value >= 10) return 'Medium';
  if (value >= 5) return 'Low';
  return 'Very Low';
};

// Get color class based on rating
const getRatingClass = (value) => {
  if (value >= 16) return 'bg-blue-400/20 text-blue-400';
  if (value >= 10) return 'bg-green-400/20 text-green-400';
  if (value >= 5) return 'bg-yellow-400/20 text-yellow-400';
  return 'bg-red-400/20 text-red-400';
};

// Toggle chart visibility
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// Score description based on total score
const scoreDescription = computed(() => {
  const score = walkabilityData.value.score;
  if (score >= 108) return "Walker's Paradise"; // 90% of 120
  if (score >= 84) return "Very Walkable"; // 70% of 120
  if (score >= 60) return "Somewhat Walkable"; // 50% of 120
  if (score >= 30) return "Car-Dependent"; // 25% of 120
  return "Very Car-Dependent";
});

// Score circle color class
const scoreColorClass = computed(() => {
  const score = walkabilityData.value.score;
  if (score >= 96) return 'bg-green-400/20 text-green-400'; // 80% of 120
  if (score >= 72) return 'bg-blue-400/20 text-blue-400'; // 60% of 120
  if (score >= 48) return 'bg-yellow-400/20 text-yellow-400'; // 40% of 120
  if (score >= 30) return 'bg-orange-400/20 text-orange-400'; // 25% of 120
  return 'bg-red-400/20 text-red-400';
});

// Calculate walkability when component mounts
onMounted(() => {
  if (route.query.lat && route.query.lng) {
    calculateWalkability();
  }
});

// Recalculate when route parameters change
watch(() => [route.query.lat, route.query.lng], ([newLat, newLng]) => {
  if (newLat && newLng) {
    calculateWalkability();
  }
});
</script>

<style scoped>
.hover\:shadow-blue:hover {
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
