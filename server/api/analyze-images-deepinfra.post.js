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
    console.log(`Processing ${imagesToAnalyze.length} images with DeepInfra Qwen2.5-VL`)

    // Prepare multimodal messages for vision model
    const messageContent = [
      {
        type: "text",
        text: `You are an expert building inspector AI assistant. Please analyze these ${imagesToAnalyze.length} images from an inspection report and provide a comprehensive visual analysis including:

1. **Visual Elements Identified**: What do you see in each image? (structures, systems, components)
2. **Potential Issues**: Any visible problems, damage, or safety concerns
3. **Layout and Context**: Spatial relationships and building context
4. **Technical Assessment**: Professional observations about condition and compliance
5. **Priority Recommendations**: What needs immediate attention based on visual evidence

Please be thorough and reference specific images by their position (Image 1, Image 2, etc.) in your analysis.

${text ? `\n\nFor context, here is some extracted text from the same report:\n${text.substring(0, 1000)}` : ''}`
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
          content: "You are an expert building inspector and property assessment specialist with advanced visual analysis capabilities. Provide detailed, professional analysis of inspection images with actionable insights."
        },
        {
          role: "user",
          content: messageContent
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }

    console.log('Sending multimodal request to DeepInfra API...')

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
    console.log('DeepInfra image analysis response received')

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
    console.error('DeepInfra image analysis error:', error)
    
    // Return a structured error response
    return {
      success: false,
      error: error.statusMessage || error.message || 'Failed to analyze images with DeepInfra',
      details: error.data || null
    }
  }
})
