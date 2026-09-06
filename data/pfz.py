from data.geo_utils import haversine
from data.route import get_port_coords

MOCK_PFZ_NODES = [
    {"lat": 9.9312, "lng": 76.2673, "radius": 5000, "info": "High probability of tuna presence. 12km off the coast."},
    {"lat": 13.0827, "lng": 80.2707, "radius": 3000, "info": "Moderate fish concentration 8km off Chennai coast."},
    {"lat": 15.4909, "lng": 73.8278, "radius": 4000, "info": "Good fishing conditions detected near Goa coast."},
    {"lat": 18.85, "lng": 72.70, "radius": 12000, "info": "High probability of Pomfret and Bombay Duck 20km off Mumbai coast."},
    {"lat": 12.80, "lng": 74.60, "radius": 9000, "info": "Moderate probability of Sardine and Mackerel 18km off Mangalore coast."},
    {"lat": 17.65, "lng": 83.45, "radius": 15000, "info": "High probability of Tuna and Seer Fish 25km off Visakhapatnam coast."}
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
