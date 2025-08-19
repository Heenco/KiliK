export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event)
    
    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text is required'
      })
    }

    const deepInfraToken = "RZDmyvBu0dfJ8IuOddkaT9awvxucbUA5"
    if (!deepInfraToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'DeepInfra API token not configured'
      })
    }

    console.log('Processing text with DeepInfra, length:', text.length)

    // Prepare the prompt for inspection report analysis
    const prompt = `You are an expert building inspector AI assistant. Please analyze the following inspection report and provide a comprehensive summary including:

1. Key findings and issues identified
2. Safety concerns that need immediate attention
3. Recommended repairs or maintenance items
4. Overall condition assessment
5. Priority levels for different issues

Please be thorough but concise in your analysis.

Inspection Report Text:
${text.substring(0, 70000)}`  // Limit text to avoid token limits

    const requestBody = {
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert building inspector and property assessment specialist. Provide detailed, professional analysis of inspection reports with actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    }

    console.log('Sending request to DeepInfra API...')

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
    console.log('DeepInfra API response received')

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid response from DeepInfra API'
      })
    }

    const summary = result.choices[0].message.content

    return {
      success: true,
      summary: summary,
      model: 'Qwen/Qwen2.5-VL-32B-Instruct',
      usage: result.usage || null
    }

  } catch (error) {
    console.error('DeepInfra summarization error:', error)
    
    // Return a structured error response
    return {
      success: false,
      error: error.statusMessage || error.message || 'Failed to analyze text with DeepInfra',
      details: error.data || null
    }
  }
})
