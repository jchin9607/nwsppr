/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  fontFamily: {
    'gupter': ['Gupter', 'serif'],
  },
  daisyui: {
    themes: ["light", "dark"],
  }
}

