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
          DEFAULT: 'var(--color-primary, #2563eb)',
          dark: 'var(--color-primary-dark, #1d4ed8)',
          light: 'var(--color-primary-light, #3b82f6)',
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
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        blob: 'blob 7s infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
