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

        texts = [c['text'] for c in chunks]
        safe_print_err(f'Computing embeddings for {len(texts)} chunks...')
        try:
            embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
            embeddings = np.array(embeddings, dtype='float32')
        except Exception as e:
            safe_print_err('Embedding computation failed:', str(e))
            safe_print_err(traceback.format_exc())
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

        # Update metadata file
        meta = []
        if os.path.exists(meta_path):
            try:
                with open(meta_path, 'r', encoding='utf-8') as f:
                    meta = json.load(f)
            except Exception:
                safe_print_err('Failed to load existing meta file, starting fresh')
                meta = []

        for i, c in enumerate(chunks):
            meta.append({"id": existing_count + i, "text": c['text'], "start": c['start'], "end": c['end']})

        try:
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
        except Exception as e:
            safe_print_err('Failed to write meta file:', str(e))
            safe_print_err(traceback.format_exc())
            sys.exit(6)

        # Print final JSON result to stdout ONLY
        result = {"added": len(chunks), "total": index.ntotal, "index_path": index_path, "meta_path": meta_path}
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
