from langgraph.graph import StateGraph, START, END

from agents.state import ORCAState, MAX_HISTORY_MESSAGES, MAX_HISTORY_CHARS
from agents.intent import extract_intent
from agents.tools import (
    weather_tool, pfz_tool, safety_tool, geofence_tool,
    route_tool, historical_tool, sos_tool, resolve_location,
)
from agents.response import get_map_data


# ─────────────────────────── helpers ───────────────────────────

def _trail(state):
    """Current reasoning trail (a fresh list, so we never mutate state in place)."""
    return list(state.get("reasoning_trail") or [])


def _entry(agent, action, result=None, status="done"):
    """One reasoning-trail entry. Keys MUST stay {agent, action, status, result}."""
    entry = {"agent": agent, "action": action, "status": status}
    if result is not None:
        entry["result"] = result
    return entry


def _verdict(safety, geofence, pfz):
    """Deterministic correlation of signals. The LLM may only EXPLAIN this
    result - it must never decide the verdict itself."""
    status = (safety or {}).get("status")
    has_pfz = bool((pfz or {}).get("lat"))

    if status == "danger":
        return "not_advisable", (
            "Sea conditions are hazardous. Safety takes precedence over the "
            "fishing-zone recommendation - do not venture out."
        )
    if status == "caution":
        return "caution", (
            "Conditions are marginal. Fishing potential may still be good, but "
            "only proceed with caution and check official advisories."
        )
    if (geofence or {}).get("warning"):
        return "restricted", (geofence or {}).get("warning")
    if status == "safe" and has_pfz:
        return "advisable", (
            "Sea conditions are calm and a fishing zone is within range. "
            "The trip looks viable."
        )
    if status == "safe":
        return "advisable", "Sea conditions are calm."
    return "informational", "No restriction or safety concerns were flagged for this query."


# ─────────────────────────── context ───────────────────────────

def prepare_context_node(state: ORCAState) -> dict:
    """Bound conversation context so we never ship unbounded history to the LLM."""
    history = list(state.get("history") or [])
    recent = history[-MAX_HISTORY_MESSAGES:]

    kept, budget = [], MAX_HISTORY_CHARS
    for turn in reversed(recent):          # newest first: keep recent context
        text = str(turn.get("content", ""))
        if len(text) > budget:
            break
        budget -= len(text)
        kept.append(turn)
    kept.reverse()

    return {"history": kept, "messages": kept}


# ────────────────────────── supervisor ─────────────────────────

def supervisor_node(state: ORCAState) -> dict:
    """Understand the query: intent, location, date, language. Decides nothing else."""
    intent_data = extract_intent(state["query"])

    extracted = intent_data.get("location")
    location = extracted or resolve_location(None)
    note = "" if extracted else f" (defaulting to home port: {location})"

    trail = _trail(state)
    trail.append(_entry(
        "Intent Classifier", "Analyzing user query...",
        result=(
            f"Intent: {intent_data.get('intent', 'general')}, Location: {location}, "
            f"Language: {intent_data.get('language', 'english')}{note}"
        ),
    ))

    return {
        "intent": intent_data.get("intent", "general"),
        "location": location,
        "date": intent_data.get("date", "today"),
        "language": intent_data.get("language", "english"),
        "reasoning_trail": trail,
    }


# ───────────────────────── specialists ─────────────────────────
# Every specialist below calls ONLY deterministic tools. No LLM involvement.

def pfz_specialist_node(state: ORCAState) -> dict:
    """Fishing zones - plus the sea state, so fishing potential is never
    recommended without the safety picture next to it."""
    loc, date = state["location"], state["date"]

    pfz = pfz_tool.invoke({"location": loc, "date": date})
    weather = weather_tool.invoke({"location": loc, "date": date})
    safety = safety_tool.invoke({"location": loc, "date": date})

    trail = _trail(state)
    trail.append(_entry("PFZ Data Agent", f"Fetching PFZ data for {loc}...",
                        result=pfz.get("info", pfz.get("error", "No data"))))
    trail.append(_entry("Weather Agent", f"Cross-checking weather at {loc}...",
                        result=f"Wind: {weather.get('wind_speed')}, Waves: {weather.get('wave_height')}"))
    trail.append(_entry("Safety Calculator", "Calculating risk level...",
                        result=f"Status: {str(safety.get('status', 'unknown')).upper()}"))

    return {
        "pfz_data": pfz, "weather_data": weather, "safety_data": safety,
        "reasoning_trail": trail,
    }


