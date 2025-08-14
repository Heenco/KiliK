<template>
  <div class="products-page min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 property-background">
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 py-16 relative z-10">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Get comprehensive property reports and risk assessments for your investment decisions
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        <!-- Single Report -->
        <div class="pricing-card bg-gray-900/80 backdrop-blur rounded-lg shadow-lg border border-gray-700 p-8 relative">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-white mb-2">Single Report</h3>
            <p class="text-gray-400 mb-6">Perfect for individual property analysis</p>
            <div class="price-display mb-8">
              <span class="text-4xl font-bold text-green-400">$9.99</span>
              <span class="text-gray-400 text-lg">AUD</span>
            </div>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">1 Property Report</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Hazard Assessment</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Walkability Score</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">PDF Download</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">24/7 Support</span>
            </li>
          </ul>
          
          <button class="btn-primary w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-black rounded-lg font-semibold transition-all duration-300">
            Get Single Report
          </button>
        </div>

        <!-- Due Diligence 10 Reports -->
        <div class="pricing-card bg-gray-900/80 backdrop-blur rounded-lg shadow-lg border-2 border-green-400 p-8 relative">
          <!-- Popular Badge -->
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
          
          <div class="text-center">
            <h3 class="text-2xl font-bold text-white mb-2">Due Diligence</h3>
            <p class="text-gray-400 mb-6">Ideal for property investors</p>
            <div class="price-display mb-4">
              <span class="text-4xl font-bold text-green-400">$49.99</span>
              <span class="text-gray-400 text-lg">AUD</span>
            </div>
            <p class="text-sm text-green-400 font-semibold mb-4">Save $50! ($5 per report)</p>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">10 Property Reports</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">All Hazard Assessments</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Walkability Scores</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Bulk PDF Downloads</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Priority Support</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">6 Month Access</span>
            </li>
          </ul>
          
          <button class="btn-primary w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-black rounded-lg font-semibold transition-all duration-300">
            Get Due Diligence Package
          </button>
        </div>

        <!-- Professional Plan -->
        <div class="pricing-card bg-gray-900/80 backdrop-blur rounded-lg shadow-lg border border-gray-700 p-8 relative">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-white mb-2">Professional</h3>
            <p class="text-gray-400 mb-6">For serious property professionals</p>
            <div class="price-display mb-4">
              <span class="text-4xl font-bold text-green-400">$99.99</span>
              <span class="text-gray-400 text-lg">AUD</span>
            </div>
            <p class="text-sm text-green-400 font-semibold mb-4">Best Value! ($2 per report)</p>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">50 Property Reports</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold text-green-400">Map Portal Access</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Advanced Analytics</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">API Access</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">White-label Reports</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">Dedicated Support</span>
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-200">12 Month Access</span>
            </li>
          </ul>
          
          <button class="btn-primary w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-black rounded-lg font-semibold transition-all duration-300">
            Get Professional Plan
          </button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-20 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        
        <div class="space-y-6">
          <div class="bg-gray-900/60 backdrop-blur rounded-lg p-6 shadow-sm border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">What's included in a property report?</h3>
            <p class="text-gray-300">Each report includes comprehensive hazard assessments (flood, bushfire, noise, coastal erosion, acid sulfate), walkability scores, accessibility analysis, and property details in a downloadable PDF format.</p>
          </div>
          
          <div class="bg-gray-900/60 backdrop-blur rounded-lg p-6 shadow-sm border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">How long do credits last?</h3>
            <p class="text-gray-300">Single reports are valid for immediate use. Due Diligence packages include 6 months access, and Professional plans include 12 months access to use your credits.</p>
          </div>
          
          <div class="bg-gray-900/60 backdrop-blur rounded-lg p-6 shadow-sm border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">What is the Map Portal?</h3>
            <p class="text-gray-300">The Map Portal (available with Professional plan) provides interactive mapping tools, batch property analysis, advanced filtering, and real-time risk layer visualization for professional property analysis.</p>
          </div>
          
          <div class="bg-gray-900/60 backdrop-blur rounded-lg p-6 shadow-sm border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-2">Can I upgrade my plan?</h3>
            <p class="text-gray-300">Yes! You can upgrade at any time and we'll credit the difference towards your new plan. Contact our support team for assistance with upgrades.</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-20 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p class="text-xl text-gray-300 mb-8">Join thousands of investors making smarter property decisions</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/signup" class="btn-primary bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            Start Free Trial
          </NuxtLink>
          <NuxtLink to="/signin" class="btn-secondary border border-gray-600 text-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800/50 transition-all duration-300">
            Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page meta
useHead({
  title: 'Pricing Plans - CliQ Property Analysis',
  meta: [
    { name: 'description', content: 'Choose the perfect plan for your property analysis needs. Get comprehensive reports with hazard assessments and walkability scores.' },
    { name: 'keywords', content: 'property analysis, hazard assessment, walkability score, property reports, due diligence' }
  ]
})
</script>

<style scoped>
.products-page {
  position: relative;
}

.container {
  max-width: 1200px;
}

.pricing-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(74, 222, 128, 0.2);
}

.price-display {
  position: relative;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(74, 222, 128, 0.4);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card {
    margin-bottom: 20px;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .container {
    padding: 0 16px;
  }
}

/* Focus states for accessibility */
.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid #4ade80;
  outline-offset: 2px;
}

/* Animation for the popular badge */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.pricing-card .absolute span {
  animation: pulse 2s infinite;
}

/* Property Blueprint Background - matching index page */
.property-background {
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

.property-grid {
  animation: dataFlow 20s infinite alternate ease-in-out;
}
</style>
