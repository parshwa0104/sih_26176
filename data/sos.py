"""
SOS Data Agent
Returns emergency contacts and instructions for a given location.
"""
import os
import httpx
from data.route import get_port_coords

def get_sos_contacts(location: str = None) -> dict:
    """
    Returns local emergency contact information and nearby vessels.
    """
    # Mock data for demonstration
    contacts = {
        "Coast Guard (Toll Free)": "1554",
        "National Emergency (Police/Fire/Ambulance)": "112",
        "Marine Police": "1093",
    }
    
    if location and "kochi" in location.lower():
        contacts["Coast Guard District 4 (Kerala)"] = "0484-2210023"
        contacts["MRCC Mumbai (Rescue Coord)"] = "022-24388065"
    elif location and "chennai" in location.lower():
        contacts["Coast Guard Region (East)"] = "044-23460450"
    
    message = "EMERGENCY CONTACTS RETRIEVED. If life is in immediate danger, broadcast 'MAYDAY MAYDAY MAYDAY' on VHF Channel 16."
    
    nearby_vessels = []
    lat, lng = None, None

    if location:
        coords = get_port_coords(location)
        if coords:
            lat, lng = coords["lat"], coords["lng"]
            vessel_api_key = os.environ.get("VESSEL_API_KEY")
            
            if vessel_api_key:
                try:
                    # Query VesselAPI for ships within 20km
                    url = f"https://api.vesselapi.com/v1/location/vessels/radius?filter.lat={lat}&filter.lon={lng}&filter.radius=20000"
                    headers = {"Authorization": f"Bearer {vessel_api_key}"}
                    response = httpx.get(url, headers=headers, timeout=5.0)
                    
                    if response.status_code == 200:
                        data = response.json().get("data", [])
                        for v in data[:5]:  # Limit to 5 nearest vessels
                            vessel = v.get("vessel", {})
                            nearby_vessels.append({
                                "name": vessel.get("name", "Unknown Vessel"),
                                "mmsi": vessel.get("mmsi"),
                                "type": vessel.get("type", "Unknown"),
                            })
                            
                        if nearby_vessels:
                            message += f" ALERT: {len(nearby_vessels)} vessel(s) detected within 20km radius."
                except Exception as e:
                    print(f"Failed to fetch nearby vessels: {e}")

    return {
        "status": "danger",
        "message": message,
        "contacts": contacts,
        "nearby_vessels": nearby_vessels,
        "lat": lat,
        "lng": lng,
    }

