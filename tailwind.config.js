/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'button-primary': 'var(--button-primary)',
        'button-primary-hover': 'var(--button-primary-hover)',
        'button-secondary-hover': 'var(--button-secondary-hover)',
      },
    },
  },
  plugins: [],
} 