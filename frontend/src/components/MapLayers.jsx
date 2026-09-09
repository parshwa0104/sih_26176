import { cx } from '../lib/format'
import { CHART, SIGNAL } from '../lib/chartColors'

/* Small chart-symbol swatches — miniatures of the map markers / fills. */
function PfzSwatch() {
  return (
    <span
      className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-[1.5px]"
      style={{ borderColor: CHART.pfz, background: `${CHART.pfz}29` }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: CHART.pfz }} />
    </span>
  )
}
function SeaSwatch() {
  return (
    <span className="flex h-3.5 w-3.5 shrink-0 overflow-hidden rounded-sm border border-hairline">
      <span className="flex-1" style={{ background: `${CHART.route}5c` }} />
      <span className="flex-1" style={{ background: `${SIGNAL.caution}5c` }} />
      <span className="flex-1" style={{ background: `${SIGNAL.danger}5c` }} />
    </span>
  )
}
function DiamondSwatch({ color }) {
  return (
    <span className="grid h-3.5 w-3.5 shrink-0 place-items-center">
      <span className="h-2.5 w-2.5 rotate-45 rounded-sm" style={{ background: color }} />
    </span>
  )
}
function TriangleSwatch({ color }) {
  return (
    <span
      className="h-0 w-0 shrink-0"
      style={{
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: `12px solid ${color}`,
      }}
    />
  )
}

function Toggle({ active, onClick, swatch, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'flex min-h-[36px] w-full items-center gap-2 rounded-xl px-2 py-1.5 text-label transition-colors',
        active ? 'text-ink' : 'text-ink-mute hover:text-ink-dim',
      )}
    >
      <span className={cx('transition-opacity', !active && 'opacity-35')}>{swatch}</span>
      <span className="flex-1 text-left">{label}</span>
      <span
        className={cx(
          'h-3.5 w-6 shrink-0 rounded-full border transition-colors',
          active ? 'border-accent bg-accent/80' : 'border-hairline-strong bg-transparent',
        )}
      >
        <span
          className={cx(
            'block h-[11px] w-[11px] translate-y-px rounded-full bg-white transition-transform',
            active ? 'translate-x-[13px]' : 'translate-x-px',
          )}
        />
      </span>
    </button>
  )
}

/**
 * Chart layer control that doubles as the legend: each row shows the symbol
 * it toggles, and transient overlays (route / hazard) list themselves when
 * present so every mark on the chart is named.
 */
export default function MapLayers({
  showPfz,
  showSeaState,
  onTogglePfz,
  onToggleSeaState,
  activeOverlay,
  t,
}) {
  const routeOn = activeOverlay === 'route'
  const hazardOn = activeOverlay === 'geofence' || activeOverlay === 'safety'

  return (
    <div className="w-[164px] rounded-xl border border-hairline bg-ocean-850/92 p-1.5 shadow-inst backdrop-blur lg:w-[186px]">
      <div className="px-2 pb-1 pt-0.5 font-mono text-meta text-ink-mute">{t.layers}</div>

      <Toggle active={showPfz} onClick={onTogglePfz} swatch={<PfzSwatch />} label={t.layerPfz} />
      <Toggle active={showSeaState} onClick={onToggleSeaState} swatch={<SeaSwatch />} label={t.layerSea} />
      {showSeaState && (
        <div className="hidden justify-between px-2 pb-1 pt-0.5 font-mono text-[9px] text-ink-mute lg:flex">
          <span>{t.seaCalm}</span>
          <span>{t.seaModerate}</span>
          <span>{t.seaRough}</span>
        </div>
      )}

      {(routeOn || hazardOn) && (
        <div className="mt-1 border-t border-hairline pt-1">
          {routeOn && (
            <div className="flex items-center gap-2 px-2 py-1 text-label text-ink-dim">
              <DiamondSwatch color={CHART.route} />
              <span>{t.legendRoute}</span>
            </div>
          )}
          {hazardOn && (
            <div className="flex items-center gap-2 px-2 py-1 text-label text-ink-dim">
              <TriangleSwatch color={SIGNAL.danger} />
              <span>{t.legendHazard}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-1 hidden items-center gap-2 border-t border-hairline px-2 pb-0.5 pt-1.5 text-label text-ink-dim lg:flex">
        <span
          className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2"
          style={{ borderColor: CHART.vessel }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: CHART.vessel }} />
        </span>
        <span>{t.legendVessel}</span>
      </div>
    </div>
  )
}
