/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep ocean grounds
        ocean: { 900: '#031525', 850: '#061D32', 800: '#082641' },
        // Instrument surfaces
        surface: { 1: '#0A2944', 2: '#0D3352', 3: '#103D60' },
        // Bioluminescent instrumentation accent
        accent: { DEFAULT: '#22B8FF', bright: '#36CFFF', deep: '#0EA5E9' },
        // Secondary marine accent
        marine: { DEFAULT: '#2DD4BF', deep: '#14B8A6' },
        // Status
        status: { safe: '#2EE6A6', caution: '#F5B942', danger: '#FF5C5C' },
        // Text
        ink: { DEFAULT: '#F4FAFF', dim: '#9DB8D0' },
        // Hairline borders
        hairline: 'rgba(54, 207, 255, 0.20)',
        'hairline-strong': 'rgba(54, 207, 255, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(54, 207, 255, 0.20)',
      },
      boxShadow: {
        inst: '0 18px 50px -12px rgba(0, 0, 0, 0.7)',
        glow: '0 0 20px rgba(54, 207, 255, 0.35)',
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
