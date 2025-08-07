import { PMTiles } from 'pmtiles'

// Overture Maps PMTiles URLs
const OVERTURE_PMTILES_URLS = {
  places: 'https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2025-04-23/places.pmtiles',
  // Add more as needed
  // buildings: 'https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2025-04-23/buildings.pmtiles',
  // transportation: 'https://overturemaps-tiles-us-west-2-beta.s3.amazonaws.com/2025-04-23/transportation.pmtiles'
}

// Cache for PMTiles instances
const pmtilesCache = new Map<string, PMTiles>()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { dataset, z, x, y } = query

  // Validate parameters
  if (!dataset || !z || !x || !y) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: dataset, z, x, y'
    })
  }

  // Check if dataset is supported
  if (!OVERTURE_PMTILES_URLS[dataset as string]) {
    throw createError({
      statusCode: 404,
      statusMessage: `Dataset '${dataset}' not found`
    })
  }

  try {
    const datasetKey = dataset as string
    const pmtilesUrl = OVERTURE_PMTILES_URLS[datasetKey]
    
    // Get or create PMTiles instance
    let pmtiles = pmtilesCache.get(datasetKey)
    if (!pmtiles) {
      pmtiles = new PMTiles(pmtilesUrl)
      pmtilesCache.set(datasetKey, pmtiles)
    }

    // Parse coordinates
    const zNum = parseInt(z as string)
    const xNum = parseInt(x as string)
    const yNum = parseInt(y as string)

    console.log('Received request with parameters:', { dataset, z, x, y });
    console.log('Using PMTiles URL:', pmtilesUrl);
    console.log('Parsed coordinates:', { zNum, xNum, yNum });

    console.log('Fetching tile data for coordinates:', { zNum, xNum, yNum });
    console.log('PMTiles instance:', pmtiles);
    console.log('Attempting to fetch tile data using PMTiles instance:', pmtiles);
    console.log('PMTiles instance details:', pmtiles);

    // Get tile data
    const tileData = await pmtiles.getZxy(zNum, xNum, yNum);

    console.log('Tile data fetched:', tileData ? 'Success' : 'Failed');

    if (!tileData) {
      console.error('Tile data not found for coordinates:', { zNum, xNum, yNum });
      throw createError({
        statusCode: 404,
        statusMessage: 'Tile not found'
      });
    }

    console.log('Tile data fetched successfully:', tileData);

    // Set appropriate headers
    setHeader(event, 'Content-Type', 'application/x-protobuf')
    setHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET')
    
    return tileData
  } catch (error) {
    console.error('PMTiles proxy error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tile data'
    })
  }
})