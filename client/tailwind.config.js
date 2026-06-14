/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.jsx',
    './main.jsx',
    './Pages/**/*.jsx',
    './components/**/*.jsx',
    './services/**/*.js',
    './utils/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
