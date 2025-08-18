import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';

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

export default defineEventHandler(async (event: H3Event): Promise<SummaryResponse> => {
  try {
    // Get the request body containing the PDF text
    const body = await readBody(event);
    const { text } = body;

    if (!text) {
      return { issues: [], error: 'No text provided' };
    }    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = '';
    
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return { issues: [], error: 'OpenAI API key is not configured in environment variables' };
    }

    // Call OpenAI's GPT-4 API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },      body: JSON.stringify({        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert building inspector reviewing property inspection reports. Extract issues from the provided text and categorize them as major or minor issues.'
          },
          {
            role: 'user',
            content: `Extract all major and minor issues from the following inspection report text. 
            Format the results as a JSON array of objects with the following structure:
            { "issues": [{ "issue": "Issue title", "severity": "Major", "description": "Detailed description" }, ...] }
            
            Only include actual issues, not general comments. Your response MUST be a valid JSON object.
            
            Report text:
            ${text.substring(0, 15000)}` // Limit text length to avoid token limits
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });    if (!response.ok) {
      let errorMessage = 'Failed to analyze text with AI';
      try {
        const errorData = await response.json();
        console.error('OpenAI API error:', JSON.stringify(errorData));
        if (errorData.error && errorData.error.message) {
          errorMessage = `OpenAI API error: ${errorData.error.message}`;
        }
      } catch (e) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
      }
      return { issues: [], error: errorMessage };
    }
      // We've already checked response.ok above, so we don't need to do it againconst data = await response.json();
    let issues: Issue[] = [];    try {
      // Parse the JSON response content
      const content = data.choices[0]?.message?.content;
      console.log('OpenAI raw response content:', content);
      
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }
      
      // Parse JSON directly from the content
      const parsedContent = JSON.parse(content);
      
      // Extract issues array from the response
      issues = parsedContent.issues || [];
      console.log('Extracted issues count:', issues.length);
      
      // Validate the structure
      issues = issues.filter(issue => 
        issue && 
        typeof issue.issue === 'string' && 
        (issue.severity === 'Major' || issue.severity === 'Minor') &&
        typeof issue.description === 'string'
      );
      
      console.log('Filtered issues count:', issues.length);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return { issues: [], error: 'Failed to parse AI response: ' + e.message };
    }

    return { issues };
  } catch (error: any) {
    console.error('Error in summarize-issues endpoint:', error);
    return { issues: [], error: error.message || 'An error occurred' };
  }
});