import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { fileName, userId } = body

  if (!fileName || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing fileName or userId'
    })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: pdfData, error } = await supabase.storage
      .from('inspection-reports')
      .download(`${userId}/${fileName}`)

    if (error) {
      console.error('Error downloading PDF:', error)
      throw createError({
        statusCode: 404,
        statusMessage: 'PDF not found'
      })
    }

    // Convert PDF buffer for processing
    const arrayBuffer = await pdfData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Use Python script for PDF to images conversion
    const { spawn } = await import('child_process')
    const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe' // Using same path as existing system
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonPath, ['-c', `
import sys
import fitz  # PyMuPDF
import io
import base64
import json

# Read PDF from stdin
pdf_data = sys.stdin.buffer.read()
doc = fitz.open(stream=pdf_data, filetype="pdf")

# Limit to first 30 pages
max_pages = min(30, len(doc))
images = []

for page_num in range(max_pages):
    page = doc.load_page(page_num)
    
    # Convert page to image with 150 DPI
    mat = fitz.Matrix(150/72, 150/72)  # 150 DPI scaling
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    # Convert to JPEG
    img_data = pix.tobytes("jpeg", jpg_quality=85)
    
    # Convert to base64 for transport
    img_base64 = base64.b64encode(img_data).decode('utf-8')
    
    images.append({
        "page": page_num + 1,
        "data": img_base64,
        "width": pix.width,
        "height": pix.height,
        "size": len(img_data)
    })

# Output as JSON
result = {
    "total_pages": len(doc),
    "converted_pages": max_pages,
    "images": images
}

print(json.dumps(result))
`])

      let output = ''
      let errorOutput = ''

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on('close', (code) => {
        if (code === 0 && output.trim()) {
          try {
            const result = JSON.parse(output.trim())
            
            // Convert base64 images to data URLs
            const processedImages = result.images.map(img => ({
              page: img.page,
              dataUrl: `data:image/jpeg;base64,${img.data}`,
              width: img.width,
              height: img.height,
              size: img.size
            }))
            
            resolve({
              success: true,
              totalPages: result.total_pages,
              convertedPages: result.converted_pages,
              images: processedImages,
              fileName
            })
          } catch (parseError) {
            console.error('JSON parse error:', parseError)
            reject(createError({
              statusCode: 500,
              statusMessage: 'Failed to parse conversion results',
              data: { error: parseError.message }
            }))
          }
        } else {
          console.error('Python PDF to images processing error:', errorOutput)
          reject(createError({
            statusCode: 500,
            statusMessage: 'Failed to convert PDF to images',
            data: { error: errorOutput || 'Python processing failed' }
          }))
        }
      })

      pythonProcess.on('error', (error) => {
        console.error('Python process error:', error)
        reject(createError({
          statusCode: 500,
          statusMessage: 'Failed to start PDF processing',
          data: { error: error.message }
        }))
      })

      // Send PDF data to Python process
      pythonProcess.stdin.write(buffer)
      pythonProcess.stdin.end()
    })

  } catch (error) {
    console.error('PDF to Images conversion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to convert PDF to images',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})
