"""
SOS / Emergency Data Agent.

Returns verified emergency contacts and, when available, nearby AIS-
tracked vessels.  Vessel detection uses AIS (Automatic Identification
System) data, which covers registered commercial vessels (>20 m or
>300 GT, per IMO SOLAS).  Most small fishing boats do NOT carry AIS.

Offshore communication channels (beyond cellular range):
- VHF Radio Channel 16 — monitored by Indian Coast Guard, range ~30 nm
- ISRO GEMINI / NavIC messaging — one-way satellite PFZ & cyclone alerts
  delivered to fishing vessels via INCOIS GAGAN infrastructure
- INSAT DRT (Data Relay Transponder) — INCOIS advisory broadcast
- AIS SART beacons — Search and Rescue Transponders (satellite-based)
- Satellite phones (Thuraya / Iridium) — available on some cooperative vessels

Contacts are verified against official Coast Guard and MRCC directories.
"""

import os
import httpx
from data.route import get_port_coords

# ── Verified emergency contacts (source: Indian Coast Guard website) ──
_BASE_CONTACTS = {
    "Coast Guard (Toll Free)": "1554",
    "National Emergency (Police/Fire/Ambulance)": "112",
    "Marine Police": "1093",
}

_REGIONAL_CONTACTS = {
    "kochi": {
        "Coast Guard District 4 (Kerala)": "0484-2210023",
        "MRCC Mumbai (Rescue Coordination)": "022-24388065",
    },
    "chennai": {
        "Coast Guard Region (East)": "044-23460450",
        "MRCC Chennai": "044-25395018",
    },
    "mumbai": {
        "MRCC Mumbai": "022-24388065",
        "Coast Guard Region (West)": "022-24312750",
    },
    "visakhapatnam": {
        "Coast Guard District (AP)": "0891-2739127",
    },
    "goa": {
        "Coast Guard Station Goa": "0832-2963990",
    },
}


def get_sos_contacts(location: str = None) -> dict:
    """Return emergency contacts and nearby AIS-tracked vessels.

    Vessel detection queries AIS databases for registered commercial
    vessels within 20 km that may be able to render assistance.  This
    uses publicly available AIS data and does NOT require other fishermen
    to run the ORCA app.
    """
    contacts = dict(_BASE_CONTACTS)

    if location:
        loc = location.lower()
        for key, regional in _REGIONAL_CONTACTS.items():
            if key in loc:
                contacts.update(regional)
                break

    message = (
        "EMERGENCY CONTACTS RETRIEVED. If life is in immediate danger, "
        "broadcast 'MAYDAY MAYDAY MAYDAY' on VHF Channel 16 (156.8 MHz). "
        "Activate EPIRB/SART if available."
    )

    nearby_vessels = []
    lat, lng = None, None

    if location:
        coords = get_port_coords(location)
        if coords:
            lat, lng = coords["lat"], coords["lng"]
            vessel_api_key = os.environ.get("VESSEL_API_KEY")

            if vessel_api_key:
                try:
                    url = (
                        f"https://api.vesselapi.com/v1/location/vessels/radius"
                        f"?filter.lat={lat}&filter.lon={lng}&filter.radius=20000"
                    )
                    headers = {"Authorization": f"Bearer {vessel_api_key}"}
                    response = httpx.get(url, headers=headers, timeout=5.0)

                    if response.status_code == 200:
                        data = response.json().get("data", [])
                        for v in data[:5]:
                            vessel = v.get("vessel", {})
                            nearby_vessels.append({
                                "name": vessel.get("name", "Unknown Vessel"),
                                "mmsi": vessel.get("mmsi"),
                                "type": vessel.get("type", "Unknown"),
                            })

                        if nearby_vessels:
                            message += (
                                f" ALERT: {len(nearby_vessels)} AIS-tracked "
                                f"vessel(s) detected within 20 km radius."
                            )
                except Exception as e:
                    print(f"[sos] Failed to fetch nearby vessels: {e}")

    return {
        "status": "danger",
        "message": message,
        "contacts": contacts,
        "nearby_vessels": nearby_vessels,
        "lat": lat,
        "lng": lng,
        "source": "Indian Coast Guard / MRCC verified contacts; AIS vessel data",
        "offline_channels": [
            "VHF Channel 16 (156.8 MHz)",
            "ISRO GEMINI/NavIC satellite messaging (via INCOIS)",
            "EPIRB / AIS SART beacon",
        ],
    }
