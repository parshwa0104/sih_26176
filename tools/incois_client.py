from langchain_core.tools import tool

@tool
def get_pfz_data(location: str) -> str:
    """Fetch Potential Fishing Zone (PFZ) data from INCOIS for a specific location. Use this to find the nearest PFZ."""
    location = location.lower()
    
    if "kerala" in location or "kochi" in location:
        return (
            "PFZ Alert: High fish concentration found 12km off the coast of Kochi. "
            "Coordinates: [9.9312, 76.2673]. Advisable to fish between 04:00 AM and 09:00 AM. "
            "MAP_DATA: {\"type\": \"pfz\", \"lat\": 9.9312, \"lng\": 76.2673, \"radius\": 5000, \"color\": \"green\"}"
        )
    elif "tamil" in location or "chennai" in location:
        return (
            "PFZ Alert: Moderate fish concentration found 8km off Chennai coast. "
            "Coordinates: [13.0827, 80.2707]. "
            "MAP_DATA: {\"type\": \"pfz\", \"lat\": 13.0827, \"lng\": 80.2707, \"radius\": 3000, \"color\": \"green\"}"
        )
    elif "goa" in location or "panaji" in location:
        return (
            "PFZ Alert: Low fish concentration near Goa. "
            "Coordinates: [15.4909, 73.8278]. "
            "MAP_DATA: {\"type\": \"pfz\", \"lat\": 15.4909, \"lng\": 73.8278, \"radius\": 2000, \"color\": \"green\"}"
        )
    else:
        return f"No specific Potential Fishing Zones (PFZ) identified near {location} at this moment."

@tool
def get_weather_safety(location: str) -> str:
    """Fetch weather and sea state data to determine if it is safe to venture into the sea."""
    location = location.lower()
    
    if "kerala" in location or "kochi" in location:
        return (
            "Weather Alert: Sea state is calm. Wind speed 10 knots. Wave height 1.2m. Safe to venture."
            "MAP_DATA: {\"type\": \"safety\", \"lat\": 9.9312, \"lng\": 76.2673, \"status\": \"safe\", \"color\": \"green\"}"
        )
    elif "tamil" in location or "chennai" in location:
        return (
            "Weather Alert: High risk! Cyclone warning in effect. Wind speed 45 knots. Wave height 4.5m. Do not venture into the sea."
            "MAP_DATA: {\"type\": \"safety\", \"lat\": 13.0827, \"lng\": 80.2707, \"status\": \"danger\", \"color\": \"red\"}"
        )
    else:
        return (
            f"Weather Alert: Normal sea conditions near {location}. Exercise standard caution."
            f"MAP_DATA: {{\"type\": \"safety\", \"lat\": 20.0, \"lng\": 73.0, \"status\": \"caution\", \"color\": \"amber\"}}"
        )

@tool
def get_sst_chlorophyll(location: str) -> str:
    """Fetch Sea Surface Temperature (SST) and Chlorophyll data for a location."""
    return (
        f"Data for {location}: SST is 28.5°C, Chlorophyll-a is 1.2 mg/m^3 indicating good conditions for pelagic fish."
        f"MAP_DATA: {{\"type\": \"sst\", \"lat\": 15.0, \"lng\": 75.0, \"value\": 28.5, \"color\": \"blue\"}}"
    )
