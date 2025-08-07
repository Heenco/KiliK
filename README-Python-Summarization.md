# Python Text Summarization for Inspection Reports

This application provides two methods for analyzing inspection reports:

1. **AI Analysis**: Using OpenAI's GPT-4 API (requires an API key)
2. **Python Analysis**: Using NLTK and rule-based extraction (no API key needed)

## Python-based Summarization

The Python-based analysis uses the Natural Language Toolkit (NLTK) and rule-based extraction to identify and categorize issues from inspection report text. This approach:

- Does not require an external API or key
- Works entirely locally
- Uses keyword matching and basic NLP techniques
- Is faster but potentially less accurate than AI-based analysis

### How It Works

The Python summarization process:

1. Tokenizes the inspection report text into sentences
2. Identifies potential issue sentences using keyword patterns
3. Categorizes issues as "Major" or "Minor" based on severity keywords
4. Extracts meaningful titles from the beginning of each issue sentence
5. Ranks issues by importance using word frequency analysis
6. Returns a structured list of issues in the same format as the AI analysis

### Required Dependencies

The Python script requires the NLTK library. Install it using:

```
pip install nltk
```

The script will automatically download the required NLTK data files on first run.

## Comparing the Two Approaches

| Feature | AI Analysis | Python Analysis |
|---------|------------|----------------|
| Accuracy | Higher | Moderate |
| Speed | Slower (API call) | Faster (local) |
| Cost | Requires API key | Free |
| Handling complex language | Excellent | Basic |
| Context understanding | High | Limited |
| Customization | Limited | Highly customizable |

## When to Use Each

- **Use AI Analysis**: For high-quality, nuanced analysis of complex reports
- **Use Python Analysis**: For faster results, when offline, or to avoid API costs

The Python analysis is particularly useful as a fallback when the OpenAI API is unavailable or rate-limited.
