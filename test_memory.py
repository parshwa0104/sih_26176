import os
from dotenv import load_dotenv

load_dotenv()

from agents.memory import add_memory
from agents.orca import process_query_stream

if __name__ == "__main__":
    print("Adding a memory for user 'fisherman_1'...")
    add_memory("fisherman_1", "The user prefers to be answered in Marathi and usually fishes near Mumbai.")
    
    print("\nQuerying ORCA...")
    query = "Where can I fish today?"
    
    # We pass thread_id to simulate a specific user
    for event in process_query_stream(query, thread_id="fisherman_1"):
        if event["type"] == "token":
            print(event["text"], end="", flush=True)
        elif event["type"] == "done":
            print("\n\nReasoning Trail:")
            for step in event["reasoning_trail"]:
                print(f"[{step['agent']}] {step['action']} -> {step['result']}")
