
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
        // 🌟 New SS MART blue palette
        ssblue: {
          primary: '#1E3A8A',      // Deep blue (main)
          secondary: '#3B82F6',    // Lighter blue
          accent: '#60A5FA',       // Accent / hover blue
          card: '#EFF6FF',         // Card bg
          border: '#DBEAFE',       // Card border
          text: '#111827',         // Strong text
          onblue: '#F9FAFB',       // Text on blue
          white: '#FFFFFF',        // Pure white
        },
        // Some legacy colors retained for fallback
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      borderRadius: {
        xl: "1.25rem",
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'ssblue': '0 4px 32px 0 rgba(30,58,138,0.13), 0 2px 16px #3B82F644',
        'cta': '0 6px 28px 0 #60A5FA33, 0 1px 8px #3B82F633',
        'frost': '0 8px 40px 0 #60A5FA26, 0 2px 12px #1E3A8A11',
      },
      backgroundImage: {
        // Blue hero and accent gradients
        'ssblue-hero': 'linear-gradient(100deg, #1E3A8A 10%, #3B82F6 80%, #60A5FA 110%)',
        'ssblue-cta': 'linear-gradient(96deg, #3B82F6 70%, #1E3A8A 130%)'
      },
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-in'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
