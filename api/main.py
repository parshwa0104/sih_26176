import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from mock_responses import MOCK_CONDITIONS, MOCK_PFZ_ZONES, MOCK_SEA_STATE
from fastapi.middleware.cors import CORSMiddleware
from agents.orca import process_query as orca_pipeline

app = FastAPI(title = "ORCA SIH Proto")

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

@app.post("/query")
def process_query_endpoint(request: QueryRequest):
    response_data = orca_pipeline(request.message)
    return response_data



@app.get("/conditions")
def get_conditions():
    """Return conditions scoped to user's home port, with source attribution."""
    return MOCK_CONDITIONS

@app.get("/pfz-zones")
def get_pfz_zones():
    """Return PFZ zones across the 5 major Indian fisheries hubs."""
    return MOCK_PFZ_ZONES

@app.get("/sea-state")
def get_sea_state():
    """Return ocean grid cells with SST, wave, and safety color grading for map overlay."""
    return MOCK_SEA_STATE

