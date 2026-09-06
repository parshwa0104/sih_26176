def calculate_safety(weather_data: dict) -> dict:
    """Determine safety based on weather data."""
    if "error" in weather_data:
        return {"status": "unknown", "message": "Cannot determine safety without valid weather data."}
        
    try:
        wind = float(weather_data["wind_speed"].split()[0])
        wave = float(weather_data["wave_height"].split()[0])
        
        if wind > 30 or wave > 3.0:
            return {
                "type": "safety",
                "status": "danger",
                "color": "red",
                "message": "High wind/wave hazard! Extreme sea conditions detected. Do not venture into the sea.",
                "lat": weather_data.get("lat"),
                "lng": weather_data.get("lng")
            }
        elif wind > 20 or wave > 2.0:
            return {
                "type": "safety",
                "status": "caution",
                "color": "amber",
                "message": "Moderate sea conditions. Exercise caution.",
                "lat": weather_data.get("lat"),
                "lng": weather_data.get("lng")
            }
        else:
            return {
                "type": "safety",
                "status": "safe",
                "color": "green",
                "message": "Sea state is calm. Safe to venture.",
                "lat": weather_data.get("lat"),
                "lng": weather_data.get("lng")
            }
    except Exception:
        return {"status": "unknown", "message": "Error calculating safety."}
