#!/usr/bin/env python3
"""
Simple script to query FAISS index and send chunks to DeepInfra for summarization.
Reads JSON from stdin: {"query": "...", "reportName": "...", "maxChunks": 5}
Finds similar chunks, sends to DeepInfra, returns summary.
"""
import sys
import os
import json
import traceback
import requests
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


def safe_print_err(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def query_faiss_index(query_text, report_name, max_chunks=5):
    """Query FAISS index for similar chunks"""
    script_dir = os.path.dirname(__file__)
    index_path = os.path.join(script_dir, 'faiss_indices', f"{report_name}.index")
    meta_path = os.path.join(script_dir, 'faiss_indices', f"{report_name}_meta.json")
    
    if not os.path.exists(index_path) or not os.path.exists(meta_path):
        return None, "Index not found for this report"
    
    try:
        # Load FAISS index and metadata
        index = faiss.read_index(index_path)
        with open(meta_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        # Load model and encode query
        model = SentenceTransformer('all-MiniLM-L6-v2')
        query_embedding = model.encode([query_text], convert_to_numpy=True)
        query_embedding = np.array(query_embedding, dtype='float32')
        
        # Search for similar chunks
        k = min(max_chunks, index.ntotal)
        distances, indices = index.search(query_embedding, k)
        
        # Get relevant chunks
        relevant_chunks = []
        for i, idx in enumerate(indices[0]):
            if idx < len(metadata):
                chunk = metadata[idx]
                relevant_chunks.append({
                    "text": chunk["text"],
                    "score": float(distances[0][i]),
                    "id": chunk.get("id", idx)
                })
        
        return relevant_chunks, None
    except Exception as e:
        return None, str(e)


def summarize_with_deepinfra(chunks, query):
    """Send chunks to DeepInfra for summarization"""
    # Combine chunks into context, but limit total size
    context_parts = []
    total_length = 0
    max_context_length = 8000  # Limit to prevent timeouts
    
    for i, chunk in enumerate(chunks):
        chunk_text = f"Chunk {i+1}:\n{chunk['text']}"
        if total_length + len(chunk_text) > max_context_length:
            break
        context_parts.append(chunk_text)
        total_length += len(chunk_text)
    
    context = "\n\n".join(context_parts)
    
    # Create prompt
    prompt = f"""Based on the following document excerpts, provide a comprehensive summary that addresses: "{query}"

Document excerpts:
{context}

Please provide a detailed summary that specifically addresses the query while incorporating relevant information from all the excerpts."""

    # DeepInfra API call
    url = "https://api.deepinfra.com/v1/openai/chat/completions"
    
    # Note: In production, use environment variable for API key
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer RZDmyvBu0dfJ8IuOddkaT9awvxucbUA5"  # TODO: Move to env
    }
    
    payload = {
        "model": "Qwen/Qwen2.5-VL-32B-Instruct",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 2000,
        "temperature": 0.3
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"], None
        else:
            return None, "No response from DeepInfra"
            
    except requests.exceptions.RequestException as e:
        return None, f"DeepInfra API error: {str(e)}"
    except Exception as e:
        return None, f"Unexpected error: {str(e)}"


def main():
    try:
        try:
            data = json.load(sys.stdin)
        except Exception as e:
            safe_print_err('Failed to read JSON from stdin:', str(e))
            raise

        query = data.get("query", "")
        report_name = data.get("reportName", "")
        max_chunks = data.get("maxChunks", 5)
        
        if not query or not report_name:
            safe_print_err('Missing query or reportName')
            print(json.dumps({"error": "missing_parameters", "detail": "query and reportName are required"}))
            sys.exit(1)

        safe_print_err(f'Querying FAISS index for report: {report_name}')
        
        # Query FAISS index for relevant chunks
        chunks, error = query_faiss_index(query, report_name, max_chunks)
        if error:
            safe_print_err(f'FAISS query failed: {error}')
            print(json.dumps({"error": "faiss_query_failed", "detail": error}))
            sys.exit(2)
        
        if not chunks:
            safe_print_err('No relevant chunks found')
            print(json.dumps({"error": "no_chunks_found", "detail": "No relevant content found for the query"}))
            sys.exit(3)
        
        safe_print_err(f'Found {len(chunks)} relevant chunks, sending to DeepInfra...')
        
        # Send to DeepInfra for summarization
        summary, error = summarize_with_deepinfra(chunks, query)
        if error:
            safe_print_err(f'DeepInfra summarization failed: {error}')
            print(json.dumps({"error": "summarization_failed", "detail": error}))
            sys.exit(4)
        
        # Return successful result
        result = {
            "summary": summary,
            "chunks_used": len(chunks),
            "query": query,
            "report_name": report_name
        }
        
        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
        return 0

    except SystemExit as se:
        raise
    except Exception as e:
        safe_print_err('Unhandled exception in query script:', str(e))
        safe_print_err(traceback.format_exc())
        try:
            sys.stdout.write(json.dumps({"error": "unhandled_exception", "detail": str(e)}))
            sys.stdout.flush()
        except Exception:
            pass
        return 10


if __name__ == '__main__':
    code = main()
    sys.exit(code)
