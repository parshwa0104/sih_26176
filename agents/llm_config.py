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
    # 1. Primary: Groq (Qwen 3.6 27B — replaces decommissioned llama-3.3-70b-versatile)
    groq_llm = ChatGroq(model="qwen/qwen3.6-27b", temperature=temperature)
    
    # 2. Secondary: Google Gemini (Gemini 2.5 Flash)
    gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=temperature)
    
    # Build fallback chain
    fallbacks = [gemini_llm]

    # 3. Tertiary: Local Ollama (only if running locally)
    if _has_ollama:
        ollama_llm = ChatOllama(model="llama3", temperature=temperature)
        fallbacks.append(ollama_llm)

    llm_with_fallbacks = groq_llm.with_fallbacks(fallbacks)
    
    return llm_with_fallbacks

# Pre-instantiate common configurations
llm_deterministic = get_llm(temperature=0.0)
llm_creative = get_llm(temperature=0.3)
