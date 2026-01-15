/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C7A7B', // Soft teal
          dark: '#234E52', // Deep green
          light: '#38B2AC',
        },
        background: {
          DEFAULT: '#F7FAFC', // Off-white/light gray
          paper: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#4299E1', // Muted blue
          green: '#48BB78',
        },
        text: {
          primary: '#2D3748',
          secondary: '#718096',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
