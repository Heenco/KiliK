import { useState } from '#app'

export const useMapState = () => {
  const layers = useState('mapLayers', () => ({
    osm: false,
    lot: true, // Set to true - lot boundary layer always visible
    address: true, // Address layer always visible
    health: false,
    food: false,
    flood: false,
    landslide: false,
    noise: false,
    isochrone: false,
    streetLights: false,
    police: false,
    speedCamera: false,
    trafficSignals: false,
    fireStations: false,
    hospitals: false,
    retailShops: false,
    places: false,
    railwayStations: false,
    railwayLines: false,
    busStations: false,
    electricityTransmission: false,
    diningCafe: false, // Add the new Dining & Cafe layer state
    education: false, // Add the Schools & Education layer state
    seifa: false // Add the SEIFA 2021 layer state
  }))

  const filters = useState('mapFilters', () => ({
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