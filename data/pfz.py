from data.geo_utils import haversine
from data.route import get_port_coords

MOCK_PFZ_NODES = [
    {
        "lat": 9.9312, "lng": 76.2673, "radius": 5000, 
        "info": "High probability of tuna presence. 12km off the coast.",
        "species_composition": {"Yellowfin Tuna": "60%", "Skipjack Tuna": "30%", "Mackerel": "10%"},
        "depth_profile": {"surface_temp": "28.5°C", "thermocline_depth": "45m", "bottom_temp": "15.2°C"},
        "water_clarity": "High", "confidence_score": 0.88
    },
    {
        "lat": 13.0827, "lng": 80.2707, "radius": 3000, 
        "info": "Moderate fish concentration 8km off Chennai coast.",
        "species_composition": {"Seer Fish": "45%", "Tuna": "35%", "Pomfret": "20%"},
        "depth_profile": {"surface_temp": "30.1°C", "thermocline_depth": "38m", "bottom_temp": "16.5°C"},
        "water_clarity": "Moderate", "confidence_score": 0.72
    },
    {
        "lat": 15.4909, "lng": 73.8278, "radius": 4000, 
        "info": "Good fishing conditions detected near Goa coast.",
        "species_composition": {"Mackerel": "50%", "Sardine": "30%", "Kingfish": "20%"},
        "depth_profile": {"surface_temp": "28.9°C", "thermocline_depth": "52m", "bottom_temp": "14.8°C"},
        "water_clarity": "High", "confidence_score": 0.91
    },
    {
        "lat": 18.85, "lng": 72.70, "radius": 12000, 
        "info": "High probability of Pomfret and Bombay Duck 20km off Mumbai coast.",
        "species_composition": {"Bombay Duck": "55%", "Pomfret": "35%", "Catfish": "10%"},
        "depth_profile": {"surface_temp": "29.2°C", "thermocline_depth": "30m", "bottom_temp": "17.1°C"},
        "water_clarity": "Low", "confidence_score": 0.85
    },
    {
        "lat": 12.80, "lng": 74.60, "radius": 9000, 
        "info": "Moderate probability of Sardine and Mackerel 18km off Mangalore coast.",
        "species_composition": {"Sardine": "65%", "Mackerel": "25%", "Seer Fish": "10%"},
        "depth_profile": {"surface_temp": "28.0°C", "thermocline_depth": "48m", "bottom_temp": "15.5°C"},
        "water_clarity": "Moderate", "confidence_score": 0.78
    },
    {
        "lat": 17.65, "lng": 83.45, "radius": 15000, 
        "info": "High probability of Tuna and Seer Fish 25km off Visakhapatnam coast.",
        "species_composition": {"Tuna": "55%", "Seer Fish": "30%", "Ribbon Fish": "15%"},
        "depth_profile": {"surface_temp": "29.5°C", "thermocline_depth": "40m", "bottom_temp": "16.0°C"},
        "water_clarity": "High", "confidence_score": 0.89
    }
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
