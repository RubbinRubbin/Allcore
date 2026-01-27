"""
Script per indicizzare i documenti fiscali in ChromaDB.
Eseguire dalla cartella backend: python -m scripts.ingest
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

import chromadb
from chromadb.config import Settings
from openai import OpenAI

# Configuration
DOCUMENTS_DIR = Path(__file__).parent.parent / "data" / "documents"
CHROMA_DIR = Path(__file__).parent.parent / "chroma_db"
EMBEDDING_MODEL = "text-embedding-3-small"
CHUNK_SIZE = 1000  # characters per chunk
CHUNK_OVERLAP = 200


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables")
    return OpenAI(api_key=api_key)


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        # Try to break at paragraph or sentence boundary
        if end < len(text):
            # Look for paragraph break
            last_para = chunk.rfind('\n\n')
            if last_para > chunk_size // 2:
                chunk = chunk[:last_para]
                end = start + last_para
            else:
                # Look for sentence break
                last_period = chunk.rfind('. ')
                if last_period > chunk_size // 2:
                    chunk = chunk[:last_period + 1]
                    end = start + last_period + 1

        chunks.append(chunk.strip())
        start = end - overlap

    return [c for c in chunks if c]  # Remove empty chunks


def get_embedding(client: OpenAI, text: str) -> list[float]:
    """Generate embedding for text."""
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )
    return response.data[0].embedding


def process_document(file_path: Path) -> list[dict]:
    """Process a document and return chunks with metadata."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract title from first line
    lines = content.split('\n')
    title = lines[0].replace('#', '').strip() if lines else file_path.stem

    chunks = chunk_text(content)

    return [
        {
            "text": chunk,
            "metadata": {
                "source": title,
                "file": file_path.name,
                "chunk_index": i
            },
            "id": f"{file_path.stem}_{i}"
        }
        for i, chunk in enumerate(chunks)
    ]


def main():
    print("=" * 50)
    print("Allcore RAG - Document Ingestion")
    print("=" * 50)

    # Initialize OpenAI client
    print("\n[1/4] Initializing OpenAI client...")
    client = get_openai_client()
    print("      OpenAI client ready")

    # Initialize ChromaDB
    print("\n[2/4] Initializing ChromaDB...")
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    chroma_client = chromadb.PersistentClient(
        path=str(CHROMA_DIR),
        settings=Settings(anonymized_telemetry=False)
    )

    # Delete existing collection if exists
    try:
        chroma_client.delete_collection("fiscal_documents")
        print("      Deleted existing collection")
    except:
        pass

    collection = chroma_client.create_collection(
        name="fiscal_documents",
        metadata={"hnsw:space": "cosine"}
    )
    print(f"      ChromaDB ready at {CHROMA_DIR}")

    # Process documents
    print("\n[3/4] Processing documents...")
    all_chunks = []

    for file_path in DOCUMENTS_DIR.glob("*.md"):
        print(f"      Processing: {file_path.name}")
        chunks = process_document(file_path)
        all_chunks.extend(chunks)
        print(f"        -> {len(chunks)} chunks")

    print(f"\n      Total chunks: {len(all_chunks)}")

    # Generate embeddings and store
    print("\n[4/4] Generating embeddings and storing...")

    for i, chunk_data in enumerate(all_chunks):
        print(f"      Embedding {i+1}/{len(all_chunks)}: {chunk_data['id']}", end='\r')

        embedding = get_embedding(client, chunk_data["text"])

        collection.add(
            documents=[chunk_data["text"]],
            embeddings=[embedding],
            metadatas=[chunk_data["metadata"]],
            ids=[chunk_data["id"]]
        )

    print(f"\n      Stored {len(all_chunks)} chunks in ChromaDB")

    # Verify
    print("\n" + "=" * 50)
    print("INGESTION COMPLETE")
    print(f"Documents processed: {len(list(DOCUMENTS_DIR.glob('*.md')))}")
    print(f"Total chunks: {collection.count()}")
    print("=" * 50)

    # Test query
    print("\nTest query: 'deducibilità auto aziendale'")
    test_embedding = get_embedding(client, "deducibilità auto aziendale")
    results = collection.query(
        query_embeddings=[test_embedding],
        n_results=2
    )
    print(f"Found {len(results['documents'][0])} relevant chunks:")
    for i, doc in enumerate(results['documents'][0][:2]):
        print(f"  {i+1}. {doc[:100]}...")


if __name__ == "__main__":
    main()
