import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';
import { spawn } from 'child_process';
import { resolve } from 'path';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { text } = body;
    if (!text) {
      return { summary: '', error: 'No text provided' };
    }

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
  } catch (error: any) {
    return { summary: '', error: error.message || 'An error occurred' };
  }
});
