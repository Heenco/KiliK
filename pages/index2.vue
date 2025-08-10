<template>
  <div class="bg-gradient-to-b from-black to-gray-900 property-background">
    <div class="property-grid"></div>
    <div class="container mx-auto px-4">
      <!-- Main Content -->      <main class="flex flex-col items-center py-6">        <!-- Hero Section -->
        <section class="flex flex-col justify-center items-center py-20 w-full">
          <div class="text-center mb-3">
            <span class="text-xs bg-gray-100 px-3 py-1 rounded-full">
              Announcing our partnership with Foursquare <Button variant="link" class="text-xs text-gray-300 hover:text-white">Read on</Button>
            </span>          </div>          <h2 class="text-center text-5xl font-bold mb-2">
            AI agents for <span class="text-green-400">{{ currentKeyword }}<span class="cursor" :class="{ 'cursor-blink': showCursor }">&#124;</span></span>
          </h2> 
          <p class="text-center text-gray-600 mb-3 max-w-xl mx-auto text-sm">
            Advanced features for real estate professionals and developers
          </p>
          
          <!-- Action Buttons -->
          <div class="max-w-2xl w-full flex justify-center items-center gap-4 mt-6">
            <Button @click="goToMainIndex" class="bg-green-600 hover:bg-green-700 text-white">
              Property Search
            </Button>
     
          </div>
 
        </section>
          <!-- Data Enrichment Section -->
        <section class="py-16 flex items-center w-full max-w-7xl">
          <div class="flex flex-col md:flex-row gap-12 items-center">
            <div class="w-full md:w-1/2">              <div class="inline-block mb-3 px-4 py-2 bg-green-600 text-sm font-medium rounded-full text-white">
                AI agent for location Intelligence
              </div>
              <h2 class="text-3xl font-bold mb-4 text-white">
                Smart buying decisions<br />powered by AI
              </h2>              <p class="text-gray-400 mb-6">
                Our comprehensive AI scoring system evaluates properties based on hazard risks, safety metrics, walkability scores, socio-economic factors, and financial projections to identify the optimal investment opportunities tailored to your specific requirements.
              </p>
              <div class="flex gap-3">
              
                <Button variant="ghost" class="bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-800/30">
                  View Property Intelligence Demo
                </Button>
              </div>
              
              <div class="grid grid-cols-2 gap-8 mt-10">                <div class="flex items-start gap-3">                <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Multi-factor property scoring</h3>
                    <p class="text-xs text-gray-400">Safety, walkability, hazards, and socio-economic metrics</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3m0 0l-3-3m3 3H2m12 3a4 4 0 10-4-4m4 4v6m4-6h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Financial insights engine</h3>
                    <p class="text-xs text-gray-400">ROI projections and comprehensive investment analytics</p>
                  </div>
                </div>
              </div>
            </div>            <div class="w-full md:w-1/2">
              <div class="relative bg-gray-800/60 p-8 rounded-lg border border-gray-700">
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-white mb-3">Property Intelligence Score: <span class="text-green-400">87/100</span></h4>
                  
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-400">Safety Score</span>
                        <span class="text-xs text-white">92/100</span>
                      </div>
                      <div class="h-1.5 bg-gray-700 rounded-full">
                        <div class="h-full bg-green-500 rounded-full" style="width: 92%"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-400">Hazard Risk</span>
                        <span class="text-xs text-white">Low</span>
                      </div>
                      <div class="h-1.5 bg-gray-700 rounded-full">
                        <div class="h-full bg-green-500 rounded-full" style="width: 85%"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-400">Walkability</span>
                        <span class="text-xs text-white">78/100</span>
                      </div>
                      <div class="h-1.5 bg-gray-700 rounded-full">
                        <div class="h-full bg-blue-500 rounded-full" style="width: 78%"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-400">Socio-Economic Index</span>
                        <span class="text-xs text-white">89/100</span>
                      </div>
                      <div class="h-1.5 bg-gray-700 rounded-full">
                        <div class="h-full bg-green-500 rounded-full" style="width: 89%"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-400">Financial Projection</span>
                        <span class="text-xs text-green-400">+18% (5yr)</span>
                      </div>
                      <div class="h-1.5 bg-gray-700 rounded-full">
                        <div class="h-full bg-green-500 rounded-full" style="width: 88%"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="absolute bottom-[-50px] right-[20px]">
                  <div class="bg-gray-800/90 p-4 rounded-lg border border-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-white">Overall Rating</span>
                      <span class="ml-3 text-sm font-bold text-green-400">A+</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Excellent investment potential</div>
                  </div>
                </div>
              </div>
            </div>
          </div>        </section>        <!-- Comparative Market Analysis Section -->
        <section class="py-16 flex items-center w-full max-w-7xl">
          <div class="flex flex-col md:flex-row gap-12 items-center">
            <div class="w-full md:w-1/2">
              <div class="inline-block mb-3 px-4 py-2 bg-green-600 text-sm font-medium rounded-full text-white">
                AI agent for Market Analysis
              </div>
              <h2 class="text-3xl font-bold mb-4 text-white">
                Data-driven Comparative<br />Market Analysis with AI
              </h2>
              <p class="text-gray-400 mb-6">
                Our AI-powered Comparative Market Analysis provides detailed insights into property values, market trends, and investment potential. By analyzing thousands of comparable properties, historical data, and market forecasts, our system helps you make informed decisions with intuitive visualizations and actionable intelligence.
              </p>
              <div class="flex gap-3">
                <Button variant="ghost" class="bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-800/30">
                  View Market Analysis Demo
                </Button>
              </div>
              
              <div class="grid grid-cols-2 gap-8 mt-10">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Dynamic price prediction</h3>
                    <p class="text-xs text-gray-400">Advanced algorithms analyze local market data to predict property values with high accuracy</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Interactive visualizations</h3>
                    <p class="text-xs text-gray-400">Intuitive charts and heatmaps provide clear insights into market trends and property comparisons</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Historical trend analysis</h3>
                    <p class="text-xs text-gray-400">Track property value changes over time to identify investment opportunities and market cycles</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Competitive advantage analysis</h3>
                    <p class="text-xs text-gray-400">Identify key property features that drive value in your target market and neighborhood</p>
                  </div>
                </div>
              </div>
            </div>            <div class="w-full md:w-1/2">
              <div class="relative bg-gray-800/60 p-8 rounded-lg border border-gray-700">
                <!-- CMA Dashboard UI -->
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h4 class="text-sm font-medium text-white">Comparative Market Analysis</h4>
                  </div>
                  <div class="bg-blue-500/30 text-blue-300 text-[10px] px-2 py-1 rounded-full border border-blue-400/20 font-semibold">LIVE DATA</div>
                </div>
                
                <!-- Property Value Chart -->
                <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4">
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="text-xs font-medium text-white">Property Value Comparison</h5>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1">
                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span class="text-[10px] text-gray-400">Subject</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span class="text-[10px] text-gray-400">Comps</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Simulated Bar Chart -->
                  <div class="h-32 flex items-end gap-1">
                    <!-- Subject Property -->
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[85%] w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-green-400 whitespace-nowrap">$875,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Subject</div>
                    </div>
                    
                    <!-- Comparable Properties -->
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[75%] w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 whitespace-nowrap">$798,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Comp 1</div>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[90%] w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 whitespace-nowrap">$910,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Comp 2</div>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[82%] w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 whitespace-nowrap">$850,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Comp 3</div>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[95%] w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 whitespace-nowrap">$945,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Comp 4</div>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center">
                      <div class="h-[80%] w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm relative">
                        <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 whitespace-nowrap">$825,000</div>
                      </div>
                      <div class="mt-1 text-[8px] text-gray-400">Comp 5</div>
                    </div>
                  </div>
                </div>
                
                <!-- Market Trends & Price History -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <!-- Price Trend Chart -->
                  <div class="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                    <h5 class="text-xs font-medium text-white mb-2">Price Trends (12M)</h5>
                    <div class="h-24 relative">
                      <!-- Simulated Line Chart -->
                      <svg viewBox="0 0 100 40" class="h-full w-full">
                        <!-- Grid Lines -->
                        <line x1="0" y1="10" x2="100" y2="10" stroke="#374151" stroke-width="0.2" />
                        <line x1="0" y1="20" x2="100" y2="20" stroke="#374151" stroke-width="0.2" />
                        <line x1="0" y1="30" x2="100" y2="30" stroke="#374151" stroke-width="0.2" />
                        
                        <!-- Trend Line -->
                        <path d="M0,30 C10,28 20,25 30,20 S40,15 50,13 S60,10 70,8 S80,5 90,3 L100,2" 
                              fill="none" 
                              stroke="#34D399" 
                              stroke-width="1" />
                              
                        <!-- Area Under Curve with Gradient -->
                        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stop-color="#34D399" stop-opacity="0.3" />
                          <stop offset="100%" stop-color="#34D399" stop-opacity="0" />
                        </linearGradient>
                        <path d="M0,30 C10,28 20,25 30,20 S40,15 50,13 S60,10 70,8 S80,5 90,3 L100,2 V40 H0 Z" 
                              fill="url(#trendGradient)" />
                      </svg>
                      
                      <div class="absolute bottom-0 left-0 right-0 flex justify-between">
                        <span class="text-[8px] text-gray-400">Jun</span>
                        <span class="text-[8px] text-gray-400">Dec</span>
                        <span class="text-[8px] text-gray-400">Jun</span>
                      </div>
                    </div>
                    <div class="mt-1 flex justify-between items-center">
                      <span class="text-[8px] text-gray-400">Market Appreciation: </span>
                      <span class="text-[10px] text-green-400">+8.2% YoY</span>
                    </div>
                  </div>
                  
                  <!-- Key Metrics -->
                  <div class="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                    <h5 class="text-xs font-medium text-white mb-2">Comparative Metrics</h5>
                    <div class="space-y-2">
                      <div>
                        <div class="flex justify-between mb-1">
                          <span class="text-[10px] text-gray-400">Price per SqFt</span>
                          <span class="text-[10px] text-white">$452 <span class="text-green-400">+5%</span></span>
                        </div>
                        <div class="h-1 bg-gray-700 rounded-full">
                          <div class="h-full bg-blue-400 rounded-full" style="width: 80%"></div>
                        </div>
                      </div>
                      
                      <div>
                        <div class="flex justify-between mb-1">
                          <span class="text-[10px] text-gray-400">Days on Market</span>
                          <span class="text-[10px] text-white">18 <span class="text-green-400">-22%</span></span>
                        </div>
                        <div class="h-1 bg-gray-700 rounded-full">
                          <div class="h-full bg-green-400 rounded-full" style="width: 65%"></div>
                        </div>
                      </div>
                      
                      <div>
                        <div class="flex justify-between mb-1">
                          <span class="text-[10px] text-gray-400">Sell-to-List Ratio</span>
                          <span class="text-[10px] text-white">102% <span class="text-green-400">+2%</span></span>
                        </div>
                        <div class="h-1 bg-gray-700 rounded-full">
                          <div class="h-full bg-blue-400 rounded-full" style="width: 75%"></div>
                        </div>
                      </div>
                      
                      <div>
                        <div class="flex justify-between mb-1">
                          <span class="text-[10px] text-gray-400">Inventory Level</span>
                          <span class="text-[10px] text-white">1.8 mo <span class="text-red-400">-0.3</span></span>
                        </div>
                        <div class="h-1 bg-gray-700 rounded-full">
                          <div class="h-full bg-yellow-400 rounded-full" style="width: 45%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- AI Market Prediction Card -->
                <div class="bg-blue-900/20 rounded-lg p-3 border border-blue-700/30">
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h5 class="text-xs font-medium text-white">AI Market Prediction</h5>
                  </div>
                  <p class="text-[11px] text-gray-300 mb-2">
                    Based on 42 comparable properties and current market conditions, our AI predicts this property is undervalued by 4.2% with strong appreciation potential in the next 12 months.
                  </p>
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="text-gray-400">Confidence: <span class="text-blue-400">89%</span></span>
                    <span class="text-gray-400">Updated: <span class="text-white">Today</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        <!-- Custom Attributes Section -->
        <section class="py-16 flex items-center w-full max-w-7xl">
          <div class="flex flex-col-reverse md:flex-row gap-12 items-center">
            <div class="w-full md:w-1/2">              <div class="relative overflow-hidden rounded-lg bg-gray-800/80 shadow-xl">
                <!-- Image Slideshow -->
                <transition name="fade" mode="out-in">
                  <img 
                    :key="currentImageIndex"
                    :src="`${propertyImages[currentImageIndex].src}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80`" 
                    class="w-full object-cover h-80 transition-opacity duration-500" 
                    :class="isAnalyzing ? 'opacity-20' : 'opacity-30'"
                    :alt="`Australian ${propertyImages[currentImageIndex].type} house`" 
                  />
                </transition>
                
                <!-- Controls -->
                <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                  <button 
                    v-for="(image, index) in propertyImages" 
                    :key="index"
                    @click="currentImageIndex = index; cyclePropertyImages();" 
                    class="w-2 h-2 rounded-full bg-gray-500 transition-all"
                    :class="{'bg-green-400 w-4': currentImageIndex === index}"
                    :disabled="isAnalyzing"
                    aria-label="Select image">
                  </button>
                </div>
                
                <!-- Next Image Button -->
                <button 
                  @click="cyclePropertyImages" 
                  class="absolute top-3 right-3 bg-gray-800/70 hover:bg-gray-700/90 p-2 rounded-full shadow-lg z-10"
                  :disabled="isAnalyzing"
                  :class="{'opacity-50 cursor-not-allowed': isAnalyzing, 'opacity-100': !isAnalyzing}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div class="absolute inset-0">
                  <!-- Inspection Overlay Elements -->
                  <div class="relative h-full">
                    <!-- Property Info Box -->
                    <div class="absolute top-6 left-8 bg-blue-900/60 backdrop-blur-sm text-blue-100 px-3 py-2 rounded-lg text-xs font-semibold border border-blue-400/30 shadow-lg">
                      <div class="flex items-center mb-1">
                        <span class="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                        {{ propertyImages[currentImageIndex].type }} Analysis
                      </div>
                      <div class="text-[10px] text-blue-200/80 pl-4">
                        Built: {{ propertyImages[currentImageIndex].buildYear }} | NCC: {{ propertyImages[currentImageIndex].nccCode }}
                      </div>
                    </div>
                    
                    <!-- Scanning Laser Effect (only visible during scanning) -->
                    <div v-if="isAnalyzing" class="absolute inset-0 overflow-hidden pointer-events-none">
                      <div class="absolute inset-x-0 h-1 bg-blue-500/40 blur-sm animate-scanning-laser"></div>
                    </div>
                    
                    <!-- Analysis Points (appear during analysis) -->
                    <div class="absolute inset-0 pointer-events-none">
                      <div 
                        v-for="(point, idx) in analysisPoints" 
                        :key="idx"
                        class="absolute w-4 h-4 -ml-2 -mt-2 rounded-full mix-blend-screen"
                        :class="point.color === 'red' ? 'bg-red-500/70' : 'bg-green-500/70'"
                        :style="`left: ${point.x}%; top: ${point.y}%;`">
                        <span class="absolute inset-0 rounded-full animate-ping" 
                              :class="point.color === 'red' ? 'bg-red-400/40' : 'bg-green-400/40'"></span>
                      </div>
                    </div>
                    
                    <!-- Detected Issues (Dynamic) -->
                    <transition-group name="issue-fade" tag="div">
                      <div 
                        v-for="(issue, idx) in detectedIssues" 
                        :key="issue"
                        :class="{
                          'absolute rounded-lg text-xs font-semibold flex items-center py-1 px-3 shadow-lg backdrop-blur-sm': true,
                          'bg-red-900/60 text-red-100 border border-red-400/30': idx % 2 === 0,
                          'bg-yellow-900/60 text-yellow-100 border border-yellow-400/30': idx % 2 === 1
                        }"
                        :style="{
                          top: `${6 + idx * 4}rem`,
                          right: `${2 + (idx % 2) * 2}rem`
                        }">
                        <span 
                          class="inline-block w-2 h-2 rounded-full mr-2"
                          :class="idx % 2 === 0 ? 'bg-red-400' : 'bg-yellow-400'">
                        </span>
                        {{ issue }} Detected
                      </div>
                    </transition-group>
                    
                    <!-- Scanning Status Message -->
                    <transition name="fade">
                      <div v-if="isAnalyzing" class="absolute top-1/2 left-0 right-0 text-center mt-16 text-xs text-blue-300 font-medium">
                        {{ scanningMessage }}
                      </div>
                    </transition>                    <!-- Building Assessment Box -->
                    <div class="absolute bottom-2 right-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/60 p-2 rounded-lg shadow-lg max-w-[160px] z-20">
                      <div class="flex items-center justify-between mb-1">
                        <div class="text-[10px] font-medium text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 mr-1 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          AI Building Assessment
                        </div>
                        <div class="bg-blue-500/30 text-blue-300 text-[8px] px-1 rounded border border-blue-400/20 font-semibold">AI</div>
                      </div>
                        <transition name="progress">
                        <div v-if="!isAnalyzing" class="flex items-center gap-1 mb-1">
                          <div class="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              class="h-full rounded-full transition-all duration-1000"
                              :class="propertyImages[currentImageIndex].compliance >= 80 ? 'bg-green-500' : propertyImages[currentImageIndex].compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'"
                              :style="`width: ${propertyImages[currentImageIndex].compliance}%`">
                            </div>
                          </div>
                          <span 
                            class="text-[9px] font-medium transition-colors"
                            :class="propertyImages[currentImageIndex].compliance >= 80 ? 'text-green-400' : propertyImages[currentImageIndex].compliance >= 70 ? 'text-yellow-400' : 'text-red-400'">
                            {{ propertyImages[currentImageIndex].compliance }}%
                          </span>
                        </div>                        <div v-else class="mb-1">
                          <div class="flex justify-between text-[9px] text-gray-400 mb-1">
                            <span>Analysis</span>
                            <span>{{ scanningProgress }}%</span>
                          </div>
                          <div class="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 rounded-full transition-all duration-300" :style="`width: ${scanningProgress}%`"></div>
                          </div>
                        </div>
                      </transition>
                      
                      <div class="text-[9px] text-gray-400 flex items-center">
                        <svg v-if="isAnalyzing" class="animate-spin -ml-1 mr-1 h-2 w-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isAnalyzing ? 'AI scan in progress...' : `${propertyImages[currentImageIndex].issues.length} issues found` }}
                      </div>
                    </div>
                    
                    <!-- Central Analysis Target -->
                    <transition name="fade">
                      <div v-if="isAnalyzing" class="absolute inset-0 flex items-center justify-center">
                        <div class="relative">
                          <div class="w-32 h-32 border-2 border-gray-500/40 border-dashed rounded-full flex items-center justify-center animate-pulse">
                            <div class="absolute w-24 h-24 border border-blue-500/30 rounded-full animate-reverse-spin"></div>
                            <div class="absolute w-16 h-16 border border-green-500/40 rounded-full animate-spin"></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                              <span class="text-xs text-blue-400 font-medium">SCANNING</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>            <div class="w-full md:w-1/2">              <div class="inline-block mb-3 px-4 py-2 bg-green-600 text-sm font-medium rounded-full text-white">
                AI agent for building inspection
              </div>              <h2 class="text-3xl font-bold mb-4 text-white">
                Comprehensive Australian<br />AI Property Inspection System
              </h2>
              <p class="text-gray-400 mb-6">
                Our AI-Inspector combines professional expertise with advanced technology to deliver inspections that exceed Australian Standard 4349.1-2007 requirements. Our system scans and analyzes interior spaces, exterior elements, roof cavities, sub-floor areas and surroundings using computer vision technology. The AI-Inspector identifies defects, classifies their severity, provides compliance assessments, and generates comprehensive reports with automated repair recommendations and cost estimates.
              </p><div class="flex gap-3">                
                <Button variant="ghost" class="bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-800/30">
                  View AI Analysis Demo
                </Button>
              </div>
                <div class="grid grid-cols-2 gap-8 mt-10">                  <div class="flex items-start gap-3">                
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>                    <h3 class="font-medium text-white mb-1">AI-powered visual analysis</h3>
                    <p class="text-xs text-gray-400">Computer vision technology scans and identifies defects in all property areas with pinpoint accuracy</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Australian Standard compliance</h3>
                    <p class="text-xs text-gray-400">AI assessments exceed AS 4349.1-2007 requirements with comprehensive digital documentation</p>
                  </div>
                </div>                <div class="flex items-start gap-3">                
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Automated defect analysis</h3>
                    <p class="text-xs text-gray-400">AI classifies defects by severity, estimates repair costs, and generates prioritized remediation plans</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-gray-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>                  <div>
                    <h3 class="font-medium text-white mb-1">Real-time risk assessment</h3>
                    <p class="text-xs text-gray-400">Instant property risk analysis with negotiation leverage data and interactive digital reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        <!-- AI Agent Review Section -->
        <section class="py-16 flex items-center w-full max-w-7xl">
          <div class="flex flex-col md:flex-row gap-12 items-center">            <div class="w-full md:w-1/2">
              <div class="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-green-600 text-sm font-medium rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                AI agent for property development
              </div>
              <h2 class="text-3xl font-bold mb-4 text-white">
                Unlock hidden property value<br />with AI urban planning analysis
              </h2>
              <p class="text-gray-400 mb-6">
                Our AI urban planner agent continuously analyzes local zoning codes, regulations, and development trends across 9,000+ cities to identify high-value opportunities including ADU potential, subdivision possibilities, and rezoning strategies that maximize your property's development potential and future return on investment.
              </p>
              <div class="flex gap-3 mb-8">

                <Button variant="ghost" class="bg-green-900/30 border border-green-600/30 text-green-400 hover:bg-green-800/30 flex items-center gap-2">
                  
                  View Zoning Maps
                </Button>
              </div>
              
              <!-- Feature Cards -->
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-green-500/30 transition-all">
                  <div class="p-2 bg-gray-700 rounded inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">AI code analysis</h3>
                    <p class="text-xs text-gray-400">Intelligent parsing of complex zoning codes to find hidden opportunities and development loopholes</p>
                  </div>
                </div>
                <div class="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-green-500/30 transition-all">
                  <div class="p-2 bg-gray-700 rounded inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Value optimization</h3>
                    <p class="text-xs text-gray-400">Personalized ADU, subdivision, and development recommendations with ROI projections</p>
                  </div>
                </div>
                <div class="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-green-500/30 transition-all">
                  <div class="p-2 bg-gray-700 rounded inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Zoning compliance</h3>
                    <p class="text-xs text-gray-400">Verify property uses against current zoning and identify potential compliance issues</p>
                  </div>
                </div>
                <div class="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-green-500/30 transition-all">
                  <div class="p-2 bg-gray-700 rounded inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-white mb-1">Comprehensive reports</h3>
                    <p class="text-xs text-gray-400">Generate detailed zoning analysis reports with actionable recommendations</p>
                  </div>
                </div>
              </div>
            </div>            <div class="w-full md:w-1/2">
              <div class="relative bg-gray-800/60 p-6 rounded-lg border border-gray-700 overflow-hidden">
                <!-- Header with property info and badge -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="h-5 w-5 rounded-full bg-green-500/30 border border-green-400/40 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div class="text-sm text-white font-medium">42 Wentworth Ave</div>
                  </div>
                  <div class="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-1 rounded-full border border-blue-400/20 font-semibold">AI ANALYZED</div>
                </div>
                  <!-- Stats Row removed as requested --><!-- Zoning Data Visualization - Zoneomics Style -->
                <div class="grid grid-cols-1 gap-4 mb-4">
                  <!-- Zoning Report Preview -->
                  <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700 shadow-md">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span class="text-sm font-medium text-white">Zoning Report Preview</span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">R2</span>
                      </div>
                    </div>
                    
                    <!-- Abstract Visual Representation (Zoneomics-inspired) -->
                    <div class="bg-gray-800/80 rounded-lg p-3 mb-3 flex justify-between items-center">
                      <div class="flex-1">                        <div class="text-xs font-medium text-white mb-1">Residential Zone</div>
                        <div class="text-[10px] text-gray-400">Sydney, NSW</div>
                      </div>
                      <div class="w-20 h-20 relative">
                        <svg width="100%" height="100%" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                            </pattern>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <rect width="40" height="40" fill="url(#smallGrid)"/>
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                            </pattern>
                          </defs>
                          <rect width="80" height="80" fill="url(#grid)" />
                          <rect x="20" y="20" width="40" height="40" rx="3" fill="rgba(74, 222, 128, 0.2)" stroke="rgba(74, 222, 128, 0.8)" stroke-width="1.5" />
                          <circle cx="40" cy="40" r="3" fill="white" />
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Property Metrics -->
                    <div class="grid grid-cols-3 gap-2 mb-3">                      <div class="bg-gray-800/60 rounded p-2 text-center">
                        <span class="text-[9px] text-gray-400 block mb-1">Lot Size</span>
                        <span class="text-xs font-medium text-white">697 sqm</span>
                      </div>
                      <div class="bg-gray-800/60 rounded p-2 text-center">
                        <span class="text-[9px] text-gray-400 block mb-1">Max Height</span>
                        <span class="text-xs font-medium text-white">10.7 m</span>
                      </div>
                      <div class="bg-gray-800/60 rounded p-2 text-center">
                        <span class="text-[9px] text-gray-400 block mb-1">Coverage</span>
                        <span class="text-xs font-medium text-white">40%</span>
                      </div>
                    </div>
                      <div class="flex justify-between items-center">
                      <div class="text-[10px] text-gray-400">Last updated: Today</div>
                    </div>
                  </div>
                  
                  <!-- Permitted Uses Quick View -->
                  <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700 shadow-md">
                    <div class="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span class="text-sm font-medium text-white">Permitted Uses</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mb-3">
                      <div class="bg-gray-800/60 rounded p-2">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                          <span class="text-xs text-white font-medium">Allowed</span>
                        </div>                        <div class="pl-5 space-y-1">
                          <div class="text-[10px] text-gray-300">Detached Dwelling</div>
                          <div class="text-[10px] text-gray-300">Granny Flat</div>
                          <div class="text-[10px] text-gray-300">Home Business</div>
                        </div>
                      </div>
                      <div class="bg-gray-800/60 rounded p-2">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                          <span class="text-xs text-white font-medium">Not Allowed</span>
                        </div>                        <div class="pl-5 space-y-1">
                          <div class="text-[10px] text-gray-300">Commercial Premises</div>
                          <div class="text-[10px] text-gray-300">Tourist Accommodation</div>
                          <div class="text-[10px] text-gray-300">Multi-dwelling Housing</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="text-[10px] text-gray-400 flex items-center justify-between">
                      <span>Data source: Municipal Code</span>
                      <button class="text-blue-400 hover:underline">View All Uses</button>
                    </div>
                  </div>
                </div>
                
                <!-- Property Zoning Data -->
                <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700 shadow-md mb-3">
                  <div class="flex items-center gap-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span class="text-sm font-medium text-white">Property Zoning Data</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Current Zoning:</span>
                      <span class="text-xs text-white">R2 (Low Density Residential)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Max Height:</span>
                      <span class="text-xs text-white">10.7 m</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">ADU potential:</span>
                      <span class="text-xs text-green-400">High (74 sqm)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Setbacks:</span>
                      <span class="text-xs text-white">4.6m front, 1.5m sides</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Subdivision:</span>
                      <span class="text-xs text-yellow-400">Possible (2 lots)</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Rezoning:</span>
                      <span class="text-xs text-green-400">Medium potential</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">Est. ROI (5yr):</span>
                      <span class="text-xs text-green-400">+32% with ADU</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400 w-28">AI Confidence:</span>
                      <span class="text-xs text-blue-400">89%</span>
                    </div>
                  </div>
                </div>                  <!-- Action Buttons section removed as requested -->
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between bg-gray-800/40 rounded-md px-3 py-2">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-xs text-gray-300">Last updated: June 16, 2025</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        <!-- Trusted Partners Section -->
          <!-- Feature Highlights -->
        <section class="py-16 w-full max-w-7xl">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-white">AI-agent Property Intelligence</h2>
            <p class="text-gray-400 mt-2">Advanced features for real estate professionals and developers</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div v-for="(feature, index) in features" :key="index" 
                 class="p-5 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-green-400/30 transition-all">
              <h3 class="font-medium text-white mb-2">{{ feature.title }}</h3>
              <p class="text-sm text-gray-400">{{ feature.description }}</p>
            </div>          </div>
        </section>
        
        <!-- Recent Updates Section -->
        <section class="py-16 w-full max-w-7xl">
          <h2 class="text-3xl font-bold mb-8 text-white">Recent updates</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-800/60 rounded-lg overflow-hidden relative group">
              <div class="aspect-video bg-gray-900 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white/80 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-medium text-white text-sm">CliQ just announced a new partnership with Mapbox</h3>
                <div class="flex justify-between items-center mt-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-600"></div>
                    <span class="text-xs text-gray-400">Alex Martinelli</span>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800/60 rounded-lg overflow-hidden relative group">
              <div class="aspect-video bg-gray-900 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white/80 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-medium text-white text-sm">New features: Property valuation AI models</h3>
                <div class="flex justify-between items-center mt-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-600"></div>
                    <span class="text-xs text-gray-400">Robert Miller</span>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800/60 rounded-lg overflow-hidden relative group">
              <div class="aspect-video bg-gray-900 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white/80 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-medium text-white text-sm">Enhanced zoning compliance detection</h3>
                <div class="flex justify-between items-center mt-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-600"></div>
                    <span class="text-xs text-gray-400">Sarah Chen</span>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white p-1 h-auto">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 w-full max-w-7xl">
          <div class="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
            <h2 class="text-2xl font-bold text-white mb-4">Ready to revolutionize your real estate data?</h2>
            <p class="text-gray-400 mb-6 max-w-xl mx-auto">Join thousands of real estate professionals using AI-powered tools to make better property decisions.</p>
            <div class="flex flex-wrap justify-center gap-4">              <Button class="bg-green-600 hover:bg-green-700 text-white">
                Get Started Now
              </Button>
              <Button variant="outline" class="border-gray-700 text-gray-100 hover:bg-gray-700">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer class="w-full py-8 mt-auto border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 class="text-white font-medium mb-3">Product</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">API</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-medium mb-3">Company</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">About</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-medium mb-3">Resources</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Community</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Status</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-medium mb-3">Legal</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Privacy</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Terms</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Security</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white text-sm">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div class="text-gray-500 text-xs">
              &copy; {{ new Date().getFullYear() }} CliQ All rights reserved.
            </div>
            <div class="flex gap-4 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Twitter</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">LinkedIn</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

