/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          navy: '#0A1628',
          dark: '#0B1D36',
          teal: '#00B4D8',
          blue: '#0077B6',
          aqua: '#90E0EF',
          seafoam: '#CAF0F8',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981'
        }
      }
    },
  },
  plugins: [],
}
