<template>
  <div class="walkability-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-4">
      <div class="matrix-spinner" aria-label="Loading">
        <span v-for="n in 20" :key="n" :class="['dot', 'dot-' + n]"></span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
          <div class="mt-2">
            <button @click="$emit('retry')" class="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium mr-2">
              Retry
            </button>
            <button @click="$emit('reset')" class="text-red-600 text-xs">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No property selected state -->
    <div v-else-if="!hasPropertySelected" class="bg-gray-50 border border-gray-200 rounded-md p-3 mb-3">
      <p class="text-sm text-gray-600">Select a property on the map to see walkability score.</p>
    </div>
    
    <!-- Walkability content -->
    <div v-else-if="score > 0" class="rounded-md p-3 mb-3 border bg-white">
      <div class="flex items-center">
        <!-- Score Display -->
        <div class="mr-4 flex-shrink-0">
          <div :class="['score-circle', scoreColorClass]">
            <div class="score-value">{{ score }}</div>
          </div>
        </div>
        <!-- Text content -->
        <div>
          <h3 class="text-sm font-medium" :class="scoreTextClass">Walkability Score</h3>
          <p class="text-xs" :class="scoreTextClass">{{ scoreDescription }}</p>
          <div class="mt-1 flex items-center">
            <span class="text-xs text-muted-foreground">{{ totalPOIs }} points of interest within {{ travelTime }} min {{ travelModeDisplay }}</span>
          </div>
        </div>
      </div>
      <!-- Charts -->
      <div v-if="showCharts" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- Radar Chart -->
        <div v-if="radarData.length > 0" class="chart-container">
          <h4 class="text-xs font-medium text-muted-foreground mb-1">Walkability Factors</h4>
          <RadarChart :chartData="formattedRadarData" :chartOptions="radarOptions" />
        </div>
        <!-- Pie Chart -->
        <div v-if="pieData.length > 0" class="chart-container">
          <h4 class="text-xs font-medium text-muted-foreground mb-1">POI Distribution</h4>
          <PieChart :chartData="formattedPieData" :chartOptions="pieOptions" />
        </div>
      </div>
      <!-- Actions -->
      <div class="mt-3 flex justify-end space-x-2">
        <button 
          v-if="!showCharts"
          @click="showCharts = true" 
          class="text-xs bg-muted text-foreground px-2 py-1 rounded border border-input">
          Show Charts
        </button>
        <button 
          v-else
          @click="showCharts = false" 
          class="text-xs bg-muted text-foreground px-2 py-1 rounded border border-input">
          Hide Charts
        </button>
      </div>
    </div>
    
    <!-- No data state -->
    <div v-else class="bg-gray-50 border border-gray-200 rounded-md p-3 mb-3">
      <p class="text-sm text-gray-600">
        No walkability data available for this area. Try adjusting your travel time or mode.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import RadarChart from './charts/RadarChart.vue'
