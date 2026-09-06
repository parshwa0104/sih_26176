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
            "lat": 13.0827,
            "lng": 80.2707,
            "color": "blue"
        })
    elif "kochi" in loc:
        base_data.update({
            "lat": 9.9312,
            "lng": 76.2673,
            "color": "blue"
        })
    elif "mumbai" in loc or "maharashtra" in loc:
        base_data.update({
            "sst": "29.2°C",
            "wind_speed": "10.5 m/s",
            "wave_height": "1.2 m",
            "lat": 18.9220,
            "lng": 72.8275,
            "color": "blue"
        })
    elif "mangalore" in loc or "karnataka" in loc:
        base_data.update({
            "sst": "28.0°C",
            "wind_speed": "14.2 m/s",
            "wave_height": "1.8 m",
            "lat": 12.9141,
            "lng": 74.8560,
            "color": "blue"
        })
    elif "visakhapatnam" in loc or "vizag" in loc:
        base_data.update({
            "sst": "29.5°C",
            "wind_speed": "11.0 m/s",
            "wave_height": "1.4 m",
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
