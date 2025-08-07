import * as turf from '@turf/turf';

export function useWalkabilityScore() {
  // Helper: Haversine distance in meters
  const getDistance = (from, to) => {
    return turf.distance(turf.point(from), turf.point(to), { units: 'meters' });
  };  // Categories and their OSM tags
  const amenityCategories = {
    grocery: [
      { key: 'shop', values: ['supermarket', 'grocery', 'convenience', 'bakery', 'butcher', 'greengrocer', 'deli', 'farm', 'organic', 'spices', 'wine', 'alcohol', 'beverages'] }
    ],
    dining: [
      { key: 'amenity', values: ['restaurant', 'cafe', 'fast_food', 'bar', 'pub'] }
    ],
    parks: [
      { key: 'leisure', values: ['park', 'garden'] },
      { key: 'landuse', values: ['recreation_ground'] }
    ],
    schools: [
      { key: 'amenity', values: ['school', 'university', 'kindergarten'] }
    ],
    retail: [
      { key: 'shop', values: ['clothes', 'department_store', 'mall', 'shoes', 'variety_store', 'electronics', 'furniture', 'books', 'toys', 'sports', 'jewelry', 'gift', 'beauty', 'cosmetics', 'pharmacy', 'optician', 'mobile_phone', 'computer', 'hardware', 'doityourself'] }
    ],
    transit: [
      { key: 'amenity', values: ['bus_station', 'ferry_terminal'] },
      { key: 'public_transport', values: ['station', 'stop_position'] },
      { key: 'railway', values: ['station', 'halt', 'tram_stop'] },
      { key: 'highway', values: ['bus_stop'] }
    ]
  };
  // Max points per category
  const CATEGORY_MAX = 20;
  // Only count amenities within 2 miles (3218 meters)
  const MAX_DIST = 2000;
  // Max amenities per category to consider
  const MAX_AMENITIES = 10;

  // Score a single amenity by distance (closer = higher score)
  const amenityScore = (dist) => {
    if (dist > MAX_DIST) return 0;
    // Linear decay: 1.0 at 0m, 0 at MAX_DIST
    return 1 - dist / MAX_DIST;
  };

  // Main function to get walkability score data
  const getWalkabilityScore = async (isochroneCoordinates) => {
    try {
      // Use centroid of isochrone as origin
      const polygon = turf.polygon(isochroneCoordinates);
      const centroid = turf.centroid(polygon).geometry.coordinates;      // Create Overpass query
      const formatPolygonForOverpass = (coordinates) => coordinates[0].map(coord => `${coord[1]} ${coord[0]}`).join(' ');
      const formattedCoords = formatPolygonForOverpass(isochroneCoordinates);
      const query = `[out:json][timeout:300];nwr[~"^(amenity|shop|leisure|landuse|public_transport|railway|highway)$"~".*"](poly:"${formattedCoords}");out center;`;
      const apiUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Overpass API response error: ${response.status}`);
      const data = await response.json();
      const elements = data.elements || [];      // Categorize amenities
      const found = { grocery: [], dining: [], parks: [], schools: [], retail: [], transit: [] };
      elements.forEach(el => {
        const tags = el.tags || {};
        for (const cat in amenityCategories) {
          for (const filter of amenityCategories[cat]) {
            if (tags[filter.key] && filter.values.includes(tags[filter.key])) {
              // Use center or geometry for location
              const coords = el.center ? [el.center.lon, el.center.lat] : (el.lon && el.lat ? [el.lon, el.lat] : null);
              if (coords) {
                const distance = getDistance(centroid, coords);
                if (distance <= MAX_DIST) {
                  found[cat].push({
                    coords,
                    distance,
                    name: tags.name || tags['name:en'] || null,
                    id: el.id
                  });
                }
              }
              break;
            }
          }
        }
      });

      // Sort places by distance within each category
      for (const cat in found) {
        found[cat].sort((a, b) => a.distance - b.distance);
      }

      // Score each category
      let totalScore = 0;
      const radarData = [];      for (const cat in found) {
        // Sort by distance and calculate scores
        const placesWithScores = found[cat].map(place => ({
          ...place,
          score: amenityScore(place.distance)
        }));
        
        // Use top places (already sorted by distance)
        const topPlaces = placesWithScores.slice(0, MAX_AMENITIES);
        
        // Category score: sum of top N, scaled to CATEGORY_MAX
        const catScore = Math.min(
          topPlaces.reduce((sum, p) => sum + p.score, 0) / MAX_AMENITIES * CATEGORY_MAX, 
          CATEGORY_MAX
        );
        
        radarData.push({ name: cat.charAt(0).toUpperCase() + cat.slice(1), value: Math.round(catScore) });
        totalScore += catScore;
      }

      // Pie chart data (for display)
      const pieData = Object.entries(found).map(([cat, arr]) => ({ name: cat.charAt(0).toUpperCase() + cat.slice(1), value: arr.length }));      return {
        score: Math.round(Math.min(totalScore, 120)), // 6 categories × 20 points each = 120 max
        radarData,
        pieData,
        totalPOIs: elements.length,
        categories: found
      };
    } catch (error) {
      console.error('Error fetching walkability data:', error);
      return {
        score: 0,
        radarData: [],
        pieData: [],
        totalPOIs: 0,
        categories: {}
      };
    }
  };

  return {
    getWalkabilityScore
  };
}