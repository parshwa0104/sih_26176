from data.geo_utils import haversine
from data.route import get_port_coords

MOCK_PFZ_NODES = [
    {"lat": 9.85, "lng": 75.80, "radius": 12000, "info": "High probability of tuna presence. Offshore zone SW of Kochi, ~50 km out."},
    {"lat": 13.08, "lng": 80.45, "radius": 11000, "info": "Moderate fish concentration east of Chennai, ~17 km out."},
    {"lat": 15.44, "lng": 73.65, "radius": 9000, "info": "Good fishing conditions offshore of the Goa coast, ~18 km out."},
    {"lat": 18.85, "lng": 72.70, "radius": 12000, "info": "High probability of Pomfret and Bombay Duck 20km off Mumbai coast."},
    {"lat": 12.80, "lng": 74.60, "radius": 9000, "info": "Moderate probability of Sardine and Mackerel 18km off Mangalore coast."},
    {"lat": 17.65, "lng": 83.45, "radius": 15000, "info": "High probability of Tuna and Seer Fish 25km off Visakhapatnam coast."},
]

def get_pfz_data(location: str, date: str) -> dict:
    """Fetch Potential Fishing Zone data based on nearest actual coordinates."""
    if not location:
        return {"error": "Location not specified"}

    port = get_port_coords(location)
    if not port:
        return {"error": f"No PFZ data found for {location} (unrecognized port)."}

    nearest_node = None
    min_dist = float('inf')

    for node in MOCK_PFZ_NODES:
        dist = haversine(port["lat"], port["lng"], node["lat"], node["lng"])
        if dist < min_dist:
            min_dist = dist
            nearest_node = node

    if nearest_node:
        return {
            "type": "pfz",
            "lat": nearest_node["lat"],
            "lng": nearest_node["lng"],
            "radius": nearest_node["radius"],
            "color": "green",
            "info": nearest_node["info"],
            "distance_km": round(min_dist, 1)
        }

    return {"error": f"No PFZ data found for {location}."}
