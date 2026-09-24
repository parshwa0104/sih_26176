"""
ORCA Orchestrator — the central pipeline that coordinates all agents and data sources.
Builds a reasoning trail for explainable AI.
"""
from agents.graph import app
from agents.response import generate_response_stream

def process_query_stream(query: str, history: list = None, thread_id: str = "default_user"):
    """
    Generator version of the ORCA pipeline for streaming.
    Yields:
      {"type": "token", "text": "..."}   — as the LLM generates text
      {"type": "done", "text", "map_data", "reasoning_trail", "safety_status"}
    """
    initial_state = {"query": query, "history": history or []}
    
    # Execute the LangGraph StateMachine with short-term thread memory
    config = {"configurable": {"thread_id": thread_id}}
    final_state = app.invoke(initial_state, config=config)

    # Stream the natural language response
    full_text = ""
    for token in generate_response_stream(
        query=final_state.get("query", ""),
        language=final_state.get("language", "english"),
        pfz_data=final_state.get("pfz_data"),
        weather_data=final_state.get("weather_data"),
        safety_data=final_state.get("safety_data"),
        geofence_data=final_state.get("geofence_data"),
        historical_data=final_state.get("historical_data"),
        route_data=final_state.get("route_data"),
        sos_data=final_state.get("sos_data"),
        history=final_state.get("history")
    ):
        full_text += token
        yield {"type": "token", "text": token}

    # Final event payload
    final_event = {
        "type": "done",
        "text": full_text,
        "map_data": final_state.get("map_data"),
        "reasoning_trail": final_state.get("reasoning_trail", []),
    }

    if final_state.get("safety_status"):
        final_event["safety_status"] = final_state["safety_status"]

    yield final_event