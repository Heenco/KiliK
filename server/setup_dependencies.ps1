$pythonPath = "C:/Luma/Crime/venv/Scripts/python.exe"
$requirementsPath = Join-Path -Path $PSScriptRoot -ChildPath "requirements.txt"

# Check if Python path exists
if (-not (Test-Path $pythonPath)) {
    Write-Error "Python virtual environment not found at $pythonPath"
    exit 1
}

# Install required packages
Write-Host "Installing required packages from $requirementsPath..." -ForegroundColor Green
& $pythonPath -m pip install -r $requirementsPath

# Download NLTK data
Write-Host "Downloading NLTK data..." -ForegroundColor Green
$NltkScript = @"
import nltk
import os
import sys

# Create a user-specific data directory
nltk_data_path = os.path.expanduser('~/nltk_data')
os.makedirs(nltk_data_path, exist_ok=True)

# Add the path to NLTK's search paths
nltk.data.path.append(nltk_data_path)

# Download required NLTK data to the user's home directory
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
"@

# Execute the Python script
$EncodedScript = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($NltkScript))
& $pythonPath -c "import base64, sys; exec(base64.b64decode(sys.argv[1]))" $EncodedScript

Write-Host "Setup complete!" -ForegroundColor Green
