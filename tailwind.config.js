/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B2265',
            dark: '#07153B',
            light: '#1B365D',
            hover: '#132B78',
            surface: '#F0F4FA',
          },
          saffron: {
            DEFAULT: '#D97706',
            light: '#F59E0B',
            dark: '#B45309',
            strip: '#FF9933',
          },
          green: {
            DEFAULT: '#15803D',
            light: '#16A34A',
            dark: '#166534',
            bg: '#DCFCE7',
            strip: '#138808',
          },
          red: {
            DEFAULT: '#B91C1C',
            light: '#DC2626',
            dark: '#991B1B',
            bg: '#FEE2E2',
          },
          amber: {
            DEFAULT: '#D97706',
            bg: '#FEF3C7',
          },
          blue: {
            DEFAULT: '#1D4ED8',
            bg: '#DBEAFE',
          },
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        serif: [
          'Merriweather',
          'Georgia',
          'Cambria',
          'serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
