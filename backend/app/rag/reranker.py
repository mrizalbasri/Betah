from typing import List, Dict, Any

_reranker_model = None

def get_reranker_model():
    """
    Model Reranker Standalone Gratis dari HuggingFace (cross-encoder/ms-marco-MiniLM-L-6-v2).
    Ukuran sangat ringan (~90MB), super cepat, cocok untuk Docker Hub & Azure Deployment.
    """
    global _reranker_model
    if _reranker_model is None:
        try:
            from sentence_transformers import CrossEncoder
            _reranker_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
            print("[+] HuggingFace Standalone Reranker Loaded: cross-encoder/ms-marco-MiniLM-L-6-v2 (~90MB)")
        except Exception as e:
            print(f"[!] Warning: Reranker failed to load ({e}), fallback without reranking.")
            _reranker_model = False
    return _reranker_model if _reranker_model is not False else None

def rerank_documents(query: str, retrieved_chunks: List[Dict[str, Any]], top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Memeringkat ulang (Rerank) kandidat chunk dokumen berdasarkan kueri pengguna
    menggunakan CrossEncoder HuggingFace secara terpisah.
    """
    if not retrieved_chunks:
        return []
    
    reranker = get_reranker_model()
    if not reranker:
        return retrieved_chunks[:top_k]
    
    try:
        pairs = [(query, chunk["content"]) for chunk in retrieved_chunks]
        rerank_scores = reranker.predict(pairs)
        
        for idx, score in enumerate(rerank_scores):
            retrieved_chunks[idx]["rerank_score"] = float(score)
            
        retrieved_chunks.sort(key=lambda x: x.get("rerank_score", 0.0), reverse=True)
    except Exception as err:
        print(f"[!] Warning: Reranking execution error: {err}")
        
    return retrieved_chunks[:top_k]