def weather_specialist_node(state: ORCAState) -> dict:
    loc, date = state["location"], state["date"]
    weather = weather_tool.invoke({"location": loc, "date": date})

    trail = _trail(state)
    trail.append(_entry("Weather Agent", f"Fetching ocean conditions for {loc}...",
                        result=f"SST: {weather.get('sst')}, Chlorophyll: {weather.get('chlorophyll')}"))

    return {"weather_data": weather, "reasoning_trail": trail}


def safety_specialist_node(state: ORCAState) -> dict:
    loc, date = state["location"], state["date"]

    weather = weather_tool.invoke({"location": loc, "date": date})
    safety = safety_tool.invoke({"location": loc, "date": date})

    trail = _trail(state)
    trail.append(_entry("Weather Agent", f"Fetching sea state for {loc}...",
                        result=f"Wind: {weather.get('wind_speed')}, Waves: {weather.get('wave_height')}"))
    trail.append(_entry("Safety Calculator", "Calculating risk level...",
                        result=f"Status: {str(safety.get('status', 'unknown')).upper()}"))

    return {"weather_data": weather, "safety_data": safety, "reasoning_trail": trail}


def route_specialist_node(state: ORCAState) -> dict:
    loc, date = state["location"], state["date"]

    pfz = pfz_tool.invoke({"location": loc, "date": date})
    geofence = geofence_tool.invoke({"location": loc})
    route = route_tool.invoke({"location": loc, "date": date})
    safety = safety_tool.invoke({"location": loc, "date": date})

    trail = _trail(state)
    trail.append(_entry("PFZ Data Agent", f"Finding fishing zone near {loc}...",
                        result=pfz.get("info", pfz.get("error", "No data"))))
    trail.append(_entry("Geofence Agent", f"Checking restricted zones near {loc}...",
                        result=(f"{len(geofence['zones'])} restricted zone(s) found"
                                if geofence.get("zones") else "No restricted zones nearby")))
    trail.append(_entry("Route Optimizer", "Computing safe route...",
                        result=(route["error"] if route.get("error") else
                                f"Route: {route.get('distance_km')}km, "
                                f"ETA: {route.get('estimated_time_hrs')}hrs")))
    trail.append(_entry("Safety Calculator", "Checking sea state for the route...",
                        result=f"Status: {str(safety.get('status', 'unknown')).upper()}"))

    return {
        "pfz_data": pfz, "geofence_data": geofence,
        "route_data": route, "safety_data": safety,
        "reasoning_trail": trail,
    }


def geofence_specialist_node(state: ORCAState) -> dict:
    loc = state["location"]
    geofence = geofence_tool.invoke({"location": loc})

    trail = _trail(state)
    trail.append(_entry("Geofence Agent", f"Checking maritime boundaries near {loc}...",
                        result=(geofence["warning"] if geofence.get("warning")
                                else "No restricted zones found near this location")))

    return {"geofence_data": geofence, "reasoning_trail": trail}


def historical_specialist_node(state: ORCAState) -> dict:
    loc, date = state["location"], state["date"]

    historical = historical_tool.invoke({"location": loc})
    weather = weather_tool.invoke({"location": loc, "date": date})

    trail = _trail(state)
    trail.append(_entry("Historical Data Agent", f"Fetching multi-year trends for {loc}...",
                        result=historical.get("analysis", "No historical data available")))
    trail.append(_entry("Weather Agent", f"Fetching current conditions for {loc}...",
                        result=f"Current SST: {weather.get('sst')}, Chlorophyll: {weather.get('chlorophyll')}"))

    return {"historical_data": historical, "weather_data": weather, "reasoning_trail": trail}


