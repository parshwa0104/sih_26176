// ---------------------------------------------------------------------------
// All data in this file is MOCK data for frontend demo purposes only.
// Structured so real API responses can be dropped in later with the same shape.
// ---------------------------------------------------------------------------

export const demoMode = true

export const currentUser = {
  name: 'Aditya Daga',
  role: 'Researcher',
  initials: 'AD',
}

export const navItems = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'map', label: 'Ocean Map', icon: 'Map' },
  { id: 'explorer', label: 'Data Explorer', icon: 'Database' },
  { id: 'reports', label: 'Reports', icon: 'FileText' },
  { id: 'alerts', label: 'Alerts', icon: 'Bell' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
]

export const statCards = [
  { id: 'regions', label: 'Total Marine Regions Monitored', value: '12', delta: '2 new', icon: 'Waves', tone: 'teal' },
  { id: 'species', label: 'Active Species Tracked', value: '48', delta: '6 new', icon: 'Fish', tone: 'blue' },
  { id: 'sources', label: 'Data Sources', value: '15', delta: 'Live', icon: 'Satellite', tone: 'cyan', deltaStyle: 'live' },
  { id: 'agents', label: 'Collaborative Agents', value: '5', delta: 'Online', icon: 'Users', tone: 'success', deltaStyle: 'live' },
]

export const mapTabs = ['Ocean Map', 'SST', 'Chlorophyll', 'Weather', 'Fishing Zones']

export const mapLayers = [
  { id: 'sst', label: 'SST (°C)', gradient: true, checked: true },
  { id: 'chlorophyll', label: 'Chlorophyll (mg/m³)', gradient: true, checked: true },
  { id: 'fishing', label: 'Fishing Zones', checked: true },
  { id: 'marine-life', label: 'Marine Life Sightings', checked: true },
  { id: 'weather', label: 'Weather Systems', checked: false },
]

export const mapMarkers = {
  coastal: [
    { id: 'mumbai', label: 'Mumbai', x: 50.6, y: 21.9, coords: '19.1°N 72.9°E' },
    { id: 'ratnagiri', label: 'Ratnagiri', x: 51.1, y: 25.9, coords: '17.0°N 73.3°E' },
    { id: 'goa', label: 'Goa', x: 51.8, y: 28.9, coords: '15.5°N 73.8°E' },
  ],
  vessels: [
    { x: 38.5, y: 19.5 }, { x: 46, y: 24.8 }, { x: 71, y: 58 }, { x: 72.5, y: 46 },
  ],
  vesselTrack: [{ x: 38.5, y: 19.5 }, { x: 42, y: 22 }, { x: 46, y: 24.8 }, { x: 50, y: 23 }],
  sightings: { x: 58.3, y: 52.5, count: 3 },
  anomaly: { x: 43, y: 37, tag: 'SST-ANOM' },
  chlorophyllHigh: { x: 46.8, y: 26.5, value: '1.10 mg/m³' },
}

export const aiInsights = [
  { id: 'tuna', icon: 'Fish', tone: 'teal', title: 'High probability of tuna presence', subtitle: 'Off Ratnagiri coast (72% confidence)' },
  { id: 'algal', icon: 'TriangleAlert', tone: 'danger', title: 'Potential harmful algal bloom', subtitle: 'Near 18.5°N, 72.8°E (moderate risk)' },
  { id: 'fishing', icon: 'Waves', tone: 'blue', title: 'Favourable conditions for fishing', subtitle: 'SST 26–28°C · Moderate chlorophyll' },
  { id: 'cyclone', icon: 'Wind', tone: 'indigo', title: 'Cyclone risk', subtitle: 'Low probability in next 5 days' },
]

export const liveConditions = [
  { id: 'sst', label: 'Sea Surface Temperature', value: '27.4', unit: '°C', delta: '0.6°C', icon: 'Thermometer', tone: 'blue' },
  { id: 'chl', label: 'Chlorophyll Concentration', value: '0.32', unit: 'mg/m³', delta: '12%', icon: 'Leaf', tone: 'success' },
  { id: 'wind', label: 'Wind Speed', value: '12.8', unit: 'm/s', delta: '2.1 m/s', icon: 'Wind', tone: 'cyan' },
  { id: 'wave', label: 'Wave Height', value: '1.6', unit: 'm', delta: '0.3 m', icon: 'Waves', tone: 'blue' },
]

