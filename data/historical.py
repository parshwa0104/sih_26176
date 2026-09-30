"""
Historical ocean data for trend analysis queries.

Data source:
- Representative multi-year trends modelled on published data from:
  - CMFRI (Central Marine Fisheries Research Institute) annual reports
  - INCOIS satellite-derived SST & chlorophyll archives
  - IMD cyclone frequency records

Every response carries a 'source' field for provenance.
When historical MOSDAC archives or CMFRI open data APIs become accessible,
this module will pull from those directly.
"""

_SOURCE = (
    "representative-trends (modelled on CMFRI annual reports "
    "and INCOIS/MOSDAC satellite archives)"
)


def get_historical_data(location: str) -> dict:
    """Return multi-year trend data for a coastal location.

    Currently returns representative data labelled as such.  The trend
    patterns (warming SST, declining chlorophyll, shifting fish stocks)
    are consistent with published CMFRI and INCOIS observations but the
    exact numbers are illustrative.
    """
    if not location:
        return {"error": "Location not specified"}

    loc = location.lower()

    if "goa" in loc:
        return {
            "location": "Goa Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.8, 28.1, 28.4, 28.9, 29.3, 29.8],
            "chlorophyll_trend": [0.45, 0.40, 0.35, 0.28, 0.22, 0.18],
            "fish_catch_trend": [120, 115, 100, 85, 70, 55],
            "anomalies_detected": [
                {"year": 2023, "event": "Marine Heatwave", "duration_days": 18,
                 "max_sst_anomaly": "+2.4°C"},
                {"year": 2024, "event": "Algal Bloom", "duration_days": 7,
                 "chlorophyll_spike": "1.8 mg/m³"},
            ],
            "analysis": (
                "SST has risen by +2°C over 5 years. Chlorophyll concentration has "
                "dropped by 60%. Fish catch has declined by 54%. Rising SST causes "
                "thermal stratification, reducing nutrient upwelling, which lowers "
                "chlorophyll (phytoplankton food), causing fish to migrate to cooler waters."
            ),
            "source": _SOURCE,
        }

    if "chennai" in loc or "tamil" in loc:
        return {
            "location": "Chennai Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.5, 28.7, 29.0, 29.2, 29.6, 30.1],
            "chlorophyll_trend": [0.38, 0.36, 0.33, 0.30, 0.27, 0.24],
            "fish_catch_trend": [95, 90, 82, 75, 68, 60],
            "anomalies_detected": [
                {"year": 2022, "event": "Severe Cyclone", "duration_days": 4,
                 "wave_height_max": "5.2 m"},
                {"year": 2024, "event": "Marine Heatwave", "duration_days": 12,
                 "max_sst_anomaly": "+1.9°C"},
            ],
            "analysis": (
                "SST rising steadily with increasing cyclone frequency. "
                "Chlorophyll declining due to ocean warming. Fish stocks moving "
                "further offshore to deeper, cooler waters."
            ),
            "source": _SOURCE,
        }

    if "kochi" in loc or "kerala" in loc:
        return {
            "location": "Kochi Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.5, 27.6, 27.8, 28.0, 28.2, 28.5],
            "chlorophyll_trend": [0.50, 0.48, 0.47, 0.45, 0.43, 0.42],
            "fish_catch_trend": [130, 128, 125, 122, 118, 115],
            "anomalies_detected": [
                {"year": 2023, "event": "Unseasonal Rainfall", "duration_days": 10,
                 "salinity_drop": "-1.5 PSU"},
            ],
            "analysis": (
                "Relatively stable conditions. Slight SST increase but still within "
                "healthy range. Chlorophyll levels remain moderate. Fish stocks stable "
                "but showing early signs of gradual decline."
            ),
            "source": _SOURCE,
        }

    if "mumbai" in loc or "maharashtra" in loc:
        return {
            "location": "Mumbai Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.2, 28.5, 28.6, 28.9, 29.0, 29.2],
            "chlorophyll_trend": [0.42, 0.40, 0.38, 0.34, 0.31, 0.28],
            "fish_catch_trend": [110, 105, 95, 88, 80, 72],
            "anomalies_detected": [
                {"year": 2022, "event": "Harmful Algal Bloom", "duration_days": 8,
                 "toxicity": "High"},
                {"year": 2024, "event": "Cyclone", "duration_days": 3,
                 "wave_height_max": "4.8 m"},
            ],
            "analysis": (
                "SST has risen by 1°C over 5 years. Urban runoff and warming waters "
                "are causing fluctuating chlorophyll levels. Commercially important species "
                "like Pomfret are shifting deeper to find cooler waters."
            ),
            "source": _SOURCE,
        }

    if "mangalore" in loc or "karnataka" in loc:
        return {
            "location": "Mangalore Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.7, 27.9, 28.0, 28.2, 28.3, 28.5],
            "chlorophyll_trend": [0.48, 0.47, 0.44, 0.42, 0.40, 0.39],
            "fish_catch_trend": [115, 112, 108, 105, 100, 96],
            "anomalies_detected": [
                {"year": 2021, "event": "Delayed Monsoon Upwelling", "duration_days": 21,
                 "chlorophyll_drop": "-0.15 mg/m³"},
            ],
            "analysis": (
                "Consistent coastal upwelling keeps conditions relatively favorable, "
                "though slight warming is observed. Sardine stocks are stable but mackerel "
                "catch shows early signs of migration."
            ),
            "source": _SOURCE,
        }

    if "visakhapatnam" in loc or "vizag" in loc:
        return {
            "location": "Visakhapatnam Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.8, 29.0, 29.1, 29.4, 29.5, 29.8],
            "chlorophyll_trend": [0.35, 0.34, 0.32, 0.30, 0.28, 0.26],
            "fish_catch_trend": [105, 100, 92, 85, 78, 70],
            "anomalies_detected": [
                {"year": 2023, "event": "Marine Heatwave", "duration_days": 15,
                 "max_sst_anomaly": "+1.8°C"},
                {"year": 2024, "event": "Deep Depression", "duration_days": 5,
                 "wave_height_max": "4.2 m"},
            ],
            "analysis": (
                "Significant warming trend noted in the Bay of Bengal. Reduced chlorophyll "
                "impacts pelagic fish availability. Tuna stocks are shifting further offshore, "
                "requiring longer trips."
            ),
            "source": _SOURCE,
        }

    return {
        "location": location,
        "analysis": (
            f"Limited historical data available for {location}. "
            "General trends show rising SST across the Indian Ocean."
        ),
        "source": _SOURCE,
    }
