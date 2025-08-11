<template>
  <div class="walkability-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-4">
      <!-- Option 1: Ripple Circles (Default) -->
      <div class="ripple-loader" aria-label="Loading walkability data">
        <div class="ripple-circle"></div>
        <div class="ripple-circle"></div>
        <div class="ripple-circle"></div>
      </div>
      
      <!-- Option 2: Pulse Dots (Uncomment to use) -->
      <!-- <div class="pulse-dots" aria-label="Loading">
        <div class="pulse-dot"></div>
        <div class="pulse-dot"></div>
        <div class="pulse-dot"></div>
      </div> -->
      
      <!-- Option 3: Orbiting Circles (Uncomment to use) -->
      <!-- <div class="orbit-loader" aria-label="Loading">
        <div class="orbit-center"></div>
        <div class="orbit-ring">
          <div class="orbit-dot"></div>
          <div class="orbit-dot"></div>
          <div class="orbit-dot"></div>
        </div>
      </div> -->
      
      <!-- Option 4: Wave Animation (Uncomment to use) -->
      <!-- <div class="wave-loader" aria-label="Loading">
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
      </div> -->
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

// Keep charts closed by default until user clicks to show them
// (Removed automatic opening when data loads)

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

/* ========================================== */
/* NEW LOADING ANIMATIONS */
/* ========================================== */

/* Option 1: Ripple Circles (Recommended) */
.ripple-loader {
  position: relative;
  width: 40px;
  height: 40px;
}

.ripple-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #a855f7;
  border-radius: 50%;
  opacity: 0;
  animation: ripple-animation 2s linear infinite;
}

.ripple-circle:nth-child(1) { animation-delay: 0s; }
.ripple-circle:nth-child(2) { animation-delay: 0.7s; }
.ripple-circle:nth-child(3) { animation-delay: 1.4s; }

@keyframes ripple-animation {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Option 2: Pulse Dots */
.pulse-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a855f7;
  animation: pulse-animation 1.4s ease-in-out infinite;
}

.pulse-dot:nth-child(1) { animation-delay: 0s; }
.pulse-dot:nth-child(2) { animation-delay: 0.2s; }
.pulse-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse-animation {
  0%, 80%, 100% {
    transform: scale(0.7);
    opacity: 0.7;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Option 3: Orbiting Circles */
.orbit-loader {
  position: relative;
  width: 40px;
  height: 40px;
}

.orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #a855f7;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: orbit-rotation 2s linear infinite;
}

.orbit-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #a855f7;
  border-radius: 50%;
}

.orbit-dot:nth-child(1) {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.orbit-dot:nth-child(2) {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.orbit-dot:nth-child(3) {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes orbit-rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Option 4: Wave Animation */
.wave-loader {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 20px;
}

.wave-bar {
  width: 3px;
  height: 100%;
  background: #a855f7;
  border-radius: 2px;
  animation: wave-animation 1.2s ease-in-out infinite;
}

.wave-bar:nth-child(1) { animation-delay: 0s; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }

@keyframes wave-animation {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>