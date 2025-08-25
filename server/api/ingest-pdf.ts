import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { fileName, userId } = body;

  if (!fileName || !userId) {
    setResponseStatus(event, 400);
    return { error: 'Missing fileName or userId in request' };
  }

  // Get supabase client using environment variables
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First, use the existing process-pdf endpoint to extract text
    console.log('Step 1: Processing PDF to extract text...');
    const processResult = await $fetch('/api/process-pdf', {
      method: 'POST',
      body: { fileName, userId }
    });
    
    if (!processResult.success || !processResult.text) {
      setResponseStatus(event, 400);
      return { 
        error: 'PDF text extraction failed', 
        detail: processResult.error || 'No text extracted from PDF'
      };
    }
    
    const text = processResult.text;
    console.log(`Step 2: Extracted ${text.length} characters from PDF`);
    
    if (text.trim().length === 0) {
      setResponseStatus(event, 400);
      return { error: 'No text content found in PDF' };
    }
    
    console.log('Step 3: Ready to ingest into Supabase vector database...');

    console.log('Step 4: Running Supabase vector ingestion...');
    
    // Use the same Supabase ingestion approach as analysis.vue
    try {
      const ingestResponse = await $fetch('/api/ingest-supabase', {
        method: 'POST',
        body: {
          text,
          reportName: fileName,
          userId
        }
      });

      console.log('Step 5: Ingestion completed successfully');
      return {
        success: true,
        chunks_added: ingestResponse.chunks_added,
        total_chunks: ingestResponse.total_chunks,
        document_name: ingestResponse.document_name,
        message: `Successfully processed PDF and ingested ${ingestResponse.chunks_added} chunks into Supabase vector database`
      };
      
    } catch (ingestError: any) {
      console.error('Supabase ingestion failed:', ingestError);
      setResponseStatus(event, 500);
      return { 
        error: 'Failed to ingest into Supabase vector database',
        detail: ingestError.message || ingestError
      };
    }
  } catch (e: any) {
    setResponseStatus(event, 500);
    console.error('Error in ingest-pdf handler:', e);
    return { error: `Error ingesting PDF: ${e.message}` };
  }
});
