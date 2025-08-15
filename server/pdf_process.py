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
        
        full_text = "\n".join(text_content)
        # Limit text to 2MB to prevent huge outputs
        max_text_length = 2 * 1024 * 1024  # 2MB
        if len(full_text) > max_text_length:
            result["text"] = full_text[:max_text_length] + "\n\n[Text truncated - PDF contains more content...]"
        else:
            result["text"] = full_text
        
        # Remove duplicate images by hashing image bytes
        import hashlib
        seen_hashes = set()
        image_count = 0
        max_images = 50  # Limit to 50 images to allow more content
        
        for page_num, page in enumerate(doc):
            if image_count >= max_images:
                break
                
            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                if image_count >= max_images:
                    break
                    
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
                    
                    # Resize large images to reduce output size
                    max_dimension = 800
                    if image.width > max_dimension or image.height > max_dimension:
                        ratio = min(max_dimension / image.width, max_dimension / image.height)
                        new_size = (int(image.width * ratio), int(image.height * ratio))
                        image = image.resize(new_size, Image.Resampling.LANCZOS)
                    
                    buffered = BytesIO()
                    # Use lower quality for smaller file sizes
                    quality = 50 if image.width > 400 else 70
                    image.convert("RGB").save(buffered, format="JPEG", quality=quality)
                    
                    # Check if the base64 string would be too large
                    img_data = buffered.getvalue()
                    if len(img_data) > 2 * 1024 * 1024:  # Skip images larger than 2MB
                        continue
                        
                    img_base64 = base64.b64encode(img_data).decode('utf-8')
                    result["images"].append(f"data:image/jpeg;base64,{img_base64}")
                    image_count += 1
                    
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
