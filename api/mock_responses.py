"""
NOTE: This data is hardcoded for now for the internal hack prototype.
Once official API access is secured, these mocks will be replaced with real
calls to INCOIS and MOSDAC endpoints.
"""

MOCK_CONDITIONS = {
    "location": "Kochi Port",
    "sst": "28.5°C",
    "sst_range": "27–29°C (optimal)",
    "wind_speed": "12.8 m/s",
    "wave_height": "1.6 m",
    "chlorophyll": "0.32 mg/m³",
    "safety": "safe",
    "craft_advisory": "Safe for mechanized & country craft",
    "source": "INCOIS satellite advisory",
    "updated": "6h ago",
    "user_location": {"lat": 9.9312, "lng": 76.2673, "label": "Kochi Port"},
    "alerts": [
        {"type": "warning", "text": "Cyclone watch near Chennai coast — avoid TN-01 zone", "time": "2h ago"},
        {"type": "info", "text": "New PFZ advisory issued for Kerala coast", "time": "4h ago"},
    ]
}

MOCK_PFZ_ZONES = {
    "center": {"lat": 20.0, "lng": 77.0}, # Central India view
    "radius_km": 2000,
    "zones": [
        {
            "lat": 9.85, "lng": 75.80, "radius": 12000,
            "label": "PFZ-KL-01", "description": "14 km SW of Kochi",
            "species": "Sardine, Mackerel", "confidence": "High",
            "conditions": {
                "sst": "28.5°C", "sst_range": "27–29°C (optimal)",
                "chlorophyll": "0.32 mg/m³ (high)",
                "wind_speed": "12.8 m/s", "wave_height": "1.6 m",
                "safety": "safe", "craft_advisory": "Safe for mechanized & country craft"
            },
            "source": "INCOIS advisory", "updated": "6h ago"
        },
        {
            "lat": 18.85, "lng": 72.70, "radius": 15000,
            "label": "PFZ-MH-01", "description": "20 km off Mumbai",
            "species": "Pomfret, Bombay Duck", "confidence": "High",
            "conditions": {
                "sst": "29.2°C", "sst_range": "27–29°C (optimal)",
                "chlorophyll": "0.42 mg/m³ (high)",
                "wind_speed": "10.5 m/s", "wave_height": "1.2 m",
                "safety": "safe", "craft_advisory": "Safe for all craft types"
            },
            "source": "INCOIS advisory", "updated": "2h ago"
        },
        {
            "lat": 13.08, "lng": 80.45, "radius": 11000,
            "label": "PFZ-TN-01", "description": "18 km E of Chennai",
            "species": "Tuna", "confidence": "Medium",
            "conditions": {
                "sst": "30.1°C", "sst_range": "27–29°C (optimal)",
                "chlorophyll": "0.24 mg/m³ (moderate)",
                "wind_speed": "45.0 m/s", "wave_height": "4.5 m",
                "safety": "danger", "craft_advisory": "DO NOT VENTURE — Cyclone Warning"
            },
            "source": "INCOIS advisory", "updated": "1h ago"
        },
        {
            "lat": 12.80, "lng": 74.60, "radius": 9000,
            "label": "PFZ-KA-01", "description": "18 km off Mangalore",
            "species": "Sardine", "confidence": "Medium",
            "conditions": {
                "sst": "28.0°C", "sst_range": "27–29°C (optimal)",
                "chlorophyll": "0.48 mg/m³ (high)",
                "wind_speed": "14.2 m/s", "wave_height": "1.8 m",
                "safety": "caution", "craft_advisory": "Caution for country craft"
            },
            "source": "INCOIS advisory", "updated": "4h ago"
        },
        {
            "lat": 17.65, "lng": 83.45, "radius": 14000,
            "label": "PFZ-AP-01", "description": "25 km off Visakhapatnam",
            "species": "Tuna, Seer Fish", "confidence": "High",
            "conditions": {
                "sst": "29.5°C", "sst_range": "27–29°C (optimal)",
                "chlorophyll": "0.35 mg/m³ (moderate)",
                "wind_speed": "11.0 m/s", "wave_height": "1.4 m",
                "safety": "safe", "craft_advisory": "Safe for mechanized craft"
            },
            "source": "INCOIS advisory", "updated": "3h ago"
        }
    ]
}

MOCK_SEA_STATE = {
    "grid": [
        # ── Kerala coast (safe, moderate SST) ──
        {"bounds": [[8.5, 74.5], [10.5, 76.5]], "sst": 28.5, "wave": 1.6, "safety": "safe",   "label": "Kerala Coast"},
        {"bounds": [[8.5, 73.0], [10.5, 74.5]], "sst": 27.8, "wave": 1.4, "safety": "safe",   "label": "Kerala Offshore"},
        {"bounds": [[8.5, 71.5], [10.5, 73.0]], "sst": 27.0, "wave": 1.2, "safety": "safe",   "label": "Kerala Deep Sea"},

        # ── Karnataka coast (caution, moderate wind) ──
        {"bounds": [[11.0, 73.5], [13.0, 75.0]], "sst": 28.0, "wave": 1.8, "safety": "caution", "label": "Karnataka Coast"},
        {"bounds": [[11.0, 72.0], [13.0, 73.5]], "sst": 27.5, "wave": 1.5, "safety": "safe",   "label": "Karnataka Offshore"},

        # ── Goa / Konkan coast ──
        {"bounds": [[14.0, 72.0], [16.0, 74.0]], "sst": 28.2, "wave": 1.4, "safety": "safe",   "label": "Goa-Konkan Coast"},
        {"bounds": [[14.0, 70.5], [16.0, 72.0]], "sst": 27.3, "wave": 1.1, "safety": "safe",   "label": "Goa Offshore"},

        # ── Mumbai / Maharashtra coast ──
        {"bounds": [[17.5, 71.0], [20.0, 73.0]], "sst": 29.2, "wave": 1.2, "safety": "safe",   "label": "Mumbai Coast"},
        {"bounds": [[17.5, 69.5], [20.0, 71.0]], "sst": 28.5, "wave": 1.0, "safety": "safe",   "label": "Mumbai Offshore"},

        # ── Chennai / Tamil Nadu coast (DANGER — cyclone) ──
        {"bounds": [[11.5, 79.5], [14.0, 81.5]], "sst": 30.1, "wave": 4.5, "safety": "danger", "label": "Chennai Coast"},
        {"bounds": [[8.5,  78.0], [11.5, 80.0]], "sst": 29.8, "wave": 3.2, "safety": "caution","label": "South TN Coast"},

        # ── Andhra Pradesh / Visakhapatnam coast ──
        {"bounds": [[15.5, 80.5], [18.5, 83.0]], "sst": 29.5, "wave": 1.4, "safety": "safe",   "label": "Vizag Coast"},
        {"bounds": [[15.5, 83.0], [18.5, 85.0]], "sst": 29.0, "wave": 1.2, "safety": "safe",   "label": "Vizag Offshore"},
    ]
}
