from typing import TypedDict, Annotated, List, Dict, Any, Optional
import operator

def append_to_list(existing: List, new: Any) -> List:
    """Reducer function to append to a list in the state."""
    if existing is None:
        return [new] if new else []
    if new is None:
        return existing
    if isinstance(new, list):
        return existing + new
    return existing + [new]

class OrcaState(TypedDict):
    query: str
    history: List[Dict[str, str]]
    long_term_memory: str
    
    # Intent extraction
    intent: str
    location: str
    date: str
    language: str
    
    # Data payloads
    pfz_data: Dict[str, Any]
    weather_data: Dict[str, Any]
    safety_data: Dict[str, Any]
    geofence_data: Dict[str, Any]
    historical_data: Dict[str, Any]
    route_data: Dict[str, Any]
    sos_data: Dict[str, Any]
    
    # Output and reasoning
    reasoning_trail: Annotated[List[Dict[str, Any]], append_to_list]
    map_data: Dict[str, Any]
    final_response: str
    safety_status: str
