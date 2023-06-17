/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fffbea',
          100: '#fff2c5',
          200: '#ffe485',
          300: '#ffd046',
          400: '#ffba1b',
          500: '#ff9804',
          600: '#e26f00',
          700: '#bb4b02',
          800: '#983908',
          900: '#7c300b',
          950: '#481600',
        },
      },
    },
  },
  plugins: [],
};
