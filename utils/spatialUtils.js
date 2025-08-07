import * as turf from '@turf/turf';

/**
 * Configuration for RPC endpoints
 */
const RPC_CONFIG = {
  baseUrl: 'http://localhost:54321/rest/v1/rpc',
  endpoints: {
    // Define all RPC endpoints and their response parsers here
    get_flood_risk: {
      // Function to parse the response data specifically for flood risk
      parseResponse: (data) => {
        if (Array.isArray(data) && data.length > 0 && data[0] && 'flood_risk' in data[0]) {
          return data[0].flood_risk;
        }
        return 'None';
      }
    },
    // SEIFA data endpoint configuration
    get_seifa_2021: {
      parseResponse: (data) => {
        // Return the first item in the array if it exists and has expected fields
        if (Array.isArray(data) && data.length > 0 && data[0]) {
          const seifaData = data[0];
          // Check if we have at least one of the expected fields
          if ('sal_name_2021' in seifaData || 'irsad_score' in seifaData) {
            return seifaData;
          }
        }
        return null;
      }
    },
    // Add more endpoints as needed, with their specific response parsers
    // Example:
    // get_landslide_risk: {
    //   parseResponse: (data) => {
    //     if (Array.isArray(data) && data.length > 0 && data[0] && 'landslide_risk' in data[0]) {
    //       return data[0].landslide_risk;
    //     }
    //     return 'None';
    //   }
    // },
  }
};

/**
 * Generic function to call any RPC endpoint with coordinates
 * 
 * @param {string} endpointName - The name of the RPC endpoint to call (e.g., 'get_flood_risk')
 * @param {Array} coordinates - Location coordinates in format [longitude, latitude]
 * @param {Object} additionalParams - Additional parameters to send to the endpoint (optional)
 * @returns {any} - The parsed response from the endpoint
 */
