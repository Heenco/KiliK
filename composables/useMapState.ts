import { useState } from '#app'

export const useMapState = () => {
  const layers = useState('mapLayers', () => ({
    // Keep these three as requested
    isochrone: true,
    
    // Overture Places layers from mapai4-OVT
    places: false,          // All Places
    healthcare: false,      // Health & Personal Care  
    groceries: true,        // Food & Groceries (default on)
    banking: false,         // Banking & Financial
    retail: false,          // Retail Shops
    petcare: false,         // Pet Care & Services
    dining: false,          // Dining & Cafes
    entertainment: false,   // Entertainment Venues
    recreation: false,      // Recreation & Sports
    trails: false,          // Walking & Cycling Trails
    transportation: false,  // Public Transportation
    vehicles: false,        // Vehicle Services
    schools: false,         // Schools & Education
    community: false,       // Community Resources
    
    // PMTiles-based Hazard layers
    flood: false,           // Flood zones
    bushfire: false,        // Bushfire zones
    noise: false,           // Noise corridors
    erosion: false,         // Erosion zones
    acidSulfate: false,     // Acid sulfate soils
    
    // Safety layers (OSM-based)
    streetLights: false,    // Street lights
    police: false,          // Police stations
    speedCamera: false,     // Speed cameras
    trafficSignals: false,  // Traffic signals & crossings
    fireStations: false,    // Fire stations & rescue
    hospitals: false,       // Hospitals & healthcare
    electricityTransmission: false, // Electricity transmission lines
  }))

  const filters = useState('mapFilters', () => ({
    // Keep existing filters structure for compatibility
    health: ['hospital', 'pharmacy', 'clinic', 'doctors', 'dentist'],
    food: ['supermarket', 'convenience', 'bakery']
  }))

  const travelMode = useState('travelMode', () => 'walking');
  const travelTime = useState('travelTime', () => 15);

  return {
    layers,
    filters,
    travelMode,
    travelTime
  }
}