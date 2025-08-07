#!/bin/bash
# Setup script for Python NLP dependencies (Unix/Mac version)

# Define the Python executable path - you may need to adjust this
PYTHON_PATH="C:/Luma/Crime/venv/Scripts/python.exe"

echo "Installing required packages from requirements.txt..."
"$PYTHON_PATH" -m pip install -r "$(dirname "$0")/requirements.txt"

echo "Downloading NLTK data..."
"$PYTHON_PATH" -c "
import nltk
import os
import sys

# Create a user-specific data directory
nltk_data_path = os.path.expanduser('~/nltk_data')
os.makedirs(nltk_data_path, exist_ok=True)

# Add the path to NLTK's search paths
nltk.data.path.append(nltk_data_path)

# Download required NLTK data
print('Downloading punkt...')
nltk.download('punkt', download_dir=nltk_data_path)
print('Downloading stopwords...')
nltk.download('stopwords', download_dir=nltk_data_path)

print('NLTK data successfully downloaded to: ' + nltk_data_path)

# Test that the resources can be loaded
try:
    from nltk.tokenize import word_tokenize
    tokens = word_tokenize('Testing NLTK tokenization.')
    print(f'Tokenization test successful: {tokens}')
    
    from nltk.corpus import stopwords
    stops = stopwords.words('english')
    print(f'Stopwords test successful, loaded {len(stops)} words')
except Exception as e:
    print(f'Error testing NLTK resources: {str(e)}', file=sys.stderr)
    sys.exit(1)
"

echo "Setup complete!"
