import json
import os
from typing import Dict, List

from dotenv import load_dotenv

# MUST run before importing agents: llm_config builds its provider chain at import time.
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from api.mock_responses import MOCK_CONDITIONS, MOCK_PFZ_ZONES, MOCK_SEA_STATE
from agents.graph import orca_graph
from agents.response import generate_response_stream

# Set ORCA_USE_LEGACY=1 to run the original agents/orca.py pipeline (regression checks).
USE_LEGACY = os.getenv("ORCA_USE_LEGACY", "0") == "1"
if USE_LEGACY:
    from agents.orca import process_query_stream

# Honest provenance: the prototype never claims to be live INCOIS data.
DATA_SOURCE = "simulated-prototype"

app = FastAPI(title="ORCA SIH Proto")

_origins_env = os.getenv("ALLOWED_ORIGINS")
_origins = ([o.strip() for o in _origins_env.split(",") if o.strip()]
            if _origins_env else ["http://localhost:5173", "http://localhost:4173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "ORCA V2 Backend Running", "data_source": DATA_SOURCE}


class QueryRequest(BaseModel):
    message: str
    # Optional: older clients that send only {"message": ...} keep working unchanged.
    history: List[Dict[str, str]] = Field(default_factory=list)


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def _final_event(state: dict, text: str) -> dict:
    safety = state.get("safety_data") or {}
    geofence = state.get("geofence_data") or {}

    event = {
        "type": "done",
        "text": text,
        "map_data": state.get("map_data"),
        "reasoning_trail": state.get("reasoning_trail", []),
        "intent": state.get("intent"),
        "location": state.get("location"),
        "language": state.get("language"),
        "verdict": state.get("verdict"),
        "correlation_note": state.get("correlation_note"),
        "data_source": DATA_SOURCE,
    }

    if safety.get("status"):
        event["safety_status"] = safety["status"]
    elif geofence.get("warning"):
        event["safety_status"] = "caution"

    return event


def _sse_stream(query: str, history: list):
    # ── Legacy path (regression comparison only) ──
    if USE_LEGACY:
        for event in process_query_stream(query):
            yield _sse(event)
        yield "data: [DONE]\n\n"
        return

    # ── Graph path: deterministic reasoning first, LLM explanation second ──
    try:
        state = orca_graph.invoke({
            "query": query,
            "history": history or [],
            "reasoning_trail": [],
        })
    except Exception as exc:
        yield _sse({
            "type": "done",
            "text": f"ORCA could not complete this request: {exc}",
            "map_data": None,
            "reasoning_trail": [],
            "data_source": DATA_SOURCE,
        })
        yield "data: [DONE]\n\n"
        return

    full_text = ""
    try:
        for token in generate_response_stream(
            query=query,
            language=state.get("language", "english"),
            pfz_data=state.get("pfz_data") or {},
            weather_data=state.get("weather_data") or {},
            safety_data=state.get("safety_data") or {},
            geofence_data=state.get("geofence_data") or {},
            historical_data=state.get("historical_data") or {},
            route_data=state.get("route_data") or {},
            verdict=state.get("verdict"),
            correlation_note=state.get("correlation_note"),
            history=state.get("history") or [],
        ):
            if token:
                full_text += token
                yield _sse({"type": "token", "text": token})
    except Exception:
        # No explanation model reachable: still return the deterministic result, clearly labelled.
        note = state.get("correlation_note") or "No explanation model is currently reachable."
        fallback = f"(Explanation model unavailable - showing the computed result.) {note}"
        full_text += fallback
        yield _sse({"type": "token", "text": fallback})

    yield _sse(_final_event(state, full_text))
    yield "data: [DONE]\n\n"


@app.post("/query")
def process_query_endpoint(request: QueryRequest):
    return StreamingResponse(
        _sse_stream(request.message, request.history),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/conditions")
def get_conditions():
    return MOCK_CONDITIONS


@app.get("/pfz-zones")
def get_pfz_zones():
    return MOCK_PFZ_ZONES


@app.get("/sea-state")
def get_sea_state():
    return MOCK_SEA_STATE
