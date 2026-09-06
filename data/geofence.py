"""
Geofencing data for Marine Protected Areas (MPAs) and International Maritime Boundaries.
Checks if a given location/route crosses restricted zones.
"""
from data.route import get_port_coords
from data.geo_utils import point_in_polygon

# Mock restricted zones as polygon bounding boxes
RESTRICTED_ZONES = [
    {
        "name": "Gulf of Mannar Marine National Park",
        "type": "mpa",
        "bounds": [
            [8.85, 78.90],
            [8.85, 79.25],
            [9.25, 79.25],
            [9.25, 78.90],
        ],
        "center": [9.05, 79.08],
        "warning": "Marine Protected Area. Fishing is prohibited inside this boundary."
    },
    {
        "name": "India-Sri Lanka Maritime Boundary",
        "type": "imb",
        "bounds": [
            [8.0, 79.5],
            [8.0, 80.5],
            [10.0, 80.5],
            [10.0, 79.5],
        ],
        "center": [9.0, 80.0],
        "warning": "International Maritime Boundary with Sri Lanka. Crossing is illegal and dangerous."
    },
    {
        "name": "Malvan Marine Sanctuary (Goa/Maharashtra)",
        "type": "mpa",
        "bounds": [
            [15.94, 73.43],
            [15.94, 73.50],
            [16.06, 73.50],
            [16.06, 73.43],
        ],
        "center": [16.0, 73.465],
        "warning": "Marine Sanctuary. Trawling and certain fishing methods are restricted."
    }
]


def check_geofence(location: str) -> dict:
    """Check if a location is near any restricted maritime zone using coordinate bounds."""
    if not location:
        return {"zones": [], "warning": None}

    port = get_port_coords(location)
    if not port:
        return {"zones": [], "warning": None}
        
    lat, lng = port["lat"], port["lng"]
    nearby_zones = []

    for zone in RESTRICTED_ZONES:
        # Real point-in-polygon ray-casting check against exact boundaries
        if point_in_polygon(lat, lng, zone["bounds"]):
            nearby_zones.append(zone)

    if nearby_zones:
        return {
            "zones": nearby_zones,
            "warning": nearby_zones[0]["warning"],
            "nearest_zone": {
                "name": nearby_zones[0]["name"],
                "type": nearby_zones[0]["type"],
                "bounds": nearby_zones[0]["bounds"],
                "center": nearby_zones[0]["center"],
            }
        }

    return {"zones": [], "warning": None}
