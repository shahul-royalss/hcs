/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dhrishta design system (from architecture doc)
        primary: {
          DEFAULT: '#1a3a6b',
          50: '#eef2f9',
          100: '#d5deef',
          200: '#aebfe0',
          300: '#7f9bcc',
          400: '#4f74b3',
          500: '#2f5490',
          600: '#1a3a6b',
          700: '#16315b',
          800: '#12284a',
          900: '#0d1e38',
        },
        secondary: {
          DEFAULT: '#2d8b8b',
          50: '#ecf7f7',
          100: '#cceaea',
          200: '#99d5d5',
          300: '#66c0c0',
          400: '#3fa5a5',
          500: '#2d8b8b',
          600: '#257373',
          700: '#1d5b5b',
          800: '#154343',
          900: '#0e2c2c',
        },
        accent: {
          DEFAULT: '#d32f2f',
          600: '#b71c1c',
        },
        success: {
          DEFAULT: '#2e7d32',
          50: '#e8f5e9',
        },
        warning: {
          DEFAULT: '#f57c00',
          50: '#fff3e0',
        },
        childcare: {
          DEFAULT: '#c2185b',
          50: '#fce4ec',
        },
        daycare: {
          DEFAULT: '#7b1fa2',
          50: '#f3e5f5',
        },
        surface: '#f5f5f5',
        ink: {
          DEFAULT: '#212121',
          light: '#757575',
        },
      },
      fontFamily: {
        heading: ['Manrope', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['"Crimson Text"', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(13, 30, 56, 0.08)',
        'card-hover': '0 8px 28px rgba(13, 30, 56, 0.14)',
      },
      borderRadius: {
        card: '1rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
