// tailwind.config.js
import tailwindcssAnimate from "tailwindcss-animate"; 
module.exports = {
    darkMode: 'class', // enable dark mode using the 'dark' class
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          fadeIn: {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        },
        animation: {
          fadeIn: "fadeIn 0.5s ease-out",
        },
      },
    },
    plugins: [tailwindcssAnimate],
  }