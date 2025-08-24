export default defineEventHandler(async (event) => {
  try {
    const { images, text } = await readBody(event)
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Images array is required'
      })
    }

    const deepInfraToken = "RZDmyvBu0dfJ8IuOddkaT9awvxucbUA5"
    if (!deepInfraToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'DeepInfra API token not configured'
      })
    }

    // Limit to first 5 images to stay within token limits
    const imagesToAnalyze = images.slice(0, 5)
    console.log(`Processing ${imagesToAnalyze.length} images for layout detection with DeepInfra Qwen2.5-VL`)

    // Prepare multimodal messages for vision model focused on layout detection
    const messageContent = [
      {
        type: "text",
        text: `Please analyze this document image and detect layout elements with bounding box coordinates. 

Return the results in the following JSON format:
{
  "image_dimensions": {"width": 0, "height": 0},
  "layout_elements": [
    {
      "type": "header|paragraph|table|image|list|footer|form",
      "bbox": [x1, y1, x2, y2],
      "text": "extracted text content",
      "confidence": 0.95
    }
  ]
}

Detect these layout elements:
- Headers and titles
- Text paragraphs 
- Tables and data sections
- Images and figures
- Lists and bullet points
- Forms and input fields
- Footers and page info

Provide pixel coordinates (x1,y1) for top-left and (x2,y2) for bottom-right of each detected element.

For reference, here are the ${imagesToAnalyze.length} images to analyze:

${text ? `Context from extracted text: ${text.substring(0, 500)}` : ''}`
      }
    ]

    // Add each image to the message content
    imagesToAnalyze.forEach((imageUrl, index) => {
      // Handle both data URLs and regular URLs
      let imageData = imageUrl
      if (imageUrl.startsWith('data:image/')) {
        imageData = imageUrl
      } else {
        // If it's not a data URL, assume it's a base64 string and format it
        imageData = `data:image/jpeg;base64,${imageUrl}`
      }

      messageContent.push({
        type: "image_url",
        image_url: {
          url: imageData
        }
      })
    })

    const requestBody = {
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are a document layout detection system. Analyze images and return bounding box coordinates for layout elements. Return results in JSON format with pixel coordinates relative to image dimensions."
        },
        {
          role: "user",
          content: messageContent
        }
      ],
      max_tokens: 2000,
      temperature: 0.3 // Lower temperature for more consistent layout analysis
    }

    console.log('Sending layout detection request to DeepInfra API...')

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepInfraToken}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepInfra API error:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `DeepInfra API error: ${errorText}`
      })
    }

    const result = await response.json()
    console.log('DeepInfra layout analysis response received')

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid response from DeepInfra API'
      })
    }

    const analysis = result.choices[0].message.content

    return {
      success: true,
      analysis: analysis,
      imagesAnalyzed: imagesToAnalyze.length,
      model: 'Qwen/Qwen2.5-VL-32B-Instruct',
      usage: result.usage || null
    }

  } catch (error) {
    console.error('DeepInfra layout analysis error:', error)
    
    // Return a structured error response
    return {
      success: false,
      error: error.statusMessage || error.message || 'Failed to analyze layout with DeepInfra',
      details: error.data || null
    }
  }
})