export const recentAlerts = [
  { id: 'a1', severity: 'danger', title: 'Possible overfishing zone detected', meta: 'Near Goa coast · 2h ago' },
  { id: 'a2', severity: 'warning', title: 'Elevated sea surface temperature', meta: 'Central Arabian Sea · 4h ago' },
  { id: 'a3', severity: 'success', title: 'High chlorophyll concentration', meta: 'Off Ratnagiri · 6h ago' },
]

// The four specialized reasoning agents (per animation spec)
// metrics = simulated finding datapoints revealed during investigation.
export const agents = [
  {
    id: 'oceanographer',
    name: 'Oceanographer',
    icon: 'Waves',
    tone: 'cyan',
    role: 'Reads SST, currents & chlorophyll',
    findingIdle: 'Awaiting query',
    finding: 'SST anomaly of +1.3°C detected 40km offshore, weakening the seasonal upwelling.',
    metrics: [
      { label: 'SST anomaly', value: '+1.3°C' },
      { label: 'Chlorophyll', value: '↓ 14%' },
    ],
  },
  {
    id: 'fisheries',
    name: 'Fisheries',
    icon: 'Fish',
    tone: 'teal',
    role: 'Tracks catch data & species movement',
    findingIdle: 'Awaiting query',
    finding: 'Pelagic catch reports down 18% week-on-week across three registered fleets.',
    metrics: [
      { label: 'Fishing pressure', value: 'High' },
      { label: 'Catch trend', value: 'Declining' },
    ],
  },
  {
    id: 'coral',
    name: 'Coral Health',
    icon: 'Sprout',
    tone: 'success',
    role: 'Monitors reef stress & bleaching risk',
    findingIdle: 'Awaiting query',
    finding: 'No acute bleaching signal, but thermal stress index is trending upward.',
    metrics: [
      { label: 'Bleaching risk', value: 'Moderate' },
      { label: 'Thermal stress', value: 'Elevated' },
    ],
  },
  {
    id: 'vessel',
    name: 'Vessel Surveillance',
    icon: 'Ship',
    tone: 'blue',
    role: 'Tracks AIS vessel activity & tracks',
    findingIdle: 'Awaiting query',
    finding: 'Trawler activity has shifted 12km north, away from historical grounds.',
    metrics: [
      { label: 'Vessel density', value: 'Elevated' },
      { label: 'Unusual tracks', value: '3 flagged' },
    ],
  },
]

export const exampleQueries = [
  'Why is marine ecosystem stress increasing along the Maharashtra coast?',
  'Is there a bleaching risk in the Malvan reef this month?',
  'Explain the SST anomaly near 18.5°N, 72.8°E',
]

// Synthesis result shown once an investigation completes.
// Simulated values — never presented as live telemetry.
export const synthesisResult = {
  headline: 'Elevated ecosystem stress detected along the Maharashtra coast.',
  confidence: 87,
  region: 'Maharashtra Coast',
  contributingAgents: ['oceanographer', 'fisheries', 'coral', 'vessel'],
  signals: 6,
  evidence: [
    'A +1.3°C sea surface anomaly is weakening the seasonal upwelling 40km offshore.',
    'Fishing pressure is elevated and catch trends are declining across registered fleets.',
    'Thermal stress on nearshore reef systems is trending upward.',
    'AIS data shows an unusual concentration of vessels overlapping the affected area.',
  ],
  agents: [
    { id: 'oceanographer', category: 'Oceanographic', text: 'SST anomaly detected in the investigated region.' },
    { id: 'fisheries', category: 'Fisheries', text: 'Elevated fishing pressure overlaps the affected area.' },
    { id: 'vessel', category: 'Vessel Surveillance', text: 'Unusual vessel concentration detected.' },
    { id: 'coral', category: 'Coral / Environmental', text: 'Ecosystem stress overlaps with observed reef stress.' },
  ],
  sources: [
    { name: 'INCOIS', desc: 'Oceanographic data' },
    { name: 'AIS Network', desc: 'Vessel / traffic data' },
    { name: 'Marine Fisheries', desc: 'Catch & landing records' },
    { name: 'Reef Monitoring', desc: 'Coral observations' },
  ],
}
