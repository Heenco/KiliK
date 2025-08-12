<template>
  <div class="pdf-page">
    <!-- Property Title Section -->
    <div class="property-header">
      <div class="title-section">
        <h1 class="report-title">Property Fact Pack</h1>
        <div class="property-info">
          <h2 class="property-address">{{ address.split(',')[0] || 'Property Address' }}</h2>
          <p class="property-location">{{ address.split(',').slice(1).join(',') || 'Location details' }}</p>
        </div>
        <div class="brand-mark">CliQ</div>
      </div>
    </div>

    <!-- Map Background Section -->
    <div class="map-background">
      <div class="map-overlay"></div>
    </div>

    <!-- Key Indicators Bar -->
    <div class="indicators-bar">
      <div class="indicator-item">
        <div class="indicator-icon">🏠</div>
        <span class="indicator-label">Easements</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">💧</div>
        <span class="indicator-label">Flooding</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">🌊</div>
        <span class="indicator-label">Overland Flow Flooding</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">📚</div>
        <span class="indicator-label">Flood History</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">🛡️</div>
        <span class="indicator-label">Flood Coastal</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">📋</div>
        <span class="indicator-label">Flood Planning</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">🏘️</div>
        <span class="indicator-label">Character</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">🖼️</div>
        <span class="indicator-label">Historic Imagery</span>
      </div>
      <div class="indicator-item">
        <div class="indicator-icon">🌿</div>
        <span class="indicator-label">Vegetation</span>
      </div>
    </div>

    <!-- At a Glance Section -->
    <div class="at-glance-section">
      <h3 class="section-title">At a glance</h3>
      <p class="section-description">
        This report provides important property information and identifies the common considerations when buying property, building or renovating.
      </p>
      
      <div class="glance-grid">
        <div class="glance-column">
          <!-- Risk Categories -->
          <div class="risk-categories">
            <div class="risk-item status-no-issues">
              <div class="risk-icon">🏠</div>
              <span class="risk-label">Easements</span>
              <div class="status-badge status-clear">
                <span class="status-icon">✓</span>
                <span class="status-text">NO CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-considerations">
              <div class="risk-icon">💧</div>
              <span class="risk-label">Flooding</span>
              <div class="status-badge status-warning">
                <span class="status-icon">!</span>
                <span class="status-text">CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-considerations">
              <div class="risk-icon">🏘️</div>
              <span class="risk-label">Character</span>
              <div class="status-badge status-warning">
                <span class="status-icon">!</span>
                <span class="status-text">CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-considerations">
              <div class="risk-icon">🌿</div>
              <span class="risk-label">Vegetation</span>
              <div class="status-badge status-warning">
                <span class="status-icon">!</span>
                <span class="status-text">CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-no-issues">
              <div class="risk-icon">🌍</div>
              <span class="risk-label">Environment</span>
              <div class="status-badge status-clear">
                <span class="status-icon">✓</span>
                <span class="status-text">NO CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-no-issues">
              <div class="risk-icon">🔥</div>
              <span class="risk-label">Bushfire</span>
              <div class="status-badge status-clear">
                <span class="status-icon">✓</span>
                <span class="status-text">NO CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>

            <div class="risk-item status-considerations">
              <div class="risk-icon">🔊</div>
              <span class="risk-label">Noise</span>
              <div class="status-badge status-warning">
                <span class="status-icon">!</span>
                <span class="status-text">CONSIDERATIONS IDENTIFIED</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glance-column">
          <!-- Property Details -->
          <div class="property-details">
            <div class="detail-group">
              <h4 class="detail-title">DATE OF REPORT</h4>
              <p class="detail-value">{{ new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
            </div>

            <div class="detail-group">
              <h4 class="detail-title">ADDRESS</h4>
              <p class="detail-value">{{ address.split(',')[0]?.toUpperCase() || '26 LANDSDOWNE STREET' }}</p>
            </div>

            <div class="detail-group" v-if="property.lotDetails">
              <h4 class="detail-title">LOT/PLAN</h4>
              <p class="detail-value">{{ property.lotDetails.lotplan || '6/RP125588' }}</p>
            </div>

            <div class="detail-group" v-if="property.lotDetails">
              <h4 class="detail-title">COUNCIL</h4>
              <p class="detail-value">{{ property.lotDetails.shire_name || 'Brisbane' }}</p>
            </div>

            <div class="detail-group">
              <h4 class="detail-title">ZONING</h4>
              <p class="detail-value">- Character Residential</p>
              <p class="detail-value small">(Infill Housing)</p>
            </div>

            <div class="detail-group">
              <h4 class="detail-title">UTILITIES</h4>
              <ul class="utility-list">
                <li>• Power</li>
                <li>• Sewer</li>
                <li>• Water</li>
              </ul>
            </div>

            <div class="detail-group">
              <h4 class="detail-title">SCHOOL CATCHMENTS</h4>
              <ul class="school-list">
                <li>• Coorparoo SS</li>
                <li>• Coorparoo Secondary College</li>
              </ul>
            </div>

            <div class="detail-group">
              <h4 class="detail-title">CLOSEST CITY</h4>
              <p class="detail-value">Brisbane - 3km</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analysis Cards -->
    <div class="analysis-section">
      <h3 class="section-title">Detailed Analysis</h3>
      
      <div class="cards-grid">
        <!-- Hazard Card -->
        <div class="pdf-card">
          <HazardCard />
        </div>

        <!-- Accessibility Card -->
        <div class="pdf-card">
          <AccessibilityCard />
        </div>

        <!-- Safety Card -->
        <div class="pdf-card">
          <SafetyCard />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pdf-footer">
      <div class="footer-left">
        <p class="footer-title">PROPERTY DUE DILIGENCE REPORT</p>
        <p class="footer-address">| {{ address.split(',')[0]?.toUpperCase() || '26 LANDSDOWNE STREET' }}</p>
      </div>
      <div class="footer-right">
        <span class="footer-brand">CliQ</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyData } from '~/composables/usePropertyData'
import HazardCard from '@/components/HazardCard.vue'
import AccessibilityCard from '@/components/AccessibilityCard.vue'
import SafetyCard from '~/components/SafetyCard.vue'

// Use PDF layout to exclude header
definePageMeta({
  layout: 'pdf'
})

const route = useRoute()
const address = ref(route.query.address || 'Sample Property Address, Brisbane QLD 4000')

// Initialize property data
const { property } = usePropertyData({
  address: '',
  lotDetails: null,
})

// Set page title for PDF
useHead({
  title: `Property Report - ${address.value}`,
  meta: [
    { name: 'description', content: `Property report for ${address.value}` }
  ]
})
</script>

<style scoped>
.pdf-page {
  font-family: 'Arial', sans-serif;
  color: #000;
  background: #fff;
  max-width: 210mm;
  margin: 0 auto;
  line-height: 1.4;
  position: relative;
}

/* PDF Page */
.pdf-page {
  font-family: 'Arial', sans-serif;
  color: #000;
  background: #fff;
  max-width: 210mm;
  margin: 0 auto;
  line-height: 1.4;
  position: relative;
}

/* Property Header */
.property-header {
  background: #fff;
  padding: 10mm 20mm 8mm 20mm;
  position: relative;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8mm;
}

.report-title {
  font-size: 24px;
  font-weight: bold;
  color: #1a365d;
  margin: 0;
  line-height: 1.2;
}

.property-info {
  flex: 1;
  margin: 0 15mm;
}

.property-address {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin: 0 0 3px 0;
  line-height: 1.2;
}

.property-location {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.brand-mark {
  font-size: 28px;
  font-weight: bold;
  color: #1a365d;
  letter-spacing: -1px;
}

/* Map Background */
.map-background {
  height: 25mm;
  background: linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%);
  position: relative;
  margin: 0 20mm;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10,10 Q50,5 90,10 Q95,50 90,90 Q50,95 10,90 Q5,50 10,10" fill="none" stroke="%23059669" stroke-width="0.5" opacity="0.3"/><path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="%233b82f6" stroke-width="0.3" opacity="0.4"/></svg>') center/cover;
}

/* Indicators Bar */
.indicators-bar {
  background: #1a365d;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 20mm;
  margin: 0 20mm;
  border-radius: 0 0 20px 20px;
}

.indicator-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 9px;
  text-align: center;
  min-width: 45px;
}

