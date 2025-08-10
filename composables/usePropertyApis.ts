// This composable handles all property-related API calls

interface PropertyDetails {
  lotplan: string;
  suburb: string;
  lot_area: number;
  parcel_typ: string;
  shire_name: string;
  lga_name: string;
  flood_risk: string | null;
  noise_desc: string | null;
  bushfire_desc: string | null;
  acid_sulph: string | null;
  erosion_desc: string | null;
  [key: string]: any; // Allow for additional properties
}

export function usePropertyApis() {
  const config = useRuntimeConfig()
  
  /**
   * Fetches all property details from coordinates using the merged endpoint
   */
  const fetchPropertyDetails = async (longitude: number, latitude: number): Promise<PropertyDetails | null> => {
    try {
      const response = await fetch(
        'https://mfratgltpabsyduhboap.supabase.co/rest/v1/rpc/get_merged_lotsuburb_details',
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
        console.error('Error fetching property details:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      // Check if we have valid data
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  };

  return {
    fetchPropertyDetails
  };
}
