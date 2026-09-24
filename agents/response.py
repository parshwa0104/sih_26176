import json

from langchain_core.prompts import PromptTemplate

from agents.llm_config import llm_creative


response_prompt = PromptTemplate.from_template(
    """You are ORCA, a marine intelligence assistant explaining results to a fisherman.
Use simple, short sentences. The reader may have low literacy.

User question: {query}
Target language: {language}

Recent conversation (most recent last):
{history}

Verified data:
{data_context}

Deterministic verdict: {verdict}
Reason for that verdict: {correlation_note}

RULES:
1. Answer in 2-4 short sentences using ONLY the verified data and verdict above.
2. The verdict and safety status are already decided by the system. Explain them.
   NEVER contradict, upgrade, or invent a different safety conclusion.
3. If the verdict is not_advisable, say clearly that it is not safe to go out.
4. If the fishing zone looks favourable but safety is caution or danger, state that
   the safety assessment takes precedence over the fishing-zone recommendation.
5. Use the recent conversation only to understand context (which place, what was asked).
6. If the target language is not English, write the answer in that language.
7. Output ONLY the answer text. No JSON, no markdown, no backticks.

Answer:"""
)


def _compact_context(pfz_data, weather_data, safety_data,
                     geofence_data, historical_data, route_data):
    """Trim raw tool output down to what the LLM actually needs (token efficiency)."""
    ctx = {}

    if pfz_data and pfz_data.get("lat"):
        ctx["fishing_zone"] = {
            "info": pfz_data.get("info"),
            "distance_km": pfz_data.get("distance_km"),
            "coords": f"{pfz_data.get('lat')},{pfz_data.get('lng')}",
        }
    elif pfz_data and pfz_data.get("error"):
        ctx["fishing_zone"] = {"error": pfz_data["error"]}

    if weather_data and not weather_data.get("error"):
        ctx["conditions"] = {
            "sst": weather_data.get("sst"),
            "chlorophyll": weather_data.get("chlorophyll"),
            "wind_speed": weather_data.get("wind_speed"),
            "wave_height": weather_data.get("wave_height"),
        }

    if safety_data and safety_data.get("status"):
        ctx["safety_status"] = safety_data["status"]
        ctx["safety_message"] = safety_data.get("message")

    if geofence_data and geofence_data.get("warning"):
        ctx["restricted_area_warning"] = geofence_data["warning"]

    if route_data and route_data.get("waypoints"):
        ctx["route"] = {
            "distance_km": route_data.get("distance_km"),
            "estimated_time_hrs": route_data.get("estimated_time_hrs"),
            "avoidances": route_data.get("avoidances"),
        }

    if historical_data:
        if historical_data.get("analysis"):
            ctx["historical_trend"] = historical_data["analysis"]
        elif historical_data.get("error"):
            ctx["historical_trend"] = historical_data["error"]

    return ctx


def _history_text(history):
    """Compact view of recent turns, so memory costs a few lines, not the whole chat."""
    lines = []
    for turn in (history or [])[-6:]:
        role = turn.get("role", "user")
        text = str(turn.get("content", ""))[:200]
        if text:
            lines.append(f"{role}: {text}")
    return "\n".join(lines) if lines else "(no previous turns)"


def get_map_data(pfz_data, safety_data, geofence_data, route_data, weather_data=None, sos_data=None):
    """Determine map_data based on what data is available (priority order).
    NOTE: argument order is positional and used by graph.py - do not reorder."""
    if sos_data and sos_data.get("lat"):
        return {
            "type": "sos",
            "lat": sos_data["lat"],
            "lng": sos_data["lng"],
            "nearby_vessels": sos_data.get("nearby_vessels", [])
        }
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
                             historical_data: dict = None, route_data: dict = None,
                             verdict: str = None, correlation_note: str = None,
                             history: list = None):
    """Stream the final explanation token by token.

    The extra arguments are optional, so the legacy agents/orca.py caller keeps working.
    """
    chain = response_prompt | llm_creative

    data_context = json.dumps(
        _compact_context(pfz_data, weather_data, safety_data,
                         geofence_data, historical_data, route_data),
        ensure_ascii=False,
    )

    for chunk in chain.stream({
        "query": query,
        "language": language or "english",
        "history": _history_text(history),
        "data_context": data_context,
        "verdict": verdict or "not computed",
        "correlation_note": correlation_note or "No safety concerns were flagged for this query.",
    }):
        content = getattr(chunk, "content", "")
        if content:
            yield content
