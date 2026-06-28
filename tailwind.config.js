/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#FAF6F0",
          200: "#F3ECE0",
        },
        caramel: {
          DEFAULT: "#A0522D",
          50: "#F5E6DC",
          100: "#E8CCB8",
          500: "#A0522D",
          600: "#8B4513",
          700: "#6B3410",
        },
        forest: {
          DEFAULT: "#2F5D4B",
          50: "#E0EDE7",
          500: "#2F5D4B",
          600: "#244A3B",
        },
      },
      fontFamily: {
        serif: [
          "Source Han Serif SC",
          "Noto Serif SC",
          "SimSun",
          "serif",
        ],
      },
      animation: {
        "bounce-sm": "bounce-sm 0.3s ease",
        "float-up": "float-up 0.3s ease",
      },
      keyframes: {
        "bounce-sm": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.92)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};
