/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // ── Type scale ──────────────────────────────────────────────
    // Single source of truth. Deliberately bimodal: a tight functional
    // band (10-16, ~1.08 steps) for instrument chrome, and a readout
    // band (20-34, ~1.28) so live numbers dominate. Each token carries
    // its own line-height, tracking and weight — one class is the whole
    // decision. Replaces Tailwind's default scale entirely so call sites
    // can't drift back to `text-sm`.
    fontSize: {
      meta: ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.075em', fontWeight: '500' }],
      label: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.045em', fontWeight: '600' }],
      caption: ['0.75rem', { lineHeight: '1.0625rem', letterSpacing: '0.005em', fontWeight: '400' }],
      body: ['0.8125rem', { lineHeight: '1.1875rem', letterSpacing: '0em', fontWeight: '400' }],
      input: ['0.9375rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em', fontWeight: '500' }],
      heading: ['1rem', { lineHeight: '1.3125rem', letterSpacing: '-0.011em', fontWeight: '600' }],
      readout: ['1.25rem', { lineHeight: '1.375rem', letterSpacing: '-0.014em', fontWeight: '600' }],
      'readout-lg': ['1.625rem', { lineHeight: '1.75rem', letterSpacing: '-0.019em', fontWeight: '700' }],
      'readout-xl': ['2.125rem', { lineHeight: '2.125rem', letterSpacing: '-0.026em', fontWeight: '700' }],
    },
    extend: {
      // ── Spacing rhythm ────────────────────────────────────────
      // Named structural rungs, layered over Tailwind's 4px grid.
      // Used for panel padding, sheet/modal chrome, card insets and
      // inline clusters so structure reads consistently.
      spacing: {
        field: '0.5rem', //  8 — gap within an inline cluster (icon <-> text)
        stack: '0.75rem', // 12 — gap between stacked items in a group
        block: '1rem', // 16 — panel / section padding
        panel: '1.25rem', // 20 — sheet + modal body padding
        bay: '1.75rem', // 28 — separation between major regions
      },
      colors: {
        // ── Bathymetric instrument palette ────────────────────────
        // Cool chart-paper ground, teal-charcoal ink, deep marine-teal
        // accent. Not sky-on-white. Status hues stay one family across
        // chrome (`safe`) and map (`safe-mark`); `chart.*` carries the
        // vector/marker colours (mirrored in src/lib/chartColors.js for
        // the JS side).
        ocean: { 900: '#EEF2F1', 850: '#FBFCFB', 800: '#DFE6E4' },
        surface: { 1: '#FFFFFF', 2: '#F4F7F6', 3: '#EAEFED' },
        accent: { DEFAULT: '#0B6472', bright: '#0E7E8A', deep: '#08414A' },
        status: {
          safe: '#0C7A5A',
          caution: '#96610F',
          danger: '#B0271C',
          'safe-mark': '#17A472',
          'caution-mark': '#DA9226',
          'danger-mark': '#DC3B2C',
        },
        chart: { vessel: '#0B6472', route: '#1C7FA6', port: '#6E8A86', pfz: '#17A472' },
        ink: { DEFAULT: '#0F1E1C', dim: '#4A5D5A', mute: '#7C8F8B' },
        hairline: 'rgba(8, 26, 24, 0.14)',
        'hairline-strong': 'rgba(8, 26, 24, 0.24)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(0, 0, 0, 0.10)',
      },
      boxShadow: {
        inst: '0 16px 44px -14px rgba(8, 26, 24, 0.20)',
      },
      // ── Motion ────────────────────────────────────────────────
      // One easing character: a firm decelerate for things entering or
      // settling. Motion signals state change and spatial relationship —
      // nothing loops unless it means "working" or "look here".
      transitionTimingFunction: {
        instr: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'instr-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'orca-ping': {
          '0%': { transform: 'scale(0.4)', opacity: '0.5' },
          '80%': { opacity: '0' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'orca-sweep': { to: { transform: 'rotate(360deg)' } },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.28' },
          '50%': { opacity: '0.55' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ping-once': {
          '0%': { transform: 'scale(0.5)', opacity: '0.55' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'orca-ping': 'orca-ping 2.8s ease-out infinite',
        'orca-sweep': 'orca-sweep 3.2s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'ping-once': 'ping-once 1.2s ease-out 2 both',
      },
    },
  },
  plugins: [],
}
