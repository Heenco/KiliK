// This composable handles all property-related API calls

interface LotDetails {
  lot: string;
  plan: string;
  lotplan: string;
  tenure: string;
  lot_area: number;
  locality: string;
  shire_name: string;
  smis_map: string;
  [key: string]: any; // Allow for additional properties
}

export function usePropertyApis() {
  const config = useRuntimeConfig()
  
  /**
   * Fetches lot details from coordinates
   */
  const fetchLotDetails = async (longitude: number, latitude: number): Promise<LotDetails | null> => {
    try {
      const response = await fetch(
        'https://mfratgltpabsyduhboap.supabase.co/rest/v1/rpc/get_lot_details',
        {
          method: 'POST',
          headers: {
            'apikey': config.public.SUPABASE_KEY,
            'Authorization': `Bearer ${config.public.SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lat: latitude,
            lon: longitude
          })
        }
      );
      
      if (!response.ok) {
        console.error('Error fetching lot details:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      // Check if we have valid data
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching lot details:', error);
      return null;
    }
  };

  /**
   * Fetches flood risk data using lotdp_input
   */
  const fetchFloodRisk = async (lotdpInput: string): Promise<Array<{ flood_risk: string; flood_type: string }> | null> => {
    try {
      const response = await fetch(
        `http://supabase.heenco.com:54321/rest/v1/rpc/get_flood_mapping_by_lot?lotplan_input=${lotdpInput}`
      );
      
      if (!response.ok) {
        console.error('Error fetching flood risk:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      // Validate response
      if (Array.isArray(data)) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching flood risk:', error);
      return null;
    }
  };

  /**
   * Fetches bushfire risk data using lotdp_input
   */
  const fetchBushfireRisk = async (lotdpInput: string): Promise<Array<{ description: string }> | null> => {
    try {
      const response = await fetch(
        `http://supabase.heenco.com:54321/rest/v1/rpc/get_bushfire_by_lot?lotplan_input=${lotdpInput}`
      );

      if (!response.ok) {
        console.error('Error fetching bushfire risk:', response.statusText);
        return null;
      }

      const data = await response.json();

      // Validate response
      if (Array.isArray(data)) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching bushfire risk:', error);
      return null;
    }
  };

  /**
   * Fetches noise risk data using lotdp_input
   */
  const fetchNoiseRisk = async (lotdpInput: string): Promise<Array<{ description: string }> | null> => {
    try {
      const response = await fetch(
        `http://supabase.heenco.com:54321/rest/v1/rpc/get_noise_by_lot?lotplan_input=${lotdpInput}`
      );

      if (!response.ok) {
        console.error('Error fetching noise risk:', response.statusText);
        return null;
      }

      const data = await response.json();

      // Validate response
      if (Array.isArray(data)) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching noise risk:', error);
      return null;
    }
  };

  /**
   * Fetches coastal erosion risk data using lotdp_input
   */
  const fetchCoastalErosionRisk = async (lotdpInput: string): Promise<Array<{ ovl2_desc: string }> | null> => {
    try {
      const response = await fetch(
        `http://supabase.heenco.com:54321/rest/v1/rpc/get_erosion_by_lot?lotplan_input=${lotdpInput}`
      );

      if (!response.ok) {
        console.error('Error fetching coastal erosion risk:', response.statusText);
        return null;
      }

      const data = await response.json();

      // Validate response
      if (Array.isArray(data)) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching coastal erosion risk:', error);
      return null;
    }
  };

  /**
   * Fetches acid sulfate risk data using lotdp_input
   */
  const fetchAcidSulfateRisk = async (lotdpInput: string): Promise<Array<{ acid_sulph: string }> | null> => {
    try {
      const response = await fetch(
        `http://supabase.heenco.com:54321/rest/v1/rpc/get_acid_sulfate_by_lot?lotplan_input=${lotdpInput}`
      );

      if (!response.ok) {
        console.error('Error fetching acid sulfate risk:', response.statusText);
        return null;
      }

      const data = await response.json();

      // Validate response
      if (Array.isArray(data)) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching acid sulfate risk:', error);
      return null;
    }
  };

  return {
    fetchLotDetails,
    fetchFloodRisk,
    fetchBushfireRisk,
    fetchNoiseRisk,
    fetchCoastalErosionRisk,
    fetchAcidSulfateRisk
  };
}
