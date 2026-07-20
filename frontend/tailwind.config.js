/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Morning light" design system (docs/design/MORNING_LIGHT_BLUEPRINT.md).
        // Discipline: ~90% ivory + navy ink, ~7% teal, ~3% gold per viewport.
        // Never pure white/black — `white` is remapped to warm ivory-050.
        white: '#FDFDFB',
        ivory: {
          DEFAULT: '#FAF7F1',
          50: '#FDFDFB', // page base — warm white
          100: '#FAF7F1', // section alternate — soft ivory
          200: '#F2EEE5', // cards at rest, inputs
          300: '#E4E4DE', // "mist" — hairlines, dividers, borders
        },
        // Ink — all text (navy family)
        primary: {
          DEFAULT: '#0A1B2E',
          50: '#EEF3F8',
          100: '#DAE4EE',
          200: '#B6C8DA',
          300: '#8CA5C0',
          400: '#5F7D9E',
          500: '#405872', // secondary text, captions
          600: '#22405E',
          700: '#16324F', // subheads, icons
          800: '#102540',
          900: '#0A1B2E', // display + body ink
        },
        // Primary accent — Healing Teal
        secondary: {
          DEFAULT: '#1F6F6B',
          50: '#ECF5F4',
          100: '#D5EAE8',
          200: '#A7D3CE', // tints, focus glows
          300: '#7CBEB8',
          400: '#4FA49D',
          500: '#2E8B84', // interactive hover, strokes
          600: '#1F6F6B', // buttons, links
          700: '#175A56', // small text on ivory
          800: '#114341',
          900: '#0B2C2A',
        },
        // Warm accent — Soft Gold ("where light falls")
        gold: {
          DEFAULT: '#C29A55',
          50: '#FBF6EB',
          100: '#F4E9D2',
          200: '#EAD9B0', // particle highlights, hover halos
          300: '#DDC084',
          400: '#CFAC6B',
          500: '#C29A55', // light shafts, milestone glow, focus ring
          600: '#A57F3F',
          700: '#7E5F2C',
        },
        // Semantic only — never decorative
        accent: {
          DEFAULT: '#A9503C', // clay — errors, emergency, destructive
          50: '#F9EDEA',
          300: '#D98973',
          600: '#8C4030',
        },
        success: {
          DEFAULT: '#2E7D5B', // emerald — success, "care active"
          50: '#EAF4EF',
        },
        warning: {
          DEFAULT: '#A57F3F',
          50: '#FBF6EB',
        },
        // Category colors, harmonized into the muted morning palette
        childcare: {
          DEFAULT: '#A9536B',
          50: '#F8EDF0',
        },
        daycare: {
          DEFAULT: '#6E5A8E',
          50: '#F1EEF6',
        },
        surface: '#FAF7F1',
        ink: {
          DEFAULT: '#0A1B2E',
          light: '#405872',
        },
      },
      fontFamily: {
        heading: ['Manrope', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['"Crimson Text"', '"Noto Sans Devanagari"', '"Noto Sans Telugu"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Elevation: rest (border only) → card (key) → card-hover (float)
        card: '0 1px 2px rgba(10, 27, 46, 0.05), 0 24px 64px -24px rgba(10, 27, 46, 0.18)',
        'card-hover': '0 2px 4px rgba(10, 27, 46, 0.04), 0 40px 96px -32px rgba(10, 27, 46, 0.22)',
        glow: '0 0 0 1px rgba(194, 154, 85, 0.35), 0 8px 32px -8px rgba(194, 154, 85, 0.45)',
      },
      borderRadius: {
        card: '1.125rem',
      },
      letterSpacing: {
        display: '-0.02em',
        overline: '0.16em',
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
        // Idle "breathing" — the site feels alive even when still (±1% scale)
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.012)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'cue-pulse': {
          '0%, 100%': { transform: 'scaleY(0.4)', opacity: '0.5' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'cue-pulse': 'cue-pulse 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        soft: 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
    },
  },
  plugins: [],
}
