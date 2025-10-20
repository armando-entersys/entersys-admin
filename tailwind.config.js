/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'entersys': {
          'primary': '#009CA6',      // Teal principal
          'dark': '#093D53',         // Dark teal/navy
          'light': '#E5F5F6',        // Light teal background
          'gold': '#C2A56D',         // Gold/bronze accent
          'hover': '#007C84',        // Darker teal for hover
          'text-dark': '#000808',    // Near black
          'text-body': '#4C5252',    // Body text
          'text-muted': '#7F8383',   // Muted text
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
