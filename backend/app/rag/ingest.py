import os
import glob
from app.core.config import settings
from app.rag.vectorstore import get_chroma_collection

def get_hr_policies_dir():
    candidates = [
        os.path.join(os.path.dirname(settings.BASE_DIR), "data", "hr_policies"),
        os.path.join(settings.BASE_DIR, "data", "hr_policies"),
        os.path.join(os.getcwd(), "data", "hr_policies"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return candidates[0]

HR_POLICIES_DIR = get_hr_policies_dir()

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

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Ekstrak teks dari file PDF menggunakan pypdf.
    """
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
        return text
    except Exception as e:
        print(f"[-] Gagal membaca PDF {pdf_path}: {e}")
        return ""

def ingest_hr_policies():
    """
    Membaca semua dokumen kebijakan HR di folder data/hr_policies/ (.md, .txt, .pdf) dan memasukkannya ke ChromaDB.
    """
    if not os.path.exists(HR_POLICIES_DIR):
        print(f"[-] Folder HR Policies tidak ditemukan di: {HR_POLICIES_DIR}")
        return

    collection = get_chroma_collection()
    
    # Cari semua file .md, .txt, dan .pdf
    policy_files = (
        glob.glob(os.path.join(HR_POLICIES_DIR, "*.md")) +
        glob.glob(os.path.join(HR_POLICIES_DIR, "*.txt")) +
        glob.glob(os.path.join(HR_POLICIES_DIR, "*.pdf"))
    )
    
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
        if file_path.lower().endswith(".pdf"):
            content = extract_text_from_pdf(file_path)
        else:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
        if not content.strip():
            continue

        chunks = split_text_into_chunks(content)
        for idx, chunk in enumerate(chunks):
            chunk_id = f"{file_name}_chunk_{idx}"
            documents.append(chunk)
            metadatas.append({"source": file_name, "chunk_index": idx})
            ids.append(chunk_id)
            chunk_counter += 1
            
    if documents:
        batch_size = 50
        total_batches = (len(documents) - 1) // batch_size + 1
        for i in range(0, len(documents), batch_size):
            end_idx = i + batch_size
            collection.upsert(
                documents=documents[i:end_idx],
                metadatas=metadatas[i:end_idx],
                ids=ids[i:end_idx]
            )
            print(f"[*] Batch {i // batch_size + 1}/{total_batches} ({min(end_idx, len(documents))}/{len(documents)} chunks) berhasil diindeks...")
        print(f"[+] Sukses mengindeks total {chunk_counter} chunk dokumen HR policy ke ChromaDB!")
    else:
        print("[-] Tidak ada dokumen yang diindeks.")

if __name__ == "__main__":
    ingest_hr_policies()
