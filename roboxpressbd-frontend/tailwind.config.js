/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f9d58',
          dark: '#0b7a45',
          50: '#f0f9f4',
          100: '#dcf2e3'
        },
        navy: {
          DEFAULT: '#1a2a4f',
          dark: '#0f1a36',
          bar: '#2a3a6b'
        },
        sky: {
          band: '#e8f4fb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
