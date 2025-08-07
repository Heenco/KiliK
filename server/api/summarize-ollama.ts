import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { text } = body;
    if (!text) {
      return { summary: '', error: 'No text provided' };
    }
    // Call Ollama local API
    const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Extract 5 major and minor issues from the following inspection report text.\n\n${text}`
        //prompt: `Summarize the following inspection report in 3-5 sentences, focusing on key issues and recommendations.\n\n${text}`
      })
    });
    if (!ollamaRes.ok) {
      return { summary: '', error: 'Ollama API error' };
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
    return { summary, error: '' };
  } catch (error: any) {
    return { summary: '', error: error.message || 'An error occurred' };
  }
});
