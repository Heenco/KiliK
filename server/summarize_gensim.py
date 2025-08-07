#!/usr/bin/env python3
import sys
import json
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

def main():
    input_data = sys.stdin.read()
    try:
        data = json.loads(input_data)
        text = data.get('text', '')
        if not text or len(text.split()) < 30:
            print(json.dumps({'summary': '', 'error': 'Text too short for summarization'}))
            return
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LsaSummarizer()
        # Summarize to 3 sentences or less if text is short
        summary_sentences = summarizer(parser.document, 3)
        summary = " ".join(str(sentence) for sentence in summary_sentences)
        print(json.dumps({'summary': summary}))
    except Exception as e:
        print(json.dumps({'summary': '', 'error': str(e)}))

if __name__ == '__main__':
    main()
