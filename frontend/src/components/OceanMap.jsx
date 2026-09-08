import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Plus, Minus, LocateFixed } from 'lucide-react'
import PfzLayer from './PfzLayer'
import SeaStateLayer from './SeaStateLayer'
import QueryOverlay from './QueryOverlay'
import { vesselIcon } from '../lib/mapIcons'
import { isNum, cx } from '../lib/format'
import debounce from 'lodash.debounce'

const validCenter = (c) => Array.isArray(c) && isNum(c[0]) && isNum(c[1])

function MapController({ center, zoom, onMove }) {
  const map = useMap()

  useEffect(() => {
    if (validCenter(center)) {
      map.setView(center, isNum(zoom) ? zoom : map.getZoom(), { animate: true })
    }
  }, [center, zoom, map])

  const handleMove = useMemo(
    () =>
      debounce(() => {
        const c = map.getCenter()
        onMove?.(c.lat, c.lng)
      }, 200),
    [map, onMove]
  )

  useMapEvents({
    move: handleMove,
  })

  useEffect(() => {
    return () => handleMove.cancel()
  }, [handleMove])

  return null
}

/** The interactive ocean chart — the heart of ORCA. */
export default function OceanMap({
  center,
  zoom,
  userLoc,
  pfzZones,
  seaState,
  showPfz,
  showSeaState,
  queryMapData,
  onZoneTap,
  onMove,
  t,
}) {
  const [map, setMap] = useState(null)

  const ctrlBtn =
    'grid h-9 w-9 place-items-center text-ink-dim transition-colors hover:bg-black/5 hover:text-ink disabled:opacity-30'

  return (
    <div className="absolute inset-0">
      <MapContainer
        ref={setMap}
        preferCanvas={true}
        center={validCenter(center) ? center : [15, 76]}
        zoom={isNum(zoom) ? zoom : 6}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* Keyless OSM raster tiles; recoloured to a dark ocean chart via a
            CSS filter on .leaflet-tile-pane (vectors/markers are unaffected). */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxZoom={19}
        />
        <MapController center={center} zoom={zoom} onMove={onMove} />

        {userLoc && isNum(userLoc.lat) && isNum(userLoc.lng) && (
          <Marker position={[userLoc.lat, userLoc.lng]} icon={vesselIcon}>
            <Popup>
              <b>{userLoc.label || t.vessel}</b>
            </Popup>
          </Marker>
        )}

        {showSeaState && <SeaStateLayer grid={seaState} />}
        {showPfz && <PfzLayer zones={pfzZones} onZoneTap={onZoneTap} />}
        <QueryOverlay data={queryMapData} t={t} />
      </MapContainer>



      {/* Map controls */}
      <div className="absolute right-3 top-3 z-[500] flex flex-col overflow-hidden rounded-xl border border-hairline bg-ocean-850/90 backdrop-blur">
        <button
          type="button"
          className={cx(ctrlBtn, 'border-b border-hairline')}
          onClick={() => map?.zoomIn()}
          aria-label={t.zoomIn}
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          className={cx(ctrlBtn, 'border-b border-hairline')}
          onClick={() => map?.zoomOut()}
          aria-label={t.zoomOut}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          className={ctrlBtn}
          onClick={() =>
            userLoc && isNum(userLoc.lat) && map?.setView([userLoc.lat, userLoc.lng], 10)
          }
          disabled={!userLoc || !isNum(userLoc?.lat)}
          aria-label={t.recenter}
        >
          <LocateFixed size={15} />
        </button>
      </div>
    </div>
  )
}
