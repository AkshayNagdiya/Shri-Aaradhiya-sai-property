/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF7F0',
          deep: '#F2EBDD',
          sand: '#EDE4D2',
        },
        ink: {
          DEFAULT: '#1C1B17',
          soft: '#2A2924',
          muted: '#57544B',
          faint: '#6E695E',
        },
        navy: {
          DEFAULT: '#0B1E3B',
          deep: '#071426',
          soft: '#14305A',
          mist: '#E9EDF4',
        },
        gold: {
          DEFAULT: '#C6A15B',
          dark: '#77601F',
          deep: '#6E5618',
          light: '#F1E5C6',
          mist: '#FAF3E2',
        },
        line: '#E3DACA',
        olive: {
          DEFAULT: '#5E5E3C',
          dark: '#41442A',
          light: '#E9E8D8',
          mist: '#F0EEE1',
        },
        clay: '#C2A878',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1320px',
      },
      boxShadow: {
        soft: '0 20px 60px -24px rgba(7,20,38,0.35)',
        card: '0 12px 40px -16px rgba(7,20,38,0.28)',
        subtle: '0 2px 16px -6px rgba(7,20,38,0.16)',
      },
      letterSpacing: {
        eyebrow: '0.28em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