// Typewriter effect state
const keywords = ['Due Diligence','Comparative Market Analysis', 'Property searching', 'Potential Development', ' Building inspection']
const currentKeyword = ref('Due Diligence')
const showCursor = ref(true)
const isDeleting = ref(false)
const textIndex = ref(0)
const typeSpeed = reactive({
  typing: 150,   // Slower typing speed (was 100)
  deleting: 80,  // Slower deleting speed (was 50)
  pause: 3000    // Longer pause before changing direction (was 1000)
})
let typingInterval
let cursorInterval

// Start the cursor blinking effect
const startCursorBlink = () => {
  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 600) // Slower cursor blink (was 500)
}

// Handle the typewriter effect
const typeText = () => {
  const currentIndex = textIndex.value % keywords.length
  const fullText = keywords[currentIndex]
  
  if (!isDeleting.value) {
    // Typing mode
    currentKeyword.value = fullText.substring(0, currentKeyword.value.length + 1)
    
    // If we've fully typed the word, pause then start deleting
    if (currentKeyword.value === fullText) {
      isDeleting.value = true
      clearInterval(typingInterval)
      typingInterval = setTimeout(typeText, typeSpeed.pause)
      return
    }
  } else {
    // Deleting mode
    currentKeyword.value = fullText.substring(0, currentKeyword.value.length - 1)
    
    // If we've fully deleted the word, move to the next word
    if (currentKeyword.value === '') {
      isDeleting.value = false
      textIndex.value++
    }
  }
  
  // Add slight randomness to typing speed to make it more natural
  const randomSpeedVariation = Math.random() * 100 - 50 // -50 to +50ms variation
  
  // Set the next timeout based on whether typing or deleting
  clearInterval(typingInterval)
  typingInterval = setTimeout(
    typeText, 
    isDeleting.value 
      ? typeSpeed.deleting + randomSpeedVariation / 2 
      : typeSpeed.typing + randomSpeedVariation
  )
}

