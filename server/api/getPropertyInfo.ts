import { H3Event } from 'h3'

// Define the response structure based on our BuildingSpecificationsCard data
interface PropertyInfo {
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


export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the address from the query parameters
    const query = getQuery(event)
    const address = query.address as string

    if (!address) {
      return createError({
        statusCode: 400,
        statusMessage: 'Address parameter is required'
      })
    }

    // Get API key from environment variables
    const apiKey = process.env.PERPLEXITY_API_KEY

    if (!apiKey) {
      console.error('PERPLEXITY_API_KEY not found in environment variables')
      return createError({
        statusCode: 500,
        statusMessage: 'API configuration error'
      })
    }    // Construct a prompt for Perplexity API
    const prompt = `Provide basic property information for the address: ${address}. 
    Return ONLY a JSON object with these fields (use "unknown" for unknown values):
    buildingType, yearBuilt, constructionMaterial, floors, floorArea, landArea, 
    foundationType, roofType, bedrooms, bathrooms, energyRating, and conditionAssessment 
    (with subfields: structural, roof, plumbing, electrical, interior, exterior).
    Do not include any other text in your response.`

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sonar', // Using the confirmed working model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides property information in JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Perplexity API error:', errorData)
      return createError({
        statusCode: response.status,
        statusMessage: `Error from Perplexity API: ${response.statusText}`
      })
    }

    const data = await response.json()
    
    // Extract the JSON response from the AI
    let propertyInfo: PropertyInfo
    
    try {
      // The API returns text that should be a JSON object
      const content = data.choices[0].message.content
      
      // Try to parse the JSON from the response
      propertyInfo = JSON.parse(content)
      
      // Ensure all required fields exist, with defaults if missing
      propertyInfo = {
        buildingType: propertyInfo.buildingType || 'unknown',
        yearBuilt: propertyInfo.yearBuilt || 'unknown',
        constructionMaterial: propertyInfo.constructionMaterial || 'unknown',
        floors: propertyInfo.floors || 'unknown',
        floorArea: propertyInfo.floorArea || 'unknown',
        landArea: propertyInfo.landArea || 'unknown',
        foundationType: propertyInfo.foundationType || 'unknown',
        roofType: propertyInfo.roofType || 'unknown',
        bedrooms: propertyInfo.bedrooms || 'unknown',
        bathrooms: propertyInfo.bathrooms || 'unknown',
        energyRating: propertyInfo.energyRating || 'unknown',
        conditionAssessment: {
          structural: propertyInfo.conditionAssessment?.structural || 'unknown',
          roof: propertyInfo.conditionAssessment?.roof || 'unknown',
          plumbing: propertyInfo.conditionAssessment?.plumbing || 'unknown',
          electrical: propertyInfo.conditionAssessment?.electrical || 'unknown',
          interior: propertyInfo.conditionAssessment?.interior || 'unknown',
          exterior: propertyInfo.conditionAssessment?.exterior || 'unknown'
        }
      }
    } catch (error) {
      console.error('Error parsing JSON from Perplexity response:', error)
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to parse property data from AI response'
      })
    }

    // Return the property information
    return propertyInfo
  } catch (error) {
    console.error('Error in getPropertyInfo API:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred'
    })
  }
})
