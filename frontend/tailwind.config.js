/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B3732A',
        'primary-dark': '#8F5A1D',
        'primary-light': '#FAF4EB',
      }
    },
  },
  plugins: [],
}
