import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  reportContext?: any; // Report context including text, metadata, etc.
  conversationHistory?: ChatMessage[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event) as ChatRequest;
    const { message, reportContext, conversationHistory = [] } = body;
    
    console.log('Chat with DeepInfra - User message:', message);
    
    if (!message?.trim()) {
      return { response: '', error: 'No message provided' };
    }

    const deepInfraToken = "RZDmyvBu0dfJ8IuOddkaT9awvxucbUA5";
    if (!deepInfraToken) {
      return { response: '', error: 'DeepInfra API token not configured' };
    }

    // Build messages array for DeepInfra API
    const messages = [];

    // System message with inspection report context
    let systemContent = 'You are a helpful AI assistant specializing in property inspection reports. Provide clear, helpful responses based on the inspection report data.';
    
    if (reportContext?.text) {
      systemContent += `\n\nInspection Report Content:\n${reportContext.text.substring(0, 50000)}`;
    }

    // Add analysis results if available
    if (reportContext?.analysisResults) {
      const { issues, gensimSummary, ollamaSummary, deepInfraSummary } = reportContext.analysisResults;
      
      if (issues?.length > 0) {
        systemContent += '\n\nIdentified Issues:\n';
        issues.slice(0, 10).forEach((issue: any, index: number) => {
          systemContent += `${index + 1}. ${issue.issue} (${issue.severity}): ${issue.description}\n`;
        });
      }
      
      if (deepInfraSummary) {
        systemContent += `\n\nPrevious Analysis Summary:\n${deepInfraSummary.substring(0, 2000)}`;
      } else if (gensimSummary) {
        systemContent += `\n\nText Summary:\n${gensimSummary.substring(0, 2000)}`;
      }
    }

    messages.push({
      role: "system",
      content: systemContent
    });

    // Add recent conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: message
    });

    console.log('Sending to DeepInfra with', messages.length, 'messages');

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepInfraToken}`
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-VL-32B-Instruct",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepInfra API error:', response.status, errorText);
      return { response: '', error: `DeepInfra API error (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid DeepInfra response:', data);
      return { response: '', error: 'Invalid response from DeepInfra API' };
    }

    const assistantResponse = data.choices[0].message.content;
    
    console.log('DeepInfra chat response:', assistantResponse.substring(0, 200) + '...');
    
    return { 
      response: assistantResponse.trim(),
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
