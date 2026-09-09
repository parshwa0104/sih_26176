from langchain_core.prompts import PromptTemplate
from agents.llm_config import llm_creative

llm = llm_creative

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
3. Output ONLY the plain answer text. Do NOT use JSON, markdown, or backticks.

Answer:"""
)


def get_map_data(pfz_data, safety_data, geofence_data, route_data, weather_data=None):
    """Determine map_data based on what data is available (priority order)."""
    if route_data and route_data.get("waypoints"):
        return route_data
    if pfz_data and pfz_data.get("lat"):
        return pfz_data
    if safety_data and safety_data.get("lat"):
        return safety_data
    if geofence_data and geofence_data.get("nearest_zone"):
        zone = geofence_data["nearest_zone"]
        return {
            "type": "geofence",
            "lat": zone["center"][0],
            "lng": zone["center"][1],
            "bounds": zone["bounds"],
            "name": zone["name"],
            "color": "red",
        }
    if weather_data and weather_data.get("lat"):
        return {
            "type": "weather",
            "lat": weather_data["lat"],
            "lng": weather_data["lng"],
        }
    return None


def generate_response_stream(query: str, language: str, pfz_data: dict, weather_data: dict,
                              safety_data: dict, geofence_data: dict = None,
                              historical_data: dict = None, route_data: dict = None):
    """Stream the final natural-language response token by token.
    Strips <think>...</think> reasoning blocks from thinking models (e.g. Qwen).
    """
    chain = response_prompt | llm

    # State for stripping <think> blocks:
    # None = haven't decided yet, True = inside think block, False = no think block
    in_think = None
    buffer = ""

    for chunk in chain.stream({
        "query": query,
        "language": language,
        "pfz_data": pfz_data or "None",
        "weather_data": weather_data or "None",
        "safety_data": safety_data or "None",
        "geofence_data": geofence_data or "None",
        "historical_data": historical_data or "None",
        "route_data": route_data or "None",
    }):
        if not chunk.content:
            continue

        token = chunk.content

        # Phase 1: Still deciding if there's a think block
        if in_think is None:
            buffer += token
            if "<think>" in buffer:
                in_think = True
                buffer = buffer.split("<think>", 1)[1]
                # Check if </think> is also in this chunk
                if "</think>" in buffer:
                    rest = buffer.split("</think>", 1)[1].lstrip("\n ")
                    buffer = ""
                    in_think = False
                    if rest:
                        yield rest
            elif len(buffer) > 12 or ("<" not in buffer and buffer.strip()):
                # No think block — flush the buffer and switch to passthrough
                in_think = False
                yield buffer
                buffer = ""
            continue

        # Phase 2: Inside think block — buffer and wait for </think>
        if in_think:
            buffer += token
            if "</think>" in buffer:
                rest = buffer.split("</think>", 1)[1].lstrip("\n ")
                buffer = ""
                in_think = False
                if rest:
                    yield rest
            continue

        # Phase 3: Normal streaming (think block already handled or absent)
        yield token

    # Flush anything left in the buffer
    if buffer and not in_think:
        yield buffer