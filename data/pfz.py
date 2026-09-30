"""
Potential Fishing Zone (PFZ) data pipeline.

Data source:
- Currently uses representative PFZ coordinates modelled on the format
  of INCOIS PFZ advisory bulletins (https://incois.gov.in/MarineFisheries/PfzAdvisory).
- INCOIS does not provide a public API for PFZ data; advisories are
  published as PDF/image bulletins.  When API access is secured, this
  module will pull directly from INCOIS.

Every response includes a 'source' field for provenance.
"""

from data.geo_utils import haversine
from data.route import get_port_coords

# Representative PFZ nodes modelled after INCOIS advisory format.
# Coordinates and species composition are based on publicly available
# INCOIS bulletins and CMFRI catch-composition data.
PFZ_NODES = [
    {
        "lat": 9.85, "lng": 75.80, "radius": 12000,
        "info": "High probability of Sardine and Mackerel. 14 km SW of Kochi.",
        "species": ["Oil Sardine", "Indian Mackerel"],
        "confidence": 0.88,
    },
    {
        "lat": 13.08, "lng": 80.75, "radius": 8000,
        "info": "Moderate fish concentration 8 km off Chennai coast.",
        "species": ["Seer Fish", "Tuna"],
        "confidence": 0.72,
    },
    {
        "lat": 15.49, "lng": 73.33, "radius": 10000,
        "info": "Good fishing conditions detected 15 km off Goa coast.",
        "species": ["Mackerel", "Sardine", "Kingfish"],
        "confidence": 0.91,
    },
    {
        "lat": 18.85, "lng": 72.20, "radius": 15000,
        "info": "High probability of Pomfret and Bombay Duck 20 km off Mumbai coast.",
        "species": ["Bombay Duck", "Pomfret", "Catfish"],
        "confidence": 0.85,
    },
    {
        "lat": 12.80, "lng": 74.10, "radius": 9000,
        "info": "Moderate probability of Sardine and Mackerel 18 km off Mangalore coast.",
        "species": ["Sardine", "Mackerel", "Seer Fish"],
        "confidence": 0.78,
    },
    {
        "lat": 17.65, "lng": 83.95, "radius": 14000,
        "info": "High probability of Tuna and Seer Fish 25 km off Visakhapatnam coast.",
        "species": ["Tuna", "Seer Fish", "Ribbon Fish"],
        "confidence": 0.89,
    },
]


def get_pfz_data(location: str, date: str) -> dict:
    """Return the nearest PFZ node for a location.

    When INCOIS API access is available, this will query live advisory data.
    Until then, representative coordinates based on published INCOIS bulletin
    patterns are used.
    """
    if not location:
        return {"error": "Location not specified"}

    port = get_port_coords(location)
    if not port:
        return {"error": f"No PFZ data found for {location} (unrecognized port)."}

    nearest_node = None
    min_dist = float("inf")

    for node in PFZ_NODES:
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
            "species": nearest_node["species"],
            "confidence": nearest_node["confidence"],
            "distance_km": round(min_dist, 1),
            "source": "representative-data (modelled on INCOIS PFZ advisory format)",
        }

    return {"error": f"No PFZ data found for {location}."}
