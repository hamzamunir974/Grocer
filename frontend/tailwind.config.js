/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A01',
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF7A01',
          600: '#E65C00',
          700: '#BF360C',
        },
        gold: {
          DEFAULT: '#FFA500',
          light: '#FFD580',
        },
        cream: {
          DEFAULT: '#FAF6F1',
          dark: '#F0E8DC',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
          light: '#555555',
          muted: '#888888',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        bento: '1.5rem',
        card: '1.25rem',
        pill: '9999px',
      },
      boxShadow: {
        bento: '0 4px 24px rgba(255, 122, 1, 0.08)',
        card: '0 2px 16px rgba(43, 43, 43, 0.08)',
        orange: '0 4px 20px rgba(255, 122, 1, 0.3)',
        'orange-lg': '0 8px 32px rgba(255, 122, 1, 0.4)',
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #FF7A01, #FFA500)',
        'cream-gradient': 'linear-gradient(180deg, #FAF6F1, #F0E8DC)',
        'hero-pattern':
          'radial-gradient(ellipse at 80% 0%, rgba(255,122,1,0.12) 0%, transparent 50%)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
        bounceIn: 'bounceIn 0.5s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
