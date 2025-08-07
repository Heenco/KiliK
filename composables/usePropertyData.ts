import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyApis } from './usePropertyApis';

export function usePropertyData(defaultProperty: any) {
  const route = useRoute();
  const { 
    fetchLotDetails, 
    fetchFloodRisk, 
    fetchBushfireRisk, 
    fetchNoiseRisk, 
    fetchCoastalErosionRisk,
    fetchAcidSulfateRisk 
  } = usePropertyApis();
  
  const addressParam = computed(() => route.query.address as string || '');
  const latParam = computed(() => route.query.lat ? Number(route.query.lat) : null);
  const lngParam = computed(() => route.query.lng ? Number(route.query.lng) : null);

  const property = ref({ 
    ...defaultProperty, 
    address: addressParam.value || defaultProperty.address,
    lotDetails: null,
    floodRisk: [],
    bushfireRisk: null,
    noiseRisk: null,
    coastalErosionRisk: null,
    acidSulfateRisk: null
  });
  
  const isLoadingLotDetails = ref(false);
  const isLoadingFloodRisk = ref(false);
  const isLoadingBushfireRisk = ref(false);
  const isLoadingNoiseRisk = ref(false);
  const isLoadingCoastalErosionRisk = ref(false);
  const isLoadingAcidSulfateRisk = ref(false);
  const lotDetailsError = ref<string | null>(null);
  const floodRiskError = ref<string | null>(null);
  const bushfireRiskError = ref<string | null>(null);
  const noiseRiskError = ref<string | null>(null);
  const coastalErosionRiskError = ref<string | null>(null);
  const acidSulfateRiskError = ref<string | null>(null);

  // Watch for address changes
  watch(() => addressParam.value, () => {
    property.value.address = addressParam.value || defaultProperty.address;
  });

  // Function to load lot details when coordinates are available
  const loadLotDetails = async () => {
    if (!lngParam.value || !latParam.value) return;
    
    try {
      isLoadingLotDetails.value = true;
      lotDetailsError.value = null;
      
      const details = await fetchLotDetails(lngParam.value, latParam.value);
      
      if (details) {
        property.value.lotDetails = details;
        await loadFloodRisk(details.lotplan);
        await loadBushfireRisk(details.lotplan); // Load bushfire risk data
        await loadNoiseRisk(details.lotplan); // Load noise risk data
        await loadCoastalErosionRisk(details.lotplan); // Load coastal erosion risk data
        await loadAcidSulfateRisk(details.lotplan); // Load acid sulfate risk data
      }
    } catch (error) {
      console.error('Failed to load lot details:', error);
      lotDetailsError.value = 'Failed to load property details';
    } finally {
      isLoadingLotDetails.value = false;
    }
  };  // Function to load flood risk data
  const loadFloodRisk = async (lotdpInput: string) => {
    if (!lotdpInput) return;
    
    try {
      isLoadingFloodRisk.value = true;
      floodRiskError.value = null;
      
      const floodRiskData = await fetchFloodRisk(lotdpInput);
      
      if (floodRiskData && floodRiskData.length > 0) {
        // Store the full flood risk data including risk level and type
        property.value.floodRisk = floodRiskData;
          // Also determine the highest risk level for display
        const riskLevels: Record<string, number> = {
          'low': 1,
          'medium': 2,
          'high': 3
        };
        
        let highestRiskItem = floodRiskData[0];
        
        // Find the highest risk level
        for (const item of floodRiskData) {
          const riskLower = item.flood_risk.toLowerCase();
          const highestRiskLower = highestRiskItem.flood_risk.toLowerCase();
          
          const currentRiskLevel = riskLevels[riskLower] || 0;
          const highestRiskLevel = riskLevels[highestRiskLower] || 0;
          
          if (currentRiskLevel > highestRiskLevel) {
            highestRiskItem = item;
          }
        }
        
        // Add the highest risk to the property object
        property.value.highestFloodRisk = highestRiskItem;
      }
    } catch (error) {
      console.error('Failed to load flood risk:', error);
      floodRiskError.value = 'Failed to load flood risk data';
    } finally {
      isLoadingFloodRisk.value = false;
    }
  };

  // Function to load bushfire risk data
  const loadBushfireRisk = async (lotdpInput: string) => {
    if (!lotdpInput) return;

    try {
      isLoadingBushfireRisk.value = true;
      bushfireRiskError.value = null;

      const bushfireRiskData = await fetchBushfireRisk(lotdpInput);

      if (bushfireRiskData && bushfireRiskData.length > 0) {
        property.value.bushfireRisk = bushfireRiskData;
        property.value.highestBushfireRisk = bushfireRiskData[0];
      }
    } catch (error) {
      console.error('Failed to load bushfire risk:', error);
      bushfireRiskError.value = 'Failed to load bushfire risk data';
    } finally {
      isLoadingBushfireRisk.value = false;
    }
  };

  // Function to load noise risk data
  const loadNoiseRisk = async (lotdpInput: string) => {
    if (!lotdpInput) return;

    try {
      isLoadingNoiseRisk.value = true;
      noiseRiskError.value = null;

      const noiseRiskData = await fetchNoiseRisk(lotdpInput);

      if (noiseRiskData && noiseRiskData.length > 0) {
        property.value.noiseRisk = noiseRiskData;
        property.value.highestNoiseRisk = noiseRiskData[0];
      }
    } catch (error) {
      console.error('Failed to load noise risk:', error);
      noiseRiskError.value = 'Failed to load noise risk data';
    } finally {
      isLoadingNoiseRisk.value = false;
    }
  };

  // Function to load coastal erosion risk data
  const loadCoastalErosionRisk = async (lotdpInput: string) => {
    if (!lotdpInput) return;

    try {
      isLoadingCoastalErosionRisk.value = true;
      coastalErosionRiskError.value = null;

      const coastalErosionRiskData = await fetchCoastalErosionRisk(lotdpInput);

      if (coastalErosionRiskData && coastalErosionRiskData.length > 0) {
        property.value.coastalErosionRisk = coastalErosionRiskData;
        property.value.highestCoastalErosionRisk = coastalErosionRiskData[0];
      }
    } catch (error) {
      console.error('Failed to load coastal erosion risk:', error);
      coastalErosionRiskError.value = 'Failed to load coastal erosion risk data';
    } finally {
      isLoadingCoastalErosionRisk.value = false;
    }
  };

  // Function to load acid sulfate risk data
  const loadAcidSulfateRisk = async (lotdpInput: string) => {
    if (!lotdpInput) return;

    try {
      isLoadingAcidSulfateRisk.value = true;
      acidSulfateRiskError.value = null;

      const acidSulfateRiskData = await fetchAcidSulfateRisk(lotdpInput);

      if (acidSulfateRiskData && acidSulfateRiskData.length > 0) {
        property.value.acidSulfateRisk = acidSulfateRiskData;
        property.value.highestAcidSulfateRisk = acidSulfateRiskData[0];
      }
    } catch (error) {
      console.error('Failed to load acid sulfate risk:', error);
      acidSulfateRiskError.value = 'Failed to load acid sulfate risk data';
    } finally {
      isLoadingAcidSulfateRisk.value = false;
    }
  };

  // Load lot details on component mount if coordinates are available
  onMounted(() => {
    if (lngParam.value && latParam.value) {
      loadLotDetails();
    }
  });

  // Expose values and functions
  return {
    property,
    addressParam,
    latParam,
    lngParam,
    isLoadingLotDetails,
    isLoadingFloodRisk,
    isLoadingBushfireRisk,
    isLoadingNoiseRisk,
    isLoadingCoastalErosionRisk,
    isLoadingAcidSulfateRisk,
    lotDetailsError,
    floodRiskError,
    bushfireRiskError,
    noiseRiskError,
    coastalErosionRiskError,
    acidSulfateRiskError,
    loadLotDetails,
    loadFloodRisk,
    loadBushfireRisk,
    loadNoiseRisk,
    loadCoastalErosionRisk,
    loadAcidSulfateRisk
  };
}
