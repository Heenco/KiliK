import { defineEventHandler, readBody } from 'h3';
import type { H3Event } from 'h3';
import { extractValidJSON } from '~/utils/jsonUtils';

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
    }

    // Prepare the text to send (limit to 10000 characters)
    const textToSend = text.substring(0, 10000);
    console.log('Text being sent to OpenAI (length:', textToSend.length, 'characters):');
    console.log('--- START TEXT ---');
    console.log(textToSend);
    console.log('--- END TEXT ---');

    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = 'testtest';
    
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
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert building inspector reviewing property inspection reports. Extract issues from the provided text and categorize them as major or minor issues.'
          },
          {
            role: 'user',
            content: `Extract all major and minor issues from the following inspection report text. 
            
            You MUST respond with ONLY a valid JSON object in this exact format:
            {
              "issues": [
                {
                  "issue": "Issue title",
                  "severity": "Major",
                  "description": "Detailed description"
                }
              ]
            }
            
            Do not include any markdown formatting, explanations, or text outside the JSON.
            Only include actual issues, not general comments.
            Severity must be exactly "Major" or "Minor".
            
            Report text (truncated to fit token limits):
            ${textToSend}` // Use the prepared text variable
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
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

    const data = await response.json();
    let issues: Issue[] = [];
    
    try {
      // Parse the JSON response content
      const content = data.choices[0]?.message?.content;
      console.log('OpenAI raw response content:', content);
      
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }
      
      // First, let's try to clean up the response if it has markdown formatting
      let cleanContent = content.trim();
      
      // Remove markdown code blocks if present
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      let parsedContent;
      try {
        parsedContent = JSON.parse(cleanContent);
      } catch (e) {
        console.log('Direct JSON parse failed, trying extractValidJSON...');
        console.log('Clean content:', cleanContent);
        // Fallback to robust extraction if direct parse fails
        try {
          parsedContent = extractValidJSON(cleanContent);
        } catch (extractError) {
          console.error('extractValidJSON also failed:', extractError);
          // If all else fails, try to extract issues manually
          const issuePattern = /"issue":\s*"([^"]+)"[^}]*"severity":\s*"(Major|Minor)"[^}]*"description":\s*"([^"]+)"/g;
          const manualIssues = [];
          let match;
          while ((match = issuePattern.exec(cleanContent)) !== null) {
            manualIssues.push({
              issue: match[1],
              severity: match[2],
              description: match[3]
            });
          }
          if (manualIssues.length > 0) {
            parsedContent = { issues: manualIssues };
          } else {
            throw new Error(`Could not parse response. Content: ${cleanContent.substring(0, 200)}...`);
          }
        }
      }
      // Support both array and object responses
      if (Array.isArray(parsedContent)) {
        // If array of issues objects (e.g., [{ issues: [...] }]), flatten them
        if (parsedContent.length > 0 && parsedContent.every(item => item && Array.isArray(item.issues))) {
          issues = parsedContent.flatMap(item => item.issues);
        } else {
          issues = parsedContent;
        }
      } else if (parsedContent.issues && Array.isArray(parsedContent.issues)) {
        issues = parsedContent.issues;
      } else {
        issues = [];
      }
      console.log('Extracted issues count:', issues.length);
      
      // Validate the structure
      issues = issues.filter(issue => 
        issue && 
        typeof issue.issue === 'string' && 
        (issue.severity === 'Major' || issue.severity === 'Minor') &&
        typeof issue.description === 'string'
      );
      
      console.log('Filtered issues count:', issues.length);
    } catch (e: any) {
      console.error('Error parsing OpenAI response:', e);
      return { issues: [], error: 'Failed to parse AI response: ' + (e?.message || 'Unknown parsing error') };
    }

    return { issues };
  } catch (error: any) {
    console.error('Error in summarize-issues endpoint:', error);
    return { issues: [], error: error.message || 'An error occurred' };
  }
});
