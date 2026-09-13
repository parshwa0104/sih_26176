import os
from dotenv import load_dotenv

load_dotenv()

from agents.orca import process_query_stream

if __name__ == "__main__":
    print("Testing LangGraph ORCA Pipeline...")
    query = "Find a safe route from Kochi to the nearest fishing zone."
    
    final_event = None
    for event in process_query_stream(query):
        if event["type"] == "token":
            print(event["text"], end="", flush=True)
        elif event["type"] == "done":
            final_event = event
            
    print("\n\n=== FINAL PAYLOAD ===")
    import json
    # Print keys to keep output small
    print("Keys:", list(final_event.keys()))
    print("Map Data:", json.dumps(final_event.get("map_data", {}), indent=2))
    print("Reasoning Trail Length:", len(final_event.get("reasoning_trail", [])))
    print("Safety Status:", final_event.get("safety_status"))
