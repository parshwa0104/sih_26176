"""
Ocean weather & conditions data pipeline.

Data sources (tried in priority order):
1. Open-Meteo Marine + Weather API — real-time wind, waves (free, no key)
2. MOSDAC satellite files — SST, chlorophyll (local HDF5/NC if available)
3. Representative fallback — labelled hardcoded values

Citations:
- Wind thresholds: IMD Cyclone Warning Division & Beaufort Scale
- Wave thresholds: WMO Sea State Code (Douglas Scale)
- SST: MOSDAC INSAT-3D SST Level-2G product
- Chlorophyll: MOSDAC OCM-3 Chlorophyll-a Level-4 product
"""

import hashlib
import httpx
from data.route import get_port_coords

OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

# ── Offshore offsets: port coords are on land; nudge seaward for ocean data ──
# Positive = east, negative = west.  Only used for API calls, not display.
_OFFSHORE_NUDGE = {
    "kochi":          (0.0, -0.5),
    "kerala":         (0.0, -0.5),
    "mumbai":         (0.0, -0.5),
    "goa":            (0.0, -0.5),
    "panaji":         (0.0, -0.5),
    "mangalore":      (0.0, -0.5),
    "karnataka":      (0.0, -0.5),
    "chennai":        (0.0,  0.5),
    "visakhapatnam":  (0.0,  0.5),
    "vizag":          (0.0,  0.5),
    "rameswaram":     (0.0,  0.5),
}


def _offshore_coords(location: str, lat: float, lng: float):
    """Push a port's land coords slightly offshore so marine APIs return ocean data."""
    loc = location.lower()
    for key, (dlat, dlng) in _OFFSHORE_NUDGE.items():
        if key in loc:
            return lat + dlat, lng + dlng
    # Default: nudge west (majority of Indian coastline faces west)
    return lat, lng - 0.5


# ─────────────────────── Open-Meteo (real-time) ───────────────────────

def _fetch_open_meteo(lat: float, lng: float, forecast_days: int = 7) -> dict | None:
    """Fetch real-time wave, wind, and forecast data from Open-Meteo (free, no key)."""
    try:
        marine_resp = httpx.get(OPEN_METEO_MARINE_URL, params={
            "latitude": lat, "longitude": lng,
            "current": "wave_height,wave_period,wave_direction",
            "daily": "wave_height_max,wave_period_max,wave_direction_dominant",
            "forecast_days": forecast_days,
            "timezone": "auto",
        }, timeout=8.0)

        weather_resp = httpx.get(OPEN_METEO_WEATHER_URL, params={
            "latitude": lat, "longitude": lng,
            "current": "wind_speed_10m,wind_direction_10m,temperature_2m",
            "daily": "wind_speed_10m_max,temperature_2m_max,temperature_2m_min",
            "wind_speed_unit": "ms",
            "forecast_days": forecast_days,
            "timezone": "auto",
        }, timeout=8.0)

        if marine_resp.status_code != 200 or weather_resp.status_code != 200:
            return None

        marine = marine_resp.json()
        weather = weather_resp.json()

        current = {
            "wave_height": marine["current"]["wave_height"],
            "wave_period": marine["current"].get("wave_period"),
            "wind_speed": weather["current"]["wind_speed_10m"],
            "wind_direction": weather["current"]["wind_direction_10m"],
            "air_temp": weather["current"]["temperature_2m"],
        }

        # Build 7-day forecast from daily data
        forecast = []
        m_daily = marine.get("daily", {})
        w_daily = weather.get("daily", {})
        dates = w_daily.get("time", [])
        for i, date in enumerate(dates[:7]):
            forecast.append({
                "day": f"Day {i+1}",
                "date": date,
                "wind_max_ms": w_daily.get("wind_speed_10m_max", [None])[i] if i < len(w_daily.get("wind_speed_10m_max", [])) else None,
                "wave_max_m": m_daily.get("wave_height_max", [None])[i] if i < len(m_daily.get("wave_height_max", [])) else None,
                "temp_max": w_daily.get("temperature_2m_max", [None])[i] if i < len(w_daily.get("temperature_2m_max", [])) else None,
            })

        return {"current": current, "forecast": forecast}

    except Exception as e:
        print(f"[weather] Open-Meteo fetch failed: {e}")
        return None


# ─────────────────────── MOSDAC satellite ─────────────────────────

def _fetch_mosdac_sst_chlorophyll(lat: float, lng: float) -> dict | None:
    """Read SST and chlorophyll from locally downloaded MOSDAC satellite files."""
    try:
        from data.mosdac_reader import get_sst_chlorophyll_at_location
        from datetime import datetime

        today = datetime.now()
        data = get_sst_chlorophyll_at_location(lat, lng, today)

        if data and data.get("sst_celsius") is not None:
            return {
                "sst_celsius": data["sst_celsius"],
                "chlorophyll": data.get("chlorophyll"),
                "date": data.get("date", "unknown"),
            }
    except FileNotFoundError:
        pass  # No MOSDAC files downloaded — expected on deployed server
    except Exception as e:
        print(f"[weather] MOSDAC read failed: {e}")
    return None


# ─────────── Representative fallback values (labelled) ────────────