.indicator-icon {
  font-size: 14px;
  margin-bottom: 3px;
  filter: brightness(0) invert(1);
}

.indicator-label {
  font-weight: 500;
  line-height: 1.1;
}

/* At a Glance Section */
.at-glance-section {
  background: #f0f9ff;
  margin: 10mm 20mm;
  padding: 12mm;
  border-radius: 8px;
  position: relative;
  page-break-inside: avoid;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #1a365d;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 13px;
  color: #374151;
  margin: 0 0 15mm 0;
  line-height: 1.4;
}

.glance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20mm;
}

/* Risk Categories */
.risk-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.risk-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.risk-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  min-width: 75px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 9px;
  font-weight: bold;
  flex: 1;
  justify-content: center;
}

.status-clear {
  background: #d1fae5;
  color: #065f46;
}

.status-warning {
  background: #3b82f6;
  color: #fff;
}

.status-icon {
  font-size: 10px;
  font-weight: bold;
}

.status-text {
  font-size: 8px;
  letter-spacing: 0.3px;
}

/* Property Details */
.property-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-group {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
}

.detail-group:last-child {
  border-bottom: none;
}

.detail-title {
  font-size: 10px;
  font-weight: bold;
  color: #6b7280;
  margin: 0 0 3px 0;
  letter-spacing: 0.3px;
}

.detail-value {
  font-size: 12px;
  color: #000;
  margin: 0;
  font-weight: 500;
}

