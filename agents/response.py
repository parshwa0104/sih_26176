import json
from langchain_core.prompts import PromptTemplate
from langchain_ollama import ChatOllama

llm = ChatOllama(model="llama3", temperature=0.3)

response_prompt = PromptTemplate.from_template(
    """You are ORCA, a marine intelligence AI. You are explaining the results of a data query to a fisherman.
Keep it simple, clear, and short. The fisherman may have low literacy. Use plain language.

User Query: {query}
Target Language: {language}

Data Context:
PFZ Data: {pfz_data}
Weather Data: {weather_data}
Safety Data: {safety_data}
Geofence Data: {geofence_data}
Historical Data: {historical_data}
Route Data: {route_data}

INSTRUCTIONS:
1. Write a short (2-4 sentences), clear answer based on the Data Context above.
2. If the Target Language is not English, translate the answer to that language.
3. Output ONLY a valid JSON object (no markdown, no backticks):
{{
    "text": "Your translated answer here"
}}

Output JSON:"""
)


def generate_response(query: str, language: str,pfz_data: dict, weather_data: dict, safety_data: dict,
                      geofence_data: dict = None, historical_data: dict = None,route_data: dict = None) -> dict:
    """Generate the final natural-language response and determine map_data."""
    chain = response_prompt | llm

    # Determine map_data based on what data is available (priority order)
    map_data = None
    if route_data and route_data.get("waypoints"):
        map_data = route_data
    elif pfz_data and pfz_data.get("lat"):
        map_data = pfz_data
    elif safety_data and safety_data.get("lat"):
        map_data = safety_data
    elif geofence_data and geofence_data.get("nearest_zone"):
        zone = geofence_data["nearest_zone"]
        map_data = {
            "type": "geofence",
            "lat": zone["center"][0],
            "lng": zone["center"][1],
            "bounds": zone["bounds"],
            "name": zone["name"],
            "color": "red"
        }

    response = chain.invoke({
        "query": query,
        "language": language,
        "pfz_data": pfz_data or "None",
        "weather_data": weather_data or "None",
        "safety_data": safety_data or "None",
        "geofence_data": geofence_data or "None",
        "historical_data": historical_data or "None",
        "route_data": route_data or "None",
    })

    try:
        text = response.content
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)
        # Force inject map_data (don't trust LLM to format coordinates)
        data["map_data"] = map_data
        return data
    except Exception as e:
        print("Response parsing failed:", e, response.content)
        # Fallback: use raw LLM text
        raw_text = response.content.strip()
        # Try to clean if it looks like a broken JSON
        if raw_text.startswith("{"):
            raw_text = "I found some information for you. Please check the map."
        return {
            "text": raw_text,
            "map_data": map_data
        }
