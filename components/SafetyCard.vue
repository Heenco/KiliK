<template>  <div class="p-6 bg-card/80 backdrop-blur rounded-lg shadow-lg border border-border hover:shadow-yellow hover:-translate-y-2 transition-all">
    <h2 class="text-xl font-bold text-card-foreground mb-2">Safety</h2>
    <p class="text-muted-foreground text-sm mb-4">Crime statistics and safety assessment for this area.</p>
      <!-- Loading State -->
    <div v-if="isLoading" class="mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Loading safety data...</span>
        <div class="animate-pulse bg-muted h-5 w-16 rounded"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-red-400 text-sm">{{ error }}</span>
      </div>
    </div>      <!-- Crime Data -->
    <div v-else-if="crimeData" class="mt-4 space-y-3">      <!-- Safety Score -->
      <div class="mb-3 flex items-center">
        <div class="mr-3 w-10 h-10 rounded-full flex items-center justify-center" :class="getCrimeScoreColorClass(getCrimeScore(crimeData.crime_rank))">
          <span class="font-bold text-lg">{{ getCrimeScore(crimeData.crime_rank) }}</span>
        </div>
        <div>
          <div class="text-card-foreground font-medium">Safety Score</div>
          <div class="text-xs text-muted-foreground">{{ getCrimeScoreDescription(getCrimeScore(crimeData.crime_rank)) }}</div>
        </div>
      </div>
      
      <!-- Population -->
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span class="text-card-foreground">Population</span>
          <span class="text-xs text-muted-foreground">(in suburb)</span>
        </div>
        <span class="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">
          {{ crimeData.population }}
        </span>
      </div>
      
      <!-- Property Crime Rate -->
      <div class="flex justify-between items-center">
        <span class="text-card-foreground">Property Crime</span>
        <span :class="getCrimeRateColorClass(crimeData.property_crimes_per_1000_people, 'property')" class="px-2 py-1 rounded text-xs">
          {{ formatCrimeRate(crimeData.property_crimes_per_1000_people) }}
        </span>
      </div>
      
      <!-- Violent Crime Rate -->
      <div class="flex justify-between items-center">
        <span class="text-card-foreground">Violent Crime</span>
        <span :class="getCrimeRateColorClass(crimeData.violent_crimes_per_1000_people, 'violent')" class="px-2 py-1 rounded text-xs">
          {{ formatCrimeRate(crimeData.violent_crimes_per_1000_people) }}
        </span>
      </div>
      
      <!-- Safety Status -->
      <div class="mt-3 p-3 bg-muted/50 rounded">
        <h4 class="text-sm font-semibold text-green-400 mb-1">Safety Status</h4>
        <p class="text-xs text-muted-foreground">{{ crimeData.safety_status }}</p>
      </div>
      
      <!-- Additional Crime Info -->
      <div class="mt-3 p-3 bg-muted/50 rounded">
        <h4 class="text-sm font-semibold text-yellow-400 mb-1">Main Crime Problems</h4>
        <p class="text-xs text-muted-foreground">{{ crimeData.main_crime_problems }}</p>
      </div>
    </div>
    
    <!-- Fallback Sample Data -->
    <div v-else class="mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-card-foreground">Income Level</span>
        <span class="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">Medium</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground">Employment</span>
        <span class="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">High</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-card-foreground">Crime Rate</span>
        <span class="px-2 py-1 bg-green-400/20 text-green-400 rounded text-xs">No Data</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Reactive data
const crimeData = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Props for coordinates (optional - can be passed from parent)
const props = defineProps({
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  }
});

