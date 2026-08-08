/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#050914',
          panel: 'rgba(11, 20, 38, 0.75)',
          border: 'rgba(56, 189, 248, 0.25)',
          accent: '#00f0ff',
          glow: '#3b82f6',
          purple: '#8b5cf6',
          warning: '#f59e0b',
          critical: '#ef4444',
          success: '#10b981'
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
