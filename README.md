# ORCA — Ocean Risk & Catch Advisor

> **Smart India Hackathon (SIH 26176)** — AI-Powered Marine Intelligence & Advisory Platform

## 1. Executive Summary

**ORCA (Ocean Risk & Catch Advisor)** is an AI-powered marine intelligence prototype designed to help coastal fishermen and marine operations teams understand ocean-related information more easily.

Users can ask questions about fishing zones, sea safety, weather, restricted areas, routes, and historical ocean trends using text or voice. ORCA understands the question, selects the relevant data and calculations, performs safety and spatial checks, and produces a simple advisory along with map-based information and an explainable reasoning trail.

The current prototype uses mock/static ocean data for demonstration, while the architecture is designed to support future integration with official sources such as INCOIS and MOSDAC.

---

## 2. Problem

Coastal fishing and marine operations require decisions based on several types of information:

- **Sea Safety:** Wind and wave conditions can make a fishing trip unsafe.
- **Fishing Location:** Fishermen need useful information about potential fishing areas to reduce unnecessary searching.
- **Restricted Areas:** Marine protected areas and international maritime boundaries must be considered while planning movement.
- **Complex Ocean Data:** Satellite and oceanographic information can be difficult to interpret quickly.

The challenge is not simply the availability of data, but bringing different types of information together to answer a user's specific question.

---

## 3. ORCA Solution

ORCA acts as an intelligent interface between the user and multiple sources of ocean information.

### Example

**User asks:**

> "Is it safe to go fishing from Kochi today?"

**ORCA then:**

1. Understands the user's intent and location.
2. Retrieves the relevant ocean and weather information.
3. Applies safety rules to wind and wave conditions.
4. Checks relevant spatial information when required.
5. Generates a simple explanation.
6. Displays the result on the map and in the interface.

**The goal:** turn multiple pieces of ocean information into one understandable, explainable advisory.

---

## 4. How ORCA Works

```text
User Question
      |
      v
Intent Understanding
      |
      v
Relevant Data / Calculations
      |
      v
Safety & Spatial Checks
      |
      v
AI Response Generation
      |
      v
Map + Explanation
 ```

### Workflow

**1. User Question**

The user asks a question using text or voice.

**2. Intent Understanding**

The backend identifies the type of question, location, date, and language.

**3. Data and Calculations**

The system selects the relevant modules for fishing zones, weather, safety, routing, geofencing, or historical information.

**4. Safety and Spatial Checks**

Rule-based Python modules perform calculations such as distance matching, safety classification, geofence checks, and route generation.

**5. AI Response**

The language model converts the processed information into a simple response.

**6. Map and Explanation**

The frontend displays the result, relevant map information, and the reasoning trail.

---
## 5. Key Features

### Potential Fishing Zone (PFZ) Identification

ORCA can identify relevant Potential Fishing Zone information using geographic distance calculations and the available prototype data.

### Sea Safety Assessment

The system evaluates wind speed and wave height using predefined safety thresholds to classify conditions as Safe, Caution, or Danger.

> These are prototype rules and should not be treated as official marine safety advisories.

### Restricted Zone Geofencing

ORCA checks whether a location falls inside defined restricted geographic areas using point-in-polygon calculations.

### Hazard-Aware Routing

The routing module generates basic routes and can adjust waypoints when restricted areas or hazards need to be avoided.

### Historical Trend Analysis

The system provides historical trend information for selected ocean parameters using the prototype's available historical data.

### Multilingual Interface

The frontend supports multiple Indian languages, including:

- English
- Hindi
- Marathi
- Tamil
- Malayalam
- Telugu
- Bengali

Voice input is also supported through the browser's Web Speech API where available.

### Interactive Ocean Map

The frontend uses Leaflet to display ocean-related information, markers, zones, routes, and other relevant data.

### Explainable Reasoning Trail

ORCA displays the stages of its processing so users can understand how different modules contributed to the final response.

---
## 6. System Architecture

