/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        ink: '#0D0D0D',
        paper: '#F5F2EB',
        accent: '#C84B2F',
        muted: '#8C8279',
        surface: '#EDEAE2',
        'surface-2': '#E0DDD5',
        success: '#2D6A4F',
        warning: '#D4A017',
      },
    },
  },
  plugins: [],
}
