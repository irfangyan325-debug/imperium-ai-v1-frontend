/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        imperial: {
          black: '#0A0A0A',
          darkGray: '#1A1A1A',
          gray: '#2A2A2A',
          lightGray: '#3A3A3A',
          gold: '#D4AF37',
          lightGold: '#E5C158',
          darkGold: '#B8941F',
          bronze: '#CD7F32',
          cream: '#F5F5DC',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 10px 40px rgba(212, 175, 55, 0.4)',
        dark: '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};