```text
                         ┌─────────────────────┐
                         │       USER          │
                         │  Text / Voice Query │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   ORCA ORCHESTRATOR │
                         │  Intent + Routing   │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ PFZ / Ocean │       │   Weather   │       │   Safety    │
      │    Data     │       │    Data     │       │   Engine    │
      └─────────────┘       └─────────────┘       └─────────────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             ┌─────────────┐                ┌─────────────┐
             │ Geofencing  │                │   Routing   │
             └─────────────┘                └─────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   LLM Response      │
                         │     Generator       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Frontend Dashboard  │
                         │ Map + Explanation   │
                         └─────────────────────┘
                         
### Architecture Layers

**Frontend**

- React + Vite
- Leaflet / React-Leaflet for the interactive map
- Tailwind CSS for interface styling
- Multilingual UI
- Voice input using the browser Web Speech API
- Firebase authentication integration

**Backend**

- FastAPI
- Server-Sent Events (SSE) for streaming responses
- Python-based data and calculation modules
- LangChain / LangGraph for orchestration and agent-style workflows

**AI Layer**

The project supports configurable language models through the LLM configuration layer, including cloud and local model options.

The LLM is used primarily for intent understanding, routing assistance, and converting processed information into natural-language responses.

**Data & Reasoning Layer**

The backend contains dedicated modules for:

- PFZ data
- Weather and ocean conditions
- Safety classification
- Geofencing
- Route generation
- Historical analysis

---

## 7. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Maps | Leaflet, React-Leaflet |
| Backend | Python, FastAPI |
| AI Orchestration | LangChain, LangGraph |
| LLMs | Groq, Google Gemini, Ollama |
| Authentication | Firebase |
| Streaming | Server-Sent Events |
| Geospatial Calculations | Haversine distance, Point-in-Polygon |
| Deployment | Vercel / Render configuration |

---
## 8. Multi-Agent Reasoning

ORCA is designed around multiple specialized reasoning roles that contribute different perspectives to a marine-related query.

### Oceanographer Agent

Focuses on:

- Sea-surface temperature
- Chlorophyll-related information
- Ocean conditions
- Environmental patterns

### Fisheries Agent

Focuses on:

- Potential fishing zones
- Fishing activity
- Catch-related patterns
- Location-based fishing information

### Coral Health Agent

Focuses on:

- Coral reef condition
- Bleaching-related information
- Environmental stress indicators

### Vessel Surveillance Agent

Focuses on:

- Vessel movement
- Unusual activity
- Spatial and maritime risk information

### Agent Collaboration

The frontend represents these specialized agents as a collaborative reasoning layer. Their outputs are intended to contribute different perspectives to a single ORCA response rather than functioning as isolated dashboards.

---

## 9. AI and LLM Layer

ORCA uses language models for natural-language understanding, routing assistance, and response generation.

The current configuration supports:

- **Groq-hosted LLaMA**
- **Google Gemini**
- **Ollama local models**

The LLM layer is configurable and supports fallback model options.

Deterministic Python modules handle important calculations such as:

- Safety classification
- Geographic distance
- Geofence checks
- Route generation

This separation keeps important safety and spatial logic explicit instead of relying entirely on an LLM.

---

## 10. Backend API

The backend is implemented using **FastAPI**.

### Main Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Backend health/status |
| `/query` | POST | Process a user query and stream the response |
| `/conditions` | GET | Return prototype ocean conditions |
| `/pfz-zones` | GET | Return prototype PFZ zones |
| `/sea-state` | GET | Return prototype sea-state information |

The `/query` endpoint uses **Server-Sent Events (SSE)** to stream reasoning and response information to the frontend.

---
## 11. Data and Prototype Status

The current repository contains demonstration/static data modules for:

- PFZ nodes
- Weather conditions
- Sea-surface temperature
- Chlorophyll
- Wind
- Wave height
- Historical trends
- Geographic restrictions
- Routes and waypoints

The system architecture is intended to support future integration with official ocean-data services such as INCOIS and MOSDAC.

### Important Prototype Limitation

The current demonstration should **not** be interpreted as a live operational marine advisory service.

Safety thresholds, geographic data, PFZ records, and other values used by the prototype may be static or simplified.

Official marine safety and fisheries advisories should always take precedence over prototype outputs.

---

## 12. Project Structure

```text
sih_26176/
│
├── agents/
│   ├── intent.py
│   ├── llm_config.py
│   ├── orca.py
│   ├── response.py
│   └── router.py
│
├── api/
│   └── main.py
│
├── data/
│   ├── pfz.py
│   ├── weather.py
│   ├── safety.py
│   ├── route.py
│   ├── historical.py
│   ├── geofence.py
│   └── geo_utils.py
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── tools/
├── requirements.txt
├── render.yaml
├── README.md
└── ORCA_README.md
  ```

---

## 13. Running the Project

### Backend

From the project root:

```bash
pip install -r requirements.txt
uvicorn api.main:app --reload
  ```

The backend will run locally using FastAPI.

### Frontend

Open another terminal:

  ```bash
