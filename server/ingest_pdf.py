#!/usr/bin/env python3
"""
Simple ingestion script for local FAISS index.
Reads JSON from stdin: {"text": "...", "reportName": "..."
Splits text into chunks, embeds with sentence-transformers, stores FAISS index and metadata.
Only the final JSON result is printed to stdout. All logs/errors go to stderr.
"""
import sys
import os
import json
import traceback
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0
    N = len(text)
    while start < N:
        end = min(start + chunk_size, N)
        chunk = text[start:end]
        chunks.append({"text": chunk, "start": start, "end": end})
        if end == N:
            break
        start = max(0, end - overlap)
    return chunks


def safe_print_err(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def main():
    try:
        try:
            data = json.load(sys.stdin)
        except Exception as e:
            safe_print_err('Failed to read JSON from stdin:', str(e))
            raise

        text = data.get("text", "")
        report = data.get("reportName", "report")
        if not text:
            safe_print_err('No text provided in input')
            print(json.dumps({"error": "no text provided"}))
            sys.exit(1)

        chunks = chunk_text(text)
        if len(chunks) == 0:
            safe_print_err('Chunking produced 0 chunks')
            print(json.dumps({"error": "no chunks created"}))
            sys.exit(1)

        # Load embedding model
        safe_print_err('Loading embedding model...', flush=True)
        try:
            model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            safe_print_err('Failed to load embedding model:', str(e))
            safe_print_err(traceback.format_exc())
            sys.exit(2)

        # Filter and validate chunks before embedding
        valid_chunks = []
        valid_texts = []
        
        for i, chunk in enumerate(chunks):
            text = chunk['text']
            
            # Skip if not a string
            if not isinstance(text, str):
                safe_print_err(f'Skipping chunk {i}: not a string (type: {type(text)})')
                continue
                
            # Skip if empty or too short
            if not text.strip() or len(text.strip()) < 10:
                safe_print_err(f'Skipping chunk {i}: too short or empty (len={len(text.strip())})')
                continue
            
            # Check for binary/PDF content patterns
            if any(pattern in text for pattern in ['%PDF-', 'obj\n<<', 'endobj', '/Type ', '/Length ']):
                safe_print_err(f'Skipping chunk {i}: contains PDF structure')
                continue
                
            # Check for excessive binary content (null bytes, control chars)
            binary_chars = sum(1 for c in text if ord(c) < 32 and c not in '\n\r\t ')
            if binary_chars > len(text) * 0.1:  # More than 10% binary chars
                safe_print_err(f'Skipping chunk {i}: too many binary characters ({binary_chars}/{len(text)})')
                continue
            
            # Check for reasonable text ratio
            printable_chars = sum(1 for c in text if c.isprintable() or c in '\n\r\t')
            if printable_chars < len(text) * 0.8:  # Less than 80% printable
                safe_print_err(f'Skipping chunk {i}: insufficient printable characters ({printable_chars}/{len(text)})')
                continue
                
            # Check for meaningful alphanumeric content
            alnum_chars = sum(1 for c in text if c.isalnum())
            if alnum_chars < 20:  # At least 20 alphanumeric characters
                safe_print_err(f'Skipping chunk {i}: insufficient alphanumeric content ({alnum_chars})')
                continue
            
            # Additional validation: ensure text can be encoded/decoded properly
            try:
                text.encode('utf-8').decode('utf-8')
            except UnicodeError:
                safe_print_err(f'Skipping chunk {i}: unicode encoding issues')
                continue
            
            # If we made it here, the chunk is valid
            valid_chunks.append(chunk)
            valid_texts.append(text.strip())
        
        if len(valid_texts) == 0:
            safe_print_err('No valid chunks found after filtering')
            print(json.dumps({"error": "no valid chunks after filtering"}))
            sys.exit(1)
        
        safe_print_err(f'Computing embeddings for {len(valid_texts)} valid chunks (filtered from {len(chunks)} total)...')
        
        # Final safety check: ensure all texts are strings and clean them
        cleaned_texts = []
        for i, text in enumerate(valid_texts):
            if not isinstance(text, str):
                safe_print_err(f'Warning: text {i} is not a string, converting')
                text = str(text)
            
            # Clean the text to ensure it's safe for tokenization
            text = text.strip()
            if not text:
                safe_print_err(f'Warning: text {i} became empty after cleaning, skipping')
                continue
                
            cleaned_texts.append(text)
        
        if len(cleaned_texts) == 0:
            safe_print_err('No texts remaining after final cleaning')
            print(json.dumps({"error": "no texts after final cleaning"}))
            sys.exit(1)
        
        # Update valid_chunks to match cleaned_texts
        valid_chunks = valid_chunks[:len(cleaned_texts)]
        
        try:
            embeddings = model.encode(cleaned_texts, show_progress_bar=False, convert_to_numpy=True)
            embeddings = np.array(embeddings, dtype='float32')
        except Exception as e:
            safe_print_err('Embedding computation failed:', str(e))
            safe_print_err(traceback.format_exc())
            # Debug: print first few problematic texts
            safe_print_err('First few texts that failed:')
            for i, text in enumerate(cleaned_texts[:5]):
                safe_print_err(f'  [{i}]: {repr(text[:100])}...')
            sys.exit(3)

        if embeddings.ndim != 2:
            safe_print_err('Embeddings have unexpected shape:', embeddings.shape)
            sys.exit(4)

        dim = embeddings.shape[1]

        out_dir = os.path.join(os.path.dirname(__file__), 'faiss_indices')
        os.makedirs(out_dir, exist_ok=True)
        index_path = os.path.join(out_dir, f"{report}.index")
        meta_path = os.path.join(out_dir, f"{report}_meta.json")

        # Load or create index
        try:
            if os.path.exists(index_path):
                try:
                    index = faiss.read_index(index_path)
                    existing_count = index.ntotal
                    # if dim mismatch, recreate
                    if index.d != dim:
                        safe_print_err(f'Existing index dim {index.d} != embedding dim {dim}, recreating index')
                        index = faiss.IndexFlatL2(dim)
                        existing_count = 0
                except Exception:
                    safe_print_err('Failed reading existing index, creating new one')
                    index = faiss.IndexFlatL2(dim)
                    existing_count = 0
            else:
                index = faiss.IndexFlatL2(dim)
                existing_count = 0

            index.add(embeddings)
            faiss.write_index(index, index_path)
        except Exception as e:
            safe_print_err('FAISS index operation failed:', str(e))
            safe_print_err(traceback.format_exc())
            sys.exit(5)

        # Update metadata file with only valid chunks
        meta = []
        if os.path.exists(meta_path):
            try:
                with open(meta_path, 'r', encoding='utf-8') as f:
                    meta = json.load(f)
            except Exception:
                safe_print_err('Failed to load existing meta file, starting fresh')
                meta = []

        for i, c in enumerate(valid_chunks):
            meta.append({"id": existing_count + i, "text": c['text'], "start": c['start'], "end": c['end']})

        try:
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
        except Exception as e:
            safe_print_err('Failed to write meta file:', str(e))
            safe_print_err(traceback.format_exc())
            sys.exit(6)

        # Print final JSON result to stdout ONLY
        result = {"added": len(valid_chunks), "total": index.ntotal, "index_path": index_path, "meta_path": meta_path}
        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
        return 0

    except SystemExit as se:
        # allow sys.exit codes propagated
        raise
    except Exception as e:
        safe_print_err('Unhandled exception in ingestion script:', str(e))
        safe_print_err(traceback.format_exc())
        # print a minimal JSON error to stdout so server can attempt to parse it if needed
        try:
            sys.stdout.write(json.dumps({"error": "unhandled_exception", "detail": str(e)}))
            sys.stdout.flush()
        except Exception:
            pass
        return 10


if __name__ == '__main__':
    code = main()
    sys.exit(code)
