import './EntryMarineLife.css'

/* Simple premium fish silhouette (tail left, facing right). */
function FishShape({ size }) {
  return (
    <svg
      className="fish-shape"
      width={size}
      height={size * 0.46}
      viewBox="0 0 30 13"
      aria-hidden="true"
    >
      <path
        d="M1 6.5 L5.5 3.9 C10 2.7 17 2.6 22 4.3 C26.6 3.6 29.5 4.6 29 6.5
           C29.5 8.4 26.6 9.4 22 8.7 C17 10.4 10 10.3 5.5 9.1 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* Schools: different depths, directions, speeds, phases. */
const SCHOOLS = [
  { top: 20, dir: 1,  dur: 24, ph: -6,  x0: 8,  n: 5, d: 'd-far',  size: 10 },
  { top: 36, dir: -1, dur: 19, ph: -9,  x0: 26, n: 4, d: 'd-mid',  size: 13 },
  { top: 50, dir: 1,  dur: 30, ph: -14, x0: 46, n: 4, d: 'd-far',  size: 9 },
  { top: 63, dir: -1, dur: 16, ph: -7,  x0: 16, n: 3, d: 'd-near', size: 16 },
  { top: 78, dir: 1,  dur: 22, ph: -11, x0: 58, n: 3, d: 'd-mid',  size: 12 },
]

/* A couple of larger, slower loners at different depths. */
const LONERS = [
  { top: 30, dir: -1, dur: 34, ph: -17, d: 'd-lone',  size: 24 },
  { top: 84, dir: 1,  dur: 27, ph: -6,  d: 'd-lone2', size: 34 },
]

const BUBBLES = Array.from({ length: 5 }, (_, i) => ({
  left: 8 + i * 21 + (i % 2) * 7,
  delay: -(1.5 + i * 3.1),
  dur: 9 + (i % 3) * 3,
}))

export default function EntryMarineLife() {
  return (
    <div className="marine-wrap" aria-hidden="true">
      {/* soft caustic light */}
      <div className="marine-caustics" />

      {/* plankton */}
      <div className="marine-plankton">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="plankton"
            style={{
              left: `${(i * 83) % 100}%`,
              top: `${(i * 37) % 90}%`,
              animationDelay: `${-(i % 9)}s`,
              animationDuration: `${7 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* schools */}
      {SCHOOLS.map((s, si) => (
        <div key={si} className="school" style={{ top: `${s.top}%` }}>
          {Array.from({ length: s.n }, (_, i) => (
            <span
              key={i}
              className={`fish-anim ${s.dir === -1 ? 'dir-l' : ''} ${s.d}`}
              style={{ left: `${s.x0 + i * 17}vw`, animationDuration: `${s.dur}s`, animationDelay: `${s.ph + (i * s.dur) / s.n}s` }}
            >
              <span className="fish-bob" style={{ animationDuration: `${3 + (i % 3)}s` }}>
                <span className="fish-wob">
                  <FishShape size={s.size} />
                </span>
              </span>
            </span>
          ))}
        </div>
      ))}

      {/* larger loners */}
      {LONERS.map((l, li) => (
        <span
          key={`l${li}`}
          className={`fish-anim ${l.dir === -1 ? 'dir-l' : ''} ${l.d}`}
          style={{ top: `${l.top}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.ph}s` }}
        >
          <span className="fish-bob" style={{ animationDuration: '6s' }}>
            <span className="fish-wob">
              <FishShape size={l.size} />
            </span>
          </span>
        </span>
      ))}

      {/* distant whale silhouette (very faint, far background) */}
      <div className="whale">
        <svg width="220" height="70" viewBox="0 0 120 38" aria-hidden="true">
          <path
            d="M4 30 C 12 18 30 12 52 14 C 72 12 92 18 100 26
               C 116 22 122 24 118 28 C 112 32 96 32 100 30
               C 82 36 40 36 22 33 C 12 33 6 32 4 30 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* occasional tiny bubbles */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
        />
      ))}
    </div>
  )
}
