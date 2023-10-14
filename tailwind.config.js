/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'animeace': ['Anime Ace', 'sans'],
        'manga': ['Manga Temple', 'sans'], 
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}