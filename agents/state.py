from typing import TypedDict, List, Dict, Any, Annotated

from langgraph.graph.message import add_messages

# ── Token-efficiency knobs (used by prepare_context in graph.py) ──
MAX_HISTORY_MESSAGES = 10      # keep only the last N raw turns
MAX_HISTORY_CHARS = 4000       # hard character cap for the history window


class ORCAState(TypedDict, total=False):
    # ── User input + conversation context ────────────────────────
    query: str
    history: List[Dict[str, str]]            # raw turns sent by the client
    messages: Annotated[list, add_messages]  # windowed, LLM-ready turns
    conversation_summary: str                # compressed older context
    long_term_memory: str                    # user memory retrieved from chromadb

    # ── Extracted query information ──────────────────────────────
    location: str
    date: str
    language: str
    intent: str

    # ── Marine data (all deterministic, from data/*) ─────────────
    pfz_data: Dict[str, Any]
    weather_data: Dict[str, Any]
    safety_data: Dict[str, Any]
    geofence_data: Dict[str, Any]
    route_data: Dict[str, Any]
    historical_data: Dict[str, Any]
    sos_data: Dict[str, Any]

    # ── Deterministic reasoning output ───────────────────────────
    verdict: str              # advisable | caution | not_advisable | restricted | informational
    correlation_note: str     # plain-English reason the LLM must explain

    # ── Explainability ───────────────────────────────────────────
    # Shape MUST stay {"agent","action","status","result"} — the frontend
    # renders these keys. A node reads it, appends, returns the FULL list.
    reasoning_trail: List[Dict[str, Any]]

    # ── Final output ─────────────────────────────────────────────
    final_response: str
    map_data: Dict[str, Any]
    error: str
