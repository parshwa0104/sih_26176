import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def get_vector_store():
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    # Use persistent client so data survives restarts
    persist_directory = os.path.join(os.path.dirname(__file__), "..", "data", "chroma_db")
    
    # Ensure the directory exists
    os.makedirs(persist_directory, exist_ok=True)
    
    vector_store = Chroma(
        collection_name="orca_long_term_memory",
        embedding_function=embeddings,
        persist_directory=persist_directory
    )
    return vector_store

def add_memory(user_id: str, content: str):
    """Add a new memory for a user."""
    vs = get_vector_store()
    vs.add_texts(texts=[content], metadatas=[{"user_id": user_id}])

def recall_memories(user_id: str, query: str, k: int = 3) -> str:
    """Recall relevant memories for a user based on the current query."""
    vs = get_vector_store()
    
    try:
        # We use a filter to only get memories for this user
        results = vs.similarity_search(query, k=k, filter={"user_id": user_id})
        if not results:
            return "No relevant past memories found."
        
        memories = [doc.page_content for doc in results]
        return "\n".join(memories)
    except Exception as e:
        print("Memory recall failed:", e)
        return "Memory unavailable."
