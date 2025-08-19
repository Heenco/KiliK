<template>  <div class="p-6 bg-card/80 backdrop-blur rounded-lg shadow-lg border border-border hover:shadow-purple hover:-translate-y-2 transition-all relative">
    <!-- Coming Soon Overlay -->
    <div class="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div class="text-center">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
        <p class="text-muted-foreground text-sm max-w-xs mx-auto">Advanced financial analysis and property investment insights will be available shortly.</p>
        <div class="mt-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Enhanced Features
          </span>
        </div>
      </div>
    </div>
    
    <!-- Original Content (blurred in background) -->
    <div class="filter blur-sm">
      <h2 class="text-xl font-bold text-purple-400 mb-2">
        Financial Assessment
        <span class="ml-2 text-sm font-normal text-muted-foreground">{{ financialData.recommendationText }}</span>
      </h2>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="mt-4 flex items-center justify-center py-2">
      <div class="h-5 w-5 rounded-full border-2 border-t-transparent border-purple-400 animate-spin"></div>
      <span class="ml-2 text-gray-300 text-sm">Loading financial data...</span>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="mt-4 text-red-400 text-sm">
      {{ error }}
    </div>
    
    <!-- Financial data -->
    <div v-else>
      <!-- Property Score -->
      <div class="bg-gray-900/50 p-3 rounded-md mt-3">
        <div class="grid grid-cols-2 gap-4">          <div class="text-center">
            <div class="text-gray-400 text-sm">Property Score</div>
            <div class="text-3xl text-green-400 font-bold">{{ financialData.propertyScore }}<span class="text-lg text-gray-400">/100</span></div>
            <div class="text-xs mt-1 text-gray-300 flex items-center justify-center">
              <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Based on financial metrics & suburb data</span>
            </div>
          </div>
          
          <div>
            <div class="text-sm text-gray-400 mb-1">Suburb Rating</div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span class="text-white">{{ financialData.suburbRating }}/20</span>
            </div>
            
            <div class="text-sm text-gray-400 mt-2 mb-1">Property Rating</div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span class="text-white">{{ financialData.propertyRating }}/20</span>
            </div>
            
            <div class="text-sm text-gray-400 mt-2 mb-1">Cash Flow Rating</div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span class="text-white">{{ financialData.cashflowRating }}/20</span>
            </div>
            
            <div class="text-sm text-gray-400 mt-2 mb-1">Growth Rating</div>
            <div class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span class="text-white">{{ financialData.growthRating }}/20</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Basic Property Value Info -->
      <div class="mt-4 bg-gray-900/50 rounded-md p-3">
        <div class="text-sm text-gray-400 mb-2">{{ financialData.timeToEquity }} months</div>
        <div class="text-xs text-gray-300">Time required to passively generate $100k in equity</div>
        
        <div class="grid grid-cols-3 gap-3 mt-3">
          <div class="text-center">
            <div class="text-white font-bold">${{ formatCurrency(financialData.askingPrice) }}k</div>
            <div class="text-xs text-gray-400">Asking Price</div>
          </div>
          
          <div class="text-center">
            <div class="text-white font-bold">${{ financialData.marketValueRange }}</div>
            <div class="text-xs text-gray-400">Market Value</div>
          </div>
          
          <div class="text-center">
            <div class="text-white font-bold">${{ formatCurrency(financialData.targetPurchasePrice) }}k</div>
            <div class="text-xs text-gray-400">Target Purchase Price</div>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-3 mt-3">
          <div class="text-center">
            <div class="text-white font-bold">${{ financialData.estimatedRentPerWeek }} pw</div>
            <div class="text-xs text-gray-400">Estimated<br>Rent Per Week</div>
          </div>
          
          <div class="text-center">
            <div class="text-white font-bold">{{ financialData.estimatedRentalYield }}%</div>
            <div class="text-xs text-gray-400">Estimated<br>Rental Yield</div>
          </div>
          
          <div class="text-center">
            <div class="text-white font-bold">-${{ financialData.totalOwnershipCostPerWeek }} pw</div>
            <div class="text-xs text-gray-400">Total ownership cost<br>per week in Y1</div>
          </div>
        </div>
      </div>
      
      <!-- Purchase Costs -->
      <div class="mt-4">
        <button 
          @click="toggleSection('purchaseCosts')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Purchase Costs</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.purchaseCosts}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.purchaseCosts" class="mt-2 space-y-1 bg-gray-900/50 p-2 rounded-md">
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Target Purchase Price</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.targetPurchasePrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Estimated Mortgage Fee</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.mortgageFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Estimated Transfer Fee</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.transferFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Estimated Stamp Duty</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.stampDuty) }}</span>
          </div>
          <div class="flex justify-between font-medium">
            <span class="text-gray-300 text-sm">Total Transaction Costs</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.totalTransactionCosts) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300 text-sm">Deposit at 20%</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.depositAmount) }}</span>
          </div>
          <div class="flex justify-between font-medium">
            <span class="text-gray-300 text-sm">Total Cash / Equity Required</span>
            <span class="text-white text-sm">${{ formatCurrency(financialData.totalCashRequired) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Cashflow Projections -->
      <div class="mt-3">
        <button 
          @click="toggleSection('cashflow')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Cashflow Projections</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.cashflow}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
          <div v-if="expandedSections.cashflow" class="mt-2 bg-gray-900/50 p-2 rounded-md overflow-x-auto">
          <table class="w-full text-sm min-w-[500px]">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="text-left p-1">Cashflows</th>
                <th class="p-1">Assumptions</th>
                <th class="p-1">Year 1</th>
                <th class="p-1">Year 5</th>
                <th class="p-1">Year 10</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Rental Income</td>
                <td class="text-center text-gray-300 p-1">+3% pa</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.cashflow.rentalIncomeY1) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.cashflow.rentalIncomeY5) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.cashflow.rentalIncomeY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Less Expenses</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.expensesY1) }}</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.expensesY5) }}</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.expensesY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Less Interest Costs</td>
                <td class="text-center text-gray-300 p-1">5.5% pa</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.interestCostsYearly) }}</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.interestCostsYearly) }}</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.interestCostsYearly) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Cashflow Before Tax</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.cashflowBeforeTaxY1) }}</td>
                <td class="text-center text-white p-1">-${{ formatCurrency(financialData.cashflow.cashflowBeforeTaxY5) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.cashflow.cashflowBeforeTaxY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Cost per Week</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">-${{ financialData.cashflow.costPerWeekY1 }}</td>
                <td class="text-center text-white p-1">-${{ financialData.cashflow.costPerWeekY5 }}</td>
                <td class="text-center text-white p-1">${{ financialData.cashflow.costPerWeekY10 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Value Projections -->
      <div class="mt-3">
        <button 
          @click="toggleSection('value')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Value Projections</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.value}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
          <div v-if="expandedSections.value" class="mt-2 bg-gray-900/50 p-2 rounded-md overflow-x-auto">
          <table class="w-full text-sm min-w-[500px]">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="text-left p-1">Valuations</th>
                <th class="p-1">Assumptions</th>
                <th class="p-1">Year 1</th>
                <th class="p-1">Year 5</th>
                <th class="p-1">Year 10</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Property Value</td>
                <td class="text-center text-gray-300 p-1">+3% pa</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.propertyValueY1) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.propertyValueY5) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.propertyValueY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Loan Amount</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.loanAmount) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.loanAmount) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.loanAmount) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Net Equity</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.netEquityY1) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.netEquityY5) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.netEquityY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Capital Return</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.capitalReturnY1) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.capitalReturnY5) }}</td>
                <td class="text-center text-white p-1">${{ formatCurrency(financialData.valueProjections.capitalReturnY10) }}</td>
              </tr>
              <tr class="border-b border-gray-700/50">
                <td class="text-gray-300 p-1">Return on Equity</td>
                <td class="text-center text-gray-300 p-1"></td>
                <td class="text-center text-white p-1">{{ financialData.valueProjections.returnOnEquityY1 }}%</td>
                <td class="text-center text-white p-1">{{ financialData.valueProjections.returnOnEquityY5 }}%</td>
                <td class="text-center text-white p-1">{{ financialData.valueProjections.returnOnEquityY10 }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Suburb Data -->
      <div class="mt-3">
        <button 
          @click="toggleSection('suburb')" 
          class="w-full text-left flex justify-between items-center bg-gray-700 text-white p-2 rounded-md"
        >
          <span class="font-medium">Suburb Level Data</span>
          <svg 
            :class="{'transform rotate-180': expandedSections.suburb}" 
            class="w-5 h-5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="expandedSections.suburb" class="mt-2 bg-gray-900/50 p-2 rounded-md">
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-2 text-gray-300 text-sm">Last 12 month property growth</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.last12MonthGrowth }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Avg historical property growth per annum</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.historicalGrowth }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-orange-500"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">% of owner occupiers</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.ownerOccupiers }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-orange-500"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Vacancy rate</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.vacancyRate }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-orange-500"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Serviceability</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.serviceability }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-red-500"></span>
            </div>
            
            <div class="col-span-2 text-gray-300 text-sm">Population change per annum</div>
            <div class="text-right text-white text-sm flex items-center justify-end">
              <span>{{ financialData.suburbData.populationChange }}%</span>
              <span class="ml-2 inline-block w-3 h-3 rounded-full bg-red-500"></span>
            </div>
          </div>
          
          <div class="mt-3 pt-2 border-t border-gray-700 text-xs flex items-center justify-between">
            <div>
              <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span class="text-red-400">BAD</span>
              <span class="inline-block w-2 h-2 rounded-full bg-green-500 mx-1"></span>
              <span class="text-green-400">GOOD</span>
              <span class="inline-block w-2 h-2 rounded-full bg-orange-500 mx-1"></span>
              <span class="text-orange-400">VERY GOOD</span>
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
  purchaseCosts: false,
  cashflow: false,
  value: false,
  suburb: false
});

