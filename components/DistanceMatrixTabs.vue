<template>
  <div class="distance-matrix">
    <!-- Tabs navigation -->
    <div class="flex border-b border-border mb-3">
      <button 
        v-for="(tab, index) in categories" 
        :key="index"
        @click="activeTab = tab"
        class="px-3 py-2 text-xs font-medium transition-colors"
        :class="[
          activeTab === tab 
            ? 'text-green-400 border-b-2 border-green-400' 
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        {{ formatCategoryName(tab) }}
      </button>
    </div>
    
    <!-- Tab content -->
    <div v-if="places[activeTab] && places[activeTab].length > 0" class="text-sm">
      <div class="max-h-[200px] overflow-y-auto pr-1">
        <div v-for="(place, index) in places[activeTab]" :key="index" class="flex justify-between py-1.5 border-b border-border/50">
          <div class="text-card-foreground truncate pr-2 flex-1">
            {{ place.name || `${formatCategoryName(activeTab)} #${index + 1}` }}
          </div>
          <div class="text-card-foreground flex-shrink-0">
            <span class="text-muted-foreground">{{ formatDistance(place.distance) }}</span>
          </div>
        </div>
      </div>
      
      <div class="mt-2 text-xs text-muted-foreground">
        Showing {{ places[activeTab].length }} nearby {{ formatCategoryName(activeTab).toLowerCase() }} locations
      </div>
    </div>
    
    <div v-else class="text-center py-4 text-muted-foreground text-sm">
      No nearby {{ formatCategoryName(activeTab).toLowerCase() }} found
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

// Props to receive places and center coordinates
const props = defineProps({
  places: {
    type: Object,
    required: true
  },
  propertyName: {
    type: String,
    default: 'Property'
  }
});

// Available categories (tabs)
const categories = ['grocery', 'dining', 'parks', 'schools', 'retail', 'transit'];
const activeTab = ref(categories[0]);

// Format distance in a human-readable way
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
};

// Format category name for display
const formatCategoryName = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
</script>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: hsl(var(--muted) / 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(74, 222, 128, 0.4);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 222, 128, 0.6);
}
</style>
