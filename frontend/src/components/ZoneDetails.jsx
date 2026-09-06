import { Fish, MapPin, Compass } from 'lucide-react'
import { isNum, cx } from '../lib/format'

const CONF_PILL = {
  High: 'border-status-safe/40 text-status-safe',
  Medium: 'border-status-caution/40 text-status-caution',
  Low: 'border-hairline text-ink-dim',
}

/** Evidence panel for a tapped PFZ marker. */
export default function ZoneDetails({ zone, onAsk, onCenter, t }) {
  if (!zone) return null
  const c = zone.conditions || {}

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-status-safe">
            {zone.label || 'PFZ'}
          </p>
          <h3 className="mt-1 text-base font-bold text-ink">
            {zone.description || t.legendPfz}
          </h3>
        </div>
        {zone.confidence && (
          <span
            className={cx(
              'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              CONF_PILL[zone.confidence] || CONF_PILL.Low,
            )}
          >
            {t.confidence}: {zone.confidence}
          </span>
        )}
      </div>

      {zone.species && (
        <p className="flex items-center gap-2 text-sm text-ink">
          <Fish size={15} className="text-status-safe" />
          {t.likelyCatch}: <span className="font-semibold text-status-safe">{zone.species}</span>
        </p>
      )}

      {(c.sst || c.chlorophyll || c.wind_speed) && (
        <div className="rounded-xl border border-hairline bg-surface-1/40 p-3 text-xs leading-relaxed text-ink-dim">
          {(c.sst || c.chlorophyll) && (
            <p>
              <span className="font-semibold text-ink">{t.why}: </span>
              {c.sst ? `${t.sst} ${c.sst}` : ''}
              {c.sst_range ? ` (${c.sst_range})` : ''}
              {c.chlorophyll ? ` · ${t.chla} ${c.chlorophyll}` : ''}
            </p>
          )}
          {(c.wind_speed || c.wave_height) && (
            <p className="mt-1">
              <span className="font-semibold text-ink">{t.conditions}: </span>
              {c.wind_speed ? `${t.wind} ${c.wind_speed}` : ''}
              {c.wave_height ? ` · ${t.waves} ${c.wave_height}` : ''}
              {c.craft_advisory ? (
                <span className="text-status-safe"> — {c.craft_advisory}</span>
              ) : null}
            </p>
          )}
          {(zone.source || zone.updated) && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim/80">
              {zone.source}
              {zone.updated ? ` · ${t.asOf} ${zone.updated}` : ''}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAsk?.(`Tell me about fishing near ${zone.description || zone.label}`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-white/5"
        >
          <Compass size={13} />
          {t.askAboutThis}
        </button>
        {isNum(zone.lat) && isNum(zone.lng) && (
          <button
            type="button"
            onClick={() => onCenter?.([zone.lat, zone.lng], 10)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1.5 text-xs font-semibold text-ink-dim transition-colors hover:text-ink"
          >
            <MapPin size={13} />
            {t.viewOnMap}
          </button>
        )}
      </div>
    </div>
  )
}
