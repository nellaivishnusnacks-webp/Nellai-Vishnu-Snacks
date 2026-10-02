/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F1E3C6',
          dark: '#E6D3A8',
        },
        ink: '#2B1B12',
        maroon: {
          DEFAULT: '#7A2419',
          dark: '#5C1A12',
        },
        mustard: {
          DEFAULT: '#D99B29',
          light: '#EAB553',
        },
        leaf: {
          DEFAULT: '#55713C',
          dark: '#3F542C',
        },
        rust: '#A8461F',
        // Card / panel surface — single source of truth is --surface in index.css.
        surface: 'var(--surface)',
      },
      fontFamily: {
        display: ['"Alfa Slab One"', 'serif'],
        editorial: ['Lora', 'serif'],
        body: ['Mukta', 'system-ui', 'sans-serif'],
        script: ['Kalam', 'cursive'],
        tamil: ['Catamaran', '"Noto Sans Tamil"', 'sans-serif'],
        'tamil-display': ['"Baloo Thambi 2"', '"Noto Sans Tamil"', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
