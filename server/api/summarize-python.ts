import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';
import { spawn } from 'child_process';
import { resolve } from 'path';

// Define the response type to match what we'll return to the frontend
interface Issue {
  issue: string;
  severity: 'Major' | 'Minor';
  description: string;
}

interface SummaryResponse {
  issues: Issue[];
  error?: string;
}

// Helper function to determine if we're running locally or on Vercel
const isRunningLocally = () => {
  const host = process.env.VERCEL_URL || process.env.HOST || 'localhost'
  return !host.includes('vercel.app') && !process.env.VERCEL
}

// Helper function to call Render service for Python analysis
const callRenderPythonAnalysis = async (text: string) => {
  const config = useRuntimeConfig()
  const renderUrl = config.pythonServiceUrl
  
  // Call Render service for Python NLTK analysis
  const response = await fetch(`${renderUrl}/summarize-python`, {
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

export default defineEventHandler(async (event: H3Event): Promise<SummaryResponse> => {
  try {
    // Get the request body containing the PDF text
    const body = await readBody(event);
    const { text } = body;

    if (!text) {
      return { issues: [], error: 'No text provided' };
    }

    // Check if running locally or on Vercel
    if (isRunningLocally()) {
      console.log('Running locally - using local Python analysis')
      return await processLocalPythonAnalysis(text)
    } else {
      console.log('Running on Vercel - using Render service for Python analysis')
      try {
        const renderResult = await callRenderPythonAnalysis(text)
        
        // Format response to match local processing format
        return {
          issues: renderResult.issues || [],
          error: renderResult.error || null
        }
      } catch (error: any) {
        console.error('Render service error:', error)
        return { issues: [], error: error.message || 'Render service unavailable' }
      }
    }
  } catch (error: any) {
    console.error('Error in summarize-python endpoint:', error);
    return { issues: [], error: error.message || 'An error occurred' };
  }
});

// Local Python analysis function (existing logic)
async function processLocalPythonAnalysis(text: string): Promise<SummaryResponse> {
  // Path to the Python scripts (relative to the server directory)
  const mainScriptPath = resolve(process.cwd(), 'server/text_summarizer.py');
  const fallbackScriptPath = resolve(process.cwd(), 'server/simple_summarizer.py');
  
  // Use the same Python virtual environment as process-pdf.ts
  const pythonPath = 'C:/Luma/Crime/venv/Scripts/python.exe';
  
  // Run the Python script with the text as input using the specified venv
  const result = await new Promise<{ issues: Issue[] } | { error: string }>(async (resolve, reject) => {
    try {
      console.log('Attempting to run main text summarizer...');
      const issues = await runPythonSummarizer(pythonPath, mainScriptPath, text);
      resolve(issues);
    } catch (mainError) {
      console.error('Main summarizer failed, trying fallback:', mainError);
      try {
        console.log('Running fallback summarizer...');
        const fallbackIssues = await runPythonSummarizer(pythonPath, fallbackScriptPath, text);
        resolve(fallbackIssues);
      } catch (fallbackError: any) {
        console.error('Both summarizers failed:', fallbackError);
        resolve({ error: `Summarization failed: ${fallbackError.message}` });
      }
    }
  });
  
  // Helper function to run a Python script
  async function runPythonSummarizer(pythonPath: string, scriptPath: string, text: string): Promise<{ issues: Issue[] } | { error: string }> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonPath, [scriptPath]);
      let stdoutData = '';
      let stderrData = '';

      // Send the text to the Python script via stdin
      pythonProcess.stdin.write(text);
      pythonProcess.stdin.end();

      // Collect stdout data
      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      // Collect stderr data (for errors)
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error('STDERR:', stderrData);
          return resolve({ error: `Error processing text: ${stderrData}` });
        }

        try {
          const parsedData = JSON.parse(stdoutData);
          resolve(parsedData);
        } catch (e) {
          console.error('Error parsing Python output:', e);
          console.error('Output was:', stdoutData);
          resolve({ error: 'Failed to parse Python output' });
        }
      });

      // Handle process error
      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  }

  // Handle error result
  if ('error' in result) {
    return { issues: [], error: result.error };
  }

  // Validate and return the issues
  const issues = result.issues || [];
  const validIssues = issues.filter(issue => 
    issue && 
    typeof issue.issue === 'string' && 
    (issue.severity === 'Major' || issue.severity === 'Minor') &&
    typeof issue.description === 'string'
  );

  return { issues: validIssues };
}
