/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#236533", // Sap Green
        background: "#DAD7CD", // Sandstone
        accent: "#588157", // Deep Olive (for highlights/buttons)
      },
      fontFamily: {
        schedulo: ["Pacifico", "cursive"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
