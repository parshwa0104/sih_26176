import json
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
# based on user intent, language we are going to decide which script to use from our data directory
intent_prompt = PromptTemplate.from_template(
    """You are an intent classification agent for a marine intelligence system called ORCA.

Given the user's query, extract the following information and return ONLY a valid JSON object:
- 'intent': One of ["pfz", "weather", "safety", "route", "geofence", "analysis", "general"]
  - "pfz" = user asks about fishing zones, fish locations, where to catch fish
  - "weather" = user asks about SST, chlorophyll, wind, waves, ocean conditions
  - "safety" = user asks if it is safe to go to sea, venture out, risk assessment
  - "route" = user asks for a safe route, path, navigation to a fishing zone
  - "geofence" = user asks about restricted areas, marine protected areas, maritime boundaries, borders
  - "analysis" = user asks WHY something happened, trends, decline, historical data, productivity changes
  - "general" = anything else
- 'location': The geographical location mentioned (or null if none)
- 'date': Any time reference (or "today" if none)
- 'language': The language of the query (e.g., "english", "hindi", "tamil", "bengali", "marathi", "telugu", "malayalam")

Query: {query}

Output ONLY the JSON object, no other text:"""
)

def extract_intent(query: str) -> dict:
    """Extract intent, location, date, and language from a user query."""
    chain = intent_prompt | llm
    response = chain.invoke({"query": query})
    try:
        text = response.content
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print("Intent parsing failed:", e, response.content)
        return {"intent": "general", "location": None, "date": "today", "language": "english"}
