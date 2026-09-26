import h5py
import numpy as np
from pathlib import Path
import re

DOWNLOAD_DIR = Path(__file__).parent.parent / "mosdac" / "downloads"

sst_files = list(DOWNLOAD_DIR.glob("*.h5"))


def get_timestamp(file):
    match = re.search(r'_(\d{2}[A-Z]{3}\d{4})_(\d{4})_L2B', file.name)
    return match.group(1) + match.group(2)


def get_sst(latitude, longitude):
    latest_file = max(sst_files, key=get_timestamp)

    with h5py.File(latest_file, "r") as f:
        lat = f["Latitude"][:] * 0.01
        lon = f["Longitude"][:] * 0.01
        sst = f["SST_REG"][:][0]

        valid = sst != -999

        distance = (lat - latitude) ** 2 + (lon - longitude) ** 2
        distance[~valid] = np.inf

        i, j = np.unravel_index(np.argmin(distance), distance.shape)

        temperature_kelvin = sst[i, j]
        temperature_celsius = temperature_kelvin - 273.15

        return {
            "sst": float(temperature_celsius),
            "unit": "C",
            "latitude": float(lat[i, j]),
            "longitude": float(lon[i, j]),
            "source": "MOSDAC",
            "dataset": "3SIMG_L2B_SST",
            "file": latest_file.name
        }