def get_weather_data(location: str, date: str) -> dict:
    """Fetch weather and ocean conditions (SST, Chlorophyll, Wind)."""
    if not location:
        return {"error": "Location not specified"}
        
    loc = location.lower()
    base_data = {
        "type": "weather",
        "sst": "28.5°C",
        "chlorophyll": "0.32 mg/m³",
        "wind_speed": "12.8 m/s",
        "wave_height": "1.6 m"
    }
    
    if "chennai" in loc:
        base_data.update({
            "sst": "30.1°C",
            "wind_speed": "45.0 m/s", # cyclone
            "wave_height": "4.5 m",
            "salinity": "34.2 PSU",
            "ph_level": 8.0,
            "visibility": "2 km",
            "current_speed": "1.5 m/s",
            "forecast_7_days": [
                {"day": "Day 1", "sst": "30.1°C", "wind": "45.0 m/s", "wave": "4.5 m", "condition": "Severe Cyclone"},
                {"day": "Day 2", "sst": "29.8°C", "wind": "30.0 m/s", "wave": "3.2 m", "condition": "Gale"},
                {"day": "Day 3", "sst": "29.5°C", "wind": "18.0 m/s", "wave": "2.1 m", "condition": "Squally"},
                {"day": "Day 4", "sst": "29.2°C", "wind": "12.0 m/s", "wave": "1.5 m", "condition": "Moderate"},
                {"day": "Day 5", "sst": "29.0°C", "wind": "10.0 m/s", "wave": "1.2 m", "condition": "Clear"},
                {"day": "Day 6", "sst": "29.1°C", "wind": "8.5 m/s", "wave": "1.0 m", "condition": "Clear"},
                {"day": "Day 7", "sst": "29.2°C", "wind": "9.0 m/s", "wave": "1.1 m", "condition": "Clear"}
            ],
            "lat": 13.0827,
            "lng": 80.2707,
            "color": "blue"
        })
    elif "kochi" in loc:
        base_data.update({
            "salinity": "34.8 PSU",
            "ph_level": 8.1,
            "visibility": "12 km",
            "current_speed": "0.6 m/s",
            "forecast_7_days": [
                {"day": "Day 1", "sst": "28.5°C", "wind": "12.8 m/s", "wave": "1.6 m", "condition": "Clear"},
                {"day": "Day 2", "sst": "28.6°C", "wind": "14.0 m/s", "wave": "1.8 m", "condition": "Slight Breeze"},
                {"day": "Day 3", "sst": "28.4°C", "wind": "15.5 m/s", "wave": "2.0 m", "condition": "Moderate"},
                {"day": "Day 4", "sst": "28.5°C", "wind": "11.0 m/s", "wave": "1.4 m", "condition": "Clear"},
                {"day": "Day 5", "sst": "28.7°C", "wind": "9.5 m/s", "wave": "1.2 m", "condition": "Clear"},
                {"day": "Day 6", "sst": "28.8°C", "wind": "10.0 m/s", "wave": "1.3 m", "condition": "Clear"},
                {"day": "Day 7", "sst": "28.6°C", "wind": "12.0 m/s", "wave": "1.5 m", "condition": "Clear"}
            ],
            "lat": 9.9312,
            "lng": 76.2673,
            "color": "blue"
        })
    elif "mumbai" in loc or "maharashtra" in loc:
        base_data.update({
            "sst": "29.2°C",
            "wind_speed": "10.5 m/s",
            "wave_height": "1.2 m",
            "salinity": "35.1 PSU",
            "ph_level": 7.9,
            "visibility": "8 km",
            "current_speed": "0.8 m/s",
            "forecast_7_days": [
                {"day": "Day 1", "sst": "29.2°C", "wind": "10.5 m/s", "wave": "1.2 m", "condition": "Clear"},
                {"day": "Day 2", "sst": "29.3°C", "wind": "11.2 m/s", "wave": "1.3 m", "condition": "Clear"},
                {"day": "Day 3", "sst": "29.4°C", "wind": "12.0 m/s", "wave": "1.4 m", "condition": "Partly Cloudy"},
                {"day": "Day 4", "sst": "29.1°C", "wind": "14.5 m/s", "wave": "1.7 m", "condition": "Moderate"},
                {"day": "Day 5", "sst": "29.0°C", "wind": "16.0 m/s", "wave": "1.9 m", "condition": "Squally"},
                {"day": "Day 6", "sst": "28.9°C", "wind": "13.0 m/s", "wave": "1.5 m", "condition": "Clear"},
                {"day": "Day 7", "sst": "29.1°C", "wind": "11.0 m/s", "wave": "1.2 m", "condition": "Clear"}
            ],
            "lat": 18.9220,
            "lng": 72.8275,
            "color": "blue"
        })
    elif "mangalore" in loc or "karnataka" in loc:
        base_data.update({
            "sst": "28.0°C",
            "wind_speed": "14.2 m/s",
            "wave_height": "1.8 m",
            "salinity": "34.5 PSU",
            "ph_level": 8.05,
            "visibility": "10 km",
            "current_speed": "0.9 m/s",
            "forecast_7_days": [
                {"day": "Day 1", "sst": "28.0°C", "wind": "14.2 m/s", "wave": "1.8 m", "condition": "Moderate"},
                {"day": "Day 2", "sst": "28.1°C", "wind": "15.0 m/s", "wave": "1.9 m", "condition": "Moderate"},
                {"day": "Day 3", "sst": "28.2°C", "wind": "12.5 m/s", "wave": "1.6 m", "condition": "Clear"},
                {"day": "Day 4", "sst": "28.0°C", "wind": "11.0 m/s", "wave": "1.4 m", "condition": "Clear"},
                {"day": "Day 5", "sst": "27.8°C", "wind": "13.5 m/s", "wave": "1.7 m", "condition": "Partly Cloudy"},
                {"day": "Day 6", "sst": "27.9°C", "wind": "16.0 m/s", "wave": "2.0 m", "condition": "Rough"},
                {"day": "Day 7", "sst": "28.1°C", "wind": "14.0 m/s", "wave": "1.8 m", "condition": "Moderate"}
            ],
            "lat": 12.9141,
            "lng": 74.8560,
            "color": "blue"
        })
    elif "visakhapatnam" in loc or "vizag" in loc:
        base_data.update({
            "sst": "29.5°C",
            "wind_speed": "11.0 m/s",
            "wave_height": "1.4 m",
            "salinity": "33.8 PSU",
            "ph_level": 8.1,
            "visibility": "14 km",
            "current_speed": "1.1 m/s",
            "forecast_7_days": [
                {"day": "Day 1", "sst": "29.5°C", "wind": "11.0 m/s", "wave": "1.4 m", "condition": "Clear"},
                {"day": "Day 2", "sst": "29.6°C", "wind": "10.0 m/s", "wave": "1.2 m", "condition": "Clear"},
                {"day": "Day 3", "sst": "29.8°C", "wind": "9.5 m/s", "wave": "1.1 m", "condition": "Clear"},
                {"day": "Day 4", "sst": "29.7°C", "wind": "13.0 m/s", "wave": "1.5 m", "condition": "Breeze"},
                {"day": "Day 5", "sst": "29.5°C", "wind": "15.0 m/s", "wave": "1.8 m", "condition": "Moderate"},
                {"day": "Day 6", "sst": "29.4°C", "wind": "18.0 m/s", "wave": "2.2 m", "condition": "Rough"},
                {"day": "Day 7", "sst": "29.6°C", "wind": "14.0 m/s", "wave": "1.7 m", "condition": "Moderate"}
            ],
            "lat": 17.6868,
            "lng": 83.2185,
            "color": "blue"
        })
    else:
        base_data.update({
            "lat": 15.4909,
            "lng": 73.8278,
            "color": "blue"
        })
        
    # Date-based nudging for realistic multi-day query results
    if date and date.lower() != "today":
        import hashlib
        # deterministic hash of the date + location
        hash_val = int(hashlib.md5(f"{location}{date}".encode()).hexdigest(), 16)
        
        # nudge SST by +/- 0.5 degrees
        sst_val = float(base_data["sst"].replace("°C", ""))
        sst_val += (hash_val % 10 - 5) / 10.0
        base_data["sst"] = f"{round(sst_val, 1)}°C"
        
        # nudge wind by up to 20%
        wind_val = float(base_data["wind_speed"].replace(" m/s", ""))
        wind_val *= 1.0 + ((hash_val % 20 - 10) / 100.0)
        base_data["wind_speed"] = f"{round(wind_val, 1)} m/s"

    return base_data
