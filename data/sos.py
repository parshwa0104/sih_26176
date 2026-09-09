"""
SOS Data Agent
Returns emergency contacts and instructions for a given location.
"""

def get_sos_contacts(location: str = None) -> dict:
    """
    Returns local emergency contact information.
    In a real system, this would query a database of maritime emergency contacts by geo-location.
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
    
    return {
        "status": "danger",
        "message": message,
        "contacts": contacts,
        "lat": None,  # Usually you'd return the user's lat/lng to plot it
        "lng": None,
    }
