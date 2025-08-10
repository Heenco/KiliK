import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyApis } from './usePropertyApis';

export function usePropertyData(defaultProperty: any) {
  const route = useRoute();
  const { fetchPropertyDetails } = usePropertyApis();
  
  const addressParam = computed(() => route.query.address as string || '');
  const latParam = computed(() => route.query.lat ? Number(route.query.lat) : null);
  const lngParam = computed(() => route.query.lng ? Number(route.query.lng) : null);

  const property = ref({ 
    ...defaultProperty, 
    address: addressParam.value || defaultProperty.address,
    lotDetails: null,
    floodRisk: null,
    bushfireRisk: null,
    noiseRisk: null,
    coastalErosionRisk: null,
    acidSulfateRisk: null
  });
  
  const isLoadingPropertyDetails = ref(false);
  const propertyDetailsError = ref<string | null>(null);

  // Watch for address changes
  watch(() => addressParam.value, () => {
    property.value.address = addressParam.value || defaultProperty.address;
  });

  // Function to load all property details when coordinates are available
  const loadPropertyDetails = async () => {
    if (!lngParam.value || !latParam.value) return;
    
    try {
      isLoadingPropertyDetails.value = true;
      propertyDetailsError.value = null;
      
      const details = await fetchPropertyDetails(lngParam.value, latParam.value);
      
      if (details) {
        // Map the merged API response to individual property fields
        property.value.lotDetails = {
          lotplan: details.lotplan,
          suburb: details.suburb,
          lot_area: details.lot_area,
          parcel_typ: details.parcel_typ,
          shire_name: details.shire_name,
          lga_name: details.lga_name
        };
        
        // Set individual risk data
        property.value.floodRisk = details.flood_risk ? [{ flood_risk: details.flood_risk, flood_type: 'Unknown' }] : [];
        property.value.bushfireRisk = details.bushfire_desc ? [{ description: details.bushfire_desc }] : null;
        property.value.noiseRisk = details.noise_desc ? [{ description: details.noise_desc }] : null;
        property.value.coastalErosionRisk = details.erosion_desc ? [{ ovl2_desc: details.erosion_desc }] : null;
        property.value.acidSulfateRisk = details.acid_sulph ? [{ acid_sulph: details.acid_sulph }] : null;
        
        // Set highest risk items for backward compatibility
        if (property.value.floodRisk.length > 0) {
          property.value.highestFloodRisk = property.value.floodRisk[0];
        }
        if (property.value.bushfireRisk) {
          property.value.highestBushfireRisk = property.value.bushfireRisk[0];
        }
        if (property.value.noiseRisk) {
          property.value.highestNoiseRisk = property.value.noiseRisk[0];
        }
        if (property.value.coastalErosionRisk) {
          property.value.highestCoastalErosionRisk = property.value.coastalErosionRisk[0];
        }
        if (property.value.acidSulfateRisk) {
          property.value.highestAcidSulfateRisk = property.value.acidSulfateRisk[0];
        }
      }
    } catch (error) {
      console.error('Failed to load property details:', error);
      propertyDetailsError.value = 'Failed to load property details';
    } finally {
      isLoadingPropertyDetails.value = false;
    }
  };

  // Legacy functions for backward compatibility - these now just call loadPropertyDetails
  const loadLotDetails = loadPropertyDetails;
  const loadFloodRisk = (lotdpInput: string) => loadPropertyDetails();
  const loadBushfireRisk = (lotdpInput: string) => loadPropertyDetails();
  const loadNoiseRisk = (lotdpInput: string) => loadPropertyDetails();
  const loadCoastalErosionRisk = (lotdpInput: string) => loadPropertyDetails();
  const loadAcidSulfateRisk = (lotdpInput: string) => loadPropertyDetails();

  // Load property details on component mount if coordinates are available
  onMounted(() => {
    if (lngParam.value && latParam.value) {
      loadPropertyDetails();
    }
  });

  // Expose values and functions
  return {
    property,
    addressParam,
    latParam,
    lngParam,
    isLoadingLotDetails: isLoadingPropertyDetails,
    isLoadingFloodRisk: isLoadingPropertyDetails,
    isLoadingBushfireRisk: isLoadingPropertyDetails,
    isLoadingNoiseRisk: isLoadingPropertyDetails,
    isLoadingCoastalErosionRisk: isLoadingPropertyDetails,
    isLoadingAcidSulfateRisk: isLoadingPropertyDetails,
    lotDetailsError: propertyDetailsError,
    floodRiskError: propertyDetailsError,
    bushfireRiskError: propertyDetailsError,
    noiseRiskError: propertyDetailsError,
    coastalErosionRiskError: propertyDetailsError,
    acidSulfateRiskError: propertyDetailsError,
    loadLotDetails,
    loadFloodRisk,
    loadBushfireRisk,
    loadNoiseRisk,
    loadCoastalErosionRisk,
    loadAcidSulfateRisk,
    loadPropertyDetails
  };
}
