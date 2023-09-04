/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'photo-profile': "url('/background.svg')",
        'second-photo-profile': "url('/second-bg.svg')",
        'photo-vertical': "url('/background-vert.svg')",
      },
      fontFamily: {
        'Poppins': ['Poppins', 'sans-serif'],
        'Roboto': ['Roboto', 'sans-serif']
      },
      animation: {
        'slide-left': 'slide-left 2s  ease-out forwards',
        'slide-right': 'slide-right 3s ease-out forwards',
        'slide-back-left': 'slide-back-left 2s ease-out forwards',
        'slide-back-right': 'slide-back-right 3s ease-out forwards',
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(0)'},
          '100%': { transform: 'translateX(-300%)'},
        },
        'slide-right': {
          '0%': { transform: 'translateX(0%)', opacity: 0 },
          '100%': { transform: 'translateX(33%)', opacity:3 },
        },
        'slide-back-left': {
          '0%': { transform: 'translateX(-300%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-back-right': {
          '0%': { transform: 'translateX(33%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 3 },
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}

