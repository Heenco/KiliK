
import { serverSupabaseClient } from '#supabase/server'
import pdf from 'pdf-poppler'
import fs from 'fs'
import path from 'path'
import os from 'os'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { fileName, textContext, userId } = body

    console.log('PDF Analysis Request:', { fileName, userId, hasTextContext: !!textContext })

    if (!fileName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PDF file name is required'
      })
    }

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    console.log('Using Nuxt Supabase server client...')

    // Use Nuxt's built-in server-side Supabase client
    const supabase = await serverSupabaseClient(event)

    console.log('Supabase client initialized, downloading file...')

    // Construct the file path in Supabase Storage
    const filePath = `${userId}/${fileName}`
    console.log('File path:', filePath)

    // Download the PDF file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('inspection-reports')
      .download(filePath)

    if (downloadError) {
      console.error('Supabase download error:', downloadError)
      throw createError({
        statusCode: 404,
        statusMessage: 'PDF file not found in storage'
      })
    }

    console.log('File downloaded successfully, size:', fileData.size)

    // Convert first 3 pages of PDF to images
    console.log('Converting first 3 pages of PDF to images...')
    
    // Create a temporary file to work with pdf2pic
    const tempDir = os.tmpdir()
    const tempPdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`)
    
    // Write the PDF buffer to temporary file
    const pdfBuffer = Buffer.from(await fileData.arrayBuffer())
    await fs.promises.writeFile(tempPdfPath, pdfBuffer)
    
    try {
      // Convert first 3 pages to images using pdf-poppler
      const options = {
        format: 'png',
        out_dir: tempDir,
        out_prefix: 'page',
        page: '1-3' // Convert only first 3 pages
      }
      
      const pages = await pdf.convert(tempPdfPath, options)
      console.log('PDF conversion result:', pages)
      
      // Read the generated images and convert to base64
      const pageImages = []
      for (let i = 1; i <= Math.min(3, pages.length || 3); i++) {
        const imagePath = path.join(tempDir, `page-${i}.png`)
        if (fs.existsSync(imagePath)) {
          const imageBuffer = await fs.promises.readFile(imagePath)
          const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`
          pageImages.push(base64Image)
          
          // Clean up the image file
          await fs.promises.unlink(imagePath)
        }
      }
      
      console.log(`Successfully converted ${pageImages.length} pages to images`)
      
      // Clean up temp file
      await fs.promises.unlink(tempPdfPath)
      
      if (pageImages.length === 0) {
        throw new Error('No pages could be converted to images')
      }

      // Prepare the message content with images
      const messageContent = [
        {
          type: "text",
          text: `Please analyze this PDF document (${fileName}) based on the first ${pageImages.length} pages shown in the images. Provide a comprehensive assessment focusing on:

1. **Document Structure & Content**: Overall organization, sections, and key information visible
2. **Key Findings**: Important details, data, or conclusions presented
3. **Issues or Concerns**: Any problems, deficiencies, or areas of attention mentioned
4. **Recommendations**: Suggested actions or improvements if any
5. **Summary**: Concise overview of the document's main points

${textContext ? `\n**Additional Context from OCR text:**\n${textContext.substring(0, 1500)}...` : ''}

Please provide a detailed analysis in a clear, structured format based on what you can see in these document pages.`
        }
      ]

      // Add each page image to the message content
      pageImages.forEach((imageData, index) => {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: imageData
          }
        })
      })

      // Prepare the messages array
      const messages = [
        {
          role: "user",
          content: messageContent
        }
      ]

    } catch (conversionError) {
      // Clean up temp file if it exists
      try {
        await fs.promises.unlink(tempPdfPath)
      } catch (unlinkError) {
        console.warn('Could not clean up temp file:', unlinkError)
      }
      
      console.error('PDF conversion error:', conversionError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to convert PDF pages to images'
      })
    }

    console.log('Calling DeepInfra API...')

    // Call DeepInfra API
    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer RZDmyvBu0dfJ8IuOddkaT9awvxucbUA5'
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-VL-32B-Instruct',
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      })
    })

    console.log('DeepInfra API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('DeepInfra API error:', errorData)
      throw createError({
        statusCode: response.status,
        statusMessage: `DeepInfra API error: ${response.statusText}`
      })
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0]) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid response from DeepInfra API'
      })
    }

    const analysis = data.choices[0].message.content

    return {
      success: true,
      analysis,
      fileName,
      model: 'Qwen2.5-VL-32B-Instruct',
      usage: data.usage || {}
    }

  } catch (error) {
    console.error('PDF analysis error details:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage
    })
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to analyze PDF with DeepInfra'
    })
  }
})
