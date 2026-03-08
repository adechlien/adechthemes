/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', "sans-serif"],
        bellota: ["Bellota Text", sans-serif],
      },
      colors: { testpink: "#ff00ff" },
    },
  },
  plugins: [],
};
