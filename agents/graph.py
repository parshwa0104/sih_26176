from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from agents.state import OrcaState
from agents.intent import extract_intent
from agents.response import get_map_data
from agents.memory import recall_memories
from data.pfz import get_pfz_data
from data.weather import get_weather_data
from data.safety import calculate_safety
from data.geofence import check_geofence
from data.historical import get_historical_data
from data.route import compute_safe_route, get_port_coords
from data.sos import get_sos_contacts

def recall_memory_node(state: OrcaState, config: dict):
    query = state.get("query", "")
    thread_id = config.get("configurable", {}).get("thread_id", "default_user")
    
    trail_start = {"agent": "Memory Manager", "action": "Recalling past interactions...", "status": "running"}
    
    memories = recall_memories(thread_id, query)
    
    trail_end = {
        "agent": "Memory Manager", 
        "action": "Recalling past interactions...", 
        "status": "done",
        "result": "Memories retrieved" if "No relevant" not in memories else "No relevant past memories"
    }
    
    return {
        "long_term_memory": memories,
        "reasoning_trail": [trail_end]
    }

def classify_intent_node(state: OrcaState):
    query = state.get("query", "")
    history = state.get("history", [])
    memory_context = state.get("long_term_memory", "")
    
    trail_start = {"agent": "Intent Classifier", "action": "Analyzing user query...", "status": "running"}
    
    # Pass memory_context to extract_intent (we will update intent.py to accept this)
    intent_data = extract_intent(query, history, memory_context)
    
    intent = intent_data.get("intent", "general")
    location = intent_data.get("location")
    date = intent_data.get("date", "today")
    language = intent_data.get("language", "english")
    
    home_port = "Mumbai"
    location_note = ""
    if not location:
        location = home_port
        location_note = f" (defaulting to home port: {home_port})"
        
    trail_end = {
        "agent": "Intent Classifier", 
        "action": "Analyzing user query...", 
        "status": "done",
        "result": f"Intent: {intent}, Location: {location}, Language: {language}" + location_note
    }
    
    return {
        "intent": intent,
        "location": location,
        "date": date,
        "language": language,
        "reasoning_trail": [trail_end]
    }