cd frontend
npm install
npm run dev
  ```

The Vite development server will provide the frontend URL.

### Environment Variables

Create a `.env` file using `.env.example` as a reference.

Depending on the configured services, environment variables may be required for:

- LLM providers
- Firebase authentication
- Frontend/backend connection
- Allowed backend origins

**Do not commit API keys, private credentials, or other secrets to GitHub.**

---

## 14. Example Queries

Users can ask questions such as:

> "Is it safe to go fishing from Kochi today?"

> "Where is the nearest fishing zone from Chennai?"

> "Show me a safe route from Kochi."

> "Am I inside a restricted area?"

> "How has the ocean condition changed historically near Mumbai?"

> "What are the current sea conditions?"

The exact response depends on the prototype data and configured model.

---
## 15. Design Philosophy

ORCA is built around three principles:

### Data Already Exists. ORCA Makes It Reason Together.

Instead of forcing users to interpret multiple datasets independently, ORCA attempts to connect relevant information around a single question.

### AI Assists. Rules Constrain. Humans Decide.

AI is used for language understanding and explanation.

Explicit Python logic handles safety classification, geographic checks, and route calculations.

Final real-world decisions remain with the user and relevant official authorities.

### Explainability Over Black-Box Answers

ORCA presents a reasoning trail showing which modules and processing stages contributed to the result.

---

## 16. Future Scope

The prototype can be extended with:

- Live INCOIS data integration
- MOSDAC and satellite-data integration
- Real-time SST and chlorophyll feeds
- Coral bleaching and marine ecosystem indicators
- AIS-based vessel surveillance
- Real-time illegal-fishing risk analysis
- Improved route optimization
- More sophisticated ocean forecasting
- Additional regional languages
- Mobile-first fisherman interface
- Offline/low-connectivity support
- Voice-first interaction for field use

---

## 17. References and Related Systems

### INCOIS

Indian National Centre for Ocean Information Services:

https://incois.gov.in/

### INCOIS Potential Fishing Zone Advisory

https://incois.gov.in/MarineFisheries/PfzAdvisory

### INCOIS SAMUDRA

https://www.incois.gov.in/site/SAMUDRA/index.html

### INCOIS ERDDAP

https://erddap.incois.gov.in/

### Jal Anveshak

Research on fishing-zone prediction using fine-tuned LLaMA 2:

https://arxiv.org/abs/2411.10050

---

## 18. Team / Contribution

This repository is being developed as part of **Smart India Hackathon 2026 — Problem Statement 26176**.

The project combines:

- AI/LLM engineering
- Multi-agent reasoning
- Marine/ocean data processing
- Geospatial computation
- React frontend development
- Interactive mapping
- Multilingual user interaction

---

## 19. Disclaimer

ORCA is a hackathon prototype and is intended for demonstration and research purposes.

The system's mock/static data, rule-based safety classifications, routes, and AI-generated responses should not be treated as official navigation, fishing, weather, or safety advisories.

Users should rely on official marine and government advisories for real-world decisions.
