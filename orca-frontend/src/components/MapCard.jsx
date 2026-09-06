import { useState } from 'react'
import { Map, Calendar, ChevronDown, Layers } from 'lucide-react'
import { mapTabs, mapLayers } from '../data/mockData.js'
import OceanMap from './OceanMap.jsx'
import InvestigationView from './InvestigationView.jsx'
import { PHASES } from '../hooks/useInvestigation.js'
import './MapCard.css'

export default function MapCard({ investigation }) {
  const [activeTab, setActiveTab] = useState(mapTabs[0])
  const [layers, setLayers] = useState(mapLayers)
  const [layersOpen, setLayersOpen] = useState(false)

  const toggleLayer = (id) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, checked: !l.checked } : l)))
  }

  const showingInvestigation = investigation.phase !== PHASES.IDLE

  return (
    <div className="map-card glass-panel">
      <div className="map-card-toolbar">
        <div className="map-tabs">
          {mapTabs.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? 'map-tab active' : 'map-tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Ocean Map' && <Map size={14} strokeWidth={2.2} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="map-toolbar-right">
          <button
            className={layersOpen ? 'map-date layers-toggle active' : 'map-date layers-toggle'}
            onClick={() => setLayersOpen((v) => !v)}
            aria-expanded={layersOpen}
          >
            <Layers size={13} strokeWidth={2.1} />
            Layers
            <ChevronDown size={12} strokeWidth={2.1} className={layersOpen ? 'chev open' : 'chev'} />
          </button>
          <button className="map-date">
            <Calendar size={14} strokeWidth={2.1} />
            Sep 5, 2026
            <ChevronDown size={13} strokeWidth={2.1} />
          </button>
        </div>
      </div>

      {layersOpen && (
        <div className="layers-bar">
          {layers.map((layer) => (
            <label className="layer-row" key={layer.id}>
              <input
                type="checkbox"
                checked={layer.checked}
                onChange={() => toggleLayer(layer.id)}
              />
              <span className="layer-check" />
              <span className="layer-label">{layer.label}</span>
              {layer.gradient && <span className={`layer-swatch swatch-${layer.id}`} />}
            </label>
          ))}
        </div>
      )}

      <div className="map-card-body">
        <div className={showingInvestigation ? 'map-viewport dimmed' : 'map-viewport'}>
          <OceanMap />
        </div>

        {showingInvestigation && (
          <InvestigationView investigation={investigation} />
        )}
      </div>
    </div>
  )
}
