/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      half: '900px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      
    }
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

