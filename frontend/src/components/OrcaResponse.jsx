import { RefreshCw, WifiOff, Clock, Navigation, ShieldCheck } from 'lucide-react'
import Sonar from './Sonar'
import ReasoningTrail from './ReasoningTrail'
import { isNum, cx } from '../lib/format'

const PILL = {
  safe: 'border-status-safe/40 text-status-safe',
  caution: 'border-status-caution/40 text-status-caution',
  danger: 'border-status-danger/40 text-status-danger',
}

function SafetyPill({ status, t }) {
  const word = status === 'danger' ? t.danger : status === 'caution' ? t.caution : t.safe
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-meta font-bold uppercase',
        PILL[status] || PILL.safe,
      )}
    >
      <ShieldCheck size={10} />
      {word}
    </span>
  )
}

function Chip({ children }) {
  return (
    <span className="rounded-full border border-hairline bg-surface-1/50 px-2 py-1 font-mono text-meta text-ink-dim">
      {children}
    </span>
  )
}

function RouteStats({ md, t }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1/40 p-stack">
      <div className="flex items-center gap-field font-mono text-meta text-ink-dim">
        <Navigation size={11} className="text-accent" />
        {t.navMap}
      </div>
      <div className="mt-2 flex flex-wrap gap-4">
        {isNum(md.distance_km) && (
          <div>
            <div className="font-mono text-meta uppercase text-ink-dim">{t.routeDistance}</div>
            <div className="font-mono text-readout text-ink">
              {md.distance_km} <span className="text-caption text-ink-dim">{t.km}</span>
            </div>
          </div>
        )}
        {isNum(md.estimated_time_hrs) && (
          <div>
            <div className="font-mono text-meta uppercase text-ink-dim">{t.routeEta}</div>
            <div className="font-mono text-readout text-ink">
              {md.estimated_time_hrs} <span className="text-caption text-ink-dim">{t.hrs}</span>
            </div>
          </div>
        )}
      </div>
      {Array.isArray(md.avoidances) && md.avoidances.length > 0 && (
        <p className="mt-2 text-caption text-status-caution">
          {t.routeAvoiding}: {md.avoidances.join(', ')}
        </p>
      )}
    </div>
  )
}

/**
 * Inner content for the ORCA response drawer / sheet. The parent supplies the
 * surrounding panel chrome so this renders the same on desktop and mobile.
 */
export default function OrcaResponse({
  loading,
  error,
  data,
  activeConditions,
  activeSource,
  activeUpdated,
  safetyStatus,
  onRetry,
  t,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-3.5">
        <Sonar size={44} label={t.analyzing} />
        <div>
          <p className="font-display text-label text-accent">{t.analyzing}</p>
          <p className="mt-0.5 text-caption text-ink-dim">{t.askHint}</p>
        </div>
      </div>
    )
  }

  if (error) {
    const timeout = error === 'timeout'
    return (
      <div className="flex items-start gap-3">
        {timeout ? (
          <Clock size={20} className="mt-0.5 shrink-0 text-status-caution" />
        ) : (
          <WifiOff size={20} className="mt-0.5 shrink-0 text-status-danger" />
        )}
        <div className="flex-1">
          <p className="text-body font-semibold text-ink">
            {timeout ? t.queryTimeout : t.queryFailed}
          </p>
          <p className="mt-0.5 text-caption text-ink-dim">
            {timeout ? t.queryTimeoutMsg : t.queryFailedMsg}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-hairline px-2.5 py-1 text-label text-accent transition-colors hover:bg-black/5"
          >
            <RefreshCw size={12} />
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const md = data.map_data
  const chips = []
  if (activeConditions?.sst) chips.push(`${t.sst} ${activeConditions.sst}`)
  if (activeConditions?.wind_speed) chips.push(`${t.wind} ${activeConditions.wind_speed}`)
  if (activeConditions?.wave_height) chips.push(`${t.waves} ${activeConditions.wave_height}`)
  if (activeConditions?.chlorophyll) chips.push(`${t.chla} ${activeConditions.chlorophyll}`)
  if (md?.type === 'pfz' && md.info) chips.push(md.info)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-display text-label text-accent">{t.orcaAnswer}</span>
        {safetyStatus && <SafetyPill status={safetyStatus} t={t} />}
      </div>

      <p className="text-body leading-relaxed text-ink">{data.text || t.emptyResponse}</p>

      {(chips.length > 0 || activeUpdated) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c, i) => (
            <Chip key={i}>{c}</Chip>
          ))}
          {activeUpdated && (
            <Chip>
              {t.asOf} {activeUpdated}
              {activeSource ? `, ${activeSource}` : ''}
            </Chip>
          )}
        </div>
      )}

      {md?.type === 'route' && <RouteStats md={md} t={t} />}

      <ReasoningTrail steps={data.reasoning_trail} t={t} />
    </div>
  )
}
