from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage


llm = ChatOllama(model="llama3", temperature=0.7)

# 2. Give the AI a Persona (System Prompt) and a Question (Human Prompt)
messages = [
    SystemMessage(content="You are ORCA, a helpful AI assistant for marine stakeholders. Keep your answers under 2 sentences."),
    HumanMessage(content="What is the most dangerous thing about the ocean?")
]

print("Asking ORCA...")

# 3. Get the response
response = llm.invoke(messages)
metadata = response.response_metadata
total_time_seconds = metadata.get("total_duration", 0)/1e9 # nanoseconds to noal timing
input_tokens = metadata.get("prompt_eval_count", 0)
output_tokens = metadata.get("eval_count", 0)
if(total_time_seconds > 0):
    tokens_per_second = output_tokens/total_time_seconds
else:
    tokens_per_second = 0

print("\nORCA says:")
print(response.content)
