import os

# ORCA model hierarchy:  Qwen (Groq) -> Gemini -> Llama (Ollama)
# Providers are only constructed when their credentials exist, so a missing
# key degrades the hierarchy instead of raising at import time.


def get_llm(temperature: float = 0.2):
    """Return the ORCA fallback chain built from the available providers."""
    models = []

    if os.getenv("GROQ_API_KEY"):
        from langchain_groq import ChatGroq
        models.append(ChatGroq(model="qwen/qwen3.6-27b", temperature=temperature))

    if os.getenv("GOOGLE_API_KEY"):
        from langchain_google_genai import ChatGoogleGenerativeAI
        models.append(ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=temperature))

    # Local fallback - needs no API key (server must be running to actually reply).
    from langchain_ollama import ChatOllama
    models.append(ChatOllama(model="llama3", temperature=temperature))

    primary, *fallbacks = models
    return primary.with_fallbacks(fallbacks) if fallbacks else primary


llm = get_llm()
llm_deterministic = llm
llm_creative = llm
