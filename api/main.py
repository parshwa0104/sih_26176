from dotenv import load_dotenv
load_dotenv()
import json
import os
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
from api.mock_responses import MOCK_CONDITIONS, MOCK_PFZ_ZONES, MOCK_SEA_STATE
from fastapi.middleware.cors import CORSMiddleware
from agents.orca import process_query_stream   # <-- changed from process_query

app = FastAPI(title="ORCA — Ocean Risk & Catch Advisor")

# CORS — comma-separated list of allowed origins via env var.
# Dev default: Vite local dev server. In production set ALLOWED_ORIGINS in your
# deployment environment (e.g. "https://orca-frontend.vercel.app")
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ORCA V2 Backend Running"}

class QueryRequest(BaseModel):
    message: str

def _sse_stream(query: str):
    try:
        for event in process_query_stream(query):
            yield f"data: {json.dumps(event)}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:
        import traceback
        err_msg = f"System Error: {str(e)} | Trace: {traceback.format_exc()}"
        error_event = {
            "type": "done",
            "text": f"CRITICAL BACKEND ERROR:\n\n{err_msg}",
            "map_data": None,
            "reasoning_trail": [{"agent": "System", "action": "Error Handler", "status": "done", "result": str(e)}]
        }
        yield f"data: {json.dumps(error_event)}\n\n"
        yield "data: [DONE]\n\n"

@app.post("/query")
def process_query_endpoint(request: QueryRequest):
    return StreamingResponse(
        _sse_stream(request.message),
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