// Sample data - in a real app this would come from an API
// Values are based on the screenshot provided
const financialData = ref({
  recommendationText: "Buy Property",
  propertyScore: 84,
  suburbRating: 13,
  propertyRating: 16,
  cashflowRating: 18,
  growthRating: 20,
  valueRating: 13,
  
  timeToEquity: 24, // months to generate $100k in equity
  askingPrice: 800,
  marketValueRange: "750k-800k",
  targetPurchasePrice: 760,
  estimatedRentPerWeek: 623,
  estimatedRentalYield: 4.26,
  totalOwnershipCostPerWeek: 105,
  
  // Purchase costs
  mortgageFee: 529,
  transferFee: 2240,
  stampDuty: 21850,
  totalTransactionCosts: 24699,
  depositAmount: 152000,
  totalCashRequired: 176699,
  
  // Cashflow projections
  cashflow: {
    rentalIncomeY1: 31748,
    rentalIncomeY5: 35732,
    rentalIncomeY10: 41423,
    
    expensesY1: 6140,
    expensesY5: 6910,
    expensesY10: 8011,
    
    interestCostsYearly: 33440,
    
    cashflowBeforeTaxY1: 7832,
    cashflowBeforeTaxY5: 4618,
    cashflowBeforeTaxY10: 28,
    
    costPerWeekY1: 105,
    costPerWeekY5: 62,
    costPerWeekY10: 0
  },
  
  // Value projections
  valueProjections: {
    propertyValueY1: 760000,
    propertyValueY5: 996205,
    propertyValueY10: 1397229,
    
    loanAmount: 608000,
    
    netEquityY1: 152000,
    netEquityY5: 369566,
    netEquityY10: 760663,
    
    capitalReturnY1: 0,
    capitalReturnY5: 217566,
    capitalReturnY10: 608663,
    
    returnOnEquityY1: 0,
    returnOnEquityY5: 143,
    returnOnEquityY10: 400
  },
  
  // Suburb level data
  suburbData: {
    last12MonthGrowth: 19,
    historicalGrowth: 11.10,
    ownerOccupiers: 58.2,
    vacancyRate: 0.76,
    serviceability: 60.25,
    populationChange: 1,
    householdIncomeChange: 16.68
  }
});

