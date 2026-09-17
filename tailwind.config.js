/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ball: 'inset 0 2px 5px rgba(255,255,255,.45), inset 0 -8px 16px rgba(0,0,0,.12), 0 10px 24px rgba(15,23,42,.14)',
      },
    },
  },
  plugins: [],
}
