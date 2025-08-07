import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const { fileName, userId } = await readBody(event)
    
    if (!fileName || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing fileName or userId'
      })
    }
      // Create temporary directory
    const tempDir = path.join(os.tmpdir(), 'pdf-processing')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Generate a unique filename for the downloaded PDF
    const timestamp = Date.now()
    const tempFilePath = path.join(tempDir, `${timestamp}-${fileName}`)
    
    // Initialize Supabase client
    const supabase = serverSupabaseClient(event)
    
    // Download file from Supabase storage
    const filePath = `${userId}/${fileName}`
    const { data, error } = await supabase.storage
      .from('inspection-reports')
      .download(filePath)
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error downloading file: ${error.message}`
      })
    }
      // Convert Blob to Buffer and save to temp file
    const buffer = Buffer.from(await data.arrayBuffer())
    fs.writeFileSync(tempFilePath, buffer)
    console.log(`Downloaded PDF saved to: ${tempFilePath}`)
    
    // Return the path to the downloaded file and any other useful information
    return {
      success: true,
      filePath: tempFilePath,
      fileName: fileName,
      message: 'PDF successfully downloaded and saved to temporary location'
    }
    
  } catch (error) {
    console.error('PDF download error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to download PDF'
    })
  }
})
