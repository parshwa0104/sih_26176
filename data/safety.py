"""
Deterministic sea-safety classifier.

Thresholds are derived from official Indian maritime safety standards:

┌────────────────┬──────────────┬──────────────────────────────────────────────┐
│ Parameter      │ Threshold    │ Source / Citation                             │
├────────────────┼──────────────┼──────────────────────────────────────────────┤
│ Wind > 30 m/s  │ DANGER       │ Beaufort Force 12 (Hurricane);               │
│                │              │ IMD: "Severe Cyclonic Storm" ≥ 48 knots      │
│ Wind > 20 m/s  │ CAUTION      │ Beaufort Force 9 (Strong Gale);              │
│                │              │ IMD: "Gale" warning ≥ 34 knots               │
│ Wave > 3.0 m   │ DANGER       │ WMO Sea State Code 5 ("Rough", 2.5–4 m);    │
│                │              │ INCOIS: "Do not venture" advisory ≥ 3.5 m    │
│ Wave > 2.0 m   │ CAUTION      │ WMO Sea State Code 4 ("Moderate", 1.25–2.5m);│
│                │              │ INCOIS Fisher-Friend: "Country craft avoid"  │
│                │              │ when wave height > 2.0 m                     │
└────────────────┴──────────────┴──────────────────────────────────────────────┘

References:
- India Meteorological Department, "Cyclone Warning Division Classification"
  https://mausam.imd.gov.in/imd_latest/contents/cyclone_warning.php
- World Meteorological Organisation, "Manual on Marine Meteorological Services",
  WMO-No. 558, Table 3.2 (Douglas Sea State Scale)
- INCOIS Fisher-Friend Mobile Advisory Service criteria
  https://incois.gov.in/portal/datainfo/drfad.jsp
- Beaufort Wind Force Scale (WMO Code 1100)
"""


# ── Thresholds (m/s for wind, metres for waves) ─────────────────────
WIND_DANGER = 30.0   # ≥ Beaufort 12 / IMD "Severe Cyclonic Storm"
WIND_CAUTION = 20.0  # ≥ Beaufort 9 / IMD "Gale"
WAVE_DANGER = 3.0    # WMO Sea State 5 / INCOIS "Do not venture"
WAVE_CAUTION = 2.0   # WMO Sea State 4 / INCOIS "Country craft avoid"

_CITATIONS = (
    "IMD Cyclone Warning Division; WMO Sea State Code (Douglas Scale); "
    "INCOIS Fisher-Friend Advisory Criteria"
)


def calculate_safety(weather_data: dict) -> dict:
    """Classify sea conditions as safe / caution / danger.

    Uses ONLY the wind speed and wave height from the weather data.
    The LLM is NEVER involved in this decision.
    """
    if "error" in weather_data:
        return {
            "status": "unknown",
            "message": "Cannot determine safety without valid weather data.",
            "source": _CITATIONS,
        }

    try:
        wind = float(str(weather_data["wind_speed"]).split()[0])
        wave = float(str(weather_data["wave_height"]).split()[0])
    except (KeyError, ValueError, IndexError):
        return {
            "status": "unknown",
            "message": "Error parsing wind/wave values.",
            "source": _CITATIONS,
        }

    lat = weather_data.get("lat")
    lng = weather_data.get("lng")

    if wind > WIND_DANGER or wave > WAVE_DANGER:
        return {
            "type": "safety",
            "status": "danger",
            "color": "red",
            "message": (
                f"HAZARDOUS SEA STATE. Wind {wind} m/s (>{WIND_DANGER} m/s threshold) "
                f"and/or wave height {wave} m (>{WAVE_DANGER} m threshold). "
                "Do not venture into the sea. "
                "(Ref: IMD Cyclone Classification; INCOIS High Wave Alert)"
            ),
            "wind_speed_ms": wind,
            "wave_height_m": wave,
            "lat": lat,
            "lng": lng,
            "source": _CITATIONS,
        }

    if wind > WIND_CAUTION or wave > WAVE_CAUTION:
        return {
            "type": "safety",
            "status": "caution",
            "color": "amber",
            "message": (
                f"MODERATE SEA STATE. Wind {wind} m/s and wave height {wave} m. "
                "Exercise caution. Country craft should not venture out. "
                "(Ref: INCOIS Fisher-Friend advisory criteria)"
            ),
            "wind_speed_ms": wind,
            "wave_height_m": wave,
            "lat": lat,
            "lng": lng,
            "source": _CITATIONS,
        }

    return {
        "type": "safety",
        "status": "safe",
        "color": "green",
        "message": (
            f"Sea state is calm. Wind {wind} m/s, wave height {wave} m. "
            "Safe for mechanized and country craft."
        ),
        "wind_speed_ms": wind,
        "wave_height_m": wave,
        "lat": lat,
        "lng": lng,
        "source": _CITATIONS,
    }
