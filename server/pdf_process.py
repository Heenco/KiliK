#!/usr/bin/env python3
# PDF processing script for extracting text, metadata, and images from PDFs

import argparse
import json
import os
import sys
import base64
from io import BytesIO
from pathlib import Path

# Try to import required libraries
try:
    import fitz  # PyMuPDF
    from PIL import Image
except ImportError:
    print(json.dumps({
        "error": "Required libraries not installed. Please run: pip install pymupdf pillow"
    }))
    sys.exit(1)

def process_pdf(file_path):
    """
    Process a PDF file to extract text, metadata, and images
    Returns a JSON object with the extracted data
    """
    result = {
        "text": "",
        "metadata": {},
        "images": [],
        "tables": []
    }
    try:
        doc = fitz.open(file_path)
        result["metadata"] = {
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "subject": doc.metadata.get("subject", ""),
            "keywords": doc.metadata.get("keywords", ""),
            "creator": doc.metadata.get("creator", ""),
            "producer": doc.metadata.get("producer", ""),
            "creationDate": doc.metadata.get("creationDate", ""),
            "modDate": doc.metadata.get("modDate", ""),
            "pageCount": len(doc)
        }
        text_content = []
        for page_num, page in enumerate(doc):
            text_content.append(page.get_text())
        result["text"] = "\n".join(text_content)
        
        # Remove duplicate images by hashing image bytes
        import hashlib
        seen_hashes = set()
        for page_num, page in enumerate(doc):
            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    # Hash the image bytes to detect duplicates
                    img_hash = hashlib.sha256(image_bytes).hexdigest()
                    if img_hash in seen_hashes:
                        continue  # skip duplicate
                    seen_hashes.add(img_hash)
                    image = Image.open(BytesIO(image_bytes))
                    if image.width < 100 or image.height < 100:
                        continue
                    buffered = BytesIO()
                    image.convert("RGB").save(buffered, format="JPEG", quality=70)
                    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    result["images"].append(f"data:image/jpeg;base64,{img_base64}")
                except Exception as e:
                    continue
        return result
    except Exception as e:
        return {
            "error": str(e),
            "text": "",
            "metadata": {},
            "images": [],
            "tables": []
        }
    finally:
        if 'doc' in locals():
            doc.close()

def main():
    parser = argparse.ArgumentParser(description='Process PDF files')
    parser.add_argument('file', help='Path to the PDF file')
    parser.add_argument('--output', help='Path to save the output JSON')
    args = parser.parse_args()
    if not os.path.exists(args.file):
        print(json.dumps({"error": f"File not found: {args.file}"}))
        return 1
    result = process_pdf(args.file)
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(result, f)
    else:
        print(json.dumps(result))
    return 0

if __name__ == "__main__":
    sys.exit(main())
