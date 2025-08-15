import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';
import { spawn } from 'child_process';
import { resolve } from 'path';

// Helper function to determine if we're running locally or on Vercel
const isRunningLocally = () => {
  const host = process.env.VERCEL_URL || process.env.HOST || 'localhost'
  return !host.includes('vercel.app') && !process.env.VERCEL
}

// Helper function to call Render service for Gensim analysis
const callRenderGensimAnalysis = async (text: string) => {
  const config = useRuntimeConfig()
  const renderUrl = config.pythonServiceUrl
  
  // Call Render service for Gensim analysis
  const response = await fetch(`${renderUrl}/summarize-gensim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Render service error: ${errorText}`)
  }

  return await response.json()
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { text } = body;
    
    if (!text) {
      return { summary: '', error: 'No text provided' };
    }

    // Check if running locally or on Vercel
    if (isRunningLocally()) {
      console.log('Running locally - using local Gensim analysis')
      return await processLocalGensimAnalysis(text)
    } else {
      console.log('Running on Vercel - using Render service for Gensim analysis')
      try {
        const renderResult = await callRenderGensimAnalysis(text)
        
        // Format response to match local processing format
        return {
          summary: renderResult.summary || '',
          error: renderResult.error || null
        }
      } catch (error: any) {
        console.error('Render service error:', error)
        return { summary: '', error: error.message || 'Render service unavailable' }
      }
    }
  } catch (error: any) {
    return { summary: '', error: error.message || 'An error occurred' };
  }
});

// Local Gensim analysis function (existing logic)
async function processLocalGensimAnalysis(text: string) {
  // Use the same Python virtual environment as summarize-python.ts
  const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe';
  const scriptPath = resolve(process.cwd(), 'server/summarize_gensim.py');

  // Call the Python script directly
  const result = await new Promise<{ summary: string; error?: string }>((resolve) => {
    const py = spawn(pythonPath, [scriptPath]);
    let output = '';
    let error = '';
    
    py.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    py.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    py.on('close', () => {
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        resolve({ summary: '', error: error || 'Failed to parse Python output' });
      }
    });
    
    py.stdin.write(JSON.stringify({ text }));
    py.stdin.end();
  });
  
  return result;
}
