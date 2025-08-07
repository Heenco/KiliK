#!/usr/bin/env python3
"""
Simple text summarizer that works without requiring NLTK resources.
This is a fallback in case the full NLP pipeline fails.
"""
import re
import json
import sys

def simple_extract_issues(text):
    """Extract issues from text using regex patterns only without NLTK."""
    # Split text into sentences (simple approach)
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # Define keyword patterns for issues, major and minor problems
    issue_words = ['issue', 'problem', 'damage', 'defect', 'concern', 'attention', 'repair', 
                  'replace', 'fix', 'broken', 'cracked', 'leaking', 'missing', 'failing', 
                  'inadequate', 'improper', 'deteriorating', 'worn', 'loose', 'recommendation']
    
    major_words = ['significant', 'major', 'serious', 'critical', 'severe', 'hazardous', 
                  'dangerous', 'safety concern', 'immediate attention', 'structural', 
                  'foundation', 'electrical hazard', 'fire hazard', 'health hazard', 
                  'water damage', 'mold', 'asbestos', 'lead', 'code violation']
    
    minor_words = ['minor', 'cosmetic', 'aesthetic', 'small', 'slight', 'minimal', 
                  'maintenance', 'recommend', 'consider', 'monitor', 'observe', 'note', 
                  'paint', 'clean', 'adjust', 'tighten', 'caulk']
    
    # Find potential issue sentences
    issues = []
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence or len(sentence) < 10:
            continue
            
        # Check if sentence contains issue words
        has_issue = any(word in sentence.lower() for word in issue_words)
        if not has_issue:
            continue
            
        # Determine severity
        severity = "Minor"  # Default
        if any(word in sentence.lower() for word in major_words):
            severity = "Major"
            
        # Create simple title from first few words
        words = sentence.split()
        title = " ".join(words[:min(7, len(words))])
        if len(title) > 50:
            title = title[:50] + "..."
            
        issues.append({
            "issue": title,
            "severity": severity,
            "description": sentence
        })
    
    # Limit to most important issues (simple approach)
    if len(issues) > 20:
        issues = issues[:20]
        
    return issues

if __name__ == "__main__":
    try:
        # Read input text from stdin
        text = sys.stdin.read()
        
        if not text or len(text.strip()) < 10:
            print(json.dumps({"issues": [], "error": "Text is too short to process"}))
            sys.exit(0)
        
        # Process the text with the simple extractor
        issues = simple_extract_issues(text)
        
        # Output JSON to stdout
        print(json.dumps({"issues": issues}))
    except Exception as e:
        # Handle exceptions and return error message
        sys.stderr.write(f"Error: {str(e)}\n")
        print(json.dumps({"issues": [], "error": str(e)}))
