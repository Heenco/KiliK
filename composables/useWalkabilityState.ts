// Shared state for walkability data to avoid recalculation
import { ref, computed } from 'vue'

// Global state for walkability data
const walkabilityState = ref({
  data: null as any,
  coordinates: null as string | null,
  isLoading: false,
  error: null as string | null
})

export function useWalkabilityState() {
  // Generate a unique key for coordinates to check if data is for the same location
  const getCoordinateKey = (lat: number, lng: number) => {
    return `${lat.toFixed(6)},${lng.toFixed(6)}`
  }

  // Check if we have valid data for the given coordinates
  const hasDataForCoordinates = (lat: number, lng: number) => {
    const key = getCoordinateKey(lat, lng)
    const hasData = walkabilityState.value.coordinates === key && walkabilityState.value.data !== null
    console.log('🔍 Checking cache for coordinates:', key, 'Found:', hasData, 'Cached key:', walkabilityState.value.coordinates)
    return hasData
  }

  // Set walkability data
  const setWalkabilityData = (lat: number, lng: number, data: any) => {
    const key = getCoordinateKey(lat, lng)
    walkabilityState.value.coordinates = key
    walkabilityState.value.data = data
    walkabilityState.value.error = null
    console.log('💾 Caching walkability data for coordinates:', key, 'Data:', data)
  }

  // Get walkability data
  const getWalkabilityData = (lat: number, lng: number) => {
    if (hasDataForCoordinates(lat, lng)) {
      return walkabilityState.value.data
    }
    return null
  }

  // Set loading state
  const setLoading = (loading: boolean) => {
    walkabilityState.value.isLoading = loading
  }

  // Set error state
  const setError = (error: string | null) => {
    walkabilityState.value.error = error
  }

  // Clear data
  const clearData = () => {
    walkabilityState.value.data = null
    walkabilityState.value.coordinates = null
    walkabilityState.value.error = null
    walkabilityState.value.isLoading = false
  }

  return {
    walkabilityState: computed(() => walkabilityState.value),
    hasDataForCoordinates,
    setWalkabilityData,
    getWalkabilityData,
    setLoading,
    setError,
    clearData
  }
}
