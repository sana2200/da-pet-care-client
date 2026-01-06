/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#4ecdc4',
        'brand-dark': '#35b6ad',
        accent: '#ff9f1c',
        text: '#2d2d2d',
        muted: '#6b7280',
        bg: '#f7faf9',
      },
      boxShadow: {
        soft: '0 10px 24px rgba(0,0,0,.08)'
      },
      borderRadius: {
        xl2: '14px'
      },
      maxWidth: {
        container: '1140px'
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
