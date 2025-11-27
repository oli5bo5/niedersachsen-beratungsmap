import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        // Frame.io specific colors
        'frameio-primary': 'rgb(var(--frameio-primary))',
        'frameio-primary-hover': 'rgb(var(--frameio-primary-hover))',
        'frameio-primary-light': 'rgb(var(--frameio-primary-light))',
        'frameio-bg-primary': 'rgb(var(--frameio-bg-primary))',
        'frameio-bg-secondary': 'rgb(var(--frameio-bg-secondary))',
        'frameio-bg-tertiary': 'rgb(var(--frameio-bg-tertiary))',
        'frameio-text-primary': 'rgb(var(--frameio-text-primary))',
        'frameio-text-secondary': 'rgb(var(--frameio-text-secondary))',
        'frameio-text-tertiary': 'rgb(var(--frameio-text-tertiary))',
        'frameio-border': 'rgb(var(--frameio-border))',
        'frameio-accent-purple': 'rgb(var(--frameio-accent-purple))',
        'frameio-accent-pink': 'rgb(var(--frameio-accent-pink))',
        'frameio-accent-blue': 'rgb(var(--frameio-accent-blue))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config



