/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // App Router files
    "./components/**/*.{js,ts,jsx,tsx}", // Reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
