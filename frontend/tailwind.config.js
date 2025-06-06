/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cv-primary': '#0F172A',
        'cv-secondary': '#1E293B',
        'cv-accent': '#06B6D4',
        'cv-light': '#F1F5F9',
        'cv-text-primary': '#F8FAFC',
        'cv-text-muted': '#94A3B8',
        'cv-text-dark': '#0F172A',
      },
      boxShadow: {
        't-lg': '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        slideInUp: {
          'from': { transform: 'translateY(100%)', opacity: '0.8' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-up': 'slideInUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
