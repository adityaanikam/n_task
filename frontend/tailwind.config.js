/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4338ca',
          light: '#a5b4fc',
        },
        accent: '#f59e42',
        background: '#f8fafc',
        darkbg: '#18181b',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} 