// Start the typewriter effect
const startTypewriter = () => {
  currentKeyword.value = ''
  isDeleting.value = false
  typeText()
}

// Setup and cleanup
onMounted(() => {
  startCursorBlink()
  startTypewriter()
})

onBeforeUnmount(() => {
  clearInterval(cursorInterval)
  clearInterval(typingInterval)
})

const goToMainIndex = () => {
  router.push('/')
}

const goToReport = () => {
  router.push('/report2')
}

// Sample features for the page
const features = [
  {
    title: 'AI Buying Assistant',
    description: 'Our comprehensive AI scoring system evaluates properties based on hazard risks, safety metrics, walkability scores, socio-economic factors, and financial projections for optimal investment decisions.'
  },
  {
    title: 'Property Investment Analysis',
    description: 'Get AI-powered ROI projections, rental yield estimates, and appreciation forecasts to make smarter investment decisions.'
  },  {
    title: 'Pre-Purchase Property Inspector',
    description: 'Australian Standard 4349.1-2007 compliant inspections covering interior, exterior, roof space, sub-floor areas and surroundings to identify major and minor defects, safety hazards, and provide detailed reports with high-resolution photos.'
  },
  {
    title: 'Maintenance Cost Predictor',
    description: 'Based on AI-detected issues, receive detailed repair cost estimates and timeline projections before purchasing a property.'
  },
  {
    title: 'Zoning Optimization Planner',
    description: 'Our AI urban planner analyzes local regulations to identify development opportunities like ADUs, subdivisions, and rezoning potential.'
  },
  {
    title: 'Future Value Projector',
    description: 'Leverage AI-powered analysis of urban planning trends to forecast neighborhood development and future property valuations.'
  }
]

