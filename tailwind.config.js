/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'back-primary': '#ffffff',
        'back-secondary': '#F5E2D9',
        'title': '#ED8FB1',
        'primary': '#FDBC9B',
        'secondary': '#CB9C5E',
        'extra': '#E9D686',
      },
    },
  },
  plugins: [],
}

