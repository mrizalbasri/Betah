import os
import chromadb
import chromadb.utils.embedding_functions as ef
from typing import List, Dict, Any
from app.core.config import settings
from app.rag.reranker import rerank_documents

CHROMA_DIR = os.path.join(settings.BASE_DIR, "backend", "chroma_db")
COLLECTION_NAME = "hr_policies"

_chroma_client = None
_collection = None

def get_embedding_function():
    """
    Menggunakan HuggingFace SentenceTransformers (all-MiniLM-L6-v2) untuk embedding lokal gratis.
    """
    return ef.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def get_chroma_collection():
    """
    Mendapatkan atau membuat koleksi ChromaDB 'hr_policies'.
    """
    global _chroma_client, _collection
    if _collection is not None:
        return _collection

    os.makedirs(CHROMA_DIR, exist_ok=True)
    _chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
    embedding_func = get_embedding_function()
    
    _collection = _chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_func,
        metadata={"hnsw:space": "cosine"}
    )
    return _collection

def query_vectorstore(query: str, n_results: int = 3) -> List[Dict[str, Any]]:
    """
    1. Retrieval kandidat awal via Cosine Similarity di ChromaDB.
    2. Reranking ulang menggunakan modul standalone CrossEncoder (backend/app/rag/reranker.py).
    """
    collection = get_chroma_collection()
    fetch_candidates = max(n_results * 3, 10)
    
    results = collection.query(
        query_texts=[query],
        n_results=fetch_candidates
    )
    
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    
    retrieved_chunks = []
    for i in range(len(documents)):
        retrieved_chunks.append({
            "content": documents[i],
            "source": metadatas[i].get("source", "HR Policy Document") if metadatas else "HR Policy Document",
            "distance": float(distances[i]) if distances else 0.0
        })
        
    # Panggil modul Reranker terpisah
    return rerank_documents(query, retrieved_chunks, top_k=n_results)
