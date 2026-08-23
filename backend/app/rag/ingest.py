import os
import glob
from app.core.config import settings
from app.rag.vectorstore import get_chroma_collection

HR_POLICIES_DIR = os.path.join(settings.BASE_DIR, "data", "hr_policies")

def split_text_into_chunks(text: str, chunk_size: int = 500, overlap: int = 50):
    """
    Fungsi pembagi teks (chunking) sederhana dan efektif berdasarkan paragraf & karakter.
    """
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""
    
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
            
        if len(current_chunk) + len(p) <= chunk_size:
            current_chunk += "\n\n" + p if current_chunk else p
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = p
            
    if current_chunk:
        chunks.append(current_chunk)
        
    return chunks

def ingest_hr_policies():
    """
    Membaca semua dokumen kebijakan HR di folder data/hr_policies/ dan memasukkannya ke ChromaDB.
    """
    if not os.path.exists(HR_POLICIES_DIR):
        print(f"[-] Folder HR Policies tidak ditemukan di: {HR_POLICIES_DIR}")
        return

    collection = get_chroma_collection()
    
    # Cari semua file .md dan .txt
    policy_files = glob.glob(os.path.join(HR_POLICIES_DIR, "*.md")) + glob.glob(os.path.join(HR_POLICIES_DIR, "*.txt"))
    
    if not policy_files:
        print(f"[!] Tidak ada file kebijakan ditemukan di: {HR_POLICIES_DIR}")
        return

    print(f"[*] Menemukan {len(policy_files)} dokumen kebijakan HR...")
    
    documents = []
    metadatas = []
    ids = []
    
    chunk_counter = 0
    for file_path in policy_files:
        file_name = os.path.basename(file_path)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        chunks = split_text_into_chunks(content)
        for idx, chunk in enumerate(chunks):
            chunk_id = f"{file_name}_chunk_{idx}"
            documents.append(chunk)
            metadatas.append({"source": file_name, "chunk_index": idx})
            ids.append(chunk_id)
            chunk_counter += 1
            
    if documents:
        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"[+] Sukses mengindeks {chunk_counter} chunk dokumen HR policy ke ChromaDB!")
    else:
        print("[-] Tidak ada dokumen yang diindeks.")

if __name__ == "__main__":
    ingest_hr_policies()
