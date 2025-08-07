#!/usr/bin/env python3
import re
import os
import sys
import json
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from heapq import nlargest

def extract_issues(text):
    """
    Extract issues from inspection report text and categorize them
    using keyword-based extraction and simple heuristics.
    """
    try:
        # Download necessary NLTK data - specify download directory to ensure accessibility
        nltk_data_path = os.path.expanduser('~/nltk_data')
        os.makedirs(nltk_data_path, exist_ok=True)
        nltk.data.path.append(nltk_data_path)
        
        nltk.download('punkt', download_dir=nltk_data_path, quiet=False)
        nltk.download('stopwords', download_dir=nltk_data_path, quiet=False)
    except Exception as e:
        print(f"NLTK download warning: {str(e)}", file=sys.stderr)
        # Continue anyway - the resources might already be available elsewhere
    
    # Define keyword patterns for major and minor issues
    major_keywords = [
        r'\b(?:significant|major|serious|critical|severe|hazardous|dangerous|safety concern|'
        r'immediate attention|structural|foundation|electrical hazard|fire hazard|health hazard|'
        r'water damage|mold|asbestos|lead|code violation)\b'
    ]
    
    minor_keywords = [
        r'\b(?:minor|cosmetic|aesthetic|small|slight|minimal|maintenance|recommend|consider|'
        r'monitor|observe|note|paint|clean|adjust|tighten|caulk)\b'
    ]
    
    # Split text into sentences
    sentences = sent_tokenize(text)
    
    # Identify potential issue sentences (those that contain problems or recommendations)
    issue_indicators = [
        r'\b(?:issue|problem|damage|defect|concern|attention|repair|replace|fix|broken|'
        r'cracked|leaking|missing|failing|inadequate|improper|deteriorating|worn|loose|recommendation)\b'
    ]
    
    # Combine all patterns
    issue_pattern = re.compile('|'.join(issue_indicators), re.IGNORECASE)
    major_pattern = re.compile('|'.join(major_keywords), re.IGNORECASE)
    minor_pattern = re.compile('|'.join(minor_keywords), re.IGNORECASE)
    
    # Extract and categorize issues
    issues = []
    
    for sentence in sentences:
        # Skip if sentence doesn't indicate an issue
        if not issue_pattern.search(sentence):
            continue
        
        # Determine severity based on keywords
        severity = "Minor"  # Default
        if major_pattern.search(sentence):
            severity = "Major"
        elif minor_pattern.search(sentence) or len(sentence) < 100:  # Short sentences about issues are often minor
            severity = "Minor"
            
        # Extract a meaningful title (first 5-7 words or use key phrases)
        words = word_tokenize(sentence)
        title_words = words[:min(7, len(words))]
        issue_title = " ".join(title_words)
        if len(issue_title) > 50:
            issue_title = issue_title[:50] + "..."
            
        # Add to issues list
        issues.append({
            "issue": issue_title,
            "severity": severity,
            "description": sentence.strip()
        })
      # Limit to most relevant issues (based on sentence scores)
    if len(issues) > 20:
        # Create a simplified summary to get most important sentences
        try:
            stop_words = set(stopwords.words('english'))
        except:
            # Fallback stopwords if NLTK data isn't properly loaded
            stop_words = set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
                             'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
                             'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
                             'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
                             'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
                             'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
                             'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
                             'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
                             'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
                             'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
                             'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
                             'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'])
            
        word_tokens = word_tokenize(text.lower())
        filtered_words = [word for word in word_tokens if word.isalnum() and word not in stop_words]
        
        # Calculate word frequencies
        freq = FreqDist(filtered_words)
        
        # Score sentences based on word frequencies
        sentence_scores = {}
        for issue in issues:
            sentence = issue["description"]
            score = 0
            for word in word_tokenize(sentence.lower()):
                if word in freq:
                    score += freq[word]
            sentence_scores[sentence] = score
        
        # Get top 20 issues
        top_sentences = nlargest(20, sentence_scores, key=sentence_scores.get)
        issues = [issue for issue in issues if issue["description"] in top_sentences]
    
    return issues

if __name__ == "__main__":
    try:
        # Read input text from stdin
        text = sys.stdin.read()
        
        if not text or len(text.strip()) < 10:
            print(json.dumps({"issues": [], "error": "Text is too short to process"}))
            sys.exit(0)
            
        try:
            # Try a simple test to make sure NLTK is working properly
            test_sentence = "This is a test sentence for NLTK tokenization."
            tokens = word_tokenize(test_sentence)
            if not tokens:
                raise Exception("NLTK tokenization failed")
        except Exception as nltk_error:
            sys.stderr.write(f"NLTK initialization error: {str(nltk_error)}\n")
            
            # Try to download resources one more time with more explicit config
            try:
                nltk.download('punkt')
                nltk.download('stopwords')
            except:
                pass
        
        # Process the text
        issues = extract_issues(text)
        
        # Output JSON to stdout
        print(json.dumps({"issues": issues}))
    except Exception as e:
        # Handle exceptions and return error message
        error_msg = str(e)
        sys.stderr.write(f"Error during text summarization: {error_msg}\n")
        
        # If it's an NLTK resource error, provide more helpful message
        if "Resource" in error_msg and "not found" in error_msg:
            error_msg = "NLTK resource error: Please ensure NLTK data is properly installed. " + error_msg
        
        print(json.dumps({"issues": [], "error": error_msg}))
