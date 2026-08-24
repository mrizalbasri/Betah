import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.rag.ingest import ingest_hr_policies
from app.rag.vectorstore import query_vectorstore, get_chroma_collection
from app.rag.reranker import rerank_documents

def test_rag_ingest_and_rerank():
    print("[1] Menjalankan ingest dokumen HR Policies ke ChromaDB...")
    ingest_hr_policies()
    
    collection = get_chroma_collection()
    count = collection.count()
    print(f"[+] Total chunk di ChromaDB: {count}")
    assert count > 0, "Vectorstore seharusnya terisi setelah ingest!"
    
    query = "Apa kebijakan insentif lembur dan bonus retensi bagi karyawan?"
    print(f"\n[2] Menjalankan kueri RAG + CrossEncoder Reranker untuk: '{query}'")
    
    results = query_vectorstore(query=query, n_results=3)
    print(f"[+] Berhasil mengambil {len(results)} chunk teratas setelah reranking:")
    
    for idx, item in enumerate(results, 1):
        score_info = f" (rerank_score: {item['rerank_score']:.4f})" if "rerank_score" in item else ""
        print(f"\n--- Hasil #{idx} [{item['source']}]{score_info} ---")
        print(item["content"][:200] + "...")
        
    assert len(results) > 0, "Query RAG harus mengembalikan minimal 1 hasil!"
    print("\n[V] Uji coba RAG Pipeline + CrossEncoder Reranker BERHASIL!")

if __name__ == "__main__":
    test_rag_ingest_and_rerank()
