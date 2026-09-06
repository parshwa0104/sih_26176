"""
ORCA Orchestrator — the central pipeline that coordinates all agents and data sources.
Builds a reasoning_trail for explainable AI.
"""
from agents.intent import extract_intent
from agents.response import generate_response
from data.pfz import get_pfz_data
from data.weather import get_weather_data
from data.safety import calculate_safety
from data.geofence import check_geofence
from data.historical import get_historical_data
from data.route import compute_safe_route, get_port_coords


def process_query(query: str) -> dict:
    """Main orchestrator for ORCA sequential pipeline."""

    reasoning_trail = []

    # ── Step 1: Intent Classification ──
    reasoning_trail.append({"agent": "Intent Classifier", "action": "Analyzing user query...", "status": "running"})
    intent_data = extract_intent(query)
    intent = intent_data.get("intent", "general")
    location = intent_data.get("location")
    date = intent_data.get("date", "today")
    language = intent_data.get("language", "english")
    reasoning_trail[-1]["status"] = "done"
    reasoning_trail[-1]["result"] = f"Intent: {intent}, Location: {location}, Language: {language}"

    # ── Step 2: Data Fetching ──
    pfz_data = {}
    weather_data = {}
    safety_data = {}
    geofence_data = {"zones": [], "warning": None}
    historical_data = {}
    route_data = {}

    if intent == "pfz":
        reasoning_trail.append({"agent": "PFZ Data Agent", "action": f"Fetching PFZ data for {location}...", "status": "running"})
        pfz_data = get_pfz_data(location, date)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = pfz_data.get("info", pfz_data.get("error", "No data"))

        # Also check weather for safety context
        reasoning_trail.append({"agent": "Weather Agent", "action": f"Cross-checking weather at {location}...", "status": "running"})
        weather_data = get_weather_data(location, date)
        safety_data = calculate_safety(weather_data)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"Wind: {weather_data.get('wind_speed')}, Waves: {weather_data.get('wave_height')}"

    elif intent == "weather":
        reasoning_trail.append({"agent": "Weather Agent", "action": f"Fetching ocean conditions for {location}...", "status": "running"})
        weather_data = get_weather_data(location, date)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"SST: {weather_data.get('sst')}, Chlorophyll: {weather_data.get('chlorophyll')}"

    elif intent == "safety":
        reasoning_trail.append({"agent": "Weather Agent", "action": f"Fetching sea state for {location}...", "status": "running"})
        weather_data = get_weather_data(location, date)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"Wind: {weather_data.get('wind_speed')}, Waves: {weather_data.get('wave_height')}"

        reasoning_trail.append({"agent": "Safety Calculator", "action": "Calculating risk level...", "status": "running"})
        safety_data = calculate_safety(weather_data)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"Status: {safety_data.get('status', 'unknown').upper()}"

    elif intent == "route":
        # Get PFZ destination and port origin
        reasoning_trail.append({"agent": "PFZ Data Agent", "action": f"Finding fishing zone near {location}...", "status": "running"})
        pfz_data = get_pfz_data(location, date)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = pfz_data.get("info", pfz_data.get("error", "No data"))

        reasoning_trail.append({"agent": "Geofence Agent", "action": f"Checking restricted zones near {location}...", "status": "running"})
        geofence_data = check_geofence(location)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"{len(geofence_data['zones'])} restricted zone(s) found" if geofence_data["zones"] else "No restricted zones nearby"

        reasoning_trail.append({"agent": "Route Optimizer", "action": "Computing safe route...", "status": "running"})
        port = get_port_coords(location)
        if not port:
            reasoning_trail[-1]["status"] = "done"
            reasoning_trail[-1]["result"] = f"Cannot compute route: {location} is not a recognized port."
        else:
            dest_lat = pfz_data.get("lat", port["lat"] + 0.5)
            dest_lng = pfz_data.get("lng", port["lng"] - 0.3)
            route_data = compute_safe_route(port["lat"], port["lng"], dest_lat, dest_lng, geofence_data.get("zones", []))
            reasoning_trail[-1]["status"] = "done"
            reasoning_trail[-1]["result"] = f"Route: {route_data.get('distance_km')}km, ETA: {route_data.get('estimated_time_hrs')}hrs"

    elif intent == "geofence":
        reasoning_trail.append({"agent": "Geofence Agent", "action": f"Checking maritime boundaries near {location}...", "status": "running"})
        geofence_data = check_geofence(location)
        reasoning_trail[-1]["status"] = "done"
        if geofence_data["warning"]:
            reasoning_trail[-1]["result"] = geofence_data["warning"]
        else:
            reasoning_trail[-1]["result"] = "No restricted zones found near this location"

    elif intent == "analysis":
        reasoning_trail.append({"agent": "Historical Data Agent", "action": f"Fetching 5-year trends for {location}...", "status": "running"})
        historical_data = get_historical_data(location)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = historical_data.get("analysis", "No historical data available")

        # Also get current conditions for comparison
        reasoning_trail.append({"agent": "Weather Agent", "action": f"Fetching current conditions for {location}...", "status": "running"})
        weather_data = get_weather_data(location, date)
        reasoning_trail[-1]["status"] = "done"
        reasoning_trail[-1]["result"] = f"Current SST: {weather_data.get('sst')}, Chlorophyll: {weather_data.get('chlorophyll')}"

    else:
        # General: gather everything we can
        if location:
            reasoning_trail.append({"agent": "Data Agents", "action": f"Gathering all data for {location}...", "status": "running"})
            pfz_data = get_pfz_data(location, date)
            weather_data = get_weather_data(location, date)
            safety_data = calculate_safety(weather_data)
            geofence_data = check_geofence(location)
            reasoning_trail[-1]["status"] = "done"
            reasoning_trail[-1]["result"] = "All data collected"

    # ── Step 3: Response Generation ──
    reasoning_trail.append({"agent": "Response Generator", "action": f"Generating answer in {language}...", "status": "running"})

    final_response = generate_response(
        query=query,
        language=language,
        pfz_data=pfz_data,
        weather_data=weather_data,
        safety_data=safety_data,
        geofence_data=geofence_data,
        historical_data=historical_data,
        route_data=route_data,
    )

    reasoning_trail[-1]["status"] = "done"
    reasoning_trail[-1]["result"] = "Response generated"

    # Attach reasoning trail and safety status to the response
    final_response["reasoning_trail"] = reasoning_trail

    # Determine the top-level safety status for the banner
    if safety_data and safety_data.get("status"):
        final_response["safety_status"] = safety_data["status"]
    elif geofence_data.get("warning"):
        final_response["safety_status"] = "caution"

    return final_response
