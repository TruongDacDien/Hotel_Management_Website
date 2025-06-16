/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollBehavior: {
        smooth: "smooth",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
