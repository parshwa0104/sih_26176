import { Fish } from 'lucide-react'

export function OrcaMark({ size = 44 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="orcaAuthMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fe6fa" />
          <stop offset="100%" stopColor="#2dd4f5" />
        </linearGradient>
      </defs>
      <path
        d="M4 24c4-11 13-18 24-16 4 0.7 7 3 8 5-3-1-6-1-8 0 3 2 4 5 3 8-1 3-4 5-7 5-1.6 3-5 6-9 6-6 0-11-4-13-9-2 0.4-4-0.2 2 1z"
        fill="url(#orcaAuthMark)"
      />
      <circle cx="27" cy="16.5" r="1.4" fill="#04121f" />
    </svg>
  )
}

const FISH = [
  { top: '18%', left: '8%', size: 22, dur: 46, delay: 0, flip: false },
  { top: '66%', left: '74%', size: 18, dur: 54, delay: 6, flip: true },
  { top: '34%', left: '58%', size: 14, dur: 40, delay: 12, flip: false },
  { top: '80%', left: '20%', size: 16, dur: 60, delay: 3, flip: true },
]

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 71) % 100,
  delay: (i * 0.9) % 14,
  dur: 12 + (i % 6) * 2.4,
  size: 1 + (i % 3),
}))

export default function OceanBackdrop() {
  return (
    <div className="auth-backdrop" aria-hidden="true">
      <div className="auth-light" />
      <svg className="auth-currents" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M-5 18 Q 25 10 55 20 T 105 14" />
        <path d="M-5 42 Q 30 34 62 44 T 105 38" />
        <path d="M-5 66 Q 35 58 66 68 T 105 62" />
        <path d="M-5 88 Q 28 80 70 90 T 105 84" />
      </svg>
      <div className="auth-particles">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="auth-particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>
      {FISH.map((f, i) => (
        <span
          key={i}
          className="auth-fish"
          style={{ top: f.top, left: f.left, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
        >
          <Fish size={f.size} strokeWidth={1.4} style={{ transform: f.flip ? 'scaleX(-1)' : undefined }} />
        </span>
      ))}
    </div>
  )
}