import PieChart from './charts/PieChart.vue'

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  radarData: {
    type: Array,
    default: () => []
  },
  pieData: {
    type: Array,
    default: () => []
  },
  totalPOIs: {
    type: Number,
    default: 0
  },
  travelMode: {
    type: String,
    default: 'walking'
  },
  travelTime: {
    type: Number,
    default: 15
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  hasPropertySelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry', 'reset', 'show-details'])

const showCharts = ref(false)

// Automatically show charts when data is loaded
watch([() => props.score, () => props.radarData.length], ([newScore, newRadarDataLength]) => {
  if (newScore > 0 && newRadarDataLength > 0) {
    showCharts.value = true
  }
})

// Format data for charts
const formattedRadarData = computed(() => {
  return {
    labels: props.radarData.map(item => item.name),
    datasets: [
      {
        label: 'Score',
        data: props.radarData.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(147, 51, 234, 1)'
      }
    ]
  }
})

const formattedPieData = computed(() => {
  return {
    labels: props.pieData.map(item => item.name),
    datasets: [
      {
        data: props.pieData.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(40, 159, 64, 0.7)',
          'rgba(210, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
})

// Chart options
const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true
      },
      suggestedMin: 0,
      suggestedMax: 10,
      ticks: {
        stepSize: 2,
        font: {
          size: 8
        }
      },
      pointLabels: {
        font: {
          size: 8
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.raw}/10`;
        }
      }
    }
  }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        font: {
          size: 8
        },
        boxWidth: 10,
        padding: 5
      }
    }
  }
}

// Computed properties for display
const travelModeDisplay = computed(() => {
  return props.travelMode.charAt(0).toUpperCase() + props.travelMode.slice(1);
})

const scoreDescription = computed(() => {
  const score = props.score;
  if (score >= 90) return "Walker's Paradise";
  if (score >= 70) return "Very Walkable";
  if (score >= 50) return "Somewhat Walkable";
  if (score >= 25) return "Car-Dependent";
  return "Very Car-Dependent";
})

const scoreColorClass = computed(() => {
  if (props.score >= 80) return 'bg-green-100 border-green-400';
  if (props.score >= 60) return 'bg-yellow-100 border-yellow-400';
  if (props.score >= 40) return 'bg-yellow-50 border-yellow-300';
  if (props.score >= 25) return 'bg-orange-100 border-orange-400';
  return 'bg-red-100 border-red-400';
});

const scoreTextClass = computed(() => {
  if (props.score >= 80) return 'text-green-800';
  if (props.score >= 60) return 'text-yellow-800';
  if (props.score >= 40) return 'text-yellow-700';
  if (props.score >= 25) return 'text-orange-800';
  return 'text-red-800';
});
</script>

<style scoped>
.walkability-container {
  width: 100%;
}

.chart-container {
  height: 150px;
  position: relative;
}

.score-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border-width: 2px;
  border-style: solid;
}

.score-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.matrix-spinner {
  width: 60px; /* wider */
  height: 32px; /* smaller height */
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* more columns for width */
  grid-template-rows: repeat(2, 1fr);   /* fewer rows for less height */
  gap: 3px;
  position: relative;
}
.matrix-spinner .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a855f7;
  opacity: 0.5;
  display: block;
  animation: none;
}
/* Adjust dot positions for 2 rows x 5 columns */
.matrix-spinner .dot-1  { grid-column: 1; grid-row: 1; }
.matrix-spinner .dot-2  { grid-column: 2; grid-row: 1; }
.matrix-spinner .dot-3  { grid-column: 3; grid-row: 1; }
.matrix-spinner .dot-4  { grid-column: 4; grid-row: 1; }
.matrix-spinner .dot-5  { grid-column: 5; grid-row: 1; }
.matrix-spinner .dot-6  { grid-column: 5; grid-row: 2; }
.matrix-spinner .dot-7  { grid-column: 4; grid-row: 2; }
.matrix-spinner .dot-8  { grid-column: 3; grid-row: 2; }
.matrix-spinner .dot-9  { grid-column: 2; grid-row: 2; }
.matrix-spinner .dot-10 { grid-column: 1; grid-row: 2; }

/* Animate the moving dot (dot-1) through dot-10 */
@keyframes matrix-dot-move {
  0%   { opacity: 1; }
  10%  { opacity: 1; }
  20%, 100% { opacity: 0.5; }
}
.matrix-spinner .dot-1  { animation: matrix-dot-move 1s linear infinite 0s; }
.matrix-spinner .dot-2  { animation: matrix-dot-move 1s linear infinite 0.1s; }
.matrix-spinner .dot-3  { animation: matrix-dot-move 1s linear infinite 0.2s; }
.matrix-spinner .dot-4  { animation: matrix-dot-move 1s linear infinite 0.3s; }
.matrix-spinner .dot-5  { animation: matrix-dot-move 1s linear infinite 0.4s; }
.matrix-spinner .dot-6  { animation: matrix-dot-move 1s linear infinite 0.5s; }
.matrix-spinner .dot-7  { animation: matrix-dot-move 1s linear infinite 0.6s; }
.matrix-spinner .dot-8  { animation: matrix-dot-move 1s linear infinite 0.7s; }
.matrix-spinner .dot-9  { animation: matrix-dot-move 1s linear infinite 0.8s; }
.matrix-spinner .dot-10 { animation: matrix-dot-move 1s linear infinite 0.9s; }
</style>