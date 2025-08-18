import { defineEventHandler, readBody, setHeader, createEventStream } from 'h3';
import type { H3Event } from 'h3';

// Helper function to process a single chunk with Ollama
async function processChunk(chunk: string, chunkIndex: number, totalChunks: number): Promise<string> {
  console.log(`Processing chunk ${chunkIndex + 1}/${totalChunks} with Ollama...`);
  
  const prompt = totalChunks > 1 
    ? `Extract major and minor issues from this inspection report section (Part ${chunkIndex + 1} of ${totalChunks}):\n\n${chunk}`
    : `Extract 5 major and minor issues from the following inspection report text:\n\n${chunk}`;

  const ollamaRes = await fetch('https://4c3b962287a5.ngrok-free.app/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: prompt
    })
  });

  if (!ollamaRes.ok) {
    const errorText = await ollamaRes.text();
    console.error(`Ollama API error for chunk ${chunkIndex + 1}:`, ollamaRes.status, errorText);
    throw new Error(`Ollama API error (${ollamaRes.status}): ${errorText}`);
  }

  // Ollama returns a stream of JSON objects per line
  let summary = '';
  const reader = ollamaRes.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim()) {
            try {
              const obj = JSON.parse(line);
              if (obj.response) summary += obj.response;
            } catch {}
          }
        }
      }
      done = streamDone;
    }
  } else {
    // fallback for non-streaming
    const data = await ollamaRes.json();
    summary = data.response || '';
  }
  
  console.log(`Chunk ${chunkIndex + 1} result:`, summary);
  return summary;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { text } = body;
    console.log('Ollama API called with text length:', text?.length);
    
    if (!text) {
      return { summary: '', error: 'No text provided' };
    }
    
    // Split text into chunks of 1000 words each
    const words = text.split(/\s+/);
    const chunkSize = 1000;
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }
    
    console.log(`Processing ${chunks.length} chunks of ${chunkSize} words each with Ollama llama3...`);
    
    let combinedSummary = '';
    
    // Process chunks sequentially and combine results
    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
        
        const result = await processChunk(chunks[i], i, chunks.length);
        
        if (result.trim()) {
          if (chunks.length > 1) {
            combinedSummary += `=== Section ${i + 1} (Words ${i * chunkSize + 1}-${(i + 1) * chunkSize}) ===\n${result}\n\n`;
          } else {
            combinedSummary = result;
          }
          
          console.log(`Chunk ${i + 1} completed. Total summary length so far: ${combinedSummary.length} characters`);
        }
      } catch (error: any) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        combinedSummary += `=== Section ${i + 1} (Error) ===\nError processing this section: ${error.message}\n\n`;
      }
    }
    
    console.log('All chunks processed. Combined summary length:', combinedSummary.length, 'characters');
    
    // Now send the combined summary back to Ollama for final summarization
    if (combinedSummary.trim()) {
      console.log('Sending combined results back to Ollama for final summarization...');
      
      try {
        const finalSummaryRes = await fetch('https://0a321ecd30ab.ngrok-free.app/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3',
            prompt: `Please provide a comprehensive summary of all the following inspection report analysis results. Consolidate and organize the findings into a clear, concise summary:\n\n${combinedSummary}`
          })
        });

        if (finalSummaryRes.ok) {
          let finalSummary = '';
          const reader = finalSummaryRes.body?.getReader();
          if (reader) {
            const decoder = new TextDecoder();
            let done = false;
            let buffer = '';
            while (!done) {
              const { value, done: streamDone } = await reader.read();
              if (value) {
                buffer += decoder.decode(value, { stream: true });
                let lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                  if (line.trim()) {
                    try {
                      const obj = JSON.parse(line);
                      if (obj.response) finalSummary += obj.response;
                    } catch {}
                  }
                }
              }
              done = streamDone;
            }
          } else {
            // fallback for non-streaming
            const data = await finalSummaryRes.json();
            finalSummary = data.response || '';
          }
          
          console.log('Final summarized result:', finalSummary);
          return { summary: finalSummary, error: '' };
        } else {
          console.log('Final summarization failed, returning combined results');
          return { summary: combinedSummary, error: '' };
        }
      } catch (error: any) {
        console.error('Error in final summarization:', error);
        console.log('Returning combined results instead');
        return { summary: combinedSummary, error: '' };
      }
    }
    
    return { summary: combinedSummary, error: '' };
    
  } catch (error: any) {
    console.error('Ollama server error:', error);
    return { summary: '', error: error.message || 'An error occurred' };
  }
});
