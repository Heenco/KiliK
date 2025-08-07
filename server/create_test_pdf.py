#!/usr/bin/env python3
# Create a simple test PDF file

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF (fitz) is not installed. Please run: pip install pymupdf")
    exit(1)

# Create a new PDF document
doc = fitz.open()

# Add a page
page = doc.new_page()

# Add some text
text = "This is a test PDF file created for testing pdf_process.py"
page.insert_text((50, 50), text, fontsize=12)

# Add a simple image (rectangle)
rect = fitz.Rect(50, 100, 200, 200)
page.draw_rect(rect, color=(0, 0, 1), fill=(1, 0, 0))

# Save the PDF
output_path = "test.pdf"
doc.save(output_path)
doc.close()

print(f"Created test PDF file at: {output_path}")
