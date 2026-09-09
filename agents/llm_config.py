import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI

# Ollama is optional — only available when running locally, not on Render/cloud
try:
    from langchain_ollama import ChatOllama
    _has_ollama = True
except ImportError:
    _has_ollama = False

def get_llm(temperature: float = 0.0):
    fallbacks = []
    primary_llm = None
    
    # Check for local Ollama
    ollama_llm = None
    if _has_ollama:
        ollama_llm = ChatOllama(model="llama3", base_url="http://localhost:11434", temperature=temperature)

    # Check for Groq API Key
    if os.getenv("GROQ_API_KEY"):
        primary_llm = ChatGroq(model="qwen/qwen3.6-27b", temperature=temperature)
    
    # Check for Gemini API Key
    if os.getenv("GOOGLE_API_KEY"):
        gemini_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=temperature)
        fallbacks.append(gemini_llm)

    # Append Ollama as the last fallback if available
    if ollama_llm:
        fallbacks.append(ollama_llm)

    # Construct the final chain
    if primary_llm:
        return primary_llm.with_fallbacks(fallbacks) if fallbacks else primary_llm
    elif fallbacks:
        # If no Groq, use the first available fallback as primary (Gemini or Ollama)
        primary = fallbacks.pop(0)
        return primary.with_fallbacks(fallbacks) if fallbacks else primary
    else:
        raise ValueError("No LLM available. Please set GROQ_API_KEY or install/run Ollama locally.")

# Pre-instantiate common configurations
llm_deterministic = get_llm(temperature=0.0)
llm_creative = get_llm(temperature=0.3)
