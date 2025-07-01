/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ must match
  theme: {
    extend: {
      fontFamily: {
        signature: ['"Dancing Script"', 'cursive'], // Or use any Google Fonts you want
      },
    },
  },
  plugins: [],
};
