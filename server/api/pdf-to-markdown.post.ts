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
    
    // Use Python script for PDF to markdown conversion
    const { spawn } = await import('child_process')
    const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe' // Using same path as existing system
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonPath, ['-c', `
import sys
import fitz  # PyMuPDF
import io

# Read PDF from stdin
pdf_data = sys.stdin.buffer.read()
doc = fitz.open(stream=pdf_data, filetype="pdf")

markdown_content = ""

for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text()
    
    # Simple markdown formatting
    lines = text.split('\\n')
    for line in lines:
        line = line.strip()
        if line:
            # Detect potential headers (all caps, short lines)
            if len(line) < 60 and line.isupper() and len(line) > 3:
                markdown_content += f"## {line}\\n\\n"
            # Detect potential subheaders (title case, short lines)
            elif len(line) < 80 and line.istitle() and len(line) > 5:
                markdown_content += f"### {line}\\n\\n"
            else:
                markdown_content += f"{line}\\n\\n"

print(markdown_content)
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
          resolve({
            success: true,
            markdown: output.trim(),
            fileName
          })
        } else {
          console.error('Python PDF processing error:', errorOutput)
          reject(createError({
            statusCode: 500,
            statusMessage: 'Failed to convert PDF to Markdown',
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
    console.error('PDF to Markdown conversion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to convert PDF to Markdown',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})