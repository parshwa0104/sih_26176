from tools.mosdac_client import get_sst


def get_weather_data(location: str, date: str) -> dict:
    """Fetch weather and ocean conditions (SST, Chlorophyll, Wind)."""

    if not location:
        return {"error": "Location not specified"}

    loc = location.lower()

    base_data = {
        "type": "weather",
        "chlorophyll": "0.32 mg/m³",
        "wind_speed": "12.8 m/s",
        "wave_height": "1.6 m"
    }

    if "chennai" in loc:
        base_data.update({
            "wind_speed": "45.0 m/s",
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
            "wind_speed": "10.5 m/s",
            "wave_height": "1.2 m",
            "lat": 18.9220,
            "lng": 72.8275,
            "color": "blue"
        })

    elif "mangalore" in loc or "karnataka" in loc:
        base_data.update({
            "wind_speed": "24.0 m/s",
            "wave_height": "2.4 m",
            "lat": 12.9141,
            "lng": 74.8560,
            "color": "blue"
        })

    elif "visakhapatnam" in loc or "vizag" in loc:
        base_data.update({
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

    # Real SST from MOSDAC
    try:
        mosdac_sst = get_sst(base_data["lat"], base_data["lng"])
        base_data["sst"] = f'{mosdac_sst["sst"]:.1f}°C'
        base_data["sst_source"] = "MOSDAC"
        base_data["sst_dataset"] = mosdac_sst["dataset"]
        base_data["sst_file"] = mosdac_sst["file"]

    except Exception as e:
        # Keep prototype working if MOSDAC data is unavailable
        base_data["sst"] = "Unavailable"
        base_data["sst_source"] = "MOSDAC"
        base_data["sst_error"] = str(e)

    return base_data