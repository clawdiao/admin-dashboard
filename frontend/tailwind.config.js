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
        primary: '#00F5D4',
        secondary: '#7B2FBE',
        dark: '#0A0A0F',
        surface: '#15151F',
        text: '#FFFFFF',
        muted: '#888888'
      }
    },
  },
  plugins: [],
}