// Function to fetch crime data from API
async function fetchCrimeData(lat, lng) {
  if (!lat || !lng) {
    error.value = 'Location coordinates not available';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch(`http://supabase.heenco.com:54321/rest/v1/rpc/get_crime_data?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      crimeData.value = data[0]; // Take the first result
    } else {
      error.value = 'No crime data found for this location';
    }
  } catch (err) {
    console.error('Error fetching crime data:', err);
    error.value = 'Failed to load crime data';
  } finally {
    isLoading.value = false;
  }
}

// Function to extract crime rank number for display
function getCrimeRankShort(crimeRank) {
  if (!crimeRank) return 'N/A';
  
  // Extract the rank number from text like "Toowong suburb is ranked10/100in Australia..."
  const match = crimeRank.match(/ranked(\d+)\/(\d+)/);
  if (match) {
    return `${match[1]}/100`;
  }
  
  return 'N/A';
}

// Function to calculate crime score (100 - rank = score)
function getCrimeScore(crimeRank) {
  if (!crimeRank) return 'N/A';
  
  // Extract the rank number from text like "Toowong suburb is ranked10/100in Australia..."
  const match = crimeRank.match(/ranked(\d+)\/(\d+)/);
  if (match) {
    const rank = parseInt(match[1]);
    const score = 100 - rank;
    return score;
  }
  
  return 'N/A';
}

// Function to get color class for crime score (higher score = safer = green)
function getCrimeScoreColorClass(score) {
  if (score === 'N/A') return 'bg-gray-400/20 text-gray-400';
  
  const numScore = parseInt(score);
  
  // Higher scores are better (safer areas)
  if (numScore >= 80) return 'bg-green-400/20 text-green-400';        // Excellent (80-100)
  if (numScore >= 60) return 'bg-yellow-400/20 text-yellow-400';      // Good (60-79)
  if (numScore >= 40) return 'bg-orange-400/20 text-orange-400';      // Fair (40-59)
  return 'bg-red-400/20 text-red-400';                               // Poor (0-39)
}

// Function to get crime score description
function getCrimeScoreDescription(score) {
  if (score === 'N/A') return 'No data available';
  
  const numScore = parseInt(score);
  
  if (numScore >= 90) return "Very Safe";
  if (numScore >= 80) return "Safe";
  if (numScore >= 60) return "Moderately Safe";
  if (numScore >= 40) return "Some Risk";
  return "Higher Risk";
}

// Function to format crime rate for better readability
function formatCrimeRate(rate) {
  if (!rate) return 'N/A';
  
  const numRate = parseFloat(rate);
  
  // Convert to more readable format
  if (numRate < 1) {
    return `${numRate} per 1000 ppl`;
  } else if (numRate >= 100) {
    return `${Math.round(numRate)} per 1000 ppl`;
  } else {
    return `${Math.round(numRate * 10) / 10} per 1000 ppl`;
  }
}

// Function to get color class based on crime rate (lower = green, higher = red)
function getCrimeRateColorClass(rate, crimeType) {
  if (!rate) return 'bg-gray-400/20 text-gray-400';
  
  const numRate = parseFloat(rate);
  
  // For property crimes (typically higher numbers)
  if (crimeType === 'property') {
    if (numRate <= 20) return 'bg-green-400/20 text-green-400';      // Very low
    if (numRate <= 40) return 'bg-yellow-400/20 text-yellow-400';    // Low-Medium
    if (numRate <= 60) return 'bg-orange-400/20 text-orange-400';    // Medium-High
    return 'bg-red-400/20 text-red-400';                             // High
  }
  
  // For violent crimes (typically lower numbers)
  if (crimeType === 'violent') {
    if (numRate <= 2) return 'bg-green-400/20 text-green-400';       // Very low
    if (numRate <= 5) return 'bg-yellow-400/20 text-yellow-400';     // Low-Medium
    if (numRate <= 10) return 'bg-orange-400/20 text-orange-400';    // Medium-High
    return 'bg-red-400/20 text-red-400';                             // High
  }
  
  // Default fallback
  return 'bg-blue-400/20 text-blue-400';
}

// Initialize data on component mount
onMounted(() => {
  // Get coordinates from props or route query parameters
  const lat = props.latitude || parseFloat(route.query.lat);
  const lng = props.longitude || parseFloat(route.query.lng);
  
  if (lat && lng) {
    fetchCrimeData(lat, lng);
  } else {
    error.value = 'Location coordinates not provided';
  }
});

// Sample data fallback (keeping for reference)
const socioEconomicData = ref({
  incomeLevel: 'Medium',
  employment: 'High',
  crimeRate: 'Low'
});
</script>

<style scoped>
/* Inherit hover effects from parent */
.hover\:shadow-yellow:hover {
  box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
}
</style>
