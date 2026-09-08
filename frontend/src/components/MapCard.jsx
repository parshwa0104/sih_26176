/**
 * Structured content for a Leaflet popup: an icon + title row, an optional
 * confidence/status tag, key/value rows and a note. Styling matches the
 * side panels so a popup reads as the same instrument, not a tooltip.
 */
export default function MapCard({ accent = 'var(--accent)', icon: Icon, title, tag, rows = [], note }) {
  const wash = typeof accent === 'string' && accent.startsWith('#') ? `${accent}1f` : 'rgba(11,100,114,0.12)'
  return (
    <div className="min-w-[172px] max-w-[240px] p-2.5 font-sans">
      <div className="flex items-center gap-2">
        {Icon && (
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
            style={{ background: wash, color: accent }}
          >
            <Icon size={12} />
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-display text-label uppercase text-ink">
          {title}
        </span>
        {tag && (
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-meta font-bold uppercase"
            style={{ background: wash, color: accent }}
          >
            {tag}
          </span>
        )}
      </div>

      {rows.length > 0 && (
        <dl className="mt-2 space-y-1 border-t border-hairline pt-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 font-mono text-meta uppercase text-ink-dim">{k}</dt>
              <dd className="min-w-0 truncate text-right font-mono text-caption text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {note && <p className="mt-2 text-caption leading-snug text-ink-dim">{note}</p>}
    </div>
  )
}
