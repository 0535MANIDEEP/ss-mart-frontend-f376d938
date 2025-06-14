
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'DM Serif Display', 'serif']
      },
      colors: {
        //🌟 Core palette: rich gold, luxury blue, velvet, subtle gradients, glass
        'lux': {
          DEFAULT: '#1B202A',
          black: '#151824',  // deeper rich black
          gold: '#FFD700',   // luxury gold (CTA, accent)
          platinum: '#F4F5F9',
          blue: '#282FFB',   // dopamine premium blue
          pink: '#E042A2',   // vibrant magenta for highlights
          glass: 'rgba(255,255,255,0.55)',
          darkglass: 'rgba(33,36,52,0.7)',
          deep: '#181929',   // deep rich area bg
          textdark: '#232336',
          textlight: '#F4F5F9',
          border: '#E8E8F3',
        },
        // Gradients via from-*/to-*
        'lux-blue': '#282FFB',
        'lux-purple': '#845EC2',
        'lux-aqua': '#01D8CA',
        'lux-pink': '#E042A2',
        'lux-gold': '#FFD700',
        'lux-glass': 'rgba(255,255,255,0.72)',
        'lux-darkglass': 'rgba(24,25,35,0.83)',
        // Neutral grays
        gray: {
          50: '#F9FAFB',
          100: '#F4F5F7',
          200: '#ECECF2',
          300: '#E1E1EC',
          400: '#C8C9DB',
          500: '#A4A6BB',
          600: '#8789A3',
          700: '#606384',
          800: '#454765',
          900: '#24243C',
        }
      },
      borderRadius: {
        xl: "1.25rem",
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'lux': '0 4px 40px 0 rgba(40,47,251,0.07), 0 2.5px 24px #FFD70022',
        'cta': '0 4px 16px 0 #FFD70044, 0 .5px 10px #FFD70033',
        'frost': '0 6px 32px 0 rgba(40,47,251,0.10), 0 0.5px 18px #F4F5F940',
      },
      backgroundImage: {
        'lux-grad': 'linear-gradient(100deg, #282FFB 10%, #845EC2 54%, #FFD700 110%)',
        'glass-light': 'linear-gradient(110deg,rgba(255,255,255,0.88) 60%,rgba(240,240,255,0.5))',
        'glass-dark': 'linear-gradient(120deg,rgba(33,36,52,0.88) 66%,rgba(24,25,33,0.47) 100%)',
        'cta-glow': 'radial-gradient(circle at 50% 80%, #FFD70055 0%, #FFF0 80%)'
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      keyframes: {
        'cta-glow': {
          '0%, 100%': { boxShadow: '0 0 24px #FFD70066, 0 3px 32px #FFD70015' },
          '50%': { boxShadow: '0 0 48px #FFD700A0, 0 6px 48px #FFD70022' },
        }
      },
      animation: {
        'cta-glow': 'cta-glow 1.6s infinite alternate',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-in'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
