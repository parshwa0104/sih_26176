# ORCA — Frontend Prototype

A polished, animated React + Vite frontend for **ORCA** (Marine EcoSystem
Reasoning with Collaborative Agents) — built as a **frontend-only demo**
for the SIH presentation.

This is UI only: every number, alert, insight, and investigation result on
screen is realistic **mock data** defined in `src/data/mockData.js`. There
is no backend, no real API calls, and no live AI reasoning — the
investigation flow is a scripted frontend animation sequence that
simulates how a real ORCA query would look and feel.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in
your browser.

To build a static production bundle:

```bash
npm run build
npm run preview
```

## What's inside

- **Home dashboard** — greeting, live stat cards, an interactive ocean
  map (mock SST/chlorophyll heatmap, vessel tracks, marine-life sightings,
  anomaly markers), AI insights, live ocean conditions, and recent alerts —
  laid out to match the provided ORCA reference screenshot.
- **"Ask ORCA" query interface** — type a question (or click one of the
  example prompts) to trigger a full investigation animation:
  `QUERY → CORE → AGENTS → DATA → CONVERGENCE → SYNTHESIS`, exactly as
  described in the animation spec.
- **Four specialised agents** — Oceanographer, Fisheries, Coral Health,
  and Vessel Surveillance — each with idle / analysing / complete states,
  visualised both in the "Agent Collaboration" strip and as animated nodes
  around the ORCA reasoning core during an investigation.
- **ORCA Core** — a central reasoning visual that pulses, glows, and
  changes state as it coordinates the agents and converges their findings.
- **Synthesis panel** — the final investigation result, with a headline
  insight, confidence score, region, contributing agents, and supporting
  evidence.

## Project structure

```
src/
  main.jsx                 Entry point
  App.jsx / App.css        Top-level layout (header + sidebar + dashboard)
  index.css                Design tokens (colors, type, spacing) & resets
  data/
    mockData.js             All mock content (stats, insights, agents, map data...)
    investigationLayout.js  Layout positions for the core/agent visualization
  hooks/
    useInvestigation.js     State machine driving the investigation animation
  components/
    Header.jsx / Sidebar.jsx        App chrome
    Greeting.jsx / StatCards.jsx    Dashboard header + KPIs
    QueryPanel.jsx                  "Ask ORCA" input + example prompts
    MapCard.jsx / OceanMap.jsx      Map panel, tabs, layers, visualization
    AgentStrip.jsx                  Agent collaboration status strip
    InvestigationView.jsx           Orchestrates the investigation visuals
    OrcaCore.jsx / AgentNode.jsx    Core + agent node visuals
    DataFlowLines.jsx               Animated connection lines & particles
    SynthesisPanel.jsx              Final investigation result
    AIInsights.jsx / LiveConditions.jsx / RecentAlerts.jsx   Right column
    PlaceholderView.jsx             Stand-in for not-yet-built nav sections
```

## Notes for connecting a real backend later

Nothing here needs to change structurally to wire in real data:

- Swap the contents of `src/data/mockData.js` for API responses (the
  shapes are already intentionally close to what a real endpoint would
  return).
- `useInvestigation.js` currently drives its phases with timers — replace
  the `setTimeout` calls with real async calls to your agents/orchestrator
  and drive the same `phase` / `agentStatus` state from actual progress
  events (e.g. via polling or a WebSocket).
- No routing library is included; `activeNav` in `App.jsx` is a simple
  local state switch. Swap in `react-router` if/when there are real pages
  per section.

## Tech stack

React 18, Vite 5, plain CSS (no CSS framework), and `lucide-react` for
icons. No other dependencies.