export const callSpatialRpc = async (endpointName, coordinates, additionalParams = {}) => {
  if (!coordinates || !coordinates.length || coordinates.length < 2) {
    console.error('Invalid coordinates for RPC call');
    return 'Invalid coordinates';
  }
  
  // Check if the endpoint is configured
  if (!RPC_CONFIG.endpoints[endpointName]) {
    console.error(`Unconfigured RPC endpoint: ${endpointName}`);
    return 'Endpoint not configured';
  }
  
  try {
    console.log(`Calling RPC ${endpointName} for coordinates:`, coordinates);
    
    // Extract longitude and latitude from coordinates
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    
    // Construct parameter string with long, lat and any additional parameters
    let paramString = `long=${longitude}&lat=${latitude}`;
    
    // Add any additional parameters
    for (const [key, value] of Object.entries(additionalParams)) {
      paramString += `&${key}=${encodeURIComponent(value)}`;
    }
    
    // Construct full API URL
    const apiUrl = `${RPC_CONFIG.baseUrl}/${endpointName}?${paramString}`;
    console.log('API URL:', apiUrl);
    
    // Make the API request
    const response = await fetch(apiUrl);
    
    console.log('API Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`Failed to call RPC endpoint ${endpointName}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    console.log(`${endpointName} API Response:`, data);
    
    // Use the endpoint-specific parser to extract the relevant data
    const parser = RPC_CONFIG.endpoints[endpointName].parseResponse;
    const result = parser ? parser(data) : data;
    
    console.log(`Parsed ${endpointName} result:`, result);
    return result;
    
  } catch (error) {
    console.error(`Error calling RPC endpoint ${endpointName}:`, error);
    return 'Error';
  }
};

/**
 * Fetches flood risk data for a specific location using RPC endpoint
 * 
 * @param {Array} coordinates - Location coordinates in format [longitude, latitude]
 * @returns {String} - Flood risk level ('High', 'Medium', 'Low', 'None', etc.)
 */
export const fetchFloodRiskData = async (coordinates) => {
  // Use the generic callSpatialRpc function with the 'get_flood_risk' endpoint
  return callSpatialRpc('get_flood_risk', coordinates);
};

/**
 * Fetches SEIFA data for a specific location using RPC endpoint
 * 
 * @param {Array} coordinates - Location coordinates in format [longitude, latitude]
 * @returns {Object|null} - SEIFA data object or null if not available
 */
export const fetchSeifaData = async (coordinates) => {
  // Use the generic callSpatialRpc function with the 'get_seifa_2021' endpoint
  return callSpatialRpc('get_seifa_2021', coordinates);
};

/**
 * Calculates the number of hospitals or other features within an isochrone polygon.
 * This function loads features within the isochrone's bounding box without changing layer visibility.
 * 
 * @param {Object} map - The MapLibre GL JS map instance
 * @param {String} isochroneSourceId - The ID of the isochrone source
 * @param {String} featureLayerId - The ID of the feature layer to query (e.g., 'hospitals-layer')
 * @returns {Number} - The count of features within the isochrone polygon
 */
export const countFeaturesWithinIsochrone = (map, isochroneSourceId, featureLayerId) => {
  if (!map || !map.getSource(isochroneSourceId)) {
    console.log('No isochrone source found');
    return 0;
  }

  try {
    // Get the isochrone polygon data
    const isochroneSource = map.getSource(isochroneSourceId);
    const isochroneData = isochroneSource._data;

    // If there's no isochrone data or it's not a proper GeoJSON, return 0
    if (!isochroneData || !isochroneData.features || !isochroneData.features.length) {
      console.log('No isochrone features found');
      return 0;
    }

    // Get the isochrone polygon
    const isochronePolygon = isochroneData.features[0];
    
    // Calculate the bounding box of the isochrone polygon for more efficient querying
    const bbox = turf.bbox(isochronePolygon);
    console.log('Isochrone bounding box:', bbox);
    
    // Get layer info to access the correct source
    const layerInfo = map.getLayer(featureLayerId);
    if (!layerInfo) {
      console.log(`Layer ${featureLayerId} not found`);
      return 0;
    }

    // Extract source info from layer
    const sourceId = layerInfo.source;
    const sourceLayer = layerInfo.sourceLayer || layerInfo['source-layer'];
    
    console.log(`Querying source: ${sourceId}, source-layer: ${sourceLayer}`);

    // For vector tile sources, query source features directly within the bbox
    if (map.getSource(sourceId).type === 'vector') {
      // Convert the bbox to a query window that Mapbox GL JS can understand
      // This ensures we only get features within or near the isochrone
      const sw = map.project([bbox[0], bbox[1]]);
      const ne = map.project([bbox[2], bbox[3]]);
      const queryWindow = [sw, ne];
      
      // Query options for vector tile source
      const queryOptions = {
        sourceLayer: sourceLayer,
        // Add the filter from the layer to match only relevant features
        filter: layerInfo.filter
      };
      
      // Get features from source within the query window
      const featuresInView = map.querySourceFeatures(sourceId, queryOptions);
      console.log(`Found ${featuresInView.length} features from vector source within bbox`);
      
      // Count features that are actually within the isochrone polygon (not just the bbox)
      let count = 0;
      // Use a Set to track unique feature IDs (avoid duplicates from multiple tiles)
      const uniqueIds = new Set();
      
      for (const feature of featuresInView) {
        if (!feature.geometry || !feature.geometry.coordinates) continue;
        
        // Create a unique ID from the feature's coordinates and properties to avoid duplicates
        const featureId = feature.id || 
                          `${feature.geometry.coordinates.join(',')}-${JSON.stringify(feature.properties).slice(0, 50)}`;
        
        // Skip if we've already counted this feature
        if (uniqueIds.has(featureId)) continue;
        uniqueIds.add(featureId);
        
        // Check if the point is inside the isochrone polygon
        const point = turf.point(feature.geometry.coordinates);
        if (turf.booleanPointInPolygon(point, isochronePolygon)) {
          count++;
        }
      }
      
      console.log(`Found ${count} unique ${featureLayerId} features within the isochrone polygon`);
      return count;
    } else {
      // For GeoJSON sources, use a different approach since we can directly access the data
      const source = map.getSource(sourceId);
      if (!source._data) {
        console.log('No source data available');
        return 0;
      }
      
      // Get all features from the GeoJSON source
      const features = source._data.features || [];
      console.log(`Found ${features.length} features in GeoJSON source`);
      
      // Apply the layer filter
      const filteredFeatures = layerInfo.filter ? 
        features.filter(feature => evaluateFilter(layerInfo.filter, feature.properties)) :
        features;
      
      // Count features within the isochrone polygon
      let count = 0;
      for (const feature of filteredFeatures) {
        if (!feature.geometry || !feature.geometry.coordinates) continue;
        
        const point = turf.point(feature.geometry.coordinates);
        if (turf.booleanPointInPolygon(point, isochronePolygon)) {
          count++;
        }
      }
      
      console.log(`Found ${count} ${featureLayerId} features within the isochrone polygon`);
      return count;
    }
    
  } catch (error) {
    console.error(`Error calculating ${featureLayerId} within isochrone:`, error);
    return 0;
  }
};

/**
 * Evaluates if a feature matches a Mapbox GL filter expression
 * Simplified implementation for basic filters
 */
function evaluateFilter(filter, properties) {
  if (!filter) return true;
  
  const operator = filter[0];
  
  // Handle 'any' operator
  if (operator === 'any') {
    return filter.slice(1).some(subFilter => evaluateFilter(subFilter, properties));
  }
  
  // Handle 'all' operator
  if (operator === 'all') {
    return filter.slice(1).every(subFilter => evaluateFilter(subFilter, properties));
  }
  
  // Handle 'in' operator with get expression
  if (operator === 'in' && Array.isArray(filter[2]) && filter[2][0] === 'get') {
    const value = filter[1];
    const propName = filter[2][1];
    const propValue = properties[propName];
    
    // Handle array properties (like categories)
    if (typeof propValue === 'string' && propValue.includes('[')) {
      try {
        const parsed = JSON.parse(propValue);
        return Array.isArray(parsed) ? parsed.includes(value) : String(propValue).includes(value);
      } catch (e) {
        return String(propValue).includes(value);
      }
    }
    return String(propValue).includes(value);
  }
  
  // Handle equality
  if (operator === '==') {
    const propName = filter[1];
    const value = filter[2];
    return properties[propName] === value;
  }
  
  return true;
}

/**
 * Calculate distance between two coordinates
 * @param {Array} coord1 - First coordinate [lng, lat]
 * @param {Array} coord2 - Second coordinate [lng, lat]
 * @returns {Number} - Euclidean distance between coordinates
 */
export const calculateDistance = (coord1, coord2) => {
  // Simple Euclidean distance calculation
  const dx = coord1[0] - coord2[0];
  const dy = coord1[1] - coord2[1];
  return Math.sqrt(dx * dx + dy * dy);
};