// Sample property data
const propertyData = ref({
  address: '19558 Los Alamos St',
  aduPossible: 'Yes',
  aduExisting: 'No',
  westOfPch: 'Max 400 ft²',
  southOfPost: 'Max 1 200 ft²',
  homeValue: '$1.75m+',
  valueGain: '+23%'
})

// Property inspection images with detailed Australian housing types
const propertyImages = ref([
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/interior-home-inspect.jpg',
    type: 'Interior of Building',
    issues: ['Water Damage', 'Electrical Hazards'],
    compliance: 84,
    buildYear: '2000-2015',
    nccCode: 'BCA4.3.1.2',
    inspectionDetails: {
      structuralIntegrity: 'Excellent',
      moistureReadings: '18% (near windows)',
      thermalPerformance: 'Good',
      ventilationQuality: 'Good'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/building-exterior-inspect.jpg',
    type: 'Exterior of Building',
    issues: ['Cracking in Brickwork', 'Poor Drainage'],
    compliance: 76,
    buildYear: '1990-2000',
    nccCode: 'BCA3.1.2.3',
    inspectionDetails: {
      structuralIntegrity: 'Good',
      moistureReadings: '24% (at foundation)',
      thermalPerformance: 'Moderate',
      ventilationQuality: 'Good'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/roof-space-interior.jpg',
    type: 'Roof Space',
    issues: ['Insulation Gaps', 'Termite Activity'],
    compliance: 68,
    buildYear: '1970-1990',
    nccCode: 'BCA3.12.1.1',
    inspectionDetails: {
      structuralIntegrity: 'Fair',
      moistureReadings: '22%',
      thermalPerformance: 'Poor',
      ventilationQuality: 'Inadequate'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/roof-cladding-exterior.jpg',
    type: 'Roof Cladding',
    issues: ['Damaged Tiles', 'Flashing Issues'],
    compliance: 78,
    buildYear: '1985-2005',
    nccCode: 'BCA1.7.2.5',
    inspectionDetails: {
      structuralIntegrity: 'Good',
      moistureReadings: '16%',
      thermalPerformance: 'Moderate',
      ventilationQuality: 'Excellent'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/sub-floor-space.jpg',
    type: 'Sub-Floor Space',
    issues: ['Rising Damp', 'Timber Rot'],
    compliance: 70,
    buildYear: '1960-1980',
    nccCode: 'BCA3.4.3.2',
    inspectionDetails: {      structuralIntegrity: 'Fair',
      moistureReadings: '28% (elevated)',
      thermalPerformance: 'Poor',
      ventilationQuality: 'Poor'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/building-surroundings.jpg',
    type: 'Surrounding Area',
    issues: ['Drainage Problems', 'Tree Root Intrusion'],
    compliance: 82,
    buildYear: 'N/A',
    nccCode: 'BCA3.1.1.0',
    inspectionDetails: {
      structuralIntegrity: 'N/A',
      moistureReadings: '19%',
      thermalPerformance: 'N/A',
      ventilationQuality: 'Good'
    }
  },
  {
    src: 'https://ownerinspections.com.au/wp-content/uploads/prepurchase-defect-drain.jpg',
    type: 'Drainage Defect',
    issues: ['Blocked Drainage', 'Water Pooling'],
    compliance: 65,
    buildYear: '1980-2010',
    nccCode: 'BCA3.1.2.2',
    inspectionDetails: {
      structuralIntegrity: 'At Risk',
      moistureReadings: '38% (critical)',
      thermalPerformance: 'Poor',
      ventilationQuality: 'Poor'
    }
  }
])

// Current image index for slideshow
const currentImageIndex = ref(0)
const isAnalyzing = ref(false)
const analyzeComplete = ref(false)
const detectedIssues = ref([])
const scanningProgress = ref(0)
const analysisPoints = ref([])
const scanningMessage = ref('Initializing AI scan...')

// Function to cycle through property images
function cyclePropertyImages() {
  if (isAnalyzing.value) return
  
  isAnalyzing.value = true
  analyzeComplete.value = false
  detectedIssues.value = []
  scanningProgress.value = 0
  analysisPoints.value = []
  
  // Create scanning progress animation
  const progressInterval = setInterval(() => {
    scanningProgress.value += 5
    
    // Update scanning message based on progress
    if (scanningProgress.value < 20) {
      scanningMessage.value = 'Analyzing structural elements...'
    } else if (scanningProgress.value < 40) {
      scanningMessage.value = 'Detecting moisture levels...'    } else if (scanningProgress.value < 60) {
      scanningMessage.value = 'Evaluating building condition...'
    } else if (scanningProgress.value < 80) {
      scanningMessage.value = 'Identifying potential issues...'
    } else {
      scanningMessage.value = 'Finalizing assessment...'
    }
    
    if (scanningProgress.value >= 100) {
      clearInterval(progressInterval)
    }
  }, 50)
  
  // Random analysis points simulation
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        analysisPoints.value.push({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          color: Math.random() > 0.7 ? 'red' : 'green'
        })
      }, i * 300)
    }
  }, 500)
  
  // Change image and reset analysis
  setTimeout(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % propertyImages.value.length
    
    // Simulate issue detection with staggered appearance
    setTimeout(() => {
      const currentIssues = propertyImages.value[currentImageIndex.value].issues
      
      currentIssues.forEach((issue, index) => {
        setTimeout(() => {
          detectedIssues.value.push(issue)
        }, index * 400)
      })
      
      setTimeout(() => {
        analyzeComplete.value = true
        isAnalyzing.value = false
      }, currentIssues.length * 400 + 200)
    }, 1200)
  }, 2500)
}

