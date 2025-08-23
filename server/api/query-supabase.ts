import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { query, reportName, userId, maxChunks = 10 } = body // Increased from 5 to 10

  if (!query || !reportName || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing query, reportName, or userId'
    })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get query embedding from DeepInfra
    console.log('Getting embedding for query:', query.substring(0, 50) + '...')
    const queryEmbedding = await getDeepInfraEmbeddings([query])
    
    // Debug: Check what documents exist for this user and report
    const { data: allDocs, error: debugError } = await supabase
      .from('documents')
      .select('id, document_name, user_id, chunk_index')
      .eq('user_id', userId)
      .limit(20) // Increased to see more docs
    
    console.log('Debug - All docs for user:', allDocs)
    console.log('Debug - Looking for reportName:', reportName)
    console.log('Debug - Looking for userId:', userId)
    
    // Search similar documents in Supabase - try without filter first
    const { data: similarDocs, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding[0],
      match_threshold: 0.3, // Lowered further to get more results
      match_count: 20, // Increased to get more potential matches
      filter: {} // Remove filter temporarily to see if we get any results
    })
    
    console.log('Debug - Similar docs found (no filter):', similarDocs?.length || 0)

    if (error) {
      console.error('Supabase similarity search error:', error)
      throw error
    }

    // If we got results, now filter them manually for this user and document
    let filteredDocs = similarDocs || []
    if (filteredDocs.length > 0) {
      // Manual filtering since RPC filter might not work as expected
      const { data: userDocs, error: filterError } = await supabase
        .from('documents')
        .select('id, content, metadata, embedding')
        .eq('user_id', userId)
        .eq('document_name', reportName)
      
      console.log('Debug - User docs for this report:', userDocs?.length || 0)
      
      if (userDocs && userDocs.length > 0) {
        // We have documents, let's do similarity search on just these
        const docIds = userDocs.map(doc => doc.id)
        filteredDocs = similarDocs.filter((doc: any) => docIds.includes(doc.id))
        console.log('Debug - Filtered docs after manual filter:', filteredDocs.length)
      } else {
        filteredDocs = []
      }
    }

    if (!filteredDocs || filteredDocs.length === 0) {
      return {
        summary: "No relevant content found for your query in this document.",
        chunks_used: 0,
        query,
        report_name: reportName
      }
    }

    console.log(`Found ${filteredDocs.length} relevant chunks, sending to DeepInfra for summarization...`)

    // Combine chunks for context (limit size to prevent timeouts)
    let context = ''
    let contextLength = 0
    const maxContextLength = 12000 // Increased from 8000 to allow more content

    for (let i = 0; i < filteredDocs.length; i++) {
      const chunkText = `Chunk ${i + 1}:\n${filteredDocs[i].content}\n\n`
      if (contextLength + chunkText.length > maxContextLength) break
      context += chunkText
      contextLength += chunkText.length
    }

    // Send to DeepInfra for summarization
    const summary = await summarizeWithDeepInfra(context, query)

    return {
      summary,
      chunks_used: filteredDocs.length,
      query,
      report_name: reportName,
      similarities: filteredDocs.map((doc: any) => doc.similarity || 0)
    }

  } catch (error) {
    console.error('Supabase query error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Query processing failed',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})

async function getDeepInfraEmbeddings(texts: string[]) {
  const response = await fetch('https://api.deepinfra.com/v1/inference/BAAI/bge-large-en-v1.5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`
    },
    body: JSON.stringify({
      inputs: texts,
      normalize: true
    })
  })

  if (!response.ok) {
    throw new Error(`DeepInfra API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.embeddings || data
}

async function summarizeWithDeepInfra(context: string, query: string) {
  const prompt = `Based on the following document excerpts, provide a comprehensive summary that addresses: "${query}"

Document excerpts:
${context}

Please provide a detailed summary that specifically addresses the query while incorporating relevant information from all the excerpts.`

  const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.DEEPINFRA_LLM_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000, // Increased from 1000 to allow longer responses
      temperature: 0.3
    })
  })

  if (!response.ok) {
    throw new Error(`DeepInfra LLM API error: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  
  if (result.choices && result.choices.length > 0) {
    return result.choices[0].message.content
  } else {
    throw new Error('No response from DeepInfra LLM')
  }
}
