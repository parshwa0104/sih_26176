"""
Route optimization: compute a mock safe route from a port to a PFZ,
factoring in weather hazards and geofenced zones to avoid.
"""


def compute_safe_route(origin_lat: float, origin_lng: float,
                       dest_lat: float, dest_lng: float,
                       hazards: list = None) -> dict:
    """
    Return a mock optimized route as a list of waypoints.
    In production this would use A* or Dijkstra over a sea-state grid.
    """
    if hazards is None:
        hazards = []

    # Generate a simple 2-waypoint curved route to simulate avoidance
    mid_lat = (origin_lat + dest_lat) / 2
    mid_lng = (origin_lng + dest_lng) / 2

    # If there are hazards, shift the midpoint to "avoid" them
    if hazards:
        mid_lat += 0.15  # nudge north
        mid_lng -= 0.10  # nudge west

    route = {
        "type": "route",
        "waypoints": [
            {"lat": origin_lat, "lng": origin_lng, "label": "Your Port"},
            {"lat": mid_lat, "lng": mid_lng, "label": "Waypoint (safe corridor)"},
            {"lat": dest_lat, "lng": dest_lng, "label": "Fishing Zone"},
        ],
        "distance_km": round(
            ((dest_lat - origin_lat) ** 2 + (dest_lng - origin_lng) ** 2) ** 0.5 * 111, 1
        ),
        "estimated_time_hrs": round(
            (((dest_lat - origin_lat) ** 2 + (dest_lng - origin_lng) ** 2) ** 0.5 * 111) / 15, 1
        ),
        "avoidances": [h.get("name", "hazard") for h in hazards] if hazards else [],
        "color": "blue"
    }

    return route


# Pre-defined port coordinates for common locations
PORTS = {
    "kochi": {"lat": 9.9312, "lng": 76.2673},
    "kerala": {"lat": 9.9312, "lng": 76.2673},
    "chennai": {"lat": 13.0827, "lng": 80.2707},
    "goa": {"lat": 15.4909, "lng": 73.8278},
    "panaji": {"lat": 15.4909, "lng": 73.8278},
    "visakhapatnam": {"lat": 17.6868, "lng": 83.2185},
    "vizag": {"lat": 17.6868, "lng": 83.2185},
    "mumbai": {"lat": 19.0760, "lng": 72.8777},
    "mangalore": {"lat": 12.9141, "lng": 74.8560},
    "rameswaram": {"lat": 9.2876, "lng": 79.3129},
}


def get_port_coords(location: str) -> dict:
    """Look up port coordinates by name."""
    if not location:
        return None
    loc = location.lower()
    for key, coords in PORTS.items():
        if key in loc:
            return coords
    return None
