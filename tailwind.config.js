/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './frontend/index.html',
    './frontend/src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#56a3d9',
        primaryDark: '#134876',
        sidebar: '#003a6a',
        background: '#f8f9fa',
        text: '#2c2c2c',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}
