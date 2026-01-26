/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from CSS variables
        primary: {
          DEFAULT: 'var(--primary-color)',
          event: 'var(--primary-event-color)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
          event: 'var(--secondary-event-color)',
        },
        bg: {
          DEFAULT: 'var(--bg-color)',
          event: 'var(--bg-event-color)',
        },
        accent: 'var(--acid-green)',
        success: 'var(--add)',
        danger: 'var(--remove)',
        overlay: 'var(--overlay)',
      },
      spacing: {
        // Spacing from CSS variables
        'xs': 'var(--val-xs)',
        'sm': 'var(--val-sm)',
        'md': 'var(--val-md)',
        'lg': 'var(--val-lg)',
        'xl': 'var(--val-xl)',
        // Calculated responsive spacing
        'xs-calc': 'var(--val-xs-calc)',
        'sm-calc': 'var(--val-sm-calc)',
        'md-calc': 'var(--val-md-calc)',
        'lg-calc': 'var(--val-lg-calc)',
        'xl-calc': 'var(--val-xl-calc)',
      },
      borderRadius: {
        'custom': 'var(--border-radius)',
      },
      fontFamily: {
        sans: ['var(--font)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
