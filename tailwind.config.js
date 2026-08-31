/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px -18px rgba(15, 23, 42, 0.25)',
      },
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d7f5ea',
          500: '#10b981',
          600: '#0f9d72',
          700: '#0d7d5d',
        },
      },
    },
  },
  plugins: [],
};
