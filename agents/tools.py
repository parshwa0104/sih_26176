from typing import Optional

from langchain_core.tools import tool

from data.pfz import get_pfz_data
from data.weather import get_weather_data
from data.safety import calculate_safety
from data.geofence import check_geofence
from data.historical import get_historical_data
from data.route import compute_safe_route, get_port_coords
from data.sos import get_sos_contacts

# Same fallback the legacy orchestrator used when no location was extracted.
HOME_PORT = "Kochi"


def resolve_location(location: Optional[str]) -> str:
    """Shared fallback: use the home port when no location was extracted."""
    return location or HOME_PORT


@tool
def weather_tool(location: str, date: str = "today") -> dict:
    """Get ocean conditions (SST, chlorophyll, wind speed, wave height) for a location and date."""
    return get_weather_data(resolve_location(location), date)


@tool
def pfz_tool(location: str, date: str = "today") -> dict:
    """Get the nearest Potential Fishing Zone (recommended zone, coordinates, radius) for a location and date."""
    return get_pfz_data(resolve_location(location), date)


@tool
def safety_tool(location: str, date: str = "today") -> dict:
    """Deterministic sea-safety classification (safe/caution/danger) for a location and date.
    Uses weather data plus fixed Python thresholds - never the LLM."""
    weather = get_weather_data(resolve_location(location), date)
    return calculate_safety(weather)


@tool
def geofence_tool(location: str) -> dict:
    """Check restricted, marine-protected and maritime-boundary zones near a location."""
    return check_geofence(resolve_location(location))


@tool
def route_tool(location: str, date: str = "today") -> dict:
    """Compute a hazard-aware route from the nearest port to the nearest fishing zone."""
    loc = resolve_location(location)
    port = get_port_coords(loc)
    if not port:
        return {"error": f"Cannot compute route: {loc} is not a recognized port."}
    pfz = get_pfz_data(loc, date)
    dest_lat = pfz.get("lat", port["lat"] + 0.5)
    dest_lng = pfz.get("lng", port["lng"] - 0.3)
    geofence = check_geofence(loc)
    return compute_safe_route(port["lat"], port["lng"], dest_lat, dest_lng, geofence.get("zones", []))


@tool
def historical_tool(location: str) -> dict:
    """Get multi-year historical ocean trend analysis for a location."""
    return get_historical_data(resolve_location(location))


@tool
def sos_tool(location: str = "") -> dict:
    """Get emergency and SOS contacts for a coastal location."""
    return get_sos_contacts(location or None)


MARINE_TOOLS = [
    weather_tool, pfz_tool, safety_tool,
    geofence_tool, route_tool, historical_tool, sos_tool,
]
