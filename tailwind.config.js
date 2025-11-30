/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0f0f1e',
        'dark-light': '#1a1a2e',
        accent: '#00d4ff',
        'accent-dark': '#7c3aed',
      },
    },
  },
  plugins: [],
}
