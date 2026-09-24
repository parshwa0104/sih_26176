import os
from dotenv import load_dotenv

load_dotenv()

from data.sos import get_sos_contacts

if __name__ == "__main__":
    print("Testing SOS for Kochi...")
    result = get_sos_contacts("Kochi")
    print("\nResult:")
    import json
    print(json.dumps(result, indent=2))
