<template>  
  <div class="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-blue hover:-translate-y-2 transition-all">
    <h2 class="text-xl font-bold text-blue-400 mb-2 flex justify-between items-center">
      <span>AI Financial Assessment</span>
      <span class="ml-2 text-sm font-normal text-gray-400" v-if="recommendation">{{ recommendation }}</span>
      <button 
        v-if="!isLoading && !isSearching" 
        @click="fetchFinancialData" 
        class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
      >
        Refresh Data
      </button>
    </h2>
    
    <!-- Loading state -->
    <div v-if="isLoading || isSearching" class="mt-4 flex items-center justify-center py-8">
      <div class="h-6 w-6 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
      <span class="ml-2 text-gray-300 text-sm">
        {{ isSearching ? 'Searching for property data...' : 'Calculating financial metrics...' }}
      </span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="mt-4 text-red-400 text-sm py-8">
      <p>{{ error }}</p>
      <button 
        @click="fetchFinancialData" 
        class="mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
      >
        Try Again
      </button>
    </div>
    
    <!-- No data state -->
    <div v-else-if="!financialData.propertyValue" class="mt-4 py-8 text-center">
      <p class="text-gray-300 mb-4">AI-powered financial assessment is available for this property</p>
      <button 
        @click="fetchFinancialData" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        Generate Financial Assessment
      </button>
    </div>
      <!-- Financial data -->
    <div v-else>
      <!-- Property Summary -->
      <div class="bg-gray-900/50 p-3 rounded-md mt-3">
        <!-- Property Value Section with Estimates -->
        <div class="mb-4">
          <div class="text-sm text-gray-400 mb-2">Estimated Property Value</div>
          <div class="space-y-2">
            <div v-for="(estimate, index) in financialData.priceEstimates" :key="index" 
                 class="flex justify-between items-center p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
              <span class="text-white text-lg">${{ formatCurrency(estimate.value) }}</span>
              <a :href="estimate.url" target="_blank" rel="noopener noreferrer" 
                 class="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center">
                {{ estimate.source }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div class="mt-2 text-right">
            <span class="text-xs text-gray-400">Average: ${{ formatCurrency(calculateAveragePropertyValue()) }}</span>
          </div>
        </div>
        
        <!-- Last Sold Price Section -->
        <div class="mb-4">
          <div class="text-sm text-gray-400 mb-2">Last Sold Price</div>
          <div class="flex justify-between items-center p-2 rounded-md bg-gray-800/50">
            <span class="text-white text-lg">${{ formatCurrency(financialData.lastSoldPrice) }}</span>
            <span class="text-xs text-gray-400">Sold on: {{ financialData.lastSoldDate || 'N/A' }}</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">Property Details</div>            <div class="text-white">
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Type:</span>
                <span>{{ financialData.propertyType }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Bedrooms:</span>
                <span>{{ financialData.bedrooms }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Last Sold:</span>
                <span>{{ financialData.lastSoldDate || 'N/A' }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div class="text-sm text-gray-400 mb-1">Financial Metrics</div>
            <div class="text-white">
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Estimated Rent:</span>
                <span>${{ financialData.estimatedRentPerWeek }} pw</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Rental Yield:</span>
                <span>{{ financialData.rentalYield }}%</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-300">Capital Growth:</span>
                <span>{{ financialData.capitalGrowthRate }}% pa</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Vacancy Rate:</span>
                <span>{{ financialData.vacancyRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Investment Analysis -->
      <div class="mt-4">
        <button 
          @click="toggleSection('investmentAnalysis')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Investment Analysis</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.investmentAnalysis}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.investmentAnalysis" class="mt-2 space-y-1 bg-gray-900/50 p-3 rounded-md">
          <div class="mb-2">
            <div class="text-white font-medium mb-1">Initial Investment</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Purchase Price:</span>
                <span class="text-white">${{ formatCurrency(financialData.propertyValue) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Deposit (20%):</span>
                <span class="text-white">${{ formatCurrency(calculateDeposit()) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Stamp Duty:</span>
                <span class="text-white">${{ formatCurrency(calculateStampDuty()) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Other Costs:</span>
                <span class="text-white">${{ formatCurrency(calculateOtherCosts()) }}</span>
              </div>
              <div class="flex justify-between col-span-2 pt-1 border-t border-gray-700">
                <span class="text-gray-300 font-medium">Total Cash Required:</span>
                <span class="text-white font-medium">${{ formatCurrency(calculateTotalCashRequired()) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mb-2 pt-2 border-t border-gray-700">
            <div class="text-white font-medium mb-1">Cash Flow Analysis</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Annual Rental Income:</span>
                <span class="text-white">${{ formatCurrency(calculateAnnualRentalIncome()) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Annual Expenses:</span>
                <span class="text-white">-${{ formatCurrency(calculateAnnualExpenses()) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Mortgage Payments:</span>
                <span class="text-white">-${{ formatCurrency(calculateAnnualMortgagePayments()) }}</span>
              </div>
              <div class="flex justify-between col-span-2 pt-1 border-t border-gray-700">
                <span class="text-gray-300 font-medium">Net Cash Flow:</span>
                <span :class="calculateNetCashFlow() >= 0 ? 'text-green-400' : 'text-red-400'" class="font-medium">
                  {{ calculateNetCashFlow() >= 0 ? '+' : '-' }}${{ formatCurrency(Math.abs(calculateNetCashFlow())) }} pa
                </span>
              </div>
              <div class="flex justify-between col-span-2">
                <span class="text-gray-300 font-medium">Weekly Cash Flow:</span>
                <span :class="calculateWeeklyCashFlow() >= 0 ? 'text-green-400' : 'text-red-400'" class="font-medium">
                  {{ calculateWeeklyCashFlow() >= 0 ? '+' : '-' }}${{ Math.abs(calculateWeeklyCashFlow()).toFixed(2) }} pw
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 10-Year Projection -->
      <div class="mt-3">
        <button 
          @click="toggleSection('projections')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">10-Year Projection</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.projections}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.projections" class="mt-2 bg-gray-900/50 p-2 rounded-md overflow-x-auto">
          <table class="w-full text-sm min-w-[500px]">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="text-left p-1">Year</th>
                <th class="p-1">Property Value</th>
                <th class="p-1">Equity</th>
                <th class="p-1">ROI</th>
                <th class="p-1">Annual Cash Flow</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="year in 10" :key="year" class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Year {{ year }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(calculatePropertyValueForYear(year)) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(calculateEquityForYear(year)) }}</td>
                <td class="text-center text-white p-1">{{ calculateROIForYear(year).toFixed(2) }}%</td>
                <td class="text-center p-1" :class="calculateCashFlowForYear(year) >= 0 ? 'text-green-400' : 'text-red-400'">
                  {{ calculateCashFlowForYear(year) >= 0 ? '+' : '-' }}${{ formatCurrency(Math.abs(calculateCashFlowForYear(year))) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        <!-- Market Insights -->
      <div class="mt-3">
        <button 
          @click="toggleSection('marketInsights')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Market Insights</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.marketInsights}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.marketInsights" class="mt-2 bg-gray-900/50 p-3 rounded-md">
          <div class="grid grid-cols-1 gap-3">
            <div v-for="(insight, index) in financialData.marketInsights" :key="index" class="border-b border-gray-700 pb-2 last:border-0 last:pb-0">
              <div class="text-white font-medium mb-1">{{ insight.title }}</div>
              <p class="text-gray-300 text-sm">{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sources -->
      <div class="mt-3" v-if="financialData.sources && financialData.sources.length > 0">
        <button 
          @click="toggleSection('sources')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Data Sources</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.sources}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.sources" class="mt-2 bg-gray-900/50 p-3 rounded-md">
          <div class="text-gray-300 text-sm mb-2">Information sourced from:</div>
          <ul class="list-disc pl-5 text-sm">
            <li v-for="(source, index) in financialData.sources" :key="index" class="mb-1">
              <a 
                :href="source.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {{ source.name }}
              </a>
            </li>
          </ul>
          <div class="mt-2 text-xs text-gray-400">
            <p>Data retrieved using Perplexity AI. Financial projections are estimates based on available data.</p>
          </div>
        </div>
      </div>
      
      <!-- Data Source -->
      <div class="mt-4 text-xs text-gray-400 text-right">
        <span>Data sourced by Perplexity AI - Last updated: {{ new Date().toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePerplexityFinancialData } from '~/composables/usePerplexityFinancialData';

// Route and address
const route = useRoute();
const address = ref('');

// Expanded sections state
const expandedSections = ref({
  investmentAnalysis: false,
  projections: false,
  marketInsights: false,
  sources: false
});

// Toggle accordion sections
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Format currency values
const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Initialize the Perplexity financial data composable
const { 
  isSearching, 
  isLoading, 
  error, 
  financialData, 
  searchPropertyData, 
  calculateFinancialMetrics,
  resetData
} = usePerplexityFinancialData();

// Recommendation based on financial metrics
const recommendation = ref('');

// Fetch financial data using AI for the address
const fetchFinancialData = async () => {
  if (!address.value) {
    error.value = "Property address is required to generate financial assessment";
    return;
  }
  
  // First search for property data
  const data = await searchPropertyData(address.value);
  
  if (data) {
    // Then calculate financial metrics
    await calculateFinancialMetrics();
    
    // Generate recommendation
    generateRecommendation();
  }
};

// Generate investment recommendation
const generateRecommendation = () => {
  const cashFlow = calculateNetCashFlow();
  const roi = calculateROIForYear(5); // 5-year ROI
  
  if (roi > 40 && financialData.capitalGrowthRate > 4) {
    recommendation.value = "Strong Buy";
  } else if (roi > 25 && cashFlow > -5000) {
    recommendation.value = "Buy";
  } else if (roi > 15 && cashFlow > -10000) {
    recommendation.value = "Consider Buying";
  } else if (roi < 10 || cashFlow < -15000) {
    recommendation.value = "Not Recommended";
  } else {
    recommendation.value = "Neutral";
  }
};

// Calculate average property value from estimates
const calculateAveragePropertyValue = () => {
  if (!financialData.priceEstimates || financialData.priceEstimates.length === 0) {
    return financialData.propertyValue;
  }
  
  const total = financialData.priceEstimates.reduce((sum, estimate) => sum + estimate.value, 0);
  return Math.round(total / financialData.priceEstimates.length);
};

// Calculation functions
const calculateDeposit = () => {
  const averageValue = calculateAveragePropertyValue();
  return averageValue * 0.2; // 20% deposit
};

const calculateStampDuty = () => {
  // Simple stamp duty calculation (this varies by location in reality)
  const value = calculateAveragePropertyValue();
  if (value <= 500000) return value * 0.02;
  if (value <= 1000000) return 10000 + (value - 500000) * 0.04;
  return 30000 + (value - 1000000) * 0.06;
};

const calculateOtherCosts = () => {
  // Legal fees, inspection costs, mortgage fees, etc.
  return Math.min(10000, calculateAveragePropertyValue() * 0.01);
};

const calculateTotalCashRequired = () => {
  return calculateDeposit() + calculateStampDuty() + calculateOtherCosts();
};

const calculateAnnualRentalIncome = () => {
  return financialData.estimatedRentPerWeek * 52 * (1 - financialData.vacancyRate / 100);
};

const calculateAnnualExpenses = () => {
  // Property management, insurance, maintenance, rates, etc.
  return calculateAveragePropertyValue() * 0.015; // Approx 1.5% of property value annually
};

const calculateAnnualMortgagePayments = () => {
  const loanAmount = calculateAveragePropertyValue() * 0.8; // 80% LVR
  const rate = financialData.interestRate / 100;
  return loanAmount * rate; // Interest-only loan for simplicity
};

const calculateNetCashFlow = () => {
  return calculateAnnualRentalIncome() - calculateAnnualExpenses() - calculateAnnualMortgagePayments();
};

const calculateWeeklyCashFlow = () => {
  return calculateNetCashFlow() / 52;
};

const calculatePropertyValueForYear = (year) => {
  // Compound growth calculation
  return calculateAveragePropertyValue() * Math.pow(1 + financialData.capitalGrowthRate / 100, year);
};

const calculateEquityForYear = (year) => {
  const initialEquity = calculateDeposit();
  const futureValue = calculatePropertyValueForYear(year);
  const loanRemaining = calculateAveragePropertyValue() * 0.8; // Assuming interest-only loan
  return futureValue - loanRemaining;
};

const calculateROIForYear = (year) => {
  const initialInvestment = calculateTotalCashRequired();
  const equity = calculateEquityForYear(year);
  const totalCashFlow = calculateNetCashFlow() * year;
  return ((equity + totalCashFlow - initialInvestment) / initialInvestment) * 100;
};

const calculateCashFlowForYear = (year) => {
  // Assume rent increases by 3% per year
  const baseIncome = calculateAnnualRentalIncome();
  const futureIncome = baseIncome * Math.pow(1.03, year - 1);
  
  // Assume expenses increase by 2% per year
  const baseExpenses = calculateAnnualExpenses();
  const futureExpenses = baseExpenses * Math.pow(1.02, year - 1);
  
  // Mortgage payments remain constant (interest-only loan)
  const mortgagePayments = calculateAnnualMortgagePayments();
  
  return futureIncome - futureExpenses - mortgagePayments;
};

// Update address when route changes
watch(() => route.query.address, (newAddress) => {
  if (newAddress && newAddress !== address.value) {
    address.value = newAddress;
    // Don't auto-fetch on address change to avoid excessive API calls
    // User can click the button to fetch data
    resetData(); // Reset any previous data
  }
}, { immediate: true });

onMounted(() => {
  // Initialize with address from route
  address.value = route.query.address || '';
  
  // Open the first section by default for better UX
  expandedSections.value.investmentAnalysis = true;
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
