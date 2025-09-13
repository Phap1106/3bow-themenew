// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//   "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   "./components/**/*.{js,ts,jsx,tsx,mdx}",
// ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {  fontFamily: {
        // body
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // heading
        heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tighter2: "-0.02em",
      },},
  },
plugins: [require("@tailwindcss/typography")],
  
  
  darkMode: "class",   
};


