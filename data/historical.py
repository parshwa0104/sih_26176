"""
Historical ocean data for compositional/analytical queries.
Provides trend data for SST, chlorophyll, and fish catch over time.
"""


def get_historical_data(location: str) -> dict:
    """Return mock historical trends for a location."""
    if not location:
        return {"error": "Location not specified"}

    loc = location.lower()

    if "goa" in loc:
        return {
            "location": "Goa Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.8, 28.1, 28.4, 28.9, 29.3, 29.8],
            "sst_trend_monthly_2025": [28.2, 28.5, 29.1, 29.8, 30.2, 30.1, 29.5, 28.9, 28.6, 28.4, 28.2, 28.1],
            "chlorophyll_trend": [0.45, 0.40, 0.35, 0.28, 0.22, 0.18],
            "fish_catch_trend": [120, 115, 100, 85, 70, 55],
            "fish_catch_by_species": {
                "Mackerel": [50, 45, 38, 30, 25, 20],
                "Sardine": [40, 42, 35, 32, 28, 22],
                "Kingfish": [30, 28, 27, 23, 17, 13]
            },
            "anomalies_detected": [
                {"year": 2023, "event": "Marine Heatwave", "duration_days": 18, "max_sst_anomaly": "+2.4°C"},
                {"year": 2024, "event": "Algal Bloom", "duration_days": 7, "chlorophyll_spike": "1.8 mg/m³"}
            ],
            "analysis": (
                "SST has risen by +2°C over 5 years. Chlorophyll concentration has "
                "dropped by 60%. Fish catch has declined by 54%. Rising SST causes "
                "thermal stratification, reducing nutrient upwelling, which lowers "
                "chlorophyll (phytoplankton food), causing fish to migrate to cooler waters."
            )
        }
    elif "chennai" in loc or "tamil" in loc:
        return {
            "location": "Chennai Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.5, 28.7, 29.0, 29.2, 29.6, 30.1],
            "sst_trend_monthly_2025": [28.8, 29.0, 29.5, 30.1, 30.6, 30.4, 29.8, 29.5, 29.2, 29.0, 28.8, 28.7],
            "chlorophyll_trend": [0.38, 0.36, 0.33, 0.30, 0.27, 0.24],
            "fish_catch_trend": [95, 90, 82, 75, 68, 60],
            "fish_catch_by_species": {
                "Seer Fish": [35, 32, 28, 25, 22, 18],
                "Tuna": [40, 38, 36, 32, 30, 28],
                "Pomfret": [20, 20, 18, 18, 16, 14]
            },
            "anomalies_detected": [
                {"year": 2022, "event": "Severe Cyclone", "duration_days": 4, "wave_height_max": "5.2m"},
                {"year": 2024, "event": "Marine Heatwave", "duration_days": 12, "max_sst_anomaly": "+1.9°C"}
            ],
            "analysis": (
                "SST rising steadily with increasing cyclone frequency. "
                "Chlorophyll declining due to ocean warming. Fish stocks moving "
                "further offshore to deeper, cooler waters."
            )
        }
    elif "kochi" in loc or "kerala" in loc:
        return {
            "location": "Kochi Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.5, 27.6, 27.8, 28.0, 28.2, 28.5],
            "sst_trend_monthly_2025": [27.8, 28.0, 28.2, 28.5, 28.9, 28.6, 28.2, 27.9, 27.8, 27.7, 27.6, 27.5],
            "chlorophyll_trend": [0.50, 0.48, 0.47, 0.45, 0.43, 0.42],
            "fish_catch_trend": [130, 128, 125, 122, 118, 115],
            "fish_catch_by_species": {
                "Oil Sardine": [60, 58, 55, 52, 50, 48],
                "Mackerel": [45, 45, 46, 44, 43, 42],
                "Prawns": [25, 25, 24, 26, 25, 25]
            },
            "anomalies_detected": [
                {"year": 2023, "event": "Unseasonal Rainfall", "duration_days": 10, "salinity_drop": "-1.5 PSU"}
            ],
            "analysis": (
                "Relatively stable conditions. Slight SST increase but still within "
                "healthy range. Chlorophyll levels remain moderate. Fish stocks stable "
                "but showing early signs of gradual decline."
            )
        }
    elif "mumbai" in loc or "maharashtra" in loc:
        return {
            "location": "Mumbai Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.2, 28.5, 28.6, 28.9, 29.0, 29.2],
            "sst_trend_monthly_2025": [28.0, 28.3, 28.8, 29.2, 29.6, 29.4, 28.9, 28.6, 28.4, 28.3, 28.2, 28.1],
            "chlorophyll_trend": [0.42, 0.40, 0.38, 0.34, 0.31, 0.28],
            "fish_catch_trend": [110, 105, 95, 88, 80, 72],
            "fish_catch_by_species": {
                "Bombay Duck": [40, 38, 35, 30, 28, 24],
                "Pomfret": [40, 37, 34, 32, 28, 25],
                "Catfish": [30, 30, 26, 26, 24, 23]
            },
            "anomalies_detected": [
                {"year": 2022, "event": "Harmful Algal Bloom", "duration_days": 8, "toxicity": "High"},
                {"year": 2024, "event": "Cyclone", "duration_days": 3, "wave_height_max": "4.8m"}
            ],
            "analysis": (
                "SST has risen by 1°C over 5 years. Urban runoff and warming waters "
                "are causing fluctuating chlorophyll levels. Commercially important species "
                "like Pomfret are shifting deeper to find cooler waters."
            )
        }
    elif "mangalore" in loc or "karnataka" in loc:
        return {
            "location": "Mangalore Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [27.7, 27.9, 28.0, 28.2, 28.3, 28.5],
            "sst_trend_monthly_2025": [27.8, 27.9, 28.1, 28.5, 28.7, 28.5, 28.2, 28.0, 27.9, 27.8, 27.8, 27.7],
            "chlorophyll_trend": [0.48, 0.47, 0.44, 0.42, 0.40, 0.39],
            "fish_catch_trend": [115, 112, 108, 105, 100, 96],
            "fish_catch_by_species": {
                "Sardine": [55, 54, 52, 50, 48, 45],
                "Mackerel": [40, 38, 36, 35, 32, 31],
                "Seer Fish": [20, 20, 20, 20, 20, 20]
            },
            "anomalies_detected": [
                {"year": 2021, "event": "Delayed Monsoon Upwelling", "duration_days": 21, "chlorophyll_drop": "-0.15 mg/m³"}
            ],
            "analysis": (
                "Consistent coastal upwelling keeps conditions relatively favorable, "
                "though slight warming is observed. Sardine stocks are stable but mackerel "
                "catch shows early signs of migration."
            )
        }
    elif "visakhapatnam" in loc or "vizag" in loc:
        return {
            "location": "Visakhapatnam Coast",
            "years": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "sst_trend": [28.8, 29.0, 29.1, 29.4, 29.5, 29.8],
            "sst_trend_monthly_2025": [28.5, 28.8, 29.2, 29.8, 30.1, 29.9, 29.5, 29.2, 28.9, 28.8, 28.6, 28.5],
            "chlorophyll_trend": [0.35, 0.34, 0.32, 0.30, 0.28, 0.26],
            "fish_catch_trend": [105, 100, 92, 85, 78, 70],
            "fish_catch_by_species": {
                "Tuna": [45, 42, 38, 35, 30, 25],
                "Seer Fish": [35, 34, 30, 28, 25, 23],
                "Ribbon Fish": [25, 24, 24, 22, 23, 22]
            },
            "anomalies_detected": [
                {"year": 2023, "event": "Marine Heatwave", "duration_days": 15, "max_sst_anomaly": "+1.8°C"},
                {"year": 2024, "event": "Deep Depression", "duration_days": 5, "wave_height_max": "4.2m"}
            ],
            "analysis": (
                "Significant warming trend noted in the Bay of Bengal. Reduced chlorophyll "
                "impacts pelagic fish availability. Tuna stocks are shifting further offshore, "
                "requiring longer trips."
            )
        }
    else:
        return {
            "location": location,
            "analysis": f"Limited historical data available for {location}. General trends show rising SST across the Indian Ocean."
        }