const isLoading = ref(false);
const error = ref(null);
const route = useRoute();

// Toggle accordion sections
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Format currency values
const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Get class for growth rate display
const getGrowthRateClass = (rate) => {
  if (rate > 5) return 'text-green-400';
  if (rate > 0) return 'text-green-200';
  if (rate === 0) return 'text-gray-200';
  return 'text-red-400';
};

// Get class for neighborhood trend display
const getTrendClass = (trend) => {
  if (trend === 'up') return 'text-green-400';
  if (trend === 'stable') return 'text-blue-400';
  return 'text-red-400';
};

// Get label for neighborhood trend
const getTrendLabel = (trend) => {
  if (trend === 'up') return 'Rising';
  if (trend === 'stable') return 'Stable';
  return 'Declining';
};

// Simulate loading financial data when the component mounts or route changes
const loadFinancialData = () => {
  isLoading.value = true;
  error.value = null;
  
  // Simulate API call with timeout
  setTimeout(() => {
    try {
      // Here you would fetch actual data from your API
      // For now we'll just use our sample data
      
      // Adjust property value based on lot area if available
      const lotDetails = route.query.lotDetails;
      if (lotDetails && lotDetails.lot_area) {
        const area = parseInt(lotDetails.lot_area);
        if (!isNaN(area)) {
          if (area > 0) {
            const valuePerSqm = Math.round((financialData.value.targetPurchasePrice * 1000) / area);
            financialData.value.pricePerSqm = valuePerSqm;
          }
        }
      }
      
      isLoading.value = false;
    } catch (err) {
      console.error("Error loading financial data:", err);
      error.value = "Could not load financial data";
      isLoading.value = false;
    }
  }, 800); // Shorter loading delay for better UX
};

onMounted(() => {
  loadFinancialData();
  
  // Open the first section by default for better UX
  expandedSections.value.purchaseCosts = true;
});

// Reload financial data when route changes
watch(() => route.query.address, () => {
  loadFinancialData();
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
