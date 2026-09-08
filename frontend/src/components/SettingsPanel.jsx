import { RefreshCw } from 'lucide-react'
import Modal from './Modal'
import StatusDot from './StatusDot'
import { LANG_CODES } from '../translations'
import { API_BASE } from '../api/client'
import { cx } from '../lib/format'

function Row({ label, children }) {
  return (
    <div className="border-b border-hairline py-3.5 last:border-0">
      <div className="font-mono text-meta uppercase text-ink-dim">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export default function SettingsPanel({
  lang,
  onLang,
  systemStatus,
  reducedMotion,
  onRetry,
  t,
  onClose,
}) {
  return (
    <Modal title={t.settingsTitle} onClose={onClose} closeLabel={t.close}>
      <Row label={t.settingLanguage}>
        <div className="flex flex-wrap gap-1.5">
          {LANG_CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLang(code)}
              className={cx(
                'rounded-lg border px-2.5 py-1.5 text-label transition-colors',
                code === lang
                  ? 'border-hairline-strong bg-accent/10 text-accent'
                  : 'border-hairline text-ink-dim hover:text-ink',
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </Row>

      <Row label={t.settingMotion}>
        <span className="text-body text-ink">
          {reducedMotion ? t.motionReduced : t.motionFull}
        </span>
      </Row>

      <Row label={t.settingApi}>
        <code className="block break-all rounded-md border border-hairline bg-surface-1/50 px-2 py-1.5 font-mono text-caption text-ink-dim">
          {API_BASE}
        </code>
      </Row>

      <Row label={t.settingStatus}>
        <div className="flex items-center gap-2">
          <StatusDot status={systemStatus} />
          <span className="text-body text-ink">
            {systemStatus === 'live'
              ? t.systemLive
              : systemStatus === 'offline'
                ? t.systemOffline
                : t.systemConnecting}
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1 text-label text-accent transition-colors hover:bg-black/5"
          >
            <RefreshCw size={12} />
            {t.retry}
          </button>
        </div>
      </Row>
    </Modal>
  )
}
