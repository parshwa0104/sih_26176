import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_models import ChatOllama

def get_llm(temperature: float = 0.0):
    # 1. Primary: Groq (Llama 3.3 70B)
    groq_llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=temperature)
    
    # 2. Secondary: Google Gemini (Gemini 2.5 Flash)
    gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=temperature)
    
    # 3. Tertiary: Local Ollama (Llama 3)
    ollama_llm = ChatOllama(model="llama3", temperature=temperature)

    # Chain them with fallbacks
    # If Groq fails (e.g. rate limit, restricted key), it instantly falls back to Gemini.
    # If Gemini fails, it falls back to Local Ollama.
    llm_with_fallbacks = groq_llm.with_fallbacks([gemini_llm, ollama_llm])
    
    return llm_with_fallbacks

# Pre-instantiate common configurations
llm_deterministic = get_llm(temperature=0.0)
llm_creative = get_llm(temperature=0.3)
