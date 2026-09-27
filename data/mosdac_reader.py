import os
import glob
import h5py
import xarray as xr
import numpy as np
from datetime import datetime 
def read_sst_data(date=None, observation_time=None):
    """Read a downloaded MOSDAC SST file, optionally for a specific date."""

    sst_folder = "mosdac/data/raw/mosdac/3DIMG_L2G_SST"

    files = glob.glob(
        os.path.join(sst_folder, "**", "*.h5"),
        recursive=True
    )

    if not files:
        raise FileNotFoundError("No MOSDAC SST files found.")

    if date:
        date_text = date.strftime("%d%b%Y").upper()

        matching_files = [
            file for file in files
            if date_text in os.path.basename(file)
        ]

        if not matching_files:
            raise FileNotFoundError(
                f"No MOSDAC SST file found for {date_text}."
            )

        files = matching_files

    if observation_time:
        time_text = observation_time.strftime("%H%M")

        matching_files = [
            file
            for file in files
            if f"_{time_text}_" in os.path.basename(file)
        ]

        if not matching_files:
            raise FileNotFoundError(
                f"No MOSDAC SST file found for {time_text}."
            )

        files = matching_files

    sst_file = max(files, key=os.path.getmtime)

    print("Using SST file:")
    print(sst_file)

    with h5py.File(sst_file, "r") as f:
        sst = f["SST"][:]
        latitude = f["latitude"][:]
        longitude = f["longitude"][:]
        time = f["time"][:]

    return {
        "sst": sst,
        "latitude": latitude,
        "longitude": longitude,
        "time": time,
        "file": sst_file
    }

def read_chlorophyll_data(date=None):
    """Read a downloaded MOSDAC chlorophyll file, optionally for a specific date."""

    chla_folder = "mosdac/data/raw/mosdac/E06OCM_L4_AC"

    files = glob.glob(
        os.path.join(chla_folder, "**", "*.nc"),
        recursive=True
    )

    if not files:
        raise FileNotFoundError("No MOSDAC chlorophyll files found.")

    if date:
        date_text = date.strftime("%Y%m%d")

        matching_files = [
            file
            for file in files
            if date_text in os.path.basename(file)
        ]

        if not matching_files:
            raise FileNotFoundError(
                f"No MOSDAC chlorophyll file found for {date_text}."
            )

        files = matching_files

    chla_file = max(files, key=os.path.getmtime)

    print("Using chlorophyll file:")
    print(chla_file)

    ds = xr.open_dataset(chla_file)

    chla = ds["chla"].values
    latitude = ds["lat"].values
    longitude = ds["lon"].values
    time = ds["time"].values

    ds.close()

    return {
        "chla": chla,
        "latitude": latitude,
        "longitude": longitude,
        "time": time,
        "file": chla_file
    }

def find_nearest_index(values, target):
    """Find the index of the coordinate closest to the target value."""
    return int(np.abs(values - target).argmin())

def get_sst_at_location(latitude, longitude, date, observation_time=None):
    """Get the nearest SST value for a latitude/longitude on a specific date."""

    data = read_sst_data(date, observation_time)

    lat_idx = find_nearest_index(data["latitude"], latitude)
    lon_idx = find_nearest_index(data["longitude"], longitude)

    sst_grid = data["sst"][0]

    # Check the nearest pixel first
    value = sst_grid[lat_idx, lon_idx]

    # If the nearest pixel is invalid, look for the nearest valid pixel
    if not np.isfinite(value) or value <= -900:
        valid_positions = np.argwhere(
        np.isfinite(sst_grid) & (sst_grid > -900)
        )

        if len(valid_positions) == 0:
            return None

        distances = (
            (valid_positions[:, 0] - lat_idx) ** 2
            + (valid_positions[:, 1] - lon_idx) ** 2
        )

        nearest_valid = valid_positions[np.argmin(distances)]

        lat_idx = int(nearest_valid[0])
        lon_idx = int(nearest_valid[1])

        value = sst_grid[lat_idx, lon_idx]

    return {
        "sst": float(value),
        "latitude": float(data["latitude"][lat_idx]),
        "longitude": float(data["longitude"][lon_idx]),
        "file": data["file"]
    }

def get_chlorophyll_at_location(latitude, longitude, date):
    """Get the nearest chlorophyll-a value for a latitude/longitude on a specific date."""

    try:
        data = read_chlorophyll_data(date)
    except FileNotFoundError:
        return None

    lat_idx = find_nearest_index(data["latitude"], latitude)
    lon_idx = find_nearest_index(data["longitude"], longitude)

    value = data["chla"][0, 0, lat_idx, lon_idx]

    return {
        "chlorophyll": float(value),
        "latitude": float(data["latitude"][lat_idx]),
        "longitude": float(data["longitude"][lon_idx]),
        "file": data["file"]
    }

def get_sst_chlorophyll_at_location(latitude, longitude, date, observation_time=None):
    """Get SST and chlorophyll-a values near a location for a specific date."""

    sst_data = get_sst_at_location(latitude, longitude, date, observation_time)
    if sst_data is None:
        return {
            "date": date.strftime("%Y-%m-%d"),
            "sst_celsius": None,
            "sst_status": "Unavailable at requested location/date",
            "chlorophyll": None
        }
    chla_data = get_chlorophyll_at_location(latitude, longitude, date)

    # Convert SST from Kelvin to Celsius
    sst_celsius = sst_data["sst"] - 273.15

    result = {
        "date": date.strftime("%Y-%m-%d"),

        "sst_celsius": round(sst_celsius, 2),

        "sst_location": {
            "latitude": sst_data["latitude"],
            "longitude": sst_data["longitude"]
        },

        "sst_file": sst_data["file"]
    }

    if chla_data is not None:
        result["chlorophyll"] = round(chla_data["chlorophyll"], 4)

        result["chlorophyll_location"] = {
            "latitude": chla_data["latitude"],
            "longitude": chla_data["longitude"]
        }

        result["chlorophyll_file"] = chla_data["file"]

    else:
        result["chlorophyll"] = None
        result["chlorophyll_status"] = "Unavailable for requested date"

    return result