// Auto-start first analysis
setTimeout(() => {
  cyclePropertyImages()
}, 1000)
</script>

<style scoped>
/* Update text colors for dark theme */
:deep(h2) {
  color: #ffffff;
}

:deep(p) {
  color: #9ca3af;
}

:deep(.bg-gray-100) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

/* Property Blueprint Background */
.property-background {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.15;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}

/* Property data visualization animation */
@keyframes dataFlow {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.15;
  }
}

/* Scanning progress animation */
@keyframes scanning-progress {
  0% {
    width: 0%;
  }
  50% {
    width: 60%;
  }
  100% {
    width: 100%;
  }
}

/* Scanning laser animation */
@keyframes scanning-laser {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateY(100%);
  }
}

/* Spin animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Reverse spin animation */
@keyframes reverse-spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

/* Issue fadeIn animation */
@keyframes issue-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse animation */
@keyframes pulse-analysis {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.property-grid {
  animation: dataFlow 20s infinite alternate ease-in-out;
}

/* Animation classes */
.animate-scanning-progress {
  animation: scanning-progress 2s ease-in-out;
}

.animate-scanning-laser {
  animation: scanning-laser 2s ease-in-out;
}

.animate-spin {
  animation: spin 8s linear infinite;
}

.animate-reverse-spin {
  animation: reverse-spin 12s linear infinite;
}

.animate-pulse {
  animation: pulse-analysis 2s ease-in-out infinite;
}

.issue-fade-enter-active {
  animation: issue-fade-in 0.5s ease-out forwards;
}

.issue-fade-leave-active {
  animation: issue-fade-in 0.5s ease-in reverse forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Cursor for typewriter effect */
.cursor {
  display: inline-block;
  color: #ffffff; /* Changed to white */
  font-weight: normal; /* Kept normal to maintain thinness */
  margin-left: 2px; /* Keep the slight spacing from the text */
  width: 1px; /* Keep it narrow/thin */
  transform: scaleY(1.2); /* Keep it slightly taller without affecting width */
}

.cursor-blink {
  opacity: 1;
}

.cursor:not(.cursor-blink) {
  opacity: 0;
}

/* Make sure all content is above the background elements */
.container {
  position: relative;
  z-index: 1;
}
</style>