def gather_data_node(state: OrcaState):
    intent = state.get("intent", "general")
    location = state.get("location")
    date = state.get("date", "today")
    
    pfz_data = {}
    weather_data = {}
    safety_data = {}
    geofence_data = {"zones": [], "warning": None}
    historical_data = {}
    route_data = {}
    sos_data = {}
    trail_updates = []
    
    if intent == "pfz":
        trail_updates.append({"agent": "PFZ Data Agent", "action": f"Fetching PFZ data for {location}...", "status": "done"})
        pfz_data = get_pfz_data(location, date)
        trail_updates[-1]["result"] = pfz_data.get("info", pfz_data.get("error", "No data"))
        
        trail_updates.append({"agent": "Weather Agent", "action": f"Cross-checking weather at {location}...", "status": "done"})
        weather_data = get_weather_data(location, date)
        trail_updates[-1]["result"] = f"Wind: {weather_data.get('wind_speed')}, Waves: {weather_data.get('wave_height')}"
        
    elif intent == "weather":
        trail_updates.append({"agent": "Weather Agent", "action": f"Fetching ocean conditions for {location}...", "status": "done"})
        weather_data = get_weather_data(location, date)
        trail_updates[-1]["result"] = f"SST: {weather_data.get('sst')}, Chlorophyll: {weather_data.get('chlorophyll')}"
        
    elif intent == "safety":
        trail_updates.append({"agent": "Weather Agent", "action": f"Fetching sea state for {location}...", "status": "done"})
        weather_data = get_weather_data(location, date)
        trail_updates[-1]["result"] = f"Wind: {weather_data.get('wind_speed')}, Waves: {weather_data.get('wave_height')}"
        
        trail_updates.append({"agent": "Safety Calculator", "action": "Calculating risk level...", "status": "done"})
        safety_data = calculate_safety(weather_data)
        trail_updates[-1]["result"] = f"Status: {safety_data.get('status', 'unknown').upper()}"
        
    elif intent == "route":
        trail_updates.append({"agent": "PFZ Data Agent", "action": f"Finding fishing zone near {location}...", "status": "done"})
        pfz_data = get_pfz_data(location, date)
        trail_updates[-1]["result"] = pfz_data.get("info", pfz_data.get("error", "No data"))
        
        trail_updates.append({"agent": "Geofence Agent", "action": f"Checking restricted zones near {location}...", "status": "done"})
        geofence_data = check_geofence(location)
        trail_updates[-1]["result"] = f"{len(geofence_data['zones'])} restricted zone(s) found" if geofence_data.get("zones") else "No restricted zones nearby"
        
        trail_updates.append({"agent": "Route Optimizer", "action": "Computing safe route...", "status": "done"})
        port = get_port_coords(location)
        if not port:
            trail_updates[-1]["result"] = f"Cannot compute route: {location} is not a recognized port."
        else:
            dest_lat = pfz_data.get("lat", port["lat"] + 0.5)
            dest_lng = pfz_data.get("lng", port["lng"] - 0.3)
            route_data = compute_safe_route(port["lat"], port["lng"], dest_lat, dest_lng, geofence_data.get("zones", []))
            trail_updates[-1]["result"] = f"Route: {route_data.get('distance_km')}km, ETA: {route_data.get('estimated_time_hrs')}hrs"
            
    elif intent == "geofence":
        trail_updates.append({"agent": "Geofence Agent", "action": f"Checking maritime boundaries near {location}...", "status": "done"})
        geofence_data = check_geofence(location)
        trail_updates[-1]["result"] = geofence_data["warning"] if geofence_data.get("warning") else "No restricted zones found near this location"
        
    elif intent == "analysis":
        trail_updates.append({"agent": "Historical Data Agent", "action": f"Fetching 5-year trends for {location}...", "status": "done"})
        historical_data = get_historical_data(location)
        trail_updates[-1]["result"] = historical_data.get("analysis", "No historical data available")
        
        trail_updates.append({"agent": "Weather Agent", "action": f"Fetching current conditions for {location}...", "status": "done"})
        weather_data = get_weather_data(location, date)
        trail_updates[-1]["result"] = f"Current SST: {weather_data.get('sst')}, Chlorophyll: {weather_data.get('chlorophyll')}"
        
    elif intent == "sos":
        trail_updates.append({"agent": "SOS Agent", "action": f"Fetching emergency contacts near {location}...", "status": "done"})
        sos_data = get_sos_contacts(location)
        safety_data = {"status": "danger"}
        trail_updates[-1]["result"] = "SOS Triggered. Emergency contacts retrieved."
        
    else:
        if location:
            trail_updates.append({"agent": "Data Agents", "action": f"Gathering all data for {location}...", "status": "done"})
            pfz_data = get_pfz_data(location, date)
            weather_data = get_weather_data(location, date)
            safety_data = calculate_safety(weather_data)
            geofence_data = check_geofence(location)
            trail_updates[-1]["result"] = "All data collected"

    return {
        "pfz_data": pfz_data,
        "weather_data": weather_data,
        "safety_data": safety_data,
        "geofence_data": geofence_data,
        "historical_data": historical_data,
        "route_data": route_data,
        "sos_data": sos_data,
        "reasoning_trail": trail_updates
    }

def respond_node(state: OrcaState):
    map_data = get_map_data(
        state.get("pfz_data"), 
        state.get("safety_data"), 
        state.get("geofence_data"), 
        state.get("route_data"), 
        state.get("weather_data"),
        state.get("sos_data")
    )
    
    safety_status = None
    if state.get("safety_data", {}).get("status"):
        safety_status = state.get("safety_data").get("status")
    elif state.get("geofence_data", {}).get("warning"):
        safety_status = "caution"

    trail_end = {
        "agent": "Response Generator", 
        "action": f"Generating answer in {state.get('language')}...", 
        "status": "done", 
        "result": "Response generated"
    }

    return {
        "map_data": map_data,
        "safety_status": safety_status,
        "reasoning_trail": [trail_end]
    }

workflow = StateGraph(OrcaState)
workflow.add_node("recall", recall_memory_node)
workflow.add_node("classify", classify_intent_node)
workflow.add_node("gather", gather_data_node)
workflow.add_node("respond", respond_node)

workflow.set_entry_point("recall")
workflow.add_edge("recall", "classify")
workflow.add_edge("classify", "gather")
workflow.add_edge("gather", "respond")
workflow.add_edge("respond", END)

# Use MemorySaver for short-term conversation thread persistence
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)
