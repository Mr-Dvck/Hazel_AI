/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        foreground: '#f3f4f6',
        obsidian: {
          900: '#060609',
          800: '#0d0e15',
          700: '#151624',
          600: '#1e2035',
        },
        neon: {
          pink: '#ff2a9d',
          red: '#ff0033',
          purple: '#a855f7',
          cyan: '#00f0ff',
          emerald: '#10b981',
          gold: '#fbbf24',
          coral: '#ff3344',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'aurora': 'aurora 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(28px)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 24px 2px rgba(0, 240, 255, 0.65), 0 0 48px -4px rgba(0, 180, 255, 0.4)',
        'neon-pink': '0 0 24px 2px rgba(255, 42, 157, 0.65), 0 0 48px -4px rgba(255, 20, 147, 0.4)',
        'neon-red': '0 0 24px 2px rgba(255, 0, 51, 0.7), 0 0 48px -4px rgba(220, 38, 38, 0.45)',
        'neon-yellow': '0 0 24px 2px rgba(255, 230, 0, 0.65), 0 0 48px -4px rgba(234, 179, 8, 0.4)',
        'neon-purple': '0 0 24px 2px rgba(168, 85, 247, 0.65), 0 0 48px -4px rgba(147, 51, 234, 0.4)',
        'neon-gold': '0 0 24px 2px rgba(251, 191, 36, 0.65), 0 0 48px -4px rgba(245, 158, 11, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
