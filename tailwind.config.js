/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef7ee', 100: '#feecd3', 200: '#fbd5a5', 300: '#f8b76d', 400: '#f49132', 500: '#f1750f', 600: '#d85b09', 700: '#b4430c', 800: '#903610', 900: '#742e10' },
      },
    },
  },
  plugins: [],
}