_REPRESENTATIVE = {
    "kochi":          {"sst": 28.5, "chlorophyll": 0.32, "wind": 12.8, "wave": 1.6},
    "kerala":         {"sst": 28.5, "chlorophyll": 0.32, "wind": 12.8, "wave": 1.6},
    "chennai":        {"sst": 30.1, "chlorophyll": 0.24, "wind": 15.0, "wave": 2.1},
    "mumbai":         {"sst": 29.2, "chlorophyll": 0.28, "wind": 10.5, "wave": 1.2},
    "maharashtra":    {"sst": 29.2, "chlorophyll": 0.28, "wind": 10.5, "wave": 1.2},
    "goa":            {"sst": 28.9, "chlorophyll": 0.35, "wind": 11.0, "wave": 1.4},
    "panaji":         {"sst": 28.9, "chlorophyll": 0.35, "wind": 11.0, "wave": 1.4},
    "mangalore":      {"sst": 28.0, "chlorophyll": 0.48, "wind": 14.2, "wave": 1.8},
    "karnataka":      {"sst": 28.0, "chlorophyll": 0.48, "wind": 14.2, "wave": 1.8},
    "visakhapatnam":  {"sst": 29.5, "chlorophyll": 0.35, "wind": 11.0, "wave": 1.4},
    "vizag":          {"sst": 29.5, "chlorophyll": 0.35, "wind": 11.0, "wave": 1.4},
}

_DEFAULT_REPR = {"sst": 28.5, "chlorophyll": 0.30, "wind": 12.0, "wave": 1.5}


# ────────────────────── Public interface ──────────────────────────

def get_weather_data(location: str, date: str) -> dict:
    """Fetch weather and ocean conditions for a location.

    Tries real data sources first (Open-Meteo, MOSDAC), then falls back to
    representative values.  Every response carries a 'source' field so the
    frontend and the response generator know what's real vs illustrative.
    """
    if not location:
        return {"error": "Location not specified"}

    loc = location.lower()
    port = get_port_coords(location)

    if not port:
        return {"error": f"Unrecognized location: {location}"}

    lat, lng = port["lat"], port["lng"]
    ocean_lat, ocean_lng = _offshore_coords(loc, lat, lng)

    # ── Source tracking ──
    sources = []
    result = {
        "type": "weather",
        "lat": lat,
        "lng": lng,
        "color": "blue",
    }

    # ── 1. Real-time wind + waves from Open-Meteo ──
    meteo = _fetch_open_meteo(ocean_lat, ocean_lng)
    if meteo:
        c = meteo["current"]
        result["wind_speed"] = f"{round(c['wind_speed'], 1)} m/s"
        result["wave_height"] = f"{round(c['wave_height'], 1)} m"
        if c.get("wave_period"):
            result["wave_period"] = f"{round(c['wave_period'], 1)} s"
        sources.append("Open-Meteo Marine API (live)")

        # Build forecast
        forecast_7 = []
        for f in meteo.get("forecast", []):
            condition = "Clear"
            wind_max = f.get("wind_max_ms")
            wave_max = f.get("wave_max_m")
            if wind_max and wind_max > 30:
                condition = "Severe Storm"
            elif wind_max and wind_max > 20:
                condition = "Gale"
            elif wind_max and wind_max > 15:
                condition = "Squally"
            elif wave_max and wave_max > 2.0:
                condition = "Rough"
            elif wind_max and wind_max > 10:
                condition = "Moderate"

            forecast_7.append({
                "day": f["day"],
                "date": f.get("date"),
                "wind": f"{round(wind_max, 1)} m/s" if wind_max else "N/A",
                "wave": f"{round(wave_max, 1)} m" if wave_max else "N/A",
                "condition": condition,
            })
        result["forecast_7_days"] = forecast_7
    else:
        # Fallback: representative wind/wave
        repr_data = _REPRESENTATIVE.get(loc, _DEFAULT_REPR)
        # Apply date-based nudging for reproducibility
        repr_data = _nudge_for_date(repr_data, location, date)
        result["wind_speed"] = f"{repr_data['wind']} m/s"
        result["wave_height"] = f"{repr_data['wave']} m"
        sources.append("representative-data (Open-Meteo unavailable)")

    # ── 2. SST + Chlorophyll from MOSDAC ──
    mosdac = _fetch_mosdac_sst_chlorophyll(ocean_lat, ocean_lng)
    if mosdac:
        result["sst"] = f"{round(mosdac['sst_celsius'], 1)}°C"
        if mosdac.get("chlorophyll") is not None:
            result["chlorophyll"] = f"{round(mosdac['chlorophyll'], 2)} mg/m³"
        sources.append(f"MOSDAC INSAT-3D ({mosdac.get('date', 'cached')})")
    else:
        # Fallback: representative SST/chlorophyll
        repr_data = _REPRESENTATIVE.get(loc, _DEFAULT_REPR)
        repr_data = _nudge_for_date(repr_data, location, date)
        result.setdefault("sst", f"{repr_data['sst']}°C")
        result.setdefault("chlorophyll", f"{repr_data['chlorophyll']} mg/m³")
        if "representative-data" not in " ".join(sources):
            sources.append("representative-data (MOSDAC files unavailable)")

    result["source"] = " + ".join(sources)
    return result


def _nudge_for_date(base: dict, location: str, date: str) -> dict:
    """Deterministic hash-based nudge so the same location+date always returns
    the same representative values (avoids looking obviously static)."""
    if not date or date.lower() == "today":
        return dict(base)

    h = int(hashlib.md5(f"{location}{date}".encode()).hexdigest(), 16)
    return {
        "sst": round(base["sst"] + (h % 10 - 5) / 10.0, 1),
        "chlorophyll": round(base["chlorophyll"] + (h % 6 - 3) / 100.0, 2),
        "wind": round(base["wind"] * (1.0 + (h % 20 - 10) / 100.0), 1),
        "wave": round(base["wave"] * (1.0 + (h % 14 - 7) / 100.0), 1),
    }
