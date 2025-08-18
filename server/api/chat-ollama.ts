import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  context?: string; // Optional inspection report context
  chatHistory?: ChatMessage[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event) as ChatRequest;
    const { message, context, chatHistory = [] } = body;
    
    console.log('Chat with Ollama - User message:', message);
    
    if (!message?.trim()) {
      return { response: '', error: 'No message provided' };
    }

    // Build context-aware prompt
    let systemPrompt = 'You are a helpful AI assistant specializing in property inspection reports. Provide clear, helpful responses.';
    
    if (context) {
      systemPrompt += `\n\nYou have access to the following inspection report content:\n${context.substring(0, 5000)}`;
    }

    // Include recent chat history for context (last 5 messages)
    const recentHistory = chatHistory.slice(-5);
    let conversationContext = '';
    
    if (recentHistory.length > 0) {
      conversationContext = '\n\nRecent conversation:\n';
      recentHistory.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}\n\nAssistant:`;

    console.log('Sending to Ollama with context length:', fullPrompt.length);

    const ollamaRes = await fetch('https://0a321ecd30ab.ngrok-free.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: fullPrompt,
        stream: false // Use non-streaming for chat for simplicity
      })
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error('Ollama API error:', ollamaRes.status, errorText);
      return { response: '', error: `Ollama API error (${ollamaRes.status}): ${errorText}` };
    }

    const data = await ollamaRes.json();
    const response = data.response || '';
    
    console.log('Ollama chat response:', response.substring(0, 200) + '...');
    
    return { 
      response: response.trim(),
      error: '' 
    };

  } catch (error: any) {
    console.error('Chat server error:', error);
    return { 
      response: '', 
      error: error.message || 'An error occurred during chat' 
    };
  }
});
