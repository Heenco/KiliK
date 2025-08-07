// Utility for extracting and fixing JSON from potentially malformed strings
export function extractValidJSON(content: string): any {
  // If it's already valid JSON, return it parsed
  try {
    return JSON.parse(content);
  } catch (e) {
    console.log('Not valid JSON, attempting extraction...');
  }

  // Try to match an array pattern
  const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    try {
      const issuesArray = JSON.parse(arrayMatch[0]);
      return { issues: issuesArray };
    } catch (e) {
      console.error('Array extraction failed:', e);
    }
  }

  // Try to match a proper JSON object
  const objectMatch = content.match(/\{\s*"issues"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch (e) {
      console.error('Object extraction failed:', e);
    }
  }

  // Try to extract each issue individually and rebuild the array
  if (content.includes('"issue"') && content.includes('"severity"') && content.includes('"description"')) {
    try {
      const issueRegex = /\{\s*"issue"\s*:\s*"([^"]+)"\s*,\s*"severity"\s*:\s*"([^"]+)"\s*,\s*"description"\s*:\s*"([^"]+)"\s*\}/g;
      const issues = [];
      let match;
      
      while ((match = issueRegex.exec(content)) !== null) {
        issues.push({
          issue: match[1],
          severity: match[2],
          description: match[3]
        });
      }
      
      if (issues.length > 0) {
        return { issues };
      }
    } catch (e) {
      console.error('Regex extraction failed:', e);
    }
  }

  // As a very last resort, try to parse after cleaning up common issues
  try {
    // Replace single quotes with double quotes
    let cleaned = content.replace(/'/g, '"');
    
    // Fix common JSON syntax issues
    cleaned = cleaned.replace(/(\w+):/g, '"$1":');  // Convert property names to quoted strings
    cleaned = cleaned.replace(/:\s*"([^"]*)\n\s*([^"]*)"/g, ': "$1 $2"'); // Fix broken strings across lines
    
    // Try to find JSON-like structures in the cleaned content
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      const extractedJson = jsonMatch[0];
      
      // Check if it contains the issues structure, otherwise wrap it
      if (!extractedJson.includes('"issues"') && extractedJson.startsWith('[')) {
        return { issues: JSON.parse(extractedJson) };
      } else {
        return JSON.parse(extractedJson);
      }
    }
  } catch (e) {
    console.error('Cleanup extraction failed:', e);
  }
  
  // If all else fails
  throw new Error('Could not extract valid JSON from response');
}
