/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "520px",
      md: "768px",
      lg: "1020px",
      xl: "1440px",
      xxl: "2560px",
    },
    extend: {
      backgroundImage: {
        "photo-profile": "url('/background.svg')",
        "second-photo-profile": "url('/second-bg.svg')",
        "photo-vertical": "url('/background-vert.svg')",
        "photo-second-vertical": "url('/background-second-vertical.svg')",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "slide-left": "slide-left 2s  ease-out forwards",
        "slide-right": "slide-right 3s ease-out forwards",
        "slide-back-left": "slide-back-left 2s ease-out forwards",
        "slide-back-right": "slide-back-right 3s ease-out forwards",

        "slide-up": "slide-up 2s  ease-out forwards",
        "slide-down": "slide-down 3s ease-out forwards",
        "slide-back-up": "slide-up-back 2s ease-out forwards",
        "slide-back-down": "slide-down-back 3s ease-out forwards",
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-300.5%)" },
        },
        "slide-right": {
          "0%": { transform: "translateX(0%)", opacity: 0 },
          "100%": { transform: "translateX(33%)", opacity: 3 },
        },
        "slide-back-left": {
          "0%": { transform: "translateX(-300%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-back-right": {
          "0%": { transform: "translateX(33%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 3 },
        },

        "slide-up": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-460%)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(33%)" },
        },

        "slide-up-back": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(33%)" },
        },
        "slide-down-back": {
          "0%": { transform: "translateY(33%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
