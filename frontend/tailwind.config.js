/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High contrast light theme
        ocean: { 900: '#F0F4F8', 850: '#FFFFFF', 800: '#E2E8F0' },
        surface: { 1: '#FFFFFF', 2: '#F8FAFC', 3: '#F1F5F9' },
        accent: { DEFAULT: '#0369A1', bright: '#0284C7', deep: '#0C4A6E' },
        marine: { DEFAULT: '#0F766E', deep: '#115E59' },
        status: { safe: '#15803D', caution: '#B45309', danger: '#B91C1C' },
        ink: { DEFAULT: '#0F172A', dim: '#475569' },
        hairline: 'rgba(0, 0, 0, 0.15)',
        'hairline-strong': 'rgba(0, 0, 0, 0.25)',
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
        inst: '0 18px 50px -12px rgba(0, 0, 0, 0.15)',
        glow: '0 0 20px rgba(3, 105, 161, 0.35)',
      },
      keyframes: {
        'orca-ping': {
          '0%': { transform: 'scale(0.4)', opacity: '0.55' },
          '80%': { opacity: '0' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'orca-sweep': { to: { transform: 'rotate(360deg)' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'orca-ping': 'orca-ping 2.6s ease-out infinite',
        'orca-sweep': 'orca-sweep 3.2s linear infinite',
        'fade-up': 'fade-up 0.35s ease-out both',
        'sheet-up': 'sheet-up 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
