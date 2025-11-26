import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        accent: '#F59E0B',
        'map-border': '#3B82F6',
      },
      borderRadius: {
        'custom': '12px',
      },
      transitionDuration: {
        'custom': '200ms',
      },
    },
  },
  plugins: [],
}
export default config

