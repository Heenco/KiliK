import { ref } from 'vue'

// Define the interface for property information
export interface PropertyInfo {
  buildingType: string
  yearBuilt: number | string
  constructionMaterial: string
  floors: number | string
  floorArea: number | string
  landArea: number | string
  foundationType: string
  roofType: string
  bedrooms: number | string
  bathrooms: number | string
  energyRating: string
  conditionAssessment: {
    structural: string
    roof: string
    plumbing: string
    electrical: string
    interior: string
    exterior: string
  }
}

export const usePropertyInfo = () => {
  const propertyInfo = ref<PropertyInfo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch property information for a given address
   */
  const fetchPropertyInfo = async (address: string) => {
    if (!address) {
      error.value = 'Address is required'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const encodedAddress = encodeURIComponent(address)
      const response = await fetch(`/api/getPropertyInfo?address=${encodedAddress}`)
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || response.statusText)
      }

      const data = await response.json()
      propertyInfo.value = data
      return data
    } catch (err) {
      console.error('Error fetching property info:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch property information'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    propertyInfo,
    isLoading,
    error,
    fetchPropertyInfo
  }
}

export default usePropertyInfo
