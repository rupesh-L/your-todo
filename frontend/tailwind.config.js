/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["'Bricolage Grotesque'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
