import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, reportName, userId } = body

  if (!text || !reportName || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing text, reportName, or userId'
    })
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Split text into chunks
    const chunks = chunkText(text, 1000, 200)
    console.log(`Processing ${chunks.length} chunks for Supabase ingestion for user: ${userId}`)

    let successCount = 0
    const batchSize = 10 // Process in batches to avoid rate limits

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      
      // Get embeddings for this batch
      const embeddings = await getDeepInfraEmbeddings(batch.map(chunk => chunk.text))
      
      // Prepare documents for insertion
      const documents = batch.map((chunk, index) => ({
        user_id: userId,
        document_name: reportName,
        chunk_index: i + index,
        content: chunk.text,
        embedding: embeddings[index],
        metadata: {
          start: chunk.start,
          end: chunk.end,
          chunk_size: chunk.text.length
        }
      }))

      // Insert into Supabase
      const { error } = await supabase
        .from('documents')
        .insert(documents)

      if (error) {
        console.error('Supabase insertion error:', error)
        throw error
      }

      successCount += batch.length
      console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`)
    }

    return {
      success: true,
      chunks_added: successCount,
      total_chunks: chunks.length,
      document_name: reportName,
      user_id: userId
    }

  } catch (error) {
    console.error('Supabase ingestion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to ingest into Supabase',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
})

// Helper functions
function chunkText(text: string, chunkSize = 1000, overlap = 200) {
  const chunks = []
  let start = 0
  const textLength = text.length

  while (start < textLength) {
    const end = Math.min(start + chunkSize, textLength)
    const chunk = text.slice(start, end)
    
    chunks.push({
      text: chunk,
      start,
      end
    })
    
    if (end === textLength) break
    start = Math.max(0, end - overlap)
  }
  
  return chunks
}

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
