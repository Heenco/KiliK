import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Helper function to determine if we're running locally or on Vercel
const isRunningLocally = () => {
  const host = process.env.VERCEL_URL || process.env.HOST || 'localhost'
  return !host.includes('vercel.app') && !process.env.VERCEL
}

// Helper function to call Render service
const callRenderService = async (fileName: string, userId: string, supabase: any) => {
  const config = useRuntimeConfig()
  const renderUrl = config.pythonServiceUrl
  
  console.log('Render URL:', renderUrl)
  
  // Download the PDF file from Supabase storage
  const filePath = `${userId}/${fileName}`
  console.log('process-pdf: attempting to download from storage path:', filePath)
  const { data, error } = await supabase.storage
    .from('inspection-reports')
    .download(filePath)

  if (error) {
    console.error('Download error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error downloading file: ${error.message}`
    })
  }

  console.log('PDF downloaded successfully from Supabase')

  // Convert Blob to Buffer for upload
  const buffer = Buffer.from(await data.arrayBuffer())
  
  // Create FormData for file upload
  const formData = new FormData()
  const blob = new Blob([buffer], { type: 'application/pdf' })
  formData.append('file', blob, fileName)
  
  console.log('Uploading PDF to Render service...')
  
  const response = await fetch(`${renderUrl}/process-pdf`, {
    method: 'POST',
    body: formData  // Send as multipart/form-data, not JSON
  })

  console.log('Render service response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Render service error response:', errorText)
    throw createError({
      statusCode: response.status,
      statusMessage: `Render service error: ${errorText}`
    })
  }

  const result = await response.json()
  console.log('Render service success response keys:', Object.keys(result))
  return result
}

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

    // Initialize Supabase client
    const supabase = await serverSupabaseClient(event)

    // Check if running locally or on Vercel
    if (isRunningLocally()) {
      console.log('Running locally - using local Python processing')
      return await processLocalPdf(fileName, userId, supabase, event)
    } else {
      console.log('Running on Vercel - using Render service')
      const renderResult = await callRenderService(fileName, userId, supabase)
      
      // Format response to match local processing format
      return {
        success: true,
        fileName: fileName,
        text: renderResult.text || '',
        images: renderResult.images || [],
        metadata: renderResult.metadata || {},
        error: renderResult.error || null,
        message: 'PDF successfully processed via Render service'
      }
    }
  } catch (error: any) {
    console.error('PDF processing error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to process PDF'
    })
  }
})

// Local PDF processing function (existing logic)
async function processLocalPdf(fileName: string, userId: string, supabase: any, event: any) {
  // Create temporary directory
  const tempDir = path.join(os.tmpdir(), 'pdf-processing')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  
  // Generate a unique filename for the downloaded PDF
  const timestamp = Date.now()
  // Sanitize fileName: use only the basename to avoid nested folders in temp path
  const safeFileName = path.basename(fileName)
  const tempFilePath = path.join(tempDir, `${timestamp}-${safeFileName}`)

  // Ensure temp dir exists
  if (!fs.existsSync(path.dirname(tempFilePath))) {
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true })
  }
  
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
  try {
    fs.writeFileSync(tempFilePath, buffer)
    console.log(`Downloaded PDF saved to: ${tempFilePath}`)
  } catch (writeErr) {
    console.error('Failed to write temp PDF file:', writeErr)
    throw createError({ statusCode: 500, statusMessage: `Failed to write temp file: ${String(writeErr)}` })
  }
  
  // Process the PDF using Python script
  const serverDir = path.join(process.cwd(), 'server')
  const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe'
  const scriptPath = path.join(serverDir, 'pdf_process.py')
  
  console.log(`Processing PDF with Python script: ${scriptPath}`)
  
  try {
    // Execute the Python script with increased buffer size
    const { stdout, stderr } = await execAsync(`"${pythonPath}" "${scriptPath}" "${tempFilePath}"`, {
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      timeout: 60000 // 60 second timeout
    })
    
    if (stderr) {
      console.error('Python script stderr:', stderr)
    }
    
    // Parse the JSON output from the Python script
    let processedData
    try {
      processedData = JSON.parse(stdout)
    } catch (parseError) {
      console.error('Failed to parse Python output:', parseError)
      throw new Error('Invalid JSON output from Python script')
    }
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath)
    
    // Return the processed data
    return {
      success: true,
      fileName: fileName,
      text: processedData.text || '',
      images: processedData.images || [],
      metadata: processedData.metadata || {},
      error: processedData.error || null,
      message: 'PDF successfully processed locally'
    }
    
  } catch (pythonError: any) {
    console.error('Python processing error:', pythonError)
    
    // Clean up temporary file on error
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Error processing PDF: ${pythonError?.message || 'Unknown Python error'}`
    })
  }
}