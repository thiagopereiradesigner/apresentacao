/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  content: ['./src/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--accent)', foreground: '#ffffff' },
        ring: 'var(--accent)',
      },
      boxShadow: {
        bento: '0 1px 3px rgba(15, 23, 42, 0.05)',
        'bento-dark': '0 14px 48px -8px rgba(0, 0, 0, 0.55)',
      },
      borderRadius: { '3xl': '1.25rem' },
    },
  },
  plugins: [],
};