def sos_specialist_node(state: ORCAState) -> dict:
    loc = state["location"]
    sos = sos_tool.invoke({"location": loc})

    trail = _trail(state)
    trail.append(_entry("SOS Agent", f"Retrieving emergency contacts for {loc}...",
                        result=sos.get("message", "Contacts retrieved")))

    return {"sos_data": sos, "reasoning_trail": trail}


def general_specialist_node(state: ORCAState) -> dict:
    """No specific intent: gather the full deterministic picture for the location."""
    loc, date = state["location"], state["date"]

    pfz = pfz_tool.invoke({"location": loc, "date": date})
    weather = weather_tool.invoke({"location": loc, "date": date})
    safety = safety_tool.invoke({"location": loc, "date": date})
    geofence = geofence_tool.invoke({"location": loc})

    trail = _trail(state)
    trail.append(_entry("Data Agents", f"Gathering all data for {loc}...",
                        result=f"PFZ, weather, safety ({safety.get('status')}) and geofence retrieved"))

    return {
        "pfz_data": pfz, "weather_data": weather,
        "safety_data": safety, "geofence_data": geofence,
        "reasoning_trail": trail,
    }


# ────────────────────────── synthesis ──────────────────────────

def synthesize_node(state: ORCAState) -> dict:
    """Correlate the signals, build the map payload, close the trail.
    The LLM text itself is streamed by api/main.py - a node must not stream."""
    safety = state.get("safety_data") or {}
    geofence = state.get("geofence_data") or {"zones": [], "warning": None}
    pfz = state.get("pfz_data") or {}

    verdict, note = _verdict(safety, geofence, pfz)

    map_data = get_map_data(
        pfz, safety, geofence,
        state.get("route_data") or {},
        state.get("weather_data") or {},
    )

    trail = _trail(state)
    trail.append(_entry("Correlation Engine",
                        "Weighing fishing potential against sea safety...",
                        result=f"{verdict.upper()} - {note}"))
    trail.append(_entry("Response Generator",
                        f"Preparing answer in {state.get('language', 'english')}...",
                        result="Response context assembled"))

    return {
        "map_data": map_data, "verdict": verdict,
        "correlation_note": note, "reasoning_trail": trail,
    }


# ─────────────────────────── routing ───────────────────────────

INTENT_ROUTES = {
    "pfz": "pfz_specialist",
    "weather": "weather_specialist",
    "safety": "safety_specialist",
    "route": "route_specialist",
    "geofence": "geofence_specialist",
    "analysis": "historical_specialist",
    "sos": "sos_specialist",
    "general": "general_specialist",
}


def route_by_intent(state: ORCAState) -> str:
    """Intent -> specialist. Returns an INTENT key, which LangGraph then maps to
    a node via INTENT_ROUTES. Unknown intents fall back to 'general'."""
    intent = state.get("intent", "general")
    return intent if intent in INTENT_ROUTES else "general"



def build_graph():
    graph = StateGraph(ORCAState)

    graph.add_node("prepare_context", prepare_context_node)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("pfz_specialist", pfz_specialist_node)
    graph.add_node("weather_specialist", weather_specialist_node)
    graph.add_node("safety_specialist", safety_specialist_node)
    graph.add_node("route_specialist", route_specialist_node)
    graph.add_node("geofence_specialist", geofence_specialist_node)
    graph.add_node("historical_specialist", historical_specialist_node)
    graph.add_node("sos_specialist", sos_specialist_node)
    graph.add_node("general_specialist", general_specialist_node)
    graph.add_node("synthesize", synthesize_node)

    graph.add_edge(START, "prepare_context")
    graph.add_edge("prepare_context", "supervisor")
    graph.add_conditional_edges("supervisor", route_by_intent, INTENT_ROUTES)

    for specialist in (
        "pfz_specialist", "weather_specialist", "safety_specialist",
        "route_specialist", "geofence_specialist", "historical_specialist",
        "sos_specialist", "general_specialist",
    ):
        graph.add_edge(specialist, "synthesize")

    graph.add_edge("synthesize", END)

    return graph.compile()


orca_graph = build_graph()
