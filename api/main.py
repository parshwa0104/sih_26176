import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
from mock_responses import MOCK_CONDITIONS, MOCK_PFZ_ZONES, MOCK_SEA_STATE
from fastapi.middleware.cors import CORSMiddleware
from agents.orca import process_query_stream   # <-- changed from process_query

app = FastAPI(title="ORCA SIH Proto")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    for event in process_query_stream(query):
        yield f"data: {json.dumps(event)}\n\n"
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