.detail-value.small {
  font-size: 10px;
  color: #6b7280;
  margin-top: 1px;
}

.utility-list,
.school-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.utility-list li,
.school-list li {
  font-size: 12px;
  color: #000;
  margin: 1px 0;
  font-weight: 500;
}

/* Analysis Section */
.analysis-section {
  margin: 10mm 20mm;
  page-break-before: auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8mm;
  margin-top: 8mm;
}

.pdf-card {
  page-break-inside: avoid;
  break-inside: avoid;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  min-height: 120mm;
}

/* Override card styles for PDF */
.pdf-card :deep(.bg-gray-800),
.pdf-card :deep(.bg-gray-900) {
  background: #fff !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 15px !important;
  box-shadow: none !important;
}

.pdf-card :deep(.text-white) {
  color: #000 !important;
}

.pdf-card :deep(.text-gray-300) {
  color: #374151 !important;
}

.pdf-card :deep(.text-gray-400) {
  color: #6b7280 !important;
}

.pdf-card :deep(.text-gray-100) {
  color: #111827 !important;
}

.pdf-card :deep(.text-gray-600) {
  color: #4b5563 !important;
}

.pdf-card :deep(.bg-gray-600\/50) {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

.pdf-card :deep(.text-blue-400) {
  color: #1d4ed8 !important;
}

.pdf-card :deep(.text-green-400) {
  color: #047857 !important;
}

.pdf-card :deep(.text-yellow-400) {
  color: #d97706 !important;
}

.pdf-card :deep(.text-red-400) {
  color: #dc2626 !important;
}

.pdf-card :deep(.text-orange-300) {
  color: #ea580c !important;
}

.pdf-card :deep(.text-orange-400) {
  color: #ea580c !important;
}

.pdf-card :deep(.text-orange-500) {
  color: #f97316 !important;
}

.pdf-card :deep(.text-red-500) {
  color: #ef4444 !important;
}

.pdf-card :deep(.bg-blue-400\/20) {
  background: #dbeafe !important;
  color: #1d4ed8 !important;
}

.pdf-card :deep(.bg-green-400\/20) {
  background: #d1fae5 !important;
  color: #047857 !important;
}

.pdf-card :deep(.bg-yellow-400\/20) {
  background: #fef3c7 !important;
  color: #d97706 !important;
}

.pdf-card :deep(.bg-red-400\/20) {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

.pdf-card :deep(.bg-orange-300\/20) {
  background: #fed7aa !important;
  color: #ea580c !important;
}

.pdf-card :deep(.bg-orange-400\/20) {
  background: #fed7aa !important;
  color: #ea580c !important;
}

.pdf-card :deep(.bg-orange-500\/20) {
  background: #fed7aa !important;
  color: #f97316 !important;
}

.pdf-card :deep(.bg-red-500\/20) {
  background: #fecaca !important;
  color: #ef4444 !important;
}

/* Hide interactive elements */
.pdf-card :deep(button),
.pdf-card :deep(.cursor-pointer) {
  display: none !important;
}

.pdf-card :deep(.hover\\:shadow-blue) {
  box-shadow: none !important;
}

.pdf-card :deep(.transition-all) {
  transition: none !important;
}

/* Footer */
.pdf-footer {
  background: #1a365d;
  color: #fff;
  padding: 6px 20mm;
  margin: 15mm 20mm 0 20mm;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-title {
  font-weight: bold;
  margin: 0;
}

.footer-address {
  margin: 0;
  font-weight: normal;
}

.footer-right {
  display: flex;
  align-items: center;
}

.footer-brand {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: -0.5px;
}

/* Print styles */
@media print {
  /* Suppress browser headers and footers */
  @page {
    margin: 8mm;
    size: A4;
  }
  
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
  }
  
  .pdf-page {
    margin: 0;
    padding: 0;
    max-width: none;
  }
  
  .property-header {
    padding: 8mm 15mm 6mm 15mm;
  }
  
  .at-glance-section {
    margin: 8mm 15mm;
    padding: 10mm;
    page-break-inside: avoid;
  }
  
  .analysis-section {
    margin: 8mm 15mm;
    page-break-before: auto;
  }
  
  .cards-grid {
    page-break-inside: avoid;
    grid-template-columns: 1fr;
    gap: 6mm;
  }
  
  .pdf-card {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 6mm;
    min-height: auto;
  }
  
  .map-background {
    margin: 0 15mm;
    height: 20mm;
  }
  
  .indicators-bar {
    margin: 0 15mm;
    padding: 4px 15mm;
  }
  
  .pdf-footer {
    margin: 10mm 15mm 0 15mm;
    page-break-inside: avoid;
  }
}

/* Force white background for PDF and suppress print headers */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* Additional print optimization */
@media print {
  /* Hide any potential browser UI elements */
  header, nav, .header, .navigation {
    display: none !important;
  }
  
  /* Ensure clean page breaks */
  .pdf-page {
    page-break-before: auto;
    page-break-after: auto;
  }
}
</style>
