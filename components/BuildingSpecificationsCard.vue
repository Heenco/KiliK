<template>
  <div class="p-6 bg-card/80 backdrop-blur rounded-lg shadow-lg border border-border hover:shadow-purple hover:-translate-y-2 transition-all relative">
    <!-- Coming Soon Overlay -->
    <div class="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div class="text-center">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
        <p class="text-muted-foreground text-sm max-w-xs mx-auto">Detailed building specifications and construction data will be available shortly.</p>
        <div class="mt-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Detailed Analysis
          </span>
        </div>
      </div>
    </div>
    
    <!-- Original Content (blurred in background) -->
    <div class="filter blur-sm">
      <h2 class="text-xl font-bold text-purple-400 mb-2">
        Building Specifications
      </h2>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="mt-4 flex items-center justify-center py-2">
      <div class="h-5 w-5 rounded-full border-2 border-t-transparent border-purple-400 animate-spin"></div>
      <span class="ml-2 text-gray-300 text-sm">Loading building data...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="mt-4 text-red-400 text-sm">
      {{ error }}
    </div>
    
    <!-- Building specifications data -->
    <div v-else>
      <!-- Basic Information -->
      <div class="bg-gray-900/50 p-3 rounded-md mt-3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">Building Type</div>
            <div class="text-white">{{ buildingData.buildingType }}</div>
            
            <div class="text-sm text-gray-400 mt-3 mb-1">Year Built</div>
            <div class="text-white">{{ buildingData.yearBuilt }}</div>
            
            <div class="text-sm text-gray-400 mt-3 mb-1">Construction Material</div>
            <div class="text-white">{{ buildingData.constructionMaterial }}</div>
          </div>
          
          <div>
            <div class="text-sm text-gray-400 mb-1">Total Floors</div>
            <div class="text-white">{{ buildingData.floors }}</div>
            
            <div class="text-sm text-gray-400 mt-3 mb-1">Floor Area</div>
            <div class="text-white">{{ buildingData.floorArea }} m²</div>
            
            <div class="text-sm text-gray-400 mt-3 mb-1">Land Area</div>
            <div class="text-white">{{ buildingData.landArea }} m²</div>
          </div>
        </div>
      </div>
      
      <!-- Construction Details -->
      <div class="mt-4">
        <button 
          @click="toggleSection('construction')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Construction Details</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.construction}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.construction" class="mt-2 space-y-1 bg-gray-900/50 p-2 rounded-md">
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Foundation Type</span>
            <span class="text-white text-sm">{{ buildingData.foundationType }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Roof Type</span>
            <span class="text-white text-sm">{{ buildingData.roofType }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Wall Construction</span>
            <span class="text-white text-sm">{{ buildingData.wallConstruction }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Insulation Rating</span>
            <span class="text-white text-sm">{{ buildingData.insulationRating }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Last Renovation</span>
            <span class="text-white text-sm">{{ buildingData.lastRenovation || 'N/A' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Interior Features -->
      <div class="mt-3">
        <button 
          @click="toggleSection('interior')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Interior Features</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.interior}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.interior" class="mt-2 space-y-1 bg-gray-900/50 p-2 rounded-md">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-400 mb-1">Bedrooms</div>
              <div class="text-white text-sm">{{ buildingData.bedrooms }}</div>
              
              <div class="text-sm text-gray-400 mt-2 mb-1">Bathrooms</div>
              <div class="text-white text-sm">{{ buildingData.bathrooms }}</div>
              
              <div class="text-sm text-gray-400 mt-2 mb-1">Living Areas</div>
              <div class="text-white text-sm">{{ buildingData.livingAreas }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-400 mb-1">Kitchen Type</div>
              <div class="text-white text-sm">{{ buildingData.kitchenType }}</div>
              
              <div class="text-sm text-gray-400 mt-2 mb-1">Flooring</div>
              <div class="text-white text-sm">{{ buildingData.flooring }}</div>
              
              <div class="text-sm text-gray-400 mt-2 mb-1">Heating/Cooling</div>
              <div class="text-white text-sm">{{ buildingData.heatingCooling }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Exterior & Property -->
      <div class="mt-3">
        <button 
          @click="toggleSection('exterior')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Exterior & Property</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.exterior}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.exterior" class="mt-2 space-y-1 bg-gray-900/50 p-2 rounded-md">
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Parking Spaces</span>
            <span class="text-white text-sm">{{ buildingData.parkingSpaces }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Garage Type</span>
            <span class="text-white text-sm">{{ buildingData.garageType }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Fencing</span>
            <span class="text-white text-sm">{{ buildingData.fencing }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Landscaping</span>
            <span class="text-white text-sm">{{ buildingData.landscaping }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Outdoor Features</span>
            <span class="text-white text-sm">{{ buildingData.outdoorFeatures }}</span>
          </div>
        </div>
      </div>
      
      <!-- Utilities & Systems -->
      <div class="mt-3">
        <button 
          @click="toggleSection('utilities')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Utilities & Systems</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.utilities}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.utilities" class="mt-2 space-y-1 bg-gray-900/50 p-2 rounded-md">
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Water Supply</span>
            <span class="text-white text-sm">{{ buildingData.waterSupply }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Sewage System</span>
            <span class="text-white text-sm">{{ buildingData.sewageSystem }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Electrical System</span>
            <span class="text-white text-sm">{{ buildingData.electricalSystem }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Internet Connectivity</span>
            <span class="text-white text-sm">{{ buildingData.internetConnectivity }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Energy Rating</span>
            <span class="text-white text-sm">{{ buildingData.energyRating }}</span>
          </div>
        </div>
      </div>
      
      <!-- Condition Assessment -->
      <div class="mt-3">
        <button 
          @click="toggleSection('condition')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Condition Assessment</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.condition}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.condition" class="mt-2 bg-gray-900/50 p-2 rounded-md">
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-2 text-gray-300 text-sm">Overall Structural Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.structural }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.structural)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Roof Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.roof }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.roof)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Plumbing Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.plumbing }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.plumbing)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Electrical Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.electrical }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.electrical)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Interior Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.interior }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.interior)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Exterior Condition</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ buildingData.conditionAssessment.exterior }}</span>
              <span :class="getConditionClass(buildingData.conditionAssessment.exterior)" class="ml-2 inline-block w-3 h-3 rounded-full"></span>
            </div>
          </div>
          
          <div class="mt-3 pt-2 border-t border-gray-700 text-xs flex items-center justify-between">
            <div>
              <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span class="text-red-400">Poor</span>
              <span class="inline-block w-2 h-2 rounded-full bg-orange-500 mx-1"></span>
              <span class="text-orange-400">Fair</span>
              <span class="inline-block w-2 h-2 rounded-full bg-green-500 mx-1"></span>
              <span class="text-green-400">Good</span>
              <span class="inline-block w-2 h-2 rounded-full bg-blue-500 mx-1"></span>
              <span class="text-blue-400">Excellent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div> <!-- End of blurred content -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Expanded sections state
const expandedSections = ref({
  construction: false,
  interior: false,
  exterior: false,
  utilities: false,
  condition: false
});

// Sample data - in a real app this would come from an API
const buildingData = ref({
  buildingType: 'Single Family Home',
  yearBuilt: 2005,
  constructionMaterial: 'Brick & Timber Frame',
  floors: 2,
  floorArea: 185,
  landArea: 550,
  
  // Construction details
  foundationType: 'Concrete Slab',
  roofType: 'Tile',
  wallConstruction: 'Double Brick',
  insulationRating: 'R3.5',
  lastRenovation: '2018',
  
  // Interior features
  bedrooms: 4,
  bathrooms: 2.5,
  livingAreas: 2,
  kitchenType: 'Modern Open Plan',
  flooring: 'Hardwood & Tile',
  heatingCooling: 'Central Air & Gas Heating',
  
  // Exterior and property
  parkingSpaces: 2,
  garageType: 'Attached Double Garage',
  fencing: 'Full Perimeter, Timber',
  landscaping: 'Established Gardens',
  outdoorFeatures: 'Covered Patio, Lawn Area',
  
  // Utilities and systems
  waterSupply: 'Town Water',
  sewageSystem: 'Connected to Mains',
  electricalSystem: '200 Amp Service',
  internetConnectivity: 'Fiber Optic Available',
  energyRating: '6-Star',
  
  // Condition assessment
  conditionAssessment: {
    structural: 'Good',
    roof: 'Good',
    plumbing: 'Fair',
    electrical: 'Excellent',
    interior: 'Good',
    exterior: 'Good'
  }
});

const isLoading = ref(false);
const error = ref(null);
const route = useRoute();

// Toggle accordion sections
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Get condition class based on rating
const getConditionClass = (condition) => {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'bg-blue-500';
    case 'good':
      return 'bg-green-500';
    case 'fair':
      return 'bg-orange-500';
    case 'poor':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Simulate loading building data when the component mounts or route changes
const loadBuildingData = () => {
  isLoading.value = true;
  error.value = null;
  
  // Simulate API call with timeout
  setTimeout(() => {
    try {
      // Here you would fetch actual data from your API
      // For now we'll just use our sample data
      isLoading.value = false;
    } catch (err) {
      console.error("Error loading building data:", err);
      error.value = "Could not load building specifications";
      isLoading.value = false;
    }
  }, 800);
};

onMounted(() => {
  loadBuildingData();
  
  // Open the first section by default for better UX
  expandedSections.value.construction = true;
});

// Reload building data when route changes
watch(() => route.query.address, () => {
  loadBuildingData();
});
</script>

<style scoped>
.hover\:shadow-purple:hover {
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
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
