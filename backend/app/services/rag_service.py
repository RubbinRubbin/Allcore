"""
RAG Service using TF-IDF for document retrieval.
Simple and effective approach that doesn't require external vector databases.
"""

import os
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Path to documents
DOCUMENTS_DIR = Path(__file__).parent.parent.parent / "data" / "documents"

# Global state for loaded documents
_documents: list[dict] = []
_vectorizer: TfidfVectorizer | None = None
_tfidf_matrix = None


def load_documents():
    """Load all markdown documents from the data directory."""
    global _documents, _vectorizer, _tfidf_matrix

    if _documents:  # Already loaded
        return

    _documents = []

    if not DOCUMENTS_DIR.exists():
        print(f"Documents directory not found: {DOCUMENTS_DIR}")
        return

    for file_path in DOCUMENTS_DIR.glob("*.md"):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract title from first line
        lines = content.split('\n')
        title = lines[0].replace('#', '').strip() if lines else file_path.stem

        _documents.append({
            "title": title,
            "content": content,
            "file": file_path.name
        })

    if _documents:
        # Create TF-IDF vectorizer
        _vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words=None,  # Keep Italian words
            ngram_range=(1, 2),  # Unigrams and bigrams
            max_features=5000
        )

        # Fit and transform documents
        texts = [doc["content"] for doc in _documents]
        _tfidf_matrix = _vectorizer.fit_transform(texts)

        print(f"Loaded {len(_documents)} documents for RAG")


def query_documents(query: str, n_results: int = 2) -> str:
    """
    Query documents using TF-IDF similarity.
    Returns relevant context as a formatted string.
    """
    # Ensure documents are loaded
    load_documents()

    if not _documents or _vectorizer is None or _tfidf_matrix is None:
        return ""

    try:
        # Transform query
        query_vector = _vectorizer.transform([query])

        # Calculate cosine similarity
        similarities = cosine_similarity(query_vector, _tfidf_matrix).flatten()

        # Get top n results
        top_indices = similarities.argsort()[-n_results:][::-1]

        # Filter out low similarity results
        context_parts = []
        for idx in top_indices:
            if similarities[idx] > 0.05:  # Minimum similarity threshold
                doc = _documents[idx]
                context_parts.append(f"### {doc['title']}\n{doc['content'][:2000]}")

        return "\n\n---\n\n".join(context_parts)

    except Exception as e:
        print(f"RAG query error: {e}")
        return ""


def get_all_documents() -> list[dict]:
    """Get list of all loaded documents (for debugging/display)."""
    load_documents()
    return [{"title": d["title"], "file": d["file"]} for d in _documents]


# Load documents on module import
